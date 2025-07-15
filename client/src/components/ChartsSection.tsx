import { Card } from '@/components/ui/Card';
import { CardHeader } from '@/components/ui/CardHeader';
import { CardTitle } from '@/components/ui/CardTitle';
import { CardContent } from '@/components/ui/CardContent';
import { CategoryChart } from '@/components/CategoryChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CategoryData } from '@/types/activity';

interface ChartsSectionProps {
  categoryData: CategoryData[];
}

export function ChartsSection({ categoryData }: ChartsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <CategoryChart data={categoryData} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
} 