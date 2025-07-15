import Stripe from 'stripe';

export class StripeClient {
  private stripe: Stripe | null = null;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  getWebhookSecret(): string {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required for webhook verification');
    }
    return webhookSecret;
  }

  async getTransactions(params?: Stripe.Issuing.TransactionListParams): Promise<Stripe.ApiList<Stripe.Issuing.Transaction>> {
    if (!this.stripe) {
      throw new Error('Stripe client not initialized');
    }

    return await this.stripe.issuing.transactions.list({ 
      ...params,
      // only capture transactions are relevant for our context
      type: 'capture'
    });
  }

  async getTransactionDetails(transactionId: string): Promise<Stripe.Issuing.Transaction> {
    if (!this.stripe) {
      throw new Error('Stripe client not initialized');
    }
    return await this.stripe.issuing.transactions.retrieve(transactionId);
  }

  async getAuthorizations(params?: Stripe.Issuing.AuthorizationListParams): Promise<Stripe.ApiList<Stripe.Issuing.Authorization>> {
    if (!this.stripe) {
      throw new Error('Stripe client not initialized');
    }
    return await this.stripe.issuing.authorizations.list({
      ...params,
      // only closed authorizations are relevant for our context
      // closed authorizations can be approved or declined, and this can be defined by checking the "approved" field
      status: 'closed'
    });
  }

  async getAuthorizationDetails(authorizationId: string): Promise<Stripe.Issuing.Authorization> {
    if (!this.stripe) {
      throw new Error('Stripe client not initialized');
    }
    return await this.stripe.issuing.authorizations.retrieve(authorizationId);
  }

  constructWebhookEvent(payload: Buffer, signature: string, webhookSecret: string): Stripe.Event {
    if (!this.stripe) {
      throw new Error('Stripe client not initialized');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}

 