"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadDropzone } from "@/components/UploadDropzone";
import { 
  CloudArrowUpIcon, 
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedModelA, setSelectedModelA] = useState("");
  const [selectedModelB, setSelectedModelB] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (files: any[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0] as any);
    }
  };

  const handleStartComparison = () => {
    if (!uploadedFile || !selectedModelA || !selectedModelB) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      window.location.href = "/compare";
    }, 3000);
  };

  const models = [
    { id: "yolov8n", name: "YOLOv8n", description: "Nano - Fastest, smallest model" },
    { id: "yolov8s", name: "YOLOv8s", description: "Small - Good balance of speed and accuracy" },
    { id: "yolov8m", name: "YOLOv8m", description: "Medium - Higher accuracy, moderate speed" },
    { id: "yolov8l", name: "YOLOv8l", description: "Large - High accuracy, slower inference" },
    { id: "yolov8x", name: "YOLOv8x", description: "Extra Large - Highest accuracy" },
    { id: "custom", name: "Custom Model", description: "Upload your own model file" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'url("/forest-pixel-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1.08) blur(1.5px)',
        opacity: 0.85
      }} />
      <div className="absolute inset-0 bg-white/80 z-10" />
      <div className="relative z-20">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                <CloudArrowUpIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up font-display">
                Upload & Compare Models
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up-delay">
                Upload your video file and select two models for side-by-side comparison with detailed analytics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8 animate-slide-up-delay-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center font-display">
                    <CloudArrowUpIcon className="w-6 h-6 mr-2 text-blue-600" />
                    Upload Video File
                  </h2>
                  
                               <UploadDropzone onFilesUploaded={handleFileUpload} />
                  
                  {uploadedFile && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fade-in-scale">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            File uploaded successfully!
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center font-display">
                    <ArrowsRightLeftIcon className="w-5 h-5 mr-2 text-green-600" />
                    Select Models for Comparison
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Model A
                      </label>
                      <select
                        value={selectedModelA}
                        onChange={(e) => setSelectedModelA(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Model A</option>
                        {models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} - {model.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Model B
                      </label>
                      <select
                        value={selectedModelB}
                        onChange={(e) => setSelectedModelB(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Model B</option>
                        {models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} - {model.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleStartComparison}
                    disabled={!uploadedFile || !selectedModelA || !selectedModelB || isProcessing}
                    className="w-full mt-6 group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <ArrowsRightLeftIcon className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        Start Comparison
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-8 animate-slide-up-delay-3">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    What You'll Get
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-fade-in-scale">
                      <BoltIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          Performance Metrics
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Accuracy, speed, memory usage, and inference time comparisons
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl animate-fade-in-scale">
                      <GlobeAltIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          Sustainability Insights
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Carbon footprint, energy consumption, and green score analysis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl animate-fade-in-scale">
                      <ArrowsRightLeftIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                          Side-by-Side Analysis
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Visual comparison with detailed charts and real-time metrics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Supported Formats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">MP4, AVI, MOV, MKV, WebM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">YOLO models (v5, v8, v9)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">ONNX, PyTorch, TensorFlow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Custom model files</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                        Processing Time
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Video processing typically takes 2-5 minutes depending on file size and model complexity. 
                        You'll receive real-time updates on the comparison page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center animate-fade-in-up">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Need help? Check out our documentation or contact support
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/compare"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Recent Comparisons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
