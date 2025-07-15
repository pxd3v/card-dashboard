import { SyncState } from "../../generated/prisma";

export interface ISyncStateRepository {
  findByCardAndType(params: { stripeCardId: string, objectType: 'transaction' | 'authorization' }): Promise<SyncState | null>;
  upsert(params: { stripeCardId: string, objectType: 'transaction' | 'authorization', lastCursor: string }): Promise<SyncState>;
} 