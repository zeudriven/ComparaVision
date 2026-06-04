@echo off
REM Production deployment script for RunPod Vision Benchmark (Windows)

echo 🚀 Starting RunPod Vision Benchmark Deployment
echo ==============================================

REM Variables
set IMAGE_NAME=vision-benchmark
set TAG=latest
set DOCKER_REGISTRY=your-registry

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo 📦 Building Docker image...
docker build -t %IMAGE_NAME%:%TAG% .

if errorlevel 1 (
    echo ❌ Docker build failed
    exit /b 1
)

echo 🧪 Running health check...
for /f %%i in ('docker run -d -p 8000:8000 %IMAGE_NAME%:%TAG%') do set CONTAINER_ID=%%i

REM Wait for container to start
timeout /t 30 /nobreak >nul

REM Check health
docker exec %CONTAINER_ID% python3 -c "import runpod; print('Health check passed')"
if errorlevel 1 (
    echo ❌ Health check failed
    docker logs %CONTAINER_ID%
    docker stop %CONTAINER_ID%
    docker rm %CONTAINER_ID%
    exit /b 1
) else (
    echo ✅ Health check passed
)

REM Stop test container
docker stop %CONTAINER_ID%
docker rm %CONTAINER_ID%

echo 🏷️ Tagging image for registry...
docker tag %IMAGE_NAME%:%TAG% %DOCKER_REGISTRY%/%IMAGE_NAME%:%TAG%

echo 🎉 Deployment completed successfully!
echo.
echo Next steps:
echo 1. Push image to your registry: docker push %DOCKER_REGISTRY%/%IMAGE_NAME%:%TAG%
echo 2. Create RunPod endpoint with image: %DOCKER_REGISTRY%/%IMAGE_NAME%:%TAG%
echo 3. Update your frontend to use the new endpoint
echo.
echo To run locally:
echo docker run -p 8000:8000 -e RUNPOD_API_KEY=your_key %IMAGE_NAME%:%TAG%

pause
