"use client";

import { useState } from "react";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  MinusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";

interface ModelComparison {
  id: string;
  modelA: {
    name: string;
    framework: string;
    size: string;
  };
  modelB: {
    name: string;
    framework: string;
    size: string;
  };
  metrics: {
    accuracy: {
      modelA: number;
      modelB: number;
      winner: "A" | "B" | "tie";
    };
    speed: {
      modelA: number;
      modelB: number;
      winner: "A" | "B" | "tie";
    };
    memory: {
      modelA: number;
      modelB: number;
      winner: "A" | "B" | "tie";
    };
    carbon: {
      modelA: number;
      modelB: number;
      winner: "A" | "B" | "tie";
    };
  };
  status: "completed" | "running" | "failed";
  createdAt: string;
}

interface ComparisonTableProps {
  comparisons: ModelComparison[];
  onViewDetails: (comparison: ModelComparison) => void;
  onExport: (comparison: ModelComparison) => void;
}

export function ComparisonTable({ 
  comparisons, 
  onViewDetails, 
  onExport 
}: ComparisonTableProps) {
  const [sortBy, setSortBy] = useState<keyof ModelComparison>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: keyof ModelComparison) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const getWinnerIcon = (winner: "A" | "B" | "tie") => {
    switch (winner) {
      case "A":
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case "B":
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: ModelComparison["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "running":
        return <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />;
      case "failed":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Models
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Accuracy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Speed (FPS)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Memory (MB)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Carbon (g CO2)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {comparisons.map((comparison) => (
              <tr key={comparison.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* Models Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {comparison.modelA.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {comparison.modelA.framework} • {comparison.modelA.size}
                    </div>
                  </div>
                  <div className="text-sm mt-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {comparison.modelB.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {comparison.modelB.framework} • {comparison.modelB.size}
                    </div>
                  </div>
                </td>

                {/* Accuracy Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.accuracy.modelA.toFixed(1)}%
                    </span>
                    {getWinnerIcon(comparison.metrics.accuracy.winner)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.accuracy.modelB.toFixed(1)}%
                    </span>
                  </div>
                </td>

                {/* Speed Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.speed.modelA}
                    </span>
                    {getWinnerIcon(comparison.metrics.speed.winner)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.speed.modelB}
                    </span>
                  </div>
                </td>

                {/* Memory Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.memory.modelA}
                    </span>
                    {getWinnerIcon(comparison.metrics.memory.winner)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.memory.modelB}
                    </span>
                  </div>
                </td>

                {/* Carbon Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.carbon.modelA}
                    </span>
                    {getWinnerIcon(comparison.metrics.carbon.winner)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comparison.metrics.carbon.modelB}
                    </span>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(comparison.status)}
                    <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                      {comparison.status}
                    </span>
                  </div>
                </td>

                {/* Date Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comparison.createdAt)}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewDetails(comparison)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onExport(comparison)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded"
                      title="Export Results"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {comparisons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <ArrowsRightLeftIcon className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No comparisons yet</p>
            <p className="text-sm">Start comparing your models to see results here</p>
          </div>
        </div>
      )}
    </div>
  );
} 