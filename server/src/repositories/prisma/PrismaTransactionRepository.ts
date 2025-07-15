import { PrismaClient } from '../../generated/prisma';
import { ICreateTransaction, ITransactionRepository } from '../interfaces/ITransactionRepository';

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByStripeId({ stripeId }: { stripeId: string }) {
    return this.prisma.transaction.findFirst({
      where: { stripeId }
    });
  }

  async findById({ id }: { id: string }) {
    return this.prisma.transaction.findFirst({
      where: { id }
    });
  }

  async findNewestByCard({ stripeCardId }: { stripeCardId?: string }) {
    const whereClause = stripeCardId ? { stripeCardId } : {};
    return this.prisma.transaction.findFirst({
      where: whereClause,
      orderBy: { stripeCreatedAt: 'desc' },
    });
  }

  async createWithOperationAndMerchantCategory({ data }: { data: ICreateTransaction & { merchantCategory: { stripeId: string, name: string }} }) {
    const stripeCreatedAt = new Date(data.stripeCreatedAt * 1000)
    
    return this.prisma.transaction.create({
      data: {
        amount: data.amount,
        stripeId: data.stripeId,
        type: data.type,
        stripeCreatedAt,
        card: {
          connect: {
            stripeId: data.card.stripeId
          }
        },
        operation: {
          create: {
            objectType: 'transaction',
            stripeCardId: data.card.stripeId,
            stripeCreatedAt,            
          }
        },
        merchantCategory: {
          connectOrCreate: {
            where: {
              stripeId: data.merchantCategory.stripeId,
            },
            create: {
              stripeId: data.merchantCategory.stripeId,
              name: data.merchantCategory.name
            }
          }
        }
      }
    });
  }

  async findAllByStripeCardId({ stripeCardId }: { stripeCardId: string }) {
    return this.prisma.transaction.findMany({
      where: { stripeCardId },
    });
  }

  async findAllByStripeCardIdWithCategories({ stripeCardId }: { stripeCardId: string }) {
    return this.prisma.transaction.findMany({
      where: {
        stripeCardId,
      },
      include: {
        merchantCategory: true
      }
    });
  }
} 