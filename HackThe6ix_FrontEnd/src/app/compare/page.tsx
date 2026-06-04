"use client";

import { useState, useEffect } from "react";
import { 
  PlayIcon,
  PauseIcon, 
  ArrowsPointingOutIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ModelStats {
  accuracy: number;
  speed: number;
  memory: number;
  carbon: number;
  greenScore: number;
  f1Score: number;
  latency: number;
  throughput: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  networkLatency: number;
  activeConnections: number;
}

export default function ComparePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [modelAStats, setModelAStats] = useState<ModelStats>({
    accuracy: 87.3,
    speed: 59.5,
    memory: 2.1,
    carbon: 3.2,
    greenScore: 82,
    f1Score: 0.89,
    latency: 12.5,
    throughput: 78.2
  });
  const [modelBStats, setModelBStats] = useState<ModelStats>({
    accuracy: 91.7,
    speed: 59,
    memory: 4.8,
    carbon: 7.1,
    greenScore: 68,
    f1Score: 0.92,
    latency: 18.3,
    throughput: 52.1
  });
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 67,
    memoryUsage: 78,
    gpuUsage: 85,
    networkLatency: 45,
    activeConnections: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        gpuUsage: Math.max(40, Math.min(98, prev.gpuUsage + (Math.random() - 0.5) * 12)),
        networkLatency: Math.max(20, Math.min(80, prev.networkLatency + (Math.random() - 0.5) * 15)),
        activeConnections: Math.max(5, Math.min(20, prev.activeConnections + Math.floor(Math.random() * 3) - 1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinner = (metric: keyof ModelStats) => {
    const aValue = modelAStats[metric];
    const bValue = modelBStats[metric];
    
    if (metric === 'carbon' || metric === 'latency' || metric === 'memory') {
      return aValue < bValue ? 'A' : 'B';
    }
    return aValue > bValue ? 'A' : 'B';
  };

  const getMetricColor = (value: number, metric: keyof ModelStats) => {
    const winner = getWinner(metric);
    if (metric === 'carbon' || metric === 'latency' || metric === 'memory') {
      return value < (metric === 'carbon' ? 5 : metric === 'latency' ? 15 : 3) ? 'text-green-600' : 'text-red-600';
    }
    return value > (metric === 'accuracy' ? 85 : metric === 'speed' ? 80 : metric === 'greenScore' ? 75 : 0.85) ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
    >
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up font-display">
                  Model Comparison
                </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-slide-up-delay">
                YOLOv8n vs YOLOv8l - Real-time performance analysis
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6 animate-slide-up-delay-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <BoltIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Model A: YOLOv8n
                  </h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <ArrowsPointingOutIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center animate-pulse-slow">
                    <div className="text-center">
                      <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Video Preview</p>
                    </div>
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(modelAStats).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg animate-fade-in-scale">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {getWinner(key as keyof ModelStats) === 'A' && (
                            <TrophyIcon className="w-4 h-4 text-yellow-500 animate-bounce-gentle" />
                          )}
                        </div>
                        <p className={`text-lg font-bold ${getMetricColor(value, key as keyof ModelStats)}`}>
                          {typeof value === 'number' && value < 1 ? value.toFixed(3) : 
                           typeof value === 'number' && value < 10 ? value.toFixed(1) : 
                           value}
                          {key === 'accuracy' || key === 'greenScore' ? '%' : 
                           key === 'speed' ? ' FPS' : 
                           key === 'memory' ? ' GB' : 
                           key === 'carbon' ? ' g' : 
                           key === 'latency' ? ' ms' : 
                           key === 'throughput' ? ' img/s' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-slide-up-delay-3">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <CpuChipIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Model B: YOLOv8l
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <ArrowsPointingOutIcon className="w-4 h-4" />
                      </button>
                      </div>
                    </div>

                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center animate-pulse-slow">
                    <div className="text-center">
                      <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Video Preview</p>
                    </div>
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(modelBStats).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg animate-fade-in-scale">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {getWinner(key as keyof ModelStats) === 'B' && (
                            <TrophyIcon className="w-4 h-4 text-yellow-500 animate-bounce-gentle" />
                          )}
                        </div>
                        <p className={`text-lg font-bold ${getMetricColor(value, key as keyof ModelStats)}`}>
                          {typeof value === 'number' && value < 1 ? value.toFixed(3) : 
                           typeof value === 'number' && value < 10 ? value.toFixed(1) : 
                           value}
                          {key === 'accuracy' || key === 'greenScore' ? '%' : 
                           key === 'speed' ? ' FPS' : 
                           key === 'memory' ? ' GB' : 
                           key === 'carbon' ? ' g' : 
                           key === 'latency' ? ' ms' : 
                           key === 'throughput' ? ' img/s' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 animate-slide-up-delay-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center font-display">
                      <ChartBarIcon className="w-5 h-5 mr-2 text-green-600" />
                      Live System Metrics
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-pulse-slow border border-blue-200 dark:border-blue-800">
                      <CpuChipIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPU</p>
                      <p className="text-lg font-bold text-blue-600 break-words">{Math.round(systemMetrics.cpuUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl animate-pulse-slow border border-purple-200 dark:border-purple-800">
                      <BoltIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">GPU</p>
                      <p className="text-lg font-bold text-purple-600 break-words">{Math.round(systemMetrics.gpuUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl animate-pulse-slow border border-green-200 dark:border-green-800">
                      <GlobeAltIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Memory</p>
                      <p className="text-lg font-bold text-green-600 break-words">{Math.round(systemMetrics.memoryUsage)}%</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl animate-pulse-slow border border-yellow-200 dark:border-yellow-800">
                      <ClockIcon className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Latency</p>
                      <p className="text-lg font-bold text-yellow-600 break-words">{Math.round(systemMetrics.networkLatency)}ms</p>
                      </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl animate-pulse-slow border border-red-200 dark:border-red-800">
                      <ChartBarIcon className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connections</p>
                      <p className="text-lg font-bold text-red-600 break-words">{systemMetrics.activeConnections}</p>
                      </div>
                    </div>
                  </div>
                </div>

              <div className="animate-slide-up-delay-3">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-yellow-600" />
                    Comparison Summary
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.keys(modelAStats).map((metric) => {
                      const winner = getWinner(metric as keyof ModelStats);
                      const aValue = modelAStats[metric as keyof ModelStats];
                      const bValue = modelBStats[metric as keyof ModelStats];
                      
                      return (
                        <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in-scale">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold ${winner === 'A' ? 'text-blue-600' : 'text-gray-400'}`}>
                              {typeof aValue === 'number' && aValue < 1 ? aValue.toFixed(3) : 
                               typeof aValue === 'number' && aValue < 10 ? aValue.toFixed(1) : aValue}
                            </span>
                            <span className="text-sm text-gray-400">vs</span>
                            <span className={`text-sm font-bold ${winner === 'B' ? 'text-purple-600' : 'text-gray-400'}`}>
                              {typeof bValue === 'number' && bValue < 1 ? bValue.toFixed(3) : 
                               typeof bValue === 'number' && bValue < 10 ? bValue.toFixed(1) : bValue}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${winner === 'A' ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <PlayIcon className="w-5 h-5 mr-2 text-green-600" />
                  Video Controls
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                  >
                    {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
