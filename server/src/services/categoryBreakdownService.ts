import { MerchantCategory, Transaction } from "../generated/prisma";
import { ITransactionRepository } from "../repositories/interfaces/ITransactionRepository";

export interface CategoryBreakdownParams {
  stripeCardId: string;
  thresholdPercent?: number;
}

export interface CategoryData {
  id: string;
  name: string;
  count: number;
  total: number;
}

export interface CategoryBreakdownResult {
  categories: CategoryData[];
}

interface CategoryBreakdownMap {
  [categoryId: string]: { count: number; total: number; name: string };
}

export class CategoryBreakdownService {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  async getCategoryBreakdown({ stripeCardId, thresholdPercent = 3 }: CategoryBreakdownParams): Promise<CategoryBreakdownResult> {
    const transactions = await this.transactionRepository.findAllByStripeCardIdWithCategories({ 
      stripeCardId,
    });

    const categoryBreakdown = this.buildCategoryBreakdown(transactions);
    const { majorCategories, minorCategories } = this.categorizeByThreshold(categoryBreakdown, thresholdPercent);
    
    majorCategories.sort((a, b) => b.count - a.count);
    
    const finalCategories = [...majorCategories];
    
    if (minorCategories.length > 0) {
      finalCategories.push(this.buildOtherCategory(minorCategories));
    }

    return {
      categories: finalCategories,
    };
  }

  private buildCategoryBreakdown(transactions: Array<Transaction & { merchantCategory: MerchantCategory }>) {
    return transactions.reduce((acc, tx) => {
      const categoryId = tx.merchantCategoryStripeId;
      const categoryName = tx.merchantCategory.name;
      
      // TO DO: check what bigint to number conversion can cause
      const amount = Number(tx.amount);
      
      if (!acc[categoryId]) {
        acc[categoryId] = { count: 0, total: 0, name: categoryName };
      }
      
      acc[categoryId].count += 1;
      acc[categoryId].total += amount;

      return acc;
    }, {} as CategoryBreakdownMap);
  }

  private categorizeByThreshold(categoryBreakdown: CategoryBreakdownMap, thresholdPercent: number) {
    const totalTransactions = Object.values(categoryBreakdown).reduce((sum, cat) => sum + cat.count, 0);
    const thresholdCount = Math.ceil((thresholdPercent / 100) * totalTransactions);

    const { majorCategories, minorCategories } = Object.entries(categoryBreakdown).reduce(
      (acc, [id, data]) => {
        const category = { id, ...data };
        if (data.count >= thresholdCount) {
          acc.majorCategories.push(category);
        } else {
          acc.minorCategories.push(category);
        }
        return acc;
      },
      { majorCategories: [] as CategoryData[], minorCategories: [] as CategoryData[] }
    );

    return { majorCategories, minorCategories };
  }

  private buildOtherCategory(minorCategories: CategoryData[]): CategoryData {
    const totals = minorCategories.reduce(
      (acc, cat) => ({ count: acc.count + cat.count, total: acc.total + cat.total }),
      { count: 0, total: 0 }
    );

    return {
      id: 'other',
      name: 'Other',
      ...totals
    };
  }
} 