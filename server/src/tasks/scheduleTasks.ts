import cron from 'node-cron'

import { StripeClient } from '../clients/stripeClient'
import { PrismaAuthorizationRepository } from '../repositories/prisma/PrismaAuthorizationRepository'
import { PrismaCardRepository } from '../repositories/prisma/PrismaCardRepository'
import { PrismaSyncStateRepository } from '../repositories/prisma/PrismaSyncStateRepository'
import { PrismaTransactionRepository } from '../repositories/prisma/PrismaTransactionRepository'
import { StripeAuthorizationService } from '../services/stripe/authorizationService'
import { StripeTransactionService } from '../services/stripe/transactionService'
import { StripeSyncDataService } from '../services/sync/stripe/SyncDataService'
import { SyncCardDataTask } from './SyncCardDataTask'
import { prismaClient } from '../prisma'

export function scheduleTasks () {
  const stripeClient = new StripeClient()

  const cardRepository = new PrismaCardRepository(prismaClient.card)
  const transactionRepository = new PrismaTransactionRepository(prismaClient.transaction)
  const authorizationRepository = new PrismaAuthorizationRepository(prismaClient.authorization)
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

  const syncCardDataTask = new SyncCardDataTask(cardRepository, stripeSyncDataService)

  // runs from 10 to 10 minutes
  cron.schedule("10 * * * *", () => syncCardDataTask.run());
}