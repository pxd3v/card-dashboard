import type Stripe from 'stripe';

export function extractCardId(card: string | Stripe.Issuing.Card): string {
  return typeof card === 'string' ? card : card.id;
} 