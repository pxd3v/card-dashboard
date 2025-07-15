import type Stripe from 'stripe';
import { ITransactionRepository } from '../../../repositories/interfaces/ITransactionRepository';
import { StripeTransactionService } from '../../../services/stripe/transactionService';
import { StripeDataProcessor, ObjectType, StripeFetchOptions } from './DataProcessor';
import { extractCardId } from '../../../utils/stripe';

export class StripeTransactionProcessor implements StripeDataProcessor<Stripe.Issuing.Transaction> {
  constructor(
    private transactionRepo: ITransactionRepository,
    private stripeTransactionService: StripeTransactionService
  ) {}

  async fetchData(cardId: string, options: StripeFetchOptions): Promise<{ data: Stripe.Issuing.Transaction[], has_more: boolean }> {
    const result = await this.stripeTransactionService.fetchTransactions(cardId, options);
    return {
      data: result.transactions,
      has_more: result.has_more
    };
  }

  async processData(transactions: Stripe.Issuing.Transaction[]): Promise<void> {
    for (const transaction of transactions) {
      try {
        const existingTransaction = await this.transactionRepo.findByStripeId({ stripeId: transaction.id });
        
        if (existingTransaction) {
          console.log(`Transaction ${transaction.id} already exists, skipping...`);
          continue;
        }

        await this.transactionRepo.createWithOperationAndMerchantCategory({
          data: this.mapTransactionToData(transaction)
        });

        console.log(`Saved transaction ${transaction.id} with operation to database`);
      } catch (error) {
        console.error(`Error processing transaction ${transaction.id}:`, error);
      }
    }
  }

  getObjectType(): ObjectType {
    return ObjectType.TRANSACTION;
  }

  getRepository(): ITransactionRepository {
    return this.transactionRepo;
  }

  getDataId(transaction: Stripe.Issuing.Transaction): string {
    return transaction.id;
  }

  private mapTransactionToData(transaction: Stripe.Issuing.Transaction) {
    return {
      stripeId: transaction.id,
      amount: Math.abs(transaction.amount),
      type: transaction.type,
      stripeCreatedAt: transaction.created,
      card: {
        stripeId: extractCardId(transaction.card)
      },
      merchantCategory: {
        stripeId: transaction.merchant_data.category_code,
        name: transaction.merchant_data.name || 'unknown',
      }
    };
  }
} 