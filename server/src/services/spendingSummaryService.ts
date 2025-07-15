import { ITransactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { centsToDollars } from "../utils/currency";

export interface SpendingSummaryParams {
  stripeCardId: string;
}

export interface SpendingSummaryResult {
  totalSpend: number;
  averageSpend: number;
  totalTransactions: number;
}

export class SpendingSummaryService {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  async getSpendingSummary({ stripeCardId }: SpendingSummaryParams): Promise<SpendingSummaryResult> {
    const transactions = await this.transactionRepository.findAllByStripeCardId({ 
      stripeCardId 
    });

    const totalSpend = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const averageSpend = transactions.length > 0 ? totalSpend / transactions.length : 0;
    

    return {
      totalSpend: centsToDollars(totalSpend),
      averageSpend: centsToDollars(averageSpend),
      totalTransactions: transactions.length,
    };
  }
} 