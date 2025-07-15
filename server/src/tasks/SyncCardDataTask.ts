import { SyncMode, StripeSyncDataService } from '../services/sync/stripe/SyncDataService';
import { ICardRepository } from '../repositories/interfaces/ICardRepository';

export class SyncCardDataTask {
  constructor(
    private cardRepository: ICardRepository,
    private stripeSyncDataService: StripeSyncDataService,
  ) {}

  async run() {
    try {
      const cards = await this.cardRepository.findAll();
      
      if (cards.length === 0) {
        console.log('No cards found in database');
        return;
      }
      
      console.log(`Found ${cards.length} cards in database. Starting sync...`);
      
      for (const card of cards) {
        console.log(`Syncing card: ${card.stripeId}`);
        
        try {
          await this.stripeSyncDataService.run({
            card: card,
            batchSize: 1000,
            mode: SyncMode.INCREMENTAL
          });
          
          console.log(`Successfully synced card: ${card.stripeId}`);
        } catch (error) {
          console.error(`Failed to sync card ${card.stripeId}:`, error);
          // Continue with other cards even if one fails
        }
      }
      
      console.log('All cards sync completed!');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}