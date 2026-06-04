/**
 * API utility functions for communicating with the backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  auth0_id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: string;
  user_id: string;
  name: string;
  model_type: string;
  file_path: string;
  file_size?: number;
  accuracy?: number;
  speed?: number;
  memory_usage?: number;
  carbon_footprint?: number;
  green_score?: number;
  f1_score?: number;
  latency?: number;
  throughput?: number;
  created_at: string;
  updated_at: string;
}

export interface Comparison {
  id: string;
  user_id: string;
  model_a_id: string;
  model_b_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: any;
  created_at: string;
  completed_at?: string;
}

/**
 * Generic API request function with authentication
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${BACKEND_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth(): Promise<ApiResponse> {
  return apiRequest('/health');
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<ApiResponse> {
  return apiRequest('/test-db');
}

/**
 * User management functions
 */
export async function registerUser(userData: {
  auth0_id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}): Promise<ApiResponse<User>> {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function getUserProfile(auth0Id: string): Promise<ApiResponse<User>> {
  return apiRequest(`/api/auth/user/${auth0Id}`);
}

export async function updateUserProfile(
  auth0Id: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> {
  return apiRequest(`/api/auth/user/${auth0Id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function syncUser(userData: {
  auth0_id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}): Promise<ApiResponse<User>> {
  return apiRequest('/api/auth/sync', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Model management functions
 */
export async function uploadModel(modelData: FormData): Promise<ApiResponse<Model>> {
  try {
    const url = `${BACKEND_URL}/api/models/upload`;
    
    const config: RequestInit = {
      method: 'POST',
      body: modelData,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Model upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getUserModels(userId: string): Promise<ApiResponse<Model[]>> {
  return apiRequest(`/api/models/user/${userId}`);
}

/**
 * Comparison functions
 */
export async function createComparison(comparisonData: {
  model_a_id: string;
  model_b_id: string;
}): Promise<ApiResponse<Comparison>> {
  return apiRequest('/api/comparisons', {
    method: 'POST',
    body: JSON.stringify(comparisonData),
  });
}

export async function getComparison(comparisonId: string): Promise<ApiResponse<Comparison>> {
  return apiRequest(`/api/comparisons/${comparisonId}`);
}

export async function getUserComparisons(userId: string): Promise<ApiResponse<Comparison[]>> {
  return apiRequest(`/api/comparisons/user/${userId}`);
}

/**
 * Real-time stats functions
 */
export async function getSystemMetrics(): Promise<ApiResponse> {
  return apiRequest('/api/metrics/system');
}

export async function getEnterpriseMetrics(organizationId: string): Promise<ApiResponse> {
  return apiRequest(`/api/metrics/enterprise/${organizationId}`);
} 