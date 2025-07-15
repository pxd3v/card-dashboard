import { Transaction, MerchantCategory } from "../../generated/prisma";

export interface ICreateTransaction {
  stripeId: string;
  amount: number;
  type: string;
  stripeCreatedAt: number;
  card: {
    stripeId: string
  },
  merchantCategory: {
    stripeId: string,
    name: string
  }
}

export interface ITransactionRepository {
  findByStripeId(params: { stripeId: string }): Promise<Transaction | null>;
  findById(params: { id: string }): Promise<Transaction | null>;
  createWithOperationAndMerchantCategory(params: { data: ICreateTransaction }): Promise<Transaction>;
  findNewestByCard(params: { stripeCardId?: string }): Promise<Transaction | null>;
  findAllByStripeCardId(params: { stripeCardId: string }): Promise<Transaction[]>;
  findAllByStripeCardIdWithCategories(params: { stripeCardId: string }): Promise<Array<Transaction & { merchantCategory: MerchantCategory }>>;
} 