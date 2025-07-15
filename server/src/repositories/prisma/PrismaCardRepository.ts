import type { PrismaClient } from '../../generated/prisma';
import { ICardRepository, ICreateCard } from '../interfaces/ICardRepository';


export class PrismaCardRepository implements ICardRepository {
  constructor(private prismaClient: PrismaClient['card']) {}

  async findByStripeId({ stripeId }: { stripeId: string }) {
    return this.prismaClient.findUnique({
      where: { stripeId },
      include: {
        authorizations: true,
        transactions: true,
      },
    });
  }

  async findAll() {
    return this.prismaClient.findMany({
      include: {
        authorizations: true,
        transactions: true,
      },
    });
  }

  async upsert({ stripeId, cardholderId, last4, brand }: ICreateCard) {
    return this.prismaClient.upsert({
      where: {
        stripeId
      },
      update: {},
      create: {
        stripeId,
        cardholderId,
        last4,
        brand,
      },
    });
  }
} 