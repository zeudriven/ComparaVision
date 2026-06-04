"use client";

import { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

interface ChartCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  delay?: number;
}

export function ChartCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon,
  children,
  className = "",
  delay = 0
}: ChartCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case "decrease":
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600 dark:text-green-400";
      case "decrease":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
      }}
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:border-green-300/50 dark:hover:border-green-600/50 transition-all duration-200 ${className}`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon && (
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200"
                whileHover={{ rotate: 5 }}
              >
                {icon}
              </motion.div>
            )}
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
              {title}
            </h3>
          </div>
          {change !== undefined && (
            <motion.div 
              className={`flex items-center text-sm font-medium ${getChangeColor()} bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: changeType === "increase" ? [0, 10, 0] : changeType === "decrease" ? [0, -10, 0] : 0 
                }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                {getChangeIcon()}
              </motion.div>
              <span className="ml-1 font-semibold">
                {change > 0 ? "+" : ""}{Math.round(change)}%
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="mb-4">
          <motion.p 
            className="text-3xl font-bold text-gray-900 dark:text-white break-words"
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ delay: delay + 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
        </div>

        {children && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: delay + 0.4, duration: 0.6 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period: string;
  };
  delay?: number;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  delay = 0,
  className = ""
}: MetricCardProps) {
  return (
    <ChartCard
      title={title}
      value={value}
      change={trend?.value}
      changeType={trend?.type}
      icon={icon}
      delay={delay}
      className={className}
    >
      {subtitle && (
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.6, duration: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
      {trend && (
        <motion.p 
          className="text-xs text-gray-500 dark:text-gray-500 mt-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.8, duration: 0.4 }}
        >
          vs {trend.period}
        </motion.p>
      )}
    </ChartCard>
  );
}

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ChartContainer({ title, children, className = "", delay = 0 }: ChartContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        y: -3,
        scale: 1.01,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:border-green-300/50 dark:hover:border-green-600/50 transition-all duration-200 ${className}`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      />

      <div className="relative z-10">
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200"
            whileHover={{ rotate: 5 }}
          >
            <ChartBarIcon className="h-5 w-5 text-white" />
          </motion.div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
            {title}
          </h3>
        </motion.div>
        
        <motion.div 
          className="h-64"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: delay + 0.4, duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
} 