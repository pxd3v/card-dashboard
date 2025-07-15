import { ChartsSection } from '@/components/ChartsSection';
import { ActivitySection } from '@/components/ActivitySection';
import type { SpendingSummary, CategoryData, ActivityItem } from '@/types/activity';
import { MetricsCards } from './MetricsCards';

interface DashboardContentProps {
  spendingSummary: SpendingSummary;
  categoryData: CategoryData[];
  activities: ActivityItem[];
  hasMore: boolean;
  nextCursor?: string;
}

export function DashboardContent({
  spendingSummary,
  categoryData,
  activities,
  hasMore,
  nextCursor
}: DashboardContentProps) {
  return (
    <>
      <MetricsCards spendingSummary={spendingSummary} />

      <div className="grid grid-cols-1 gap-8">
        <ChartsSection categoryData={categoryData} />
        <ActivitySection 
          activities={activities}
          hasMore={hasMore}
          nextCursor={nextCursor}
        />
      </div>
    </>
  );
} 