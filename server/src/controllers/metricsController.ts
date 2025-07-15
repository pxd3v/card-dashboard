import { Request, Response } from 'express';
import { CategoryBreakdownService } from '../services/categoryBreakdownService';
import { SpendingSummaryService } from '../services/spendingSummaryService';

export class MetricsController {
  constructor(
    private categoryBreakdownService: CategoryBreakdownService,
    private spendingSummaryService: SpendingSummaryService,
  ) {}

  async getCategoryBreakdown(req: Request, res: Response): Promise<void> {
    try {
      if(!process.env.STRIPE_CARD_ID) {
        throw new Error('Card not found')
      }

      const result = await this.categoryBreakdownService.getCategoryBreakdown({
        stripeCardId: process.env.STRIPE_CARD_ID,
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getCategoryBreakdown:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch category breakdown',
          code: 'CATEGORY_BREAKDOWN_ERROR'
        }
      });
    }
  }

  async getSpendingSummary(req: Request, res: Response): Promise<void> {
    try {
      if(!process.env.STRIPE_CARD_ID) {
        throw new Error('Card not found')
      }

      const result = await this.spendingSummaryService.getSpendingSummary({
        stripeCardId: process.env.STRIPE_CARD_ID
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getSpendingSummary:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch spending summary',
          code: 'SPENDING_SUMMARY_ERROR'
        }
      });
    }
  }
} 