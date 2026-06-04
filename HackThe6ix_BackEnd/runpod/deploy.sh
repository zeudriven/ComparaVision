#!/bin/bash
# Production deployment script for RunPod Vision Benchmark

set -e

echo "🚀 Starting RunPod Vision Benchmark Deployment"
echo "=============================================="

# Variables
IMAGE_NAME="vision-benchmark"
TAG="latest"
DOCKER_REGISTRY="your-registry"  # Change this to your Docker registry

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if NVIDIA Docker is available
if ! docker run --rm --gpus all nvidia/cuda:12.1-base-ubuntu22.04 nvidia-smi > /dev/null 2>&1; then
    echo "⚠️ NVIDIA Docker not available. GPU acceleration will not work."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME}:${TAG} .

echo "🧪 Running health check..."
CONTAINER_ID=$(docker run -d --gpus all -p 8000:8000 ${IMAGE_NAME}:${TAG})

# Wait for container to start
sleep 30

# Check health
if docker exec $CONTAINER_ID python3 -c "import runpod; print('Health check passed')"; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

# Stop test container
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID

echo "🏷️ Tagging image for registry..."
docker tag ${IMAGE_NAME}:${TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${TAG}

echo "📤 Pushing to registry..."
# docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${TAG}

echo "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Push image to your registry: docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${TAG}"
echo "2. Create RunPod endpoint with image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${TAG}"
echo "3. Update your frontend to use the new endpoint"
echo ""
echo "To run locally:"
echo "docker run --gpus all -p 8000:8000 -e RUNPOD_API_KEY=your_key ${IMAGE_NAME}:${TAG}"
