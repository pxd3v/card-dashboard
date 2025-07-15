import type Stripe from 'stripe';
import { ITransactionRepository } from '../../repositories/interfaces/ITransactionRepository';
import { IAuthorizationRepository } from '../../repositories/interfaces/IAuthorizationRepository';
import { StripeClient } from '../../clients/stripeClient';
import { extractCardId } from '../../utils/stripe';

export class StripeWebhookService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private authorizationRepository: IAuthorizationRepository,
    private stripeClient: StripeClient
  ) {}

  async processWebhook({ payload, signature }: { payload: Buffer, signature: string }) {
    const event = this.verifyWebhookSignature(
      payload,
      signature as string
    );

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'issuing_authorization.created':
        await this.handleAuthorizationEvent(event);
        break;

      case 'issuing_transaction.created':
        await this.handleTransactionEvent(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.stripeClient.getWebhookSecret();

    try {
      return this.stripeClient.constructWebhookEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.log('@@error', error)
      throw new Error('Webhook signature verification failed');
    }
  }

  private async handleAuthorizationEvent(event: Stripe.IssuingAuthorizationCreatedEvent): Promise<void> {
    const authorization = event.data.object;

    console.log(`Authorization ${event.type}:`, authorization);

    await this.authorizationRepository.createWithOperationAndMerchantCategory({ 
      data: {
        amount: authorization.amount,
        stripeCreatedAt: authorization.created,
        stripeId: authorization.id,
        approved: authorization.approved,
        card: {
          stripeId: extractCardId(authorization.card)
        },
        merchantCategory: {
          stripeId: authorization.merchant_data.category_code,
          name: authorization.merchant_data.name || 'unknown',
        }
      }
    });
  }

  private async handleTransactionEvent(event: Stripe.IssuingTransactionCreatedEvent): Promise<void> {
    const transaction = event.data.object;
    
    console.log(`Transaction ${event.type}:`, transaction);

    await this.transactionRepository.createWithOperationAndMerchantCategory({ 
      data: {
        amount: transaction.amount,
        stripeCreatedAt: transaction.created,
        stripeId: transaction.id,
        type: transaction.type,
        card: {
          stripeId: extractCardId(transaction.card)
        },
        merchantCategory: {
          stripeId: transaction.merchant_data.category_code,
          name: transaction.merchant_data.name || 'unknown',
        }
      }
    });
  }
}