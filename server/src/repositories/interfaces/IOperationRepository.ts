import { Authorization, Operation, Transaction, MerchantCategory } from "../../generated/prisma";

export interface IOperationRepository {
  findByStripeCardId(params: { 
    stripeCardId: string, 
    limit?: number, 
    cursor?: string 
  }): Promise<Array<Operation & { 
    authorization: (Authorization & { merchantCategory: MerchantCategory }) | null, 
    transaction: (Transaction & { merchantCategory: MerchantCategory }) | null 
  }>>;
} 