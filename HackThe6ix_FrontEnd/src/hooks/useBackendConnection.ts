import { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth, testDatabaseConnection, ApiResponse } from '@/lib/api';

interface BackendConnectionState {
  isConnected: boolean;
  isHealthy: boolean;
  isDatabaseConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useBackendConnection() {
  const [state, setState] = useState<BackendConnectionState>({
    isConnected: false,
    isHealthy: false,
    isDatabaseConnected: false,
    isLoading: true,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check backend health
      const healthResponse = await checkBackendHealth();
      
      if (!healthResponse.success) {
        throw new Error(healthResponse.error || 'Backend health check failed');
      }

      // Test database connection
      const dbResponse = await testDatabaseConnection();
      
      setState({
        isConnected: true,
        isHealthy: healthResponse.success,
        isDatabaseConnected: dbResponse.success,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        isConnected: false,
        isHealthy: false,
        isDatabaseConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const retryConnection = useCallback(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    ...state,
    retryConnection,
  };
} 