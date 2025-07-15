import type Stripe from 'stripe';
import { IAuthorizationRepository } from '../../../repositories/interfaces/IAuthorizationRepository';
import { StripeAuthorizationService } from '../../../services/stripe/authorizationService';
import { StripeDataProcessor, ObjectType, StripeFetchOptions } from './DataProcessor';
import { extractCardId } from '../../../utils/stripe';

export class StripeAuthorizationProcessor implements StripeDataProcessor<Stripe.Issuing.Authorization> {
  constructor(
    private authorizationRepo: IAuthorizationRepository,
    private stripeAuthorizationService: StripeAuthorizationService
  ) {}

  async fetchData(cardId: string, options: StripeFetchOptions): Promise<{ data: Stripe.Issuing.Authorization[], has_more: boolean }> {
    const result = await this.stripeAuthorizationService.fetchAuthorizations(cardId, options);
    return {
      data: result.authorizations,
      has_more: result.has_more
    };
  }

  async processData(authorizations: Stripe.Issuing.Authorization[]): Promise<void> {
    for (const authorization of authorizations) {
      try {
        const existingAuthorization = await this.authorizationRepo.findByStripeId({ stripeId: authorization.id });
        
        if (existingAuthorization) {
          console.log(`Authorization ${authorization.id} already exists, skipping...`);
          continue;
        }

        await this.authorizationRepo.createWithOperationAndMerchantCategory({
          data: this.mapAuthorizationToData(authorization)
        });

        console.log(`Saved authorization ${authorization.id} with operation to database`);
      } catch (error) {
        console.error(`Error processing authorization ${authorization.id}:`, error);
      }
    }
  }

  getObjectType(): ObjectType {
    return ObjectType.AUTHORIZATION;
  }

  getRepository(): IAuthorizationRepository {
    return this.authorizationRepo;
  }

  getDataId(authorization: Stripe.Issuing.Authorization): string {
    return authorization.id;
  }

  private mapAuthorizationToData(authorization: Stripe.Issuing.Authorization) {
    return {
      stripeId: authorization.id,
      amount: Math.abs(authorization.amount),
      stripeCreatedAt: authorization.created,
      approved: authorization.approved,
      card: {
        stripeId: extractCardId(authorization.card)
      },
      merchantCategory: {
        stripeId: authorization.merchant_data.category_code,
        name: authorization.merchant_data.name || 'unknown',
      }
    };
  }
} 