import express, { Router } from 'express';
import { MetricsController } from '../../controllers/metricsController';
import { CategoryBreakdownService } from '../../services/categoryBreakdownService';
import { SpendingSummaryService } from '../../services/spendingSummaryService';
import { PrismaClient } from '../../generated/prisma';
import { PrismaTransactionRepository } from '../../repositories/prisma/PrismaTransactionRepository';

const router: express.Router = Router();

const prismaClient = new PrismaClient();
const transactionRepository = new PrismaTransactionRepository(prismaClient);

const categoryBreakdownService = new CategoryBreakdownService(transactionRepository);
const spendingSummaryService = new SpendingSummaryService(transactionRepository);

const metricsController = new MetricsController(categoryBreakdownService, spendingSummaryService);

router.get('/categories', (req, res) => metricsController.getCategoryBreakdown(req, res));

router.get('/summary', (req, res) => metricsController.getSpendingSummary(req, res));

export default router; 