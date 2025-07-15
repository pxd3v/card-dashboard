# Card Dashboard

A dashboard for managing Stripe Issuing card data.

## 📊 Data Models

- **Card** - Stripe Issuing card information
- **Authorization** - Card closed authorization attempts
- **Transaction** - Captured Card transactions
- **MerchantCategory** - Merchant categorization data
- **Operation** - Unified view of authorizations and transactions
- **SyncState** - Tracks synchronization progress

## Core Features

### Backend Features

- **Stripe Webhook Integration** - Handles `issuing_authorization.created` and `issuing_transaction.created` events
- **Automated Sync** - Cron job runs every 10 minutes to check for missing data (fallback for webhook failures)
- **Incremental Sync** - Only fetches new data since last sync
- **RESTful API** - Endpoints for frontend consumption

### Frontend Features

- **Interactive Charts** - Category breakdown and spending analytics
- **Activity Feed** - Paginated transaction and authorization history
- **Responsive Design** - Modern UI that works on all devices

## API Endpoints

```
GET  /api/card/activity           - List all transactions and authorizations, with pagination
GET  /api/metrics/categories      - Transactions Category breakdown
GET  /api/metrics/summary         - Transactions stats summary
POST /webhook/stripe              - Stripe webhook endpoint
```

## Installation & Setup

### Backend Setup

1. **Install dependencies**

   ```bash
   cd server
   pnpm install
   ```

2. **Environment configuration**

   ```bash
   cd server
   cp env.example .env
   # Fill in your Stripe credentials and database configuration
   ```

3. **Database setup**

   ```bash
   pnpm db:generate    # Generate Prisma client
   pnpm db:migrate     # Run database migrations
   ```

4. **Initial data sync**

   ```bash
   pnpm sync:card-from-scratch
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd client
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
