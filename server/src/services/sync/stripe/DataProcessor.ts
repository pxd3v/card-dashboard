
import { ITransactionRepository } from '../../../repositories/interfaces/ITransactionRepository';
import { IAuthorizationRepository } from '../../../repositories/interfaces/IAuthorizationRepository';

export enum ObjectType {
  TRANSACTION = 'transaction',
  AUTHORIZATION = 'authorization'
}

export interface StripeFetchOptions {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}

export interface StripeDataProcessor<T> {
  fetchData(cardId: string, options: StripeFetchOptions): Promise<{ data: T[], has_more: boolean }>;
  processData(data: T[]): Promise<void>;
  getObjectType(): ObjectType;
  getRepository(): ITransactionRepository | IAuthorizationRepository;
  getDataId(data: T): string;
} 