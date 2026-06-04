/**
 * Backend API Integration Example for Vision Benchmark
 * Use this in your Node.js backend to connect with RunPod
 */

const { RunPodVisionBenchmark } = require('./runpod_integration.js');
const { createClient } = require('@supabase/supabase-js');

class VisionBenchmarkAPI {
    constructor() {
        this.runpod = new RunPodVisionBenchmark(process.env.RUNPOD_API_KEY);
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
        
        // Set your endpoint ID here after creating it
        this.runpod.endpointId = process.env.RUNPOD_ENDPOINT_ID;
    }

    /**
     * Main API endpoint for frontend requests
     */
    async handleBenchmarkRequest(req, res) {
        try {
            const { modelA, modelB, imagesData, userId } = req.body;
            
            // Validate input
            if (!modelA || !modelB || !imagesData || !Array.isArray(imagesData)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid input: modelA, modelB, and imagesData are required'
                });
            }

            console.log(`🚀 Starting benchmark: ${modelA} vs ${modelB} for user ${userId}`);

            // Start benchmark
            const benchmarkResult = await this.runpod.runBenchmark(
                modelA, 
                modelB, 
                imagesData,
                {
                    carbonTracking: true,
                    detailedMetrics: true,
                    userId: userId
                }
            );

            // Format result for frontend
            const formattedResult = this.formatResultForFrontend(benchmarkResult);

            // Save to Supabase
            const dbResult = await this.saveToDatabase(formattedResult, userId);

            console.log(`✅ Benchmark completed: ${formattedResult.winner}`);

            return res.json({
                success: true,
                data: formattedResult,
                dbId: dbResult.id
            });

        } catch (error) {
            console.error('❌ Benchmark API error:', error);
            
            return res.status(500).json({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    /**
     * Format RunPod result for frontend consumption
     */
    formatResultForFrontend(runpodResult) {
        const output = runpodResult.output || runpodResult;
        
        return {
            id: runpodResult.id,
            timestamp: new Date().toISOString(),
            models: {
                modelA: {
                    id: output.model_a_id,
                    metrics: output.model_a_metrics
                },
                modelB: {
                    id: output.model_b_id, 
                    metrics: output.model_b_metrics
                }
            },
            comparison: {
                winner: output.winner,
                summary: output.comparison_summary
            },
            performance: {
                totalImages: output.model_a_metrics?.inference_count || 0,
                executionTime: runpodResult.executionTime,
                status: 'completed'
            }
        };
    }

    /**
     * Save benchmark result to Supabase
     */
    async saveToDatabase(result, userId) {
        const { data, error } = await this.supabase
            .from('comparison_results')
            .insert({
                user_id: userId,
                model_a_id: result.models.modelA.id,
                model_b_id: result.models.modelB.id,
                model_a_metrics: result.models.modelA.metrics,
                model_b_metrics: result.models.modelB.metrics,
                winner: result.comparison.winner,
                comparison_summary: result.comparison.summary,
                execution_time: result.performance.executionTime,
                total_images: result.performance.totalImages,
                created_at: result.timestamp
            })
            .select()
            .single();

        if (error) {
            console.error('Database save error:', error);
            throw new Error(`Failed to save to database: ${error.message}`);
        }

        return data;
    }

    /**
     * Get benchmark history for a user
     */
    async getBenchmarkHistory(userId, limit = 10) {
        const { data, error } = await this.supabase
            .from('comparison_results')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(`Failed to fetch history: ${error.message}`);
        }

        return data;
    }

    /**
     * Get real-time benchmark stats
     */
    async getRealTimeStats() {
        const { data, error } = await this.supabase
            .from('comparison_results')
            .select('model_a_id, model_b_id, winner, created_at')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch stats: ${error.message}`);
        }

        // Calculate statistics
        const stats = {
            totalBenchmarks: data.length,
            modelPerformance: {},
            recentActivity: data.slice(0, 5)
        };

        // Count model wins
        data.forEach(result => {
            const winner = result.winner === 'Model A' ? result.model_a_id : result.model_b_id;
            stats.modelPerformance[winner] = (stats.modelPerformance[winner] || 0) + 1;
        });

        return stats;
    }
}

// Export for use in Express.js routes
module.exports = { VisionBenchmarkAPI };

// Example Express.js route setup
if (require.main === module) {
    const express = require('express');
    const cors = require('cors');
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    
    const benchmarkAPI = new VisionBenchmarkAPI();
    
    // Main benchmark endpoint
    app.post('/api/benchmark', (req, res) => benchmarkAPI.handleBenchmarkRequest(req, res));
    
    // Get user history
    app.get('/api/benchmark/history/:userId', async (req, res) => {
        try {
            const history = await benchmarkAPI.getBenchmarkHistory(req.params.userId);
            res.json({ success: true, data: history });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Get real-time stats
    app.get('/api/benchmark/stats', async (req, res) => {
        try {
            const stats = await benchmarkAPI.getRealTimeStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Vision Benchmark API running on port ${PORT}`);
    });
}
