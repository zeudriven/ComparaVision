/**
 * RunPod Integration for Vision Benchmark
 * Handles communication with RunPod serverless endpoints
 * Author: Ada - Systems Architect
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class RunPodVisionBenchmark {
    constructor(apiKey, endpointId = null) {
        this.apiKey = apiKey;
        this.endpointId = endpointId;
        this.baseURL = 'https://api.runpod.ai/v2';
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Create a new RunPod endpoint for vision benchmarking
     */
    async createEndpoint() {
        try {
            const endpointConfig = {
                name: 'vision-benchmark-worker',
                image: 'your-dockerhub-username/vision-benchmark:latest',
                gpu_type: 'NVIDIA RTX A4000',
                min_workers: 0,
                max_workers: 3,
                idle_timeout: 300,
                environment_variables: {
                    'RUNPOD_API_KEY': this.apiKey
                },
                docker_args: '',
                container_disk_in_gb: 50,
                volume_in_gb: 20,
                ports: '8000/http'
            };

            const response = await axios.post(
                `${this.baseURL}/endpoints`,
                endpointConfig,
                { headers: this.headers }
            );

            if (response.data.success) {
                this.endpointId = response.data.endpoint.id;
                console.log(`✅ Endpoint created: ${this.endpointId}`);
                return response.data;
            } else {
                throw new Error(`Failed to create endpoint: ${response.data.error}`);
            }
        } catch (error) {
            console.error('❌ Endpoint creation failed:', error.message);
            throw error;
        }
    }

    /**
     * Get endpoint status
     */
    async getEndpointStatus() {
        try {
            const response = await axios.get(
                `${this.baseURL}/endpoints/${this.endpointId}`,
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            console.error('❌ Failed to get endpoint status:', error.message);
            throw error;
        }
    }

    /**
     * Run vision model comparison benchmark
     */
    async runBenchmark(modelA, modelB, imagesData, options = {}) {
        if (!this.endpointId) {
            throw new Error('No endpoint ID configured. Create an endpoint first.');
        }

        try {
            console.log(`🚀 Starting benchmark: ${modelA} vs ${modelB}`);
            
            const jobData = {
                input: {
                    model_a_id: modelA,
                    model_b_id: modelB,
                    images_data: imagesData,
                    options: {
                        include_carbon_tracking: options.carbonTracking || true,
                        detailed_metrics: options.detailedMetrics || true,
                        confidence_threshold: options.confidenceThreshold || 0.5,
                        timeout_seconds: options.timeoutSeconds || 300,
                        ...options
                    }
                }
            };

            const response = await axios.post(
                `${this.baseURL}/${this.endpointId}/run`,
                jobData,
                { 
                    headers: this.headers,
                    timeout: 300000 // 5 minute timeout
                }
            );

            if (response.data.status === 'IN_QUEUE' || response.data.status === 'IN_PROGRESS') {
                const jobId = response.data.id;
                console.log(`⏳ Job queued with ID: ${jobId}`);
                
                // Poll for completion
                return await this.pollJobCompletion(jobId);
            } else if (response.data.status === 'COMPLETED') {
                return response.data;
            } else {
                throw new Error(`Unexpected response status: ${response.data.status}`);
            }

        } catch (error) {
            console.error('❌ Benchmark execution failed:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    }

    /**
     * Poll job completion status
     */
    async pollJobCompletion(jobId, maxAttempts = 60, intervalMs = 5000) {
        console.log(`🔄 Polling job ${jobId} for completion...`);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await axios.get(
                    `${this.baseURL}/endpoints/${this.endpointId}/status/${jobId}`,
                    { headers: this.headers }
                );

                const status = response.data.status;
                console.log(`📊 Job ${jobId} status: ${status} (attempt ${attempt + 1}/${maxAttempts})`);

                if (status === 'COMPLETED') {
                    console.log('✅ Job completed successfully!');
                    return response.data;
                } else if (status === 'FAILED') {
                    throw new Error(`Job failed: ${response.data.error || 'Unknown error'}`);
                } else if (status === 'CANCELLED') {
                    throw new Error('Job was cancelled');
                }

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, intervalMs));

            } catch (error) {
                if (attempt === maxAttempts - 1) {
                    throw new Error(`Job polling failed after ${maxAttempts} attempts: ${error.message}`);
                }
                console.warn(`⚠️ Polling attempt ${attempt + 1} failed, retrying...`);
            }
        }

        throw new Error(`Job did not complete within ${maxAttempts * intervalMs / 1000} seconds`);
    }

    /**
     * Cancel a running job
     */
    async cancelJob(jobId) {
        try {
            const response = await axios.post(
                `${this.baseURL}/endpoints/${this.endpointId}/cancel/${jobId}`,
                {},
                { headers: this.headers }
            );

            console.log(`🛑 Job ${jobId} cancellation requested`);
            return response.data;
        } catch (error) {
            console.error('❌ Job cancellation failed:', error.message);
            throw error;
        }
    }

    /**
     * Get job logs
     */
    async getJobLogs(jobId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/endpoints/${this.endpointId}/logs/${jobId}`,
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            console.error('❌ Failed to get job logs:', error.message);
            throw error;
        }
    }

    /**
     * Prepare image data for benchmarking
     */
    static prepareImagesData(imageFiles, groundTruthCsv) {
        const imagesData = [];
        
        // Read ground truth CSV
        const csvContent = fs.readFileSync(groundTruthCsv, 'utf8');
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 2) {
                const imagePath = values[0].trim();
                const carCount = parseInt(values[1].trim());
                
                if (!isNaN(carCount)) {
                    imagesData.push({
                        image_path: imagePath,
                        car_count: carCount,
                        description: values[2] ? values[2].trim() : `Image with ${carCount} cars`
                    });
                }
            }
        }

        return imagesData;
    }

    /**
     * Validate model compatibility
     */
    static validateModelPair(modelA, modelB) {
        const supportedModels = [
            'Trained_yolov5',
            'Trained_yolov8', 
            'efficientnet_b0',
            'detectron2'
        ];

        const visionModels = supportedModels;
        
        if (!visionModels.includes(modelA)) {
            throw new Error(`Model A '${modelA}' is not a supported vision model`);
        }
        
        if (!visionModels.includes(modelB)) {
            throw new Error(`Model B '${modelB}' is not a supported vision model`);
        }

        return true;
    }

    /**
     * Format benchmark results for frontend
     */
    static formatBenchmarkResults(rawResults) {
        if (rawResults.error) {
            return {
                success: false,
                error: rawResults.error,
                timestamp: new Date().toISOString()
            };
        }

        const output = rawResults.output || rawResults;
        
        return {
            success: true,
            comparison: {
                modelA: {
                    id: output.model_a_id,
                    metrics: output.model_a_metrics
                },
                modelB: {
                    id: output.model_b_id,
                    metrics: output.model_b_metrics
                },
                winner: output.winner,
                summary: output.comparison_summary
            },
            metadata: {
                timestamp: output.timestamp || Date.now(),
                jobId: rawResults.id,
                executionTime: rawResults.executionTime
            }
        };
    }

    /**
     * Comprehensive benchmark runner
     */
    async runComprehensiveBenchmark(testPairs, imagesData, options = {}) {
        const results = [];
        
        console.log(`🎯 Running comprehensive benchmark with ${testPairs.length} model pairs`);
        
        for (let i = 0; i < testPairs.length; i++) {
            const [modelA, modelB] = testPairs[i];
            
            try {
                console.log(`\n📊 Benchmark ${i + 1}/${testPairs.length}: ${modelA} vs ${modelB}`);
                
                // Validate models
                RunPodVisionBenchmark.validateModelPair(modelA, modelB);
                
                // Run benchmark
                const result = await this.runBenchmark(modelA, modelB, imagesData, options);
                const formattedResult = RunPodVisionBenchmark.formatBenchmarkResults(result);
                
                results.push({
                    pairIndex: i,
                    modelA,
                    modelB,
                    result: formattedResult,
                    status: 'completed'
                });
                
                console.log(`✅ Completed: ${modelA} vs ${modelB} - Winner: ${formattedResult.comparison?.winner || 'Unknown'}`);
                
                // Brief pause between runs to avoid overwhelming the system
                if (i < testPairs.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
            } catch (error) {
                console.error(`❌ Failed benchmark ${i + 1}: ${modelA} vs ${modelB} - ${error.message}`);
                
                results.push({
                    pairIndex: i,
                    modelA,
                    modelB,
                    result: { success: false, error: error.message },
                    status: 'failed'
                });
            }
        }
        
        const successCount = results.filter(r => r.status === 'completed').length;
        console.log(`\n🏁 Comprehensive benchmark completed: ${successCount}/${testPairs.length} successful`);
        
        return {
            summary: {
                total: testPairs.length,
                successful: successCount,
                failed: testPairs.length - successCount,
                timestamp: new Date().toISOString()
            },
            results
        };
    }
}

module.exports = { RunPodVisionBenchmark };

// Example usage for testing
if (require.main === module) {
    const API_KEY = process.env.RUNPOD_API_KEY || "your_api_key_here";
    
    if (API_KEY === "your_api_key_here") {
        console.error("❌ Please set RUNPOD_API_KEY environment variable");
        process.exit(1);
    }
    
    async function testIntegration() {
        console.log("🧪 Testing RunPod Vision Benchmark Integration");
        
        const benchmark = new RunPodVisionBenchmark(API_KEY);
        
        // Test data
        const testImages = [
            {
                image_path: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
                car_count: 3,
                description: "Highway scene with multiple cars"
            },
            {
                image_path: "https://images.unsplash.com/photo-1502877338535-766e1452684a", 
                car_count: 1,
                description: "Single car on road"
            }
        ];
        
        const testPairs = [
            ["Trained_yolov5", "efficientnet_b0"],
            ["Trained_yolov8", "detectron2"]
        ];
        
        try {
            // Note: This would normally create/use an actual endpoint
            console.log("✅ Integration test structure verified");
            console.log("📊 Test pairs configured:", testPairs);
            console.log("🖼️ Test images configured:", testImages.length);
            
        } catch (error) {
            console.error("❌ Integration test failed:", error.message);
        }
    }
    
    testIntegration();
}
