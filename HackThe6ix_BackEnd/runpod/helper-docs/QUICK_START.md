# RunPod Vision Benchmark - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- RunPod Account with API access
- Docker Hub account (for custom images)
- Node.js 18+ and Python 3.11+

### Step 1: Environment Setup

```bash
# Clone the repository
git clone https://github.com/HacktheSix/HackThe6ix_BackEnd.git
cd HackThe6ix_BackEnd/runpod

# Set environment variables
export RUNPOD_API_KEY="your_runpod_api_key_here"
```

### Step 2: Build and Deploy

```bash
# Build Docker image
docker build -t your-username/vision-benchmark:latest .

# Push to Docker Hub
docker push your-username/vision-benchmark:latest

# Test locally first
python validate_system.py
```

### Step 3: RunPod Deployment

```javascript
const { RunPodVisionBenchmark } = require('./runpod_integration.js');

const benchmark = new RunPodVisionBenchmark(process.env.RUNPOD_API_KEY);

// Create endpoint
await benchmark.createEndpoint();

// Run benchmark
const result = await benchmark.runBenchmark(
  "Trained_yolov5", 
  "efficientnet_b0",
  imagesData
);
```

### Step 4: Test the System

```bash
# Run validation tests
python validate_system.py

# Test model benchmarking
python test_worker.py

# Check integration
node runpod_integration.js
```

## 📝 Example Usage

### Basic Car Detection Benchmark

```python
# Example images data
images_data = [
    {
        "image_path": "https://example.com/highway.jpg",
        "car_count": 5,
        "description": "Highway with multiple cars"
    },
    {
        "image_path": "https://example.com/parking.jpg", 
        "car_count": 12,
        "description": "Parking lot scene"
    }
]

# Run comparison
result = await benchmark.runBenchmark(
    "Trained_yolov8",
    "detectron2", 
    images_data,
    {
        "carbonTracking": True,
        "detailedMetrics": True,
        "confidenceThreshold": 0.5
    }
)

print(f"Winner: {result.comparison.winner}")
print(f"Accuracy A: {result.comparison.modelA.metrics.accuracy:.3f}")
print(f"Speed A: {result.comparison.modelA.metrics.speed_ms:.2f}ms")
```

## 🎯 Supported Model Pairs

```python
VISION_MODEL_PAIRS = [
    ("Trained_yolov5", "efficientnet_b0"),
    ("Trained_yolov5", "detectron2"), 
    ("Trained_yolov8", "detectron2"),
    ("Trained_yolov8", "Trained_yolov5"),
    # Add more pairs as needed
]
```

## 📊 Understanding Results

### Performance Metrics
```json
{
  "accuracy": 0.87,        // 87% detection accuracy
  "speed_ms": 42.3,        // 42.3ms per image
  "memory_mb": 512.0,      // 512MB peak memory
  "f1_score": 0.85,        // 85% F1 score
  "throughput_fps": 23.6,  // 23.6 frames per second
  "carbon_emissions": 0.001, // CO2 equivalent
  "green_score": 78.4      // Efficiency score
}
```

### Interpretation Guide
- **Accuracy > 0.8**: Excellent performance
- **Speed < 50ms**: Real-time capable
- **Memory < 1GB**: Edge device friendly
- **F1 Score > 0.7**: Good precision/recall balance
- **Green Score > 70**: Environmentally efficient

## 🔧 Configuration Options

### RunPod Worker Settings
```python
WORKER_CONFIG = {
    "gpu_type": "NVIDIA RTX A4000",
    "min_workers": 0,
    "max_workers": 3,
    "idle_timeout": 300,
    "container_disk_in_gb": 50,
    "volume_in_gb": 20
}
```

### Benchmark Options
```python
BENCHMARK_OPTIONS = {
    "include_carbon_tracking": True,
    "detailed_metrics": True,
    "confidence_threshold": 0.5,
    "batch_size": 1,
    "warmup_runs": 3,
    "measurement_runs": 10
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Failed**
   ```bash
   # Check CUDA availability
   python -c "import torch; print(torch.cuda.is_available())"
   ```

2. **Memory Errors**
   ```python
   # Reduce batch size or use smaller models
   torch.cuda.empty_cache()
   gc.collect()
   ```

3. **RunPod Timeout**
   ```javascript
   // Increase timeout in API call
   { timeout: 600000 } // 10 minutes
   ```

### Debug Mode
```python
# Enable detailed logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Check system resources
python validate_system.py
```

## 📚 Next Steps

1. **Scale Up**: Add more model pairs and datasets
2. **Optimize**: Tune performance for your specific use case  
3. **Monitor**: Set up real-time performance tracking
4. **Extend**: Add new vision tasks beyond car detection

---
*Quick Start Guide by Ada - Systems Architect*
*Ready to benchmark? Let's make some computational magic! ✨*