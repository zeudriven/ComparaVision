"use client";

import { useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  ChartBarIcon, 
  CloudArrowUpIcon, 
  ArrowsRightLeftIcon,
  BoltIcon,
  GlobeAltIcon,
  ClockIcon,
  DocumentIcon,
  UserGroupIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ServerIcon,
  WifiIcon,
  CpuChipIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { ChartContainer, MetricCard } from "@/components/ChartCard";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

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

interface SystemMetrics {
  cpuUsage: number;
  gpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
}

interface SustainabilityMetrics {
  totalCarbonSaved: number;
  greenScore: number;
  energyEfficiency: number;
  renewableEnergyUsage: number;
  carbonOffset: number;
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Use real-time stats hook
  const { data: realTimeData, loading, error, lastUpdated, refresh } = useRealTimeStats({
    pollingInterval: 3000, // Update every 3 seconds
    enabled: true
  });

  // Fallback data while loading or if backend is not available
  const [fallbackLiveStats, setFallbackLiveStats] = useState<LiveStats>({
    activeComparisons: 12,
    queueLength: 5,
    systemLoad: 67,
    carbonFootprint: 2.4,
    energyConsumption: 45.2,
    uptime: 99.8,
    responseTime: 245,
    errorRate: 0.2
  });
  const [fallbackSystemMetrics, setFallbackSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 74.79,
    gpuUsage: 86.42,
    memoryUsage: 79.38,
    networkLatency: 35.22,
    activeConnections: 14
  });
  const [fallbackSustainability, setFallbackSustainability] = useState<SustainabilityMetrics>({
    totalCarbonSaved: 12.8,
    greenScore: 87,
    energyEfficiency: 92,
    renewableEnergyUsage: 78,
    carbonOffset: 8.5
  });

  // Use real-time data if available, otherwise use fallback
  const liveStats = realTimeData?.liveStats || fallbackLiveStats;
  const systemMetrics = realTimeData?.systemMetrics || fallbackSystemMetrics;
  const sustainability = realTimeData?.sustainability || fallbackSustainability;

  // Update fallback data only when real-time data is not available
  useEffect(() => {
    if (!realTimeData) {
      const interval = setInterval(() => {
        setFallbackLiveStats(prev => ({
          ...prev,
          activeComparisons: prev.activeComparisons + Math.floor(Math.random() * 3) - 1,
          queueLength: Math.max(0, prev.queueLength + Math.floor(Math.random() * 3) - 1),
          systemLoad: Math.max(0, Math.min(100, prev.systemLoad + (Math.random() - 0.5) * 10)),
          carbonFootprint: Math.max(0, prev.carbonFootprint + (Math.random() - 0.5) * 0.5),
          energyConsumption: Math.max(0, prev.energyConsumption + (Math.random() - 0.5) * 2),
          responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 50),
          errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [realTimeData]);

  useEffect(() => {
    if (!realTimeData) {
      const interval = setInterval(() => {
        setFallbackSystemMetrics(prev => ({
          ...prev,
          cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
          gpuUsage: Math.max(0, Math.min(100, prev.gpuUsage + (Math.random() - 0.5) * 8)),
          memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 6)),
          networkLatency: Math.max(10, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 20)),
          activeConnections: Math.max(1, Math.min(50, prev.activeConnections + Math.floor(Math.random() * 3) - 1))
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [realTimeData]);

  const performanceData = {
    labels: ['YOLOv8n', 'YOLOv8s', 'YOLOv8m', 'YOLOv8l', 'YOLOv8x'],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: [85.2, 88.7, 91.3, 93.1, 94.2],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Speed (FPS)',
        data: [120, 95, 65, 45, 30],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const comparisonTrends = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Comparisons',
        data: [12, 19, 15, 25, 22, 18, 24],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const modelDistribution = {
    labels: ['YOLO', 'ONNX', 'PyTorch', 'TensorFlow', 'Custom'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const carbonMetrics = {
    labels: ['YOLOv8n', 'YOLOv8s', 'YOLOv8m', 'YOLOv8l', 'YOLOv8x'],
    datasets: [
      {
        label: 'Carbon Footprint (g CO2)',
        data: [2.1, 3.8, 6.2, 9.1, 12.5],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const sustainabilityRadar = {
    labels: ['Energy Efficiency', 'Carbon Footprint', 'Renewable Energy', 'Green Score', 'Carbon Offset'],
    datasets: [
      {
        label: 'Current Performance',
        data: [sustainability.energyEfficiency, 100 - (sustainability.greenScore), sustainability.renewableEnergyUsage, sustainability.greenScore, sustainability.carbonOffset * 10],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  const realTimeMetrics = {
    labels: ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m'],
    datasets: [
      {
        label: 'System Load (%)',
        data: [65, 68, 72, 70, 67, 69, 71, 68, 66, liveStats.systemLoad],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Response Time (ms)',
        data: [240, 245, 250, 248, 242, 246, 249, 244, 241, liveStats.responseTime],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/forest-pixel-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: `center ${bgY.get()}`,
          backgroundRepeat: 'no-repeat',
          filter: brightness.get() ? `brightness(${brightness.get()}) blur(1.5px)` : undefined,
          scale,
          opacity: 0.85
        }}
      />
      <div className="absolute inset-0 bg-white/80 z-10" />
      <div className="relative z-20">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                    Corporate Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    Real-time model comparison analytics and sustainability insights
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      realTimeData ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className={`text-sm ${
                      realTimeData ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {realTimeData ? 'Live' : 'Fallback'}
                    </span>
                  </div>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-up">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Connection Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error} - Using fallback data. Backend integration will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Models"
                value="1,247"
                subtitle="Uploaded models"
                icon={<CloudArrowUpIcon className="h-5 w-5 text-blue-600" />}
                trend={{ value: 12, type: "increase", period: "last month" }}
              />
              <MetricCard
                title="Active Comparisons"
                value={liveStats.activeComparisons}
                subtitle="Currently running"
                icon={<ArrowsRightLeftIcon className="h-5 w-5 text-green-600" />}
                trend={{ value: 8, type: "increase", period: "last hour" }}
              />
              <MetricCard
                title="Cost Efficiency"
                value={`${Math.round(sustainability.energyEfficiency)}%`}
                subtitle="Resource optimization"
                icon={<CurrencyDollarIcon className="h-5 w-5 text-blue-600" />}
                trend={{ value: 12, type: "increase", period: "last month" }}
                className="ring-2 ring-blue-400/40 shadow-lg bg-gradient-to-br from-blue-100/60 to-blue-200/40 dark:from-blue-900/40 dark:to-blue-800/30"
              />
              <MetricCard
                title="Green Score"
                value={`${Math.round(sustainability.greenScore)}/100`}
                subtitle="Sustainability rating"
                icon={<GlobeAltIcon className="h-5 w-5 text-green-600" />}
                trend={{ value: 5, type: "increase", period: "last week" }}
                className="ring-2 ring-green-400/40 shadow-lg bg-gradient-to-br from-green-100/60 to-emerald-100/40 dark:from-green-900/40 dark:to-emerald-900/30"
              />
              <MetricCard
                title="Carbon Saved"
                value={`${Math.round(sustainability.totalCarbonSaved * 10) / 10}kg`}
                subtitle="CO2 equivalent"
                icon={<GlobeAltIcon className="h-5 w-5 text-green-600" />}
                trend={{ value: 15, type: "increase", period: "last month" }}
                className="ring-2 ring-emerald-400/40 shadow-lg bg-gradient-to-br from-emerald-100/60 to-green-100/40 dark:from-emerald-900/40 dark:to-green-900/30"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 animate-slide-up-delay-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center font-display">
                      <ChartBarIcon className="w-5 h-5 mr-2 text-green-600" />
                      Live System Metrics
                    </h3>
                    <div className="flex items-center space-x-4">
                      {/* Real-time status indicator */}
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          realTimeData ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`text-sm ${
                          realTimeData ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {realTimeData ? 'Live' : 'Fallback'}
                        </span>
                      </div>
                      
                      {/* Last updated timestamp */}
                      {lastUpdated && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                      )}
                      
                      {/* Refresh button */}
                      <button
                        onClick={refresh}
                        disabled={loading}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        title="Refresh data"
                      >
                        <ArrowPathIcon className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
                          loading ? 'animate-spin' : ''
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-pulse-slow">
                      <CpuChipIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPU</p>
                      <p className="text-lg font-bold text-blue-600">{Math.round(systemMetrics.cpuUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl animate-pulse-slow">
                      <BoltIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">GPU</p>
                      <p className="text-lg font-bold text-purple-600">{Math.round(systemMetrics.gpuUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl animate-pulse-slow">
                      <GlobeAltIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Memory</p>
                      <p className="text-lg font-bold text-green-600">{Math.round(systemMetrics.memoryUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl animate-pulse-slow">
                      <ClockIcon className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Latency</p>
                      <p className="text-lg font-bold text-yellow-600">{Math.round(systemMetrics.networkLatency)}ms</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl animate-pulse-slow">
                      <ChartBarIcon className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connections</p>
                      <p className="text-lg font-bold text-red-600">{systemMetrics.activeConnections}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-display">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">System Load</span>
                      <span className={`text-sm font-medium ${
                        liveStats.systemLoad > 80 ? 'text-red-600' : 
                        liveStats.systemLoad > 60 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {Math.round(liveStats.systemLoad)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Queue Length</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {liveStats.queueLength}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round(liveStats.responseTime)}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                      <span className="text-sm font-medium text-green-600">
                        {Math.round(liveStats.uptime)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                      <span className={`text-sm font-medium ${
                        liveStats.errorRate > 2 ? 'text-red-600' : 
                        liveStats.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {liveStats.errorRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Sustainability and Enterprise Metrics - Separate Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-slide-up-delay-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center font-display">
                <GlobeAltIcon className="w-5 h-5 text-green-600 mr-2" />
                Sustainability Metrics
              </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Efficiency</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">
                  {Math.round(sustainability.energyEfficiency)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Renewable Energy</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">
                  {Math.round(sustainability.renewableEnergyUsage)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbon Offset</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">
                  {Math.round(sustainability.carbonOffset * 10) / 10}kg
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Carbon</span>
                <span className="text-lg font-bold text-red-700 dark:text-red-300">
                  {Math.round(liveStats.carbonFootprint * 10) / 10}g
                </span>
              </div>
            </div>
          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-slide-up-delay-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center font-display">
                <ChartBarIcon className="w-5 h-5 text-purple-600 mr-2" />
                Enterprise Metrics
              </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Accuracy</span>
                <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {Math.round(realTimeData?.comparisonStats?.averageAccuracy || 89.2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing Speed</span>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {Math.round(realTimeData?.comparisonStats?.averageSpeed || 85.5)} FPS
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</span>
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                  {Math.round(liveStats.uptime)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Success Rate</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {Math.round(100 - liveStats.errorRate)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {Math.round(liveStats.responseTime)}ms
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Queue Length</span>
                <span className="text-lg font-bold text-rose-700 dark:text-rose-300">
                  {liveStats.queueLength} jobs
                </span>
              </div>
            </div>
          </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartContainer title="Model Performance Comparison">
                <Line
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </ChartContainer>

              <ChartContainer title="Sustainability Radar">
                <Radar
                  data={sustainabilityRadar}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartContainer title="Model Type Distribution">
                <Doughnut
                  data={modelDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </ChartContainer>

              <ChartContainer title="Carbon Footprint by Model">
                <Bar
                  data={carbonMetrics}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </ChartContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Recent Activity & Alerts
                </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Export Report
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    action: "Model comparison completed",
                    models: "YOLOv8n vs YOLOv8s",
                    time: "2 minutes ago",
                    user: "John Doe",
                    status: "success",
                    priority: "normal"
                  },
                  {
                    action: "High carbon footprint detected",
                    models: "YOLOv8l processing",
                    time: "5 minutes ago",
                    user: "System Alert",
                    status: "warning",
                    priority: "high"
                  },
                  {
                    action: "New model uploaded",
                    models: "custom_yolo_v9.onnx",
                    time: "15 minutes ago",
                    user: "Jane Smith",
                    status: "upload",
                    priority: "normal"
                  },
                  {
                    action: "System optimization completed",
                    models: "Energy efficiency improved",
                    time: "1 hour ago",
                    user: "System",
                    status: "success",
                    priority: "normal"
                  },
                  {
                    action: "Comparison failed",
                    models: "YOLOv8l vs YOLOv8x",
                    time: "1 hour ago",
                    user: "Bob Johnson",
                    status: "error",
                    priority: "medium"
                  },
                  {
                    action: "Sustainability report generated",
                    models: "Q1 Green Metrics",
                    time: "2 hours ago",
                    user: "Alice Brown",
                    status: "report",
                    priority: "normal"
                  }
                ].map((activity, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg ${
                    activity.priority === "high" ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" :
                    activity.priority === "medium" ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" :
                    "bg-gray-50 dark:bg-gray-700"
                  }`}>
                    <div className="flex-shrink-0">
                      {activity.status === "success" && (
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {activity.status === "warning" && (
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                      {activity.status === "upload" && (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {activity.status === "error" && (
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <DocumentIcon className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                      {activity.status === "report" && (
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <ChartBarIcon className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.models}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.user}
                      </span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
