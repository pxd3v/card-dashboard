import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface DashboardErrorProps {
  message?: string;
}

export function DashboardError({ message = 'Failed to load dashboard data' }: DashboardErrorProps) {
  return (
    <ErrorAlert message={message} />
  );
} 