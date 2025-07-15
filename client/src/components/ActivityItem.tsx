import { ActivityItemIcon } from '@/components/ui/ActivityItemIcon';
import { ActivityStatusBadge } from '@/components/ui/ActivityStatusBadge';
import { formatAmount, formatDate } from '@/utils/formatters';
import { getActivityInfo } from '@/utils/activityUtils';
import type { ActivityItem } from '@/types/activity';

interface ActivityItemProps {
  item: ActivityItem;
}

export function ActivityItemComponent({ item }: ActivityItemProps) {
  const activityInfo = getActivityInfo(item);
  
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
} 