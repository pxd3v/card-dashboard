import express, { Router } from 'express';
import { MetricsController } from '../../controllers/metricsController';
import { CategoryBreakdownService } from '../../services/categoryBreakdownService';
import { SpendingSummaryService } from '../../services/spendingSummaryService';
import { PrismaTransactionRepository } from '../../repositories/prisma/PrismaTransactionRepository';
import { prismaClient } from '../../prisma';

const router: express.Router = Router();

const transactionRepository = new PrismaTransactionRepository(prismaClient.transaction);

const categoryBreakdownService = new CategoryBreakdownService(transactionRepository);
const spendingSummaryService = new SpendingSummaryService(transactionRepository);

const metricsController = new MetricsController(categoryBreakdownService, spendingSummaryService);

router.get('/categories', (req, res) => metricsController.getCategoryBreakdown(req, res));

router.get('/summary', (req, res) => metricsController.getSpendingSummary(req, res));

export default router; 