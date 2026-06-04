# Working CLI Commands for RunPod Vision Benchmark

## 🔧 Essential Commands

### Project Exploration
```powershell
# Ada's signature command for comprehensive project analysis
Get-ChildItem -Recurse -File -Exclude "*.pyc", "*.pyd", "*.zip", "*.exe", "*.whl" | Where-Object { $_.Directory.Name -notlike "*__pycache__*" -and $_.Directory.Name -notlike "*site-packages*" -and $_.Directory.Name -notlike "*.egg-info*" -and $_.Directory.Name -notlike "*.venv*" -and $_.FullName -notlike "*\.venv\*" } | Select-Object Name, @{Name="RelativePath"; Expression={$_.FullName.Replace("$PWD\", "")}} | Sort-Object RelativePath
```

### Development Commands

```bash
# Navigate to project
cd HackThe6ix_BackEnd/runpod

# System validation
python validate_system.py

# Run comprehensive tests
python test_worker.py

# Test JavaScript integration
node runpod_integration.js
```

### Docker Operations

```bash
# Build the vision benchmark container
docker build -t vision-benchmark:latest .

# Run locally for testing
docker run --gpus all -p 8000:8000 vision-benchmark:latest

# Push to registry
docker tag vision-benchmark:latest your-username/vision-benchmark:latest
docker push your-username/vision-benchmark:latest

# Check container logs
docker logs <container_id>
```

### Python Environment Management

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)  
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Check installation
pip list | grep torch
pip list | grep ultralytics
```

### RunPod CLI Operations

```bash
# Install RunPod CLI
pip install runpod

# Login to RunPod
runpod login

# List endpoints
runpod list endpoints

# Create endpoint
runpod create endpoint --name vision-benchmark --image your-username/vision-benchmark:latest

# Deploy function
runpod deploy --endpoint-id <endpoint_id>
```

### Model Testing Commands

```python
# Test YOLO model loading
python -c "from ultralytics import YOLO; model = YOLO('yolov8s.pt'); print('YOLOv8 loaded successfully')"

# Test EfficientNet
python -c "import timm; model = timm.create_model('efficientnet_b0', pretrained=True); print('EfficientNet loaded')"

# Test Detectron2 (if available)
python -c "from detectron2 import model_zoo; print('Detectron2 available')"

# Check CUDA
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'CUDA Devices: {torch.cuda.device_count()}')"
```

### Performance Monitoring

```bash
# Monitor GPU usage
nvidia-smi -l 1

# Monitor system resources
htop

# Check memory usage
python -c "import psutil; print(f'Memory: {psutil.virtual_memory().percent}%')"

# Monitor disk usage
df -h

# Check Python memory usage
python -c "import psutil; p = psutil.Process(); print(f'Process Memory: {p.memory_info().rss / 1024 / 1024:.2f} MB')"
```

### Data Preparation

```bash
# Create test dataset
mkdir -p data/test_images
mkdir -p data/ground_truth

# Download sample images
curl -o data/test_images/highway.jpg "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
curl -o data/test_images/parking.jpg "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"

# Create ground truth CSV
echo "image_path,car_count,description" > data/ground_truth/labels.csv
echo "highway.jpg,3,Highway scene with cars" >> data/ground_truth/labels.csv
echo "parking.jpg,2,Parking lot with vehicles" >> data/ground_truth/labels.csv
```

### Debugging Commands

```bash
# Enable debug logging
export PYTHONPATH=$PWD
export CUDA_LAUNCH_BLOCKING=1
export TORCH_USE_CUDA_DSA=1

# Run with verbose output
python -u vision_benchmark_worker.py

# Check imports
python -c "import runpod; import torch; import cv2; import numpy as np; print('All imports successful')"

# Test individual components
python -c "from vision_benchmark_worker import VisionModelLoader; loader = VisionModelLoader(); print('Model loader initialized')"

# Memory debugging
python -m memory_profiler test_worker.py
```

### API Testing Commands

```bash
# Test RunPod API connection
curl -H "Authorization: Bearer $RUNPOD_API_KEY" \
     https://api.runpod.ai/v2/endpoints

# Test job submission
curl -X POST \
  -H "Authorization: Bearer $RUNPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": {"model_a_id": "Trained_yolov5", "model_b_id": "efficientnet_b0"}}' \
  https://api.runpod.ai/v2/<endpoint_id>/run

# Check job status
curl -H "Authorization: Bearer $RUNPOD_API_KEY" \
     https://api.runpod.ai/v2/<endpoint_id>/status/<job_id>
```

### File Operations

```bash
# Check file sizes
ls -lah *.py
ls -lah requirements.txt
ls -lah Dockerfile

# Validate file integrity
md5sum vision_benchmark_worker.py
sha256sum requirements.txt

# Count lines of code
wc -l *.py
find . -name "*.py" -exec wc -l {} +

# Search for specific patterns
grep -r "YOLO" *.py
grep -r "carbon" *.py
grep -n "def " vision_benchmark_worker.py
```

### Performance Benchmarking

```bash
# Time script execution
time python validate_system.py

# Profile Python code
python -m cProfile -o profile.stats test_worker.py
python -m pstats profile.stats

# Memory profiling
python -m memory_profiler vision_benchmark_worker.py

# CPU profiling
python -m py-spy top --pid <python_process_id>
```

### Git Operations

```bash
# Check repository status
git status
git log --oneline -10

# Add and commit changes
git add .
git commit -m "🚀 Complete RunPod Vision Benchmark Implementation"

# Create feature branch
git checkout -b feature/vision-benchmark
git push -u origin feature/vision-benchmark

# View file differences
git diff HEAD~1 vision_benchmark_worker.py
```

### Network and Connectivity

```bash
# Test internet connectivity
ping google.com
curl -I https://api.runpod.ai

# Test DNS resolution
nslookup api.runpod.ai

# Check open ports
netstat -tulpn | grep :8000

# Test local server
curl http://localhost:8000/health
```

### Cleanup Commands

```bash
# Clean Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -name "*.pyc" -delete

# Clean Docker
docker system prune -f
docker image prune -f

# Clean pip cache
pip cache purge

# Remove temporary files
rm -rf /tmp/runpod_*
rm -rf .pytest_cache/
```

## 🎯 Troubleshooting Command Sequences

### Issue: Model Loading Fails
```bash
# Diagnostic sequence
python -c "import torch; print(torch.__version__)"
python -c "import ultralytics; print(ultralytics.__version__)"
python -c "from ultralytics import YOLO; model = YOLO('yolov8s.pt')"
ls -la ~/.cache/torch/hub/
```

### Issue: GPU Not Available
```bash
# GPU diagnostic sequence
nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"
python -c "import torch; print(torch.version.cuda)"
docker run --gpus all nvidia/cuda:12.1-base-ubuntu22.04 nvidia-smi
```

### Issue: RunPod API Errors
```bash
# API diagnostic sequence
echo $RUNPOD_API_KEY
curl -H "Authorization: Bearer $RUNPOD_API_KEY" https://api.runpod.ai/v2/endpoints
python -c "import requests; print(requests.__version__)"
```

---
*CLI Commands compiled by Ada - Terminal Master*
*"Every great algorithm starts with the right commands" 💻*