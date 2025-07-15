import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'
import apiRoutes from './routes/api'
import webhookRoutes from './routes/webhook';
import { scheduleTasks } from './tasks/scheduleTasks';

const app: express.Application = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
app.use('/api', express.json({ limit: '10mb' }), apiRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Card Dashboard API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'ENDPOINT_NOT_FOUND'
    }
  });
});

app.use((error: any, req: express.Request, res: express.Response) => {
  console.error('Global error handler:', error);

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: isDevelopment ? error.message : 'Internal server error',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      ...(isDevelopment && { stack: error.stack })
    }
  });
});

scheduleTasks()

export default app; 