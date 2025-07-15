import { apiClient } from '@/lib/apiClient';
import type { 
  ActivityResponse, 
  CategoryResponse, 
  SummaryResponse 
} from '@/types/activity';

export async function getActivities(cursor?: string): Promise<ActivityResponse> {
  const params: Record<string, string> = {};
  
  if (cursor) {
    params.cursor = cursor;
  }

  return apiClient.get<ActivityResponse>('/card/activity', params);
} 

export async function getSpendingSummary(): Promise<SummaryResponse> {
  return apiClient.get<SummaryResponse>('/metrics/summary');
}

export async function getCategoryData(): Promise<CategoryResponse> {
  return apiClient.get<CategoryResponse>('/metrics/categories');
}
