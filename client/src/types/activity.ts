export interface ActivityItem {
  id: string;
  objectType: 'authorization' | 'transaction';
  stripeCreatedAt: string;
  authorization?: {
    id: string;
    amount: number;
    approved: boolean;
    merchantCategory: {
      name: string;
    };
  };
  transaction?: {
    id: string;
    amount: number;
    type: string;
    merchantCategory: {
      name: string;
    };
  };
}

export interface SpendingSummary {
  totalSpend: number;
  averageSpend: number;
  totalTransactions: number;
}

export interface CategoryData {
  id: string;
  name: string;
  count: number;
  total: number;
}

export interface ActivityResponse {
  data: ActivityItem[];
  pagination: {
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface CategoryResponse {
  data: {
    categories: CategoryData[];
  };
}

export interface SummaryResponse {
  data: SpendingSummary;
} 