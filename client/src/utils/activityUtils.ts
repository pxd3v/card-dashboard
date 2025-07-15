import { ActivityItem } from '@/types/activity';

export type ActivityStatus = 'declined' | 'captured';

export interface ActivityInfo {
  title: string;
  amount: number;
  status: ActivityStatus;
  isAuthorization: boolean;
}

export function getActivityInfo(item: ActivityItem): ActivityInfo {
  if (item.authorization) {
    return {
      title: item.authorization.merchantCategory.name,
      amount: item.authorization.amount,
      status: 'declined',
      isAuthorization: true
    };
  }
  
  return {
    title: item.transaction?.merchantCategory.name || '',
    amount: item.transaction?.amount || 0,
    status: 'captured',
    isAuthorization: false
  };
}

export function getStatusDisplayName(status: ActivityStatus): string {
  const statusMap: Record<ActivityStatus, string> = {
    declined: 'Declined',
    captured: 'Captured'
  };
  return statusMap[status];
}

export function getStatusStyles(status: ActivityStatus): string {
  const styleMap: Record<ActivityStatus, string> = {
    declined: 'bg-red-100 text-red-800',
    captured: 'bg-blue-100 text-blue-800'
  };
  return styleMap[status];
} 