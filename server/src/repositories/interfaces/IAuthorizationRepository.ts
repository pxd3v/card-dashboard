import { Authorization } from "../../generated/prisma";

export interface ICreateAuthorization {
  stripeId: string;
  amount: number;
  stripeCreatedAt: number;
  approved: boolean;
  card: {
    stripeId: string
  },
  merchantCategory: {
    stripeId: string,
    name: string
  }
}

export interface IAuthorizationRepository {
  findByStripeId(params: { stripeId: string }): Promise<Authorization | null>;
  findById(params: { id: string }): Promise<Authorization | null>;
  createWithOperationAndMerchantCategory(params: { data: ICreateAuthorization }): Promise<Authorization>;
  findByStripeCardId(params: { stripeCardId: string, limit?: number, cursor?: string, approvedOnly?: boolean }): Promise<Authorization[]>;
  findNewestByCard(params: { stripeCardId?: string }): Promise<Authorization | null>;
} 