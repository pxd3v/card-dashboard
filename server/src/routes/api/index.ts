import express, { Router } from 'express';
import cardRoutes from './card';
import metricsRoutes from './metrics';

const router: express.Router = Router();

router.use('/card', cardRoutes);
router.use('/metrics', metricsRoutes);

export default router; 