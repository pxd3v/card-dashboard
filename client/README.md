# Card Dashboard Client

A Next.js-based dashboard for displaying card activity, metrics, and spending analytics.

## Features

- **Activity Feed**: Displays all transactions and authorizations (approved/declined) in chronological order
- **Infinite Scroll**: Load additional activity data as needed
- **Real-time Updates**: Auto-refresh every 30 seconds to show new Stripe data
- **Metrics Dashboard**: Shows total spend, average transaction amount, and total transaction count
- **Category Analytics**: Pie chart showing transaction category distribution
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints Used

- `GET /api/card/activity` - Fetch card activity with pagination
- `GET /api/metrics/summary` - Get spending summary metrics
- `GET /api/metrics/categories` - Get category breakdown for charts

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set environment variables:

   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Filtering

The dashboard only displays:

- **Authorizations**: Approved or declined (ignores other states)
- **Transactions**: Only captured transactions (ignores other types)

## Performance

Designed to handle ~1,000 authorizations and ~1,000 transactions with reasonable load times (~a few seconds) through:

- Pagination with cursor-based navigation
- Efficient data filtering on the server
- Optimized React rendering with proper memoization
