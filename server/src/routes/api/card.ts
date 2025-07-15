import express, { Router } from 'express';
import { CardController } from '../../controllers/CardController';
import { ActivityService } from '../../services/activityService';
import { PrismaOperationRepository } from '../../repositories/prisma/PrismaOperationRepository';
import { prismaClient } from '../../prisma';

const router: express.Router = Router();

const operationRepository = new PrismaOperationRepository(prismaClient.operation)

const activityService = new ActivityService(operationRepository);
const cardController = new CardController(activityService);

router.get('/activity', (req, res) => cardController.getCardActivity(req, res));

export default router; 