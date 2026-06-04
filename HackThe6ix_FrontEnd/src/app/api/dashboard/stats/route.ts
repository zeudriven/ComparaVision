import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Replace with your actual backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers that backend requires
        // 'Authorization': `Bearer ${token}`,
      },
      // Add cache: 'no-store' to ensure fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Return mock data as fallback while backend is being developed
    return NextResponse.json({
      systemMetrics: {
        cpuUsage: Math.random() * 100,
        gpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        networkLatency: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 50) + 1
      },
      liveStats: {
        activeComparisons: Math.floor(Math.random() * 20) + 5,
        queueLength: Math.floor(Math.random() * 10),
        systemLoad: Math.random() * 100,
        carbonFootprint: Math.random() * 5,
        energyConsumption: Math.random() * 100,
        uptime: 95 + Math.random() * 5,
        responseTime: 50 + Math.random() * 200,
        errorRate: Math.random() * 2
      },
      sustainability: {
        totalCarbonSaved: Math.random() * 20,
        greenScore: 70 + Math.random() * 30,
        energyEfficiency: 80 + Math.random() * 20,
        renewableEnergyUsage: 60 + Math.random() * 40,
        carbonOffset: Math.random() * 15
      },
      comparisonStats: {
        totalComparisons: Math.floor(Math.random() * 1000) + 100,
        modelsCompared: Math.floor(Math.random() * 50) + 10,
        averageAccuracy: 80 + Math.random() * 20,
        averageSpeed: 50 + Math.random() * 100
      },
      enterpriseMetrics: {
        modelAccuracy: 85 + Math.random() * 15,
        processingSpeed: 60 + Math.random() * 40,
        systemUptime: 95 + Math.random() * 5,
        successRate: 95 + Math.random() * 5,
        responseTime: 100 + Math.random() * 200,
        queueLength: Math.floor(Math.random() * 15),
        concurrentComparisons: Math.floor(Math.random() * 10) + 5,
        dataThroughput: 1000 + Math.random() * 2000
      }
    });
  }
} 