import { Request, Response } from 'express';
import { ActivityService } from '../services/activityService';

export class CardController {
  constructor(
    private activityService: ActivityService,
  ) {}

  async getCardActivity(req: Request, res: Response): Promise<void> {
    try {
      if(!process.env.STRIPE_CARD_ID) {
        throw new Error('Card not found')
      }
      
      const { 
        limit = 50, 
        cursor,
      } = req.query

      const params = {
        limit: Number(limit),
        cursor: cursor as string | undefined,
      };

      const result = await this.activityService.fetchCardActivity({ stripeCardId: process.env.STRIPE_CARD_ID, params });

      res.json({
        success: true,
        data: result.operations,
        pagination: {
          hasMore: result.hasMore,
          nextCursor: result.lastCursor,
        }
      });
    } catch (error) {
      console.error('Error in getCardActivity:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch card activity',
          code: 'CARD_ACTIVITY_FETCH_ERROR'
        }
      });
    }
  }
}