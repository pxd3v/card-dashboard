import type { PrismaClient } from '../../generated/prisma';

import { ISyncStateRepository } from '../interfaces/ISyncStateRepository';

export class PrismaSyncStateRepository implements ISyncStateRepository {
  constructor(private prismaClient: PrismaClient['syncState']) {}


  async findByCardAndType({ stripeCardId, objectType }: { stripeCardId: string, objectType: 'transaction' | 'authorization' }) {
    return this.prismaClient.findUnique({
      where: {
        stripeCardId_objectType: {
          stripeCardId,
          objectType,
        },
      },
    });
  }

  async upsert({ stripeCardId, objectType, lastCursor }: { 
    stripeCardId: string, 
    objectType: 'transaction' | 'authorization', 
    lastCursor: string 
  }) {
    return this.prismaClient.upsert({
      where: {
        stripeCardId_objectType: {
          stripeCardId,
          objectType,
        },
      },
      update: {
        lastCursor,
        lastSyncAt: new Date(),
      },
      create: {
        stripeCardId,
        objectType,
        lastCursor,
        lastSyncAt: new Date(),
      },
    });
  }
} 