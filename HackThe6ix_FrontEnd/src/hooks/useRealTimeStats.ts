import { useState, useEffect, useCallback } from 'react';

interface SystemMetrics {
  cpuUsage: number;
  gpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
}

interface LiveStats {
  activeComparisons: number;
  queueLength: number;
  systemLoad: number;
  carbonFootprint: number;
  energyConsumption: number;
  uptime: number;
  responseTime: number;
  errorRate: number;
}

interface SustainabilityMetrics {
  totalCarbonSaved: number;
  greenScore: number;
  energyEfficiency: number;
  renewableEnergyUsage: number;
  carbonOffset: number;
}

interface ComparisonStats {
  totalComparisons: number;
  modelsCompared: number;
  averageAccuracy: number;
  averageSpeed: number;
}

interface EnterpriseMetrics {
  modelAccuracy: number;
  processingSpeed: number;
  systemUptime: number;
  successRate: number;
  responseTime: number;
  queueLength: number;
  concurrentComparisons: number;
  dataThroughput: number;
}

interface DashboardStats {
  systemMetrics: SystemMetrics;
  liveStats: LiveStats;
  sustainability: SustainabilityMetrics;
  comparisonStats: ComparisonStats;
  enterpriseMetrics: EnterpriseMetrics;
}

interface UseRealTimeStatsOptions {
  pollingInterval?: number; // in milliseconds
  enabled?: boolean;
}

export function useRealTimeStats(options: UseRealTimeStatsOptions = {}) {
  const { pollingInterval = 5000, enabled = true } = options;
  
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Ensure we get fresh data
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stats = await response.json();
      setData(stats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching real-time stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchStats();
    }
  }, [enabled, fetchStats]);

  // Set up polling
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      fetchStats();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchStats]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
  };
} 