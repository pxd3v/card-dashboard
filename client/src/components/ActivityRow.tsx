import { ActivityItemComponent } from '@/components/ActivityItem';
import type { ActivityItem } from '@/types/activity';

interface ActivityRowProps {
  index: number;
  style: React.CSSProperties;
  data: ActivityItem[];
}

export function ActivityRow({ index, style, data }: ActivityRowProps) {
  const item = data[index];
  
  return (
    <div style={style} className="mb-4">
      <ActivityItemComponent item={item} />
    </div>
  );
} 