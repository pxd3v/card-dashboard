import express, { Router } from 'express';
import { PrismaTransactionRepository } from '../../repositories/prisma/PrismaTransactionRepository';
import { PrismaAuthorizationRepository } from '../../repositories/prisma/PrismaAuthorizationRepository';
import { StripeWebhookController } from '../../controllers/stripe/WebhookController';
import { StripeWebhookService } from '../../services/stripe/webhookService';
import { StripeClient } from '../../clients/stripeClient';
import { prismaClient } from '../../prisma';

const router: express.Router = Router();

const transactionRepo = new PrismaTransactionRepository(prismaClient.transaction);
const authorizationRepo = new PrismaAuthorizationRepository(prismaClient.authorization);
const stripeClient = new StripeClient()
const stripeWebhookService = new StripeWebhookService(transactionRepo, authorizationRepo, stripeClient)

const stripeWebhookController = new StripeWebhookController(stripeWebhookService);

router.post('/', (req, res) => stripeWebhookController.handleWebhook(req, res));

export default router; 