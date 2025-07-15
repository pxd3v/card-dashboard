import { CreditCard, XCircle } from 'lucide-react';
import type { ActivityItem } from '@/types/activity';
import { getActivityInfo } from '@/utils/activityUtils';

interface ActivityItemIconProps {
  item: ActivityItem;
}

export function ActivityItemIcon({ item }: ActivityItemIconProps) {
  const activityInfo = getActivityInfo(item);
  
  if (activityInfo.isAuthorization) {
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return <CreditCard className="h-5 w-5 text-blue-500" />;
} 