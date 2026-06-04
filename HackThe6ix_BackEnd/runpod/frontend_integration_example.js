/**
 * Frontend Integration Example for Vision Benchmark
 * Use this in your Next.js frontend to send requests to backend
 */

import React, { useState, useCallback } from 'react';

// Hook for vision benchmark API calls
export const useVisionBenchmark = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const runBenchmark = useCallback(async (modelA, modelB, imageFiles, userId) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Convert image files to base64
            const imagesData = await Promise.all(
                imageFiles.map(async (file) => {
                    const base64 = await fileToBase64(file);
                    return {
                        filename: file.name,
                        data: base64,
                        size: file.size
                    };
                })
            );

            const response = await fetch(`${API_BASE_URL}/api/benchmark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modelA,
                    modelB,
                    imagesData,
                    userId
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Benchmark failed');
            }

            setResult(data.data);
            return data.data;

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    const getBenchmarkHistory = useCallback(async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/benchmark/history/${userId}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            return data.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [API_BASE_URL]);

    const getRealTimeStats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/benchmark/stats`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            return data.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [API_BASE_URL]);

    return {
        runBenchmark,
        getBenchmarkHistory,
        getRealTimeStats,
        isLoading,
        error,
        result
    };
};

// Utility function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        reader.onerror = error => reject(error);
    });
};

// Example React component for benchmark interface
export const VisionBenchmarkComponent = ({ userId }) => {
    const { runBenchmark, isLoading, error, result } = useVisionBenchmark();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [modelA, setModelA] = useState('Trained_yolov5');
    const [modelB, setModelB] = useState('efficientnet_b0');

    const availableModels = [
        'Trained_yolov5',
        'Trained_yolov8', 
        'efficientnet_b0',
        'detectron2',
        'llama2_70b',
        'opus_mt',
        'roberta_base',
        'wav2vec2'
    ];

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleBenchmark = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select images to benchmark');
            return;
        }

        if (modelA === modelB) {
            alert('Please select different models');
            return;
        }

        try {
            await runBenchmark(modelA, modelB, selectedFiles, userId);
        } catch (error) {
            console.error('Benchmark failed:', error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Vision Model Benchmark</h2>
            
            {/* Model Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Model A</label>
                    <select 
                        value={modelA} 
                        onChange={(e) => setModelA(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Model B</label>
                    <select 
                        value={modelB} 
                        onChange={(e) => setModelB(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Upload Road Images with Cars
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
                {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        {selectedFiles.length} file(s) selected
                    </p>
                )}
            </div>

            {/* Run Benchmark Button */}
            <button
                onClick={handleBenchmark}
                disabled={isLoading || selectedFiles.length === 0}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? 'Running Benchmark...' : 'Run Benchmark'}
            </button>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {/* Results Display */}
            {result && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
                    <h3 className="text-lg font-bold mb-4">Benchmark Results</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="font-semibold">{result.models.modelA.id}</h4>
                            <ul className="text-sm">
                                <li>Accuracy: {result.models.modelA.metrics.accuracy?.toFixed(2)}%</li>
                                <li>F1 Score: {result.models.modelA.metrics.f1_score?.toFixed(3)}</li>
                                <li>Latency: {result.models.modelA.metrics.avg_latency?.toFixed(2)}ms</li>
                                <li>Memory: {result.models.modelA.metrics.peak_memory_mb?.toFixed(1)}MB</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold">{result.models.modelB.id}</h4>
                            <ul className="text-sm">
                                <li>Accuracy: {result.models.modelB.metrics.accuracy?.toFixed(2)}%</li>
                                <li>F1 Score: {result.models.modelB.metrics.f1_score?.toFixed(3)}</li>
                                <li>Latency: {result.models.modelB.metrics.avg_latency?.toFixed(2)}ms</li>
                                <li>Memory: {result.models.modelB.metrics.peak_memory_mb?.toFixed(1)}MB</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                        <strong>Winner: {result.comparison.winner}</strong>
                        <p className="text-sm mt-2">{result.comparison.summary}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Example API configuration for Next.js
export const benchmarkApiConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    endpoints: {
        benchmark: '/api/benchmark',
        history: '/api/benchmark/history',
        stats: '/api/benchmark/stats'
    }
};
