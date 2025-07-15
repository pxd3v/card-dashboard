# Card Dashboard Backend

A service for managing Stripe Issuing card data.

## 📊 Data Models

- **Card** - Stripe Issuing card information
- **Authorization** - Card closed authorization attempts
- **Transaction** - Captured Card transactions
- **MerchantCategory** - Merchant categorization data
- **Operation** - Unified view of authorizations and transactions
- **SyncState** - Tracks synchronization progress

## Core Features

- **Sync data through stripe webhooks** - Handles `issuing_authorization.created` and `issuing_transaction.created` events
- **Cron Job to constantly check if any data is missing** - From 10 to 10 minutes we check if card data is missing (to fallback in case webhook fails or app goes offline)
- **Incremental Sync** - Only fetches new data since last sync

## API Endpoints

```
GET  /api/card/activity           - List all transactions and authorizations, with pagination
GET  /api/metrics/categories      - Transactions Category breakdown
GET  /api/metrics/summary         - Transactions stats summary
POST /webhook/stripe              - Stripe webhook endpoint
```

### Installation

1. **Clone and install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment setup**

   ```bash
   cp env.example .env
   # Fill in your Stripe credentials and configuration
   ```

3. **Database setup**

   ```bash
   pnpm db:generate    # Generate Prisma client
   pnpm db:migrate     # Run database migrations
   ```

4. **Create card in db and do initial sync**

   ```bash
   pnpm sync:card-from-scratch
   ```

5. **Start development server**

   ```bash
   pnpm dev           # Development with hot reload
   ```
