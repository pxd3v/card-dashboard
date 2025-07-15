import { Card } from '../../../generated/prisma/client';
import { ITransactionRepository } from '../../../repositories/interfaces/ITransactionRepository';
import { ISyncStateRepository } from '../../../repositories/interfaces/ISyncStateRepository';
import { IAuthorizationRepository } from '../../../repositories/interfaces/IAuthorizationRepository';
import { StripeTransactionService } from '../../../services/stripe/transactionService';
import { StripeAuthorizationService } from '../../../services/stripe/authorizationService';
import { StripeTransactionProcessor } from '../../../services/sync/stripe/TransactionProcessor';
import { StripeAuthorizationProcessor } from '../../../services/sync/stripe/AuthorizationProcessor';
import { StripeDataProcessor } from '../../../services/sync/stripe/DataProcessor';

export enum SyncMode {
  INCREMENTAL = 'incremental',
  FROM_SCRATCH = 'from_scratch'
}

interface SyncJobOptions {
  card: Card;
  batchSize?: number;
  mode?: SyncMode;
}

interface SyncResult {
  success: boolean;
  processedCount: number;
  error?: string;
}

export class StripeSyncDataService {
  private readonly DEFAULT_BATCH_SIZE = 100;
  private readonly DEFAULT_SYNC_MODE = SyncMode.INCREMENTAL;

  constructor(
    private transactionRepo: ITransactionRepository,
    private syncStateRepo: ISyncStateRepository,
    private authorizationRepo: IAuthorizationRepository,
    private stripeTransactionService: StripeTransactionService,
    private stripeAuthorizationService: StripeAuthorizationService,
  ) {}

  async run(options: SyncJobOptions): Promise<SyncResult> {
    const { card, batchSize = this.DEFAULT_BATCH_SIZE, mode = this.DEFAULT_SYNC_MODE } = options;
    
    try {
      console.log(`Starting ${mode} sync for card ${card.stripeId}...`);

      const transactionProcessor = new StripeTransactionProcessor(
        this.transactionRepo,
        this.stripeTransactionService
      );

      const authorizationProcessor = new StripeAuthorizationProcessor(
        this.authorizationRepo,
        this.stripeAuthorizationService
      );

      const [transactionResult, authorizationResult] = await Promise.all([
        this.syncData(transactionProcessor, card, batchSize, mode),
        this.syncData(authorizationProcessor, card, batchSize, mode)
      ]);

      return {
        success: transactionResult.success && authorizationResult.success,
        processedCount: transactionResult.processedCount + authorizationResult.processedCount
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Sync job failed:', errorMessage);
      return {
        success: false,
        processedCount: 0,
        error: errorMessage
      };
    }
  }

  private async syncData<T>(
    processor: StripeDataProcessor<T>,
    card: Card,
    batchSize: number,
    mode: SyncMode
  ): Promise<SyncResult> {
    try {
      if (mode === SyncMode.FROM_SCRATCH) {
        return await this.syncAllData(processor, card, batchSize);
      } else {
        return await this.syncNewestData(processor, card, batchSize);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Error syncing ${processor.getObjectType()}:`, errorMessage);
      return {
        success: false,
        processedCount: 0,
        error: errorMessage
      };
    }
  }

  private async syncNewestData<T>(
    processor: StripeDataProcessor<T>,
    card: Card,
    batchSize: number
  ): Promise<SyncResult> {
    const syncState = await this.syncStateRepo.findByCardAndType({
      stripeCardId: card.stripeId,
      objectType: processor.getObjectType()
    });

    let cursor = syncState?.lastCursor || undefined;
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await processor.fetchData(card.stripeId, {
        limit: batchSize,
        ending_before: cursor
      });

      await processor.processData(result.data);
      totalProcessed += result.data.length;

      hasMore = result.has_more;
      if (result.data.length > 0) {
        const firstItem = result.data[0];
        if (firstItem) {
          cursor = processor.getDataId(firstItem);
        }
      }
    }

    if (cursor) {
      await this.syncStateRepo.upsert({
        stripeCardId: card.stripeId,
        objectType: processor.getObjectType(),
        lastCursor: cursor
      });
      console.log(`Updated ${processor.getObjectType()} sync state with cursor: ${cursor}`);
    }

    return { success: true, processedCount: totalProcessed };
  }

  private async syncAllData<T>(
    processor: StripeDataProcessor<T>,
    card: Card,
    batchSize: number
  ): Promise<SyncResult> {
    let cursor: string | undefined;
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await processor.fetchData(card.stripeId, {
        limit: batchSize,
        starting_after: cursor
      });

      await processor.processData(result.data);
      totalProcessed += result.data.length;

      hasMore = result.has_more;
      if (result.data.length > 0) {
        const lastItem = result.data[result.data.length - 1];
        if (lastItem) {
          cursor = processor.getDataId(lastItem);
        }
      }
    }

    const newestRecord = await processor.getRepository().findNewestByCard({ stripeCardId: card.stripeId });
    if (newestRecord) {
      await this.syncStateRepo.upsert({
        stripeCardId: card.stripeId,
        objectType: processor.getObjectType(),
        lastCursor: newestRecord.stripeId
      });
    }

    return { success: true, processedCount: totalProcessed };
  }
}
