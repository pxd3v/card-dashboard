import type Stripe from 'stripe';
import { StripeClient } from '../../clients/stripeClient';

export class StripeAuthorizationService {
  constructor(
    private stripeClient: StripeClient
  ) {}

  async fetchAuthorizations(cardId?: string, params?: {
    limit?: number;
    starting_after?: string; // retrieve authorizations older than the provided id
    ending_before?: string; // retrieve authorizations newer than provided id
  }) {
    try {
      const listParams: Stripe.Issuing.AuthorizationListParams = {
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

      const response = await this.stripeClient.getAuthorizations(listParams);
      
      return {
        authorizations: response.data,
        has_more: response.has_more
      }
    } catch (error) {
      console.error('Error fetching authorizations:', error);
      throw new Error('Failed to fetch authorizations from Stripe');
    }
  }

  async fetchAuthorization(authorizationId: string) {
    try {
      return await this.stripeClient.getAuthorizationDetails(authorizationId);
    } catch (error) {
      console.error('Error fetching authorization:', error);
      throw new Error('Failed to fetch authorization from Stripe');
    }
  }
}
