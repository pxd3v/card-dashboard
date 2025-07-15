import type { ActivityItem } from '@/types/activity';
import { getActivityInfo, getStatusDisplayName, getStatusStyles } from '@/utils/activityUtils';

interface ActivityStatusBadgeProps {
  item: ActivityItem;
}

export function ActivityStatusBadge({ item }: ActivityStatusBadgeProps) {
  const activityInfo = getActivityInfo(item);
  const status = activityInfo.status;

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(status)}`}>
      {getStatusDisplayName(status)}
    </span>
  );
} 