import { Card } from "../../generated/prisma";

export interface ICreateCard {
  stripeId: string, 
  cardholderId: string,
  last4: string,
  brand: string
}

export interface ICardRepository {
  findByStripeId(params: { stripeId: string }): Promise<Card | null>;
  findAll(): Promise<Card[]>;
  upsert(params: ICreateCard): Promise<Card>
} 