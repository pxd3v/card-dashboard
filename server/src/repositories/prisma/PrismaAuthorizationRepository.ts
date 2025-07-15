import { PrismaClient } from '../../generated/prisma';
import { IAuthorizationRepository, ICreateAuthorization } from '../interfaces/IAuthorizationRepository';

export class PrismaAuthorizationRepository implements IAuthorizationRepository {
  constructor(private prisma: PrismaClient['authorization']) {}

  async findByStripeId({ stripeId }: { stripeId: string }) {
    return this.prisma.findFirst({
      where: { stripeId }
    });
  }

  async findById({ id }: { id: string }) {
    return this.prisma.findFirst({
      where: { id }
    });
  }

  async findByStripeCardId({ stripeCardId, limit = 50, cursor, approvedOnly }: { stripeCardId: string, limit?: number, cursor?: string, approvedOnly?: boolean }) {
    return this.prisma.findMany({
      where: { stripeCardId, approved: approvedOnly  },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { stripeCreatedAt: 'desc' },
    });
  }

  async findNewestByCard({ stripeCardId }: { stripeCardId?: string }) {
    const whereClause = stripeCardId ? { stripeCardId } : {};
    return this.prisma.findFirst({
      where: whereClause,
      orderBy: { stripeCreatedAt: 'desc' },
    });
  }

  async createWithOperationAndMerchantCategory({ data }: { data: ICreateAuthorization }) {
    const stripeCreatedAt = new Date(data.stripeCreatedAt * 1000)
    
    return this.prisma.create({
      data: {
        ...data,
        stripeCreatedAt,
        card: {
          connect: {
            stripeId: data.card.stripeId
          }
        },
        operation: {
          create: {
            objectType: 'authorization',
            stripeCardId: data.card.stripeId,
            stripeCreatedAt
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
} 