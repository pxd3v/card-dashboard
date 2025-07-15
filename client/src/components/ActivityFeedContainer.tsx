'use client';

import { useState, useCallback } from 'react';
import { ActivityFeed } from '@/components/ActivityFeed';
import { getActivities } from '@/lib/api';
import type { ActivityItem } from '@/types/activity';

interface ActivityFeedContainerProps {
  initialActivities: ActivityItem[];
  initialHasMore: boolean;
  initialNextCursor?: string;
}

export function ActivityFeedContainer({ 
  initialActivities, 
  initialHasMore, 
  initialNextCursor 
}: ActivityFeedContainerProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastCursor, setLastCursor] = useState<string | undefined>(initialNextCursor);

  const loadMoreActivities = useCallback(async () => {
    if (loadingMore || !hasMore || !lastCursor) return;
    
    setLoadingMore(true);
    
    try {
      const response = await getActivities(lastCursor);
      
      setActivities(prev => [...prev, ...response.data]);
      setHasMore(response.pagination.hasMore);
      setLastCursor(response.pagination.nextCursor);
    } catch (err) {
      console.error('Failed to load more activities:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [lastCursor, hasMore, loadingMore]);

  return (
    <ActivityFeed 
      activities={activities}
      onLoadMore={loadMoreActivities}
      hasMore={hasMore}
      loadingMore={loadingMore}
    />
  );
} 