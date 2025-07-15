import { PrismaClient } from "../../generated/prisma";
import { IOperationRepository } from "../interfaces/IOperationRepository";

export class PrismaOperationRepository implements IOperationRepository {
  constructor(private prismaClient: PrismaClient['operation']) {}

  async findByStripeCardId({ stripeCardId, limit, cursor }: { 
    stripeCardId: string, 
    limit?: number, 
    cursor?: string 
  }) {
    return this.prismaClient.findMany({
      where: { 
        stripeCardId,
        OR: [
          {
            authorization: {
              approved: false
            }
          },
          {
            transaction: {
              type: 'capture'
            }
          }
        ]
      },
      orderBy: {
        stripeCreatedAt: 'desc'
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        authorization: {
          include: {
            merchantCategory: true
          }
        },
        transaction: {
          include: {
            merchantCategory: true
          }
        },
      }
    });
  }
} 
