const API_BASE = 'http://localhost:3001/api';

interface ApiClientOptions {
  cache?: RequestCache;
  method?: string;
  body?: unknown;
}

class ApiClient {
  private async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { cache = 'no-store', method = 'GET', body } = options;
    
    const config: RequestInit = {
      method,
      cache,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }
}

export const apiClient = new ApiClient(); 