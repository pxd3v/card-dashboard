interface TooltipData {
  name: string;
  value: number;
  total: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipData }>;
}

export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-600">Count: {data.value}</p>
        <p className="text-sm text-gray-600">
          Total: ${(data.total / 100).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
} 