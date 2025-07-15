import express, { Router } from 'express';
import stripeRoutes from './stripe';

const router: express.Router = Router();

router.use('/stripe', stripeRoutes);

export default router; 