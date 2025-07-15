import { AlertCircle } from 'lucide-react';
import { ActivityItemIcon } from '@/components/ui/ActivityItemIcon';
import { ActivityStatusBadge } from '@/components/ui/ActivityStatusBadge';
import { Spinner } from '@/components/ui/Spinner';
import { formatAmount, formatDate } from '@/utils/formatters';
import { getActivityInfo } from '@/utils/activityUtils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { ActivityItem } from '@/types/activity';

interface ActivityFeedProps {
  activities: ActivityItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

export function ActivityFeed({ activities, onLoadMore, hasMore, loadingMore }: ActivityFeedProps) {
  const { loadingRef } = useIntersectionObserver(onLoadMore, hasMore, loadingMore);

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No activity found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 overflow-y-auto space-y-4 pr-2">
      {activities.map((item) => {
        const activityInfo = getActivityInfo(item);
        
        return (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              <ActivityItemIcon item={item} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {activityInfo.title}
                </h4>
                <span className="text-sm font-semibold text-gray-900">
                  {formatAmount(activityInfo.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {formatDate(item.stripeCreatedAt)}
                </span>
                <ActivityStatusBadge item={item} />
              </div>
            </div>
          </div>
        );
      })}
      
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-4">
          <Spinner loading={loadingMore} />
        </div>
      )}
    </div>
  );
} 