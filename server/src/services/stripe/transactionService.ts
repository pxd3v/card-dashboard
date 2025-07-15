import Stripe from 'stripe';
import { StripeClient } from '../../clients/stripeClient';

export class StripeTransactionService {
  constructor(
    private stripeClient: StripeClient
  ) {}

  async fetchTransactions(cardId?: string, params?: {
    limit?: number;
    starting_after?: string; // retrieve transactions older than the provided id
    ending_before?: string; // retrieve transactions newer than provided id
  }) {
    try {
      const listParams: Stripe.Issuing.TransactionListParams = {
        limit: params?.limit || 100,
      };

      if (cardId) {
        listParams.card = cardId;
      }

      if (params?.starting_after) {
        listParams.starting_after = params.starting_after;
      }

      if (params?.ending_before) {
        listParams.ending_before = params.ending_before;
      }

      const response = await this.stripeClient.getTransactions(listParams);
      
      return {
        has_more: response.has_more,
        transactions: response.data
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions from Stripe');
    }
  }

  async fetchTransaction(transactionId: string) {
    try {
      return await this.stripeClient.getTransactionDetails(transactionId);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction from Stripe');
    }
  }
}
