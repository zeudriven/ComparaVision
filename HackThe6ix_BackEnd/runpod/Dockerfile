FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV TORCH_CUDA_ARCH_LIST="6.0 6.1 7.0 7.5 8.0 8.6+PTX"
ENV FORCE_CUDA="1"
ENV RUNPOD_API_KEY=""
ENV DATABASE_URL=""

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    git \
    wget \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgoogle-perftools4 \
    ffmpeg \
    libfontconfig1 \
    libxrender1 \
    libxtst6 \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy requirements and package files first for better caching
COPY requirements.txt ./

# Upgrade pip and install wheel
RUN python3 -m pip install --upgrade pip setuptools wheel

# Install PyTorch with CUDA support first
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy Node.js package file and install if it exists
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi

# Install additional vision dependencies
RUN pip3 install --no-cache-dir \
    yolov5 \
    effdet \
    ensemble-boxes \
    albumentations \
    onnx \
    onnxruntime-gpu

# Install Detectron2 (this can be tricky, so we do it separately)
RUN pip3 install 'git+https://github.com/facebookresearch/detectron2.git'

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/models /app/data /app/results /app/temp /app/logs

# Set permissions
RUN chmod +x /app/*.py

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python3 -c "import runpod; print('Health check passed')" || exit 1

# Run the worker
CMD ["python3", "vision_benchmark_worker.py"]
