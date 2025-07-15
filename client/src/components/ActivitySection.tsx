import { Card } from '@/components/ui/Card';
import { CardHeader } from '@/components/ui/CardHeader';
import { CardTitle } from '@/components/ui/CardTitle';
import { CardContent } from '@/components/ui/CardContent';
import { ActivityFeedContainer } from '@/components/ActivityFeedContainer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ActivityItem } from '@/types/activity';

interface ActivitySectionProps {
  activities: ActivityItem[];
  hasMore: boolean;
  nextCursor?: string;
}

export function ActivitySection({ activities, hasMore, nextCursor }: ActivitySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <ActivityFeedContainer 
            initialActivities={activities}
            initialHasMore={hasMore}
            initialNextCursor={nextCursor}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
} 