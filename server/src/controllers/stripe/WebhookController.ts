import { Request, Response } from 'express';
import { StripeWebhookService } from '../../services/stripe/webhookService';

export class StripeWebhookController {
  constructor(
    private stripeWebhookService: StripeWebhookService,
  ) {}

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Missing Stripe signature',
          code: 'MISSING_SIGNATURE'
        }
      });
      return;
    }

    try {
      this.stripeWebhookService.processWebhook({ 
        payload: req.body, 
        signature: signature as string 
      })

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        error: {
          message: 'Webhook signature verification failed',
          code: 'WEBHOOK_VERIFICATION_FAILED'
        }
      });
    }
  }
}
