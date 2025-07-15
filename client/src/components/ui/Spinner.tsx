interface SpinnerProps {
  loading?: boolean;
}

export function Spinner({ loading = true }: SpinnerProps) {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span>Loading more...</span>
      </div>
    );
  }
  return <div className="text-gray-400">Scroll to load more</div>;
} 