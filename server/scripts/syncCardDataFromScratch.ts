// need to be imported first
import 'dotenv/config'

import { PrismaCardRepository } from '../src/repositories/prisma/PrismaCardRepository'
import { PrismaAuthorizationRepository } from '../src/repositories/prisma/PrismaAuthorizationRepository'
import { PrismaTransactionRepository } from '../src/repositories/prisma/PrismaTransactionRepository'
import { PrismaSyncStateRepository } from '../src/repositories/prisma/PrismaSyncStateRepository'
import { StripeClient } from '../src/clients/stripeClient';
import { StripeTransactionService } from '../src/services/stripe/transactionService';
import { StripeAuthorizationService } from '../src/services/stripe/authorizationService';
import { SyncMode, StripeSyncDataService } from '../src/services/sync/stripe/SyncDataService';
import { prismaClient } from '../src/prisma';

async function main() {
  const stripeClient = new StripeClient()

  const cardRepository = new PrismaCardRepository(prismaClient.card)
  const transactionRepository = new PrismaTransactionRepository(prismaClient)
  const authorizationRepository = new PrismaAuthorizationRepository(prismaClient)
  const syncStateRepository = new PrismaSyncStateRepository(prismaClient.syncState)
  
  const stripeTransactionService = new StripeTransactionService(stripeClient)
  const stripeAuthorizationService = new StripeAuthorizationService(stripeClient)
  
  const stripeSyncDataService = new StripeSyncDataService(
    transactionRepository,
    syncStateRepository,
    authorizationRepository,
    stripeTransactionService,
    stripeAuthorizationService
  );

  if(
    !process.env.STRIPE_CARD_ID || 
    !process.env.STRIPE_CARD_CARDHOLDER_ID || 
    !process.env.STRIPE_CARD_LAST4 || 
    !process.env.STRIPE_CARD_BRAND
  ) {
    console.log('Card data not found.');

    return
  }

  try {
    const card = await cardRepository.upsert({ 
      stripeId: process.env.STRIPE_CARD_ID, 
      cardholderId: process.env.STRIPE_CARD_CARDHOLDER_ID,
      last4: process.env.STRIPE_CARD_LAST4,
      brand: process.env.STRIPE_CARD_BRAND,
    });
    
    await stripeSyncDataService.run({
      card: card,
      batchSize: 1000,
      mode: SyncMode.FROM_SCRATCH
    });
    
    console.log('Sync completed successfully!');
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

main(); 