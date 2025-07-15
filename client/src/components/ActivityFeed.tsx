import { AlertCircle } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { Spinner } from '@/components/ui/Spinner';
import { ActivityRow } from '@/components/ActivityRow';
import type { ActivityItem } from '@/types/activity';

interface ActivityFeedProps {
  activities: ActivityItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

export function ActivityFeed({ activities, onLoadMore, hasMore, loadingMore }: ActivityFeedProps) {
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

  const itemHeight = 88;
  const containerHeight = 384;

  const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }: { 
    scrollOffset: number; 
    scrollUpdateWasRequested: boolean;
  }) => {
    if (scrollUpdateWasRequested) return;
    
    const totalHeight = activities.length * itemHeight;
    const visibleHeight = containerHeight;
    const scrollThreshold = totalHeight - visibleHeight - 200;
    
    if (scrollOffset >= scrollThreshold && hasMore && !loadingMore) {
      onLoadMore();
    }
  };

  return (
    <div className="h-96">
      <List
        height={containerHeight}
        itemCount={activities.length}
        itemSize={itemHeight}
        itemData={activities}
        width="100%"
        className="pr-2"
        onScroll={handleScroll}
      >
        {ActivityRow}
      </List>
      
      {hasMore && loadingMore && (
        <div className="flex justify-center py-4">
          <Spinner loading={true} />
        </div>
      )}
    </div>
  );
} 