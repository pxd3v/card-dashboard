import { IOperationRepository } from "../repositories/interfaces/IOperationRepository";
import { centsToDollars } from "../utils/currency";

export class ActivityService {
  constructor(
    private operationRepository: IOperationRepository,
  ) {}

  async fetchCardActivity({ stripeCardId, params }: {stripeCardId: string, params?: {
    limit?: number;
    cursor?: string;
  }}) {
    try {
      const operations = await this.operationRepository.findByStripeCardId({ 
        stripeCardId, 
        limit: params?.limit,
        cursor: params?.cursor
      });

      const limit = params?.limit || 100;
      const hasMore = operations.length === limit;

      const serializedOperations = operations.map(operation => ({
        ...operation,
        authorization: operation.authorization ? {
          ...operation.authorization,
          amount: centsToDollars(operation.authorization.amount)
        } : undefined,
        transaction: operation.transaction ? {
          ...operation.transaction,
          amount: centsToDollars(operation.transaction.amount)
        } : undefined
      }));

      return {
        operations: serializedOperations,
        hasMore,
        lastCursor: hasMore ? operations[operations.length - 1]?.id : undefined
      };
    } catch (error) {
      console.error('Error fetching card activity:', error);
      throw new Error('Failed to fetch card activity');
    }
  }
}
