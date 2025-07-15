import { DashboardContent } from '@/components/DashboardContent';
import { getActivities, getSpendingSummary, getCategoryData } from '@/lib/api';
import { DashboardError } from '@/components/DashboardError';
import { DashboardLayout } from '@/components/DashboardLayout';

export default async function Dashboard() {
  try {
    const [activitiesResponse, spendingSummaryResponse, categoryResponse] = await Promise.all([
      getActivities(),
      getSpendingSummary(),
      getCategoryData()
    ]);

    return (
      <DashboardLayout>
        <DashboardContent
          spendingSummary={spendingSummaryResponse.data}
          categoryData={categoryResponse.data.categories}
          activities={activitiesResponse.data}
          hasMore={activitiesResponse.pagination.hasMore}
          nextCursor={activitiesResponse.pagination.nextCursor}
        />
      </DashboardLayout>
    );
  } catch (error) {
    console.error('@@Error', error);

    return (
      <DashboardLayout>
        <DashboardError message={"Failed to load the dashboard."} />
      </DashboardLayout>
    );
  }
}
