# HackThe6ix Backend - Vision Benchmark System

## 🚀 Vision Model Performance Comparison Platform

A comprehensive backend system that benchmarks computer vision models (YOLOv5, YOLOv8, EfficientNet, Detectron2) on car detection tasks, measuring accuracy, speed, memory usage, carbon footprint, and more.

## 🔄 System Process Flow

```mermaid
graph TD
    A[Frontend Upload] --> B[Image Preprocessing]
    B --> C[RunPod API Call]
    C --> D[Docker Container]
    D --> E[Model Loading]
    E --> F[Benchmark Execution]
    F --> G[Performance Metrics]
    G --> H[Results Processing]
    H --> I[Supabase Update]
    I --> J[Frontend Dashboard]
    
    subgraph "Frontend Layer"
        A1[User Uploads Images] --> A2[Ground Truth CSV]
        A2 --> A3[Model Selection]
        A3 --> A4[POST Request]
    end
    
    subgraph "RunPod Serverless"
        C1[Request Validation] --> C2[Job Queue]
        C2 --> C3[Auto-scaling 0-3]
        C3 --> C4[Container Spawn]
    end
    
    subgraph "Vision Benchmark Worker"
        E1[YOLOv5 Model] --> F1[Car Detection]
        E2[YOLOv8 Model] --> F2[Performance Monitor]
        E3[EfficientNet] --> F3[Carbon Tracking]
        E4[Detectron2] --> F4[Memory Analysis]
        F1 --> G1[Accuracy Metrics]
        F2 --> G2[Speed Analysis]
        F3 --> G3[Green Score]
        F4 --> G4[System Stats]
    end
    
    subgraph "Database Layer"
        I1[Model Results] --> I2[Performance History]
        I2 --> I3[Comparison Data]
        I3 --> I4[Real-time Updates]
    end
    
    A --> A1
    C --> C1
    D --> E1
    G1 --> H
    I --> I1
    I4 --> J
    
    style A fill:#e1f5fe
    style J fill:#e8f5e8
    style D fill:#fff3e0
    style I fill:#f3e5f5
```

## 📊 Detailed Architecture Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant R as RunPod API
    participant C as Container
    participant M as Model Engine
    participant S as Supabase
    participant D as Dashboard
    
    F->>R: POST /runsync with images & CSV
    R->>C: Spawn Docker container
    C->>M: Initialize benchmark system
    
    Note over M: Load 4 vision models
    M->>M: YOLOv5 car detection
    M->>M: YOLOv8 car detection  
    M->>M: EfficientNet classification
    M->>M: Detectron2 object detection
    
    Note over M: Measure performance
    M->>M: Accuracy (mAP, F1, precision)
    M->>M: Speed (inference time, throughput)
    M->>M: Memory (RAM, GPU usage)
    M->>M: Carbon (CO2 emissions)
    M->>M: Latency (response times)
    
    M->>C: Return benchmark results
    C->>S: Update performance data
    C->>R: Return formatted results
    R->>F: JSON response with metrics
    F->>D: Update real-time dashboard
    
    Note over D: Display comparison charts
```

## 🎯 Data Flow Architecture

```mermaid
flowchart LR
    subgraph Input["📤 Input Data"]
        I1[Road Images]
        I2[Ground Truth CSV]
        I3[Model Selection]
    end
    
    subgraph Processing["⚡ Processing Pipeline"]
        P1[Image Validation]
        P2[Data Preprocessing] 
        P3[Model Inference]
        P4[Metrics Calculation]
    end
    
    subgraph Models["🤖 Vision Models"]
        M1[YOLOv5<br/>Object Detection]
        M2[YOLOv8<br/>Enhanced Detection]
        M3[EfficientNet<br/>Classification]
        M4[Detectron2<br/>Instance Segmentation]
    end
    
    subgraph Metrics["📊 Performance Metrics"]
        MT1[Accuracy<br/>mAP, Precision, Recall]
        MT2[Speed<br/>Inference Time, FPS]
        MT3[Memory<br/>RAM, GPU Usage]
        MT4[Carbon<br/>CO2, Green Score]
        MT5[Latency<br/>Response Time]
    end
    
    subgraph Output["📈 Output Results"]
        O1[Comparison Table]
        O2[Performance Charts]
        O3[Model Rankings]
        O4[Historical Data]
    end
    
    Input --> Processing
    Processing --> Models
    Models --> Metrics
    Metrics --> Output
    
    P1 --> P2 --> P3 --> P4
    M1 & M2 & M3 & M4 --> MT1 & MT2 & MT3 & MT4 & MT5
```

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- Docker Desktop (for RunPod deployment)

## 🔗 RunPod Integration Setup

### RunPod Serverless Configuration
```mermaid
graph TD
    A[Docker Image Build] --> B[Registry Push]
    B --> C[RunPod Endpoint]
    C --> D[Auto-scaling Config]
    D --> E[Environment Variables]
    E --> F[Production Ready]
    
    subgraph "Container Specs"
        CS1[CUDA 12.1 Base]
        CS2[Python 3.11+]
        CS3[Node.js Runtime]
        CS4[Vision Libraries]
    end
    
    subgraph "Scaling Rules"
        SR1[Min Workers: 0]
        SR2[Max Workers: 3]
        SR3[Timeout: 300s]
        SR4[Auto-scale on demand]
    end
    
    A --> CS1
    D --> SR1
```

### API Endpoint Structure
```json
{
  "endpoint": "https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/runsync",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_RUNPOD_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "input": {
      "images": ["base64_encoded_image_1", "base64_encoded_image_2"],
      "ground_truth_csv": "base64_encoded_csv_data",
      "models": ["yolov5", "yolov8", "efficientnet", "detectron2"],
      "supabase_config": {
        "url": "your_supabase_url_here",
        "key": "your_supabase_anon_key_here"
      }
    }
  }
}
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd auth0_login
```

2. Create a `.env` file in the root directory with these values:
```properties
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NODE_ENV=development
PORT=3000
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

## Port Configuration
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Common Issues & Solutions

1. Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

2. Dependencies issues
```bash
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules
npm install
```

3. Database Connection Issues
- Verify your Supabase URL and key in .env
- Check if Supabase service is running
- Ensure your IP is whitelisted in Supabase dashboard

## Project Structure
```
HackThe6ix_BackEnd/
├── runpod/                          # 🚀 RunPod Vision Benchmark System
│   ├── vision_benchmark_worker.py   # Main AI benchmarking engine
│   ├── runpod_integration.js        # RunPod API client
│   ├── test_worker.py              # Comprehensive test suite
│   ├── Dockerfile                  # Container configuration
│   ├── requirements.txt            # Python dependencies
│   ├── package.json               # Node.js dependencies
│   └── helper-docs/               # 📚 Documentation
│       ├── ARCHITECTURE.md
│       ├── QUICK_START.md
│       └── TUTORIAL.md
├── src/                           # 🎨 Frontend Components
│   ├── components/
│   │   ├── LocalServerDashboard.jsx
│   │   └── VellumDashboard.jsx
│   ├── hooks/
│   │   ├── useLocalServerData.js
│   │   └── useVellumData.js
│   └── lib/
│       └── supabase.js           # Supabase client configuration
├── vellum/                       # 🤖 Vellum Integration
│   ├── main.py
│   └── vellum_test.py
├── data/                         # 📊 Performance Data
│   ├── comparison_results.csv
│   ├── public_models.csv
│   └── proprietary_models.csv
├── server.js                     # Express backend server
├── setup-database.js            # Database initialization
└── .env                         # Environment variables
```

## 🔧 Component Interactions

```mermaid
graph LR
    subgraph "Frontend Layer"
        FE[Next.js Frontend]
        DASH[Dashboard]
        UP[Upload Component]
    end
    
    subgraph "Backend Services"
        EXP[Express Server]
        SUPA[Supabase DB]
        VELL[Vellum AI]
    end
    
    subgraph "RunPod Infrastructure"
        RP[RunPod API]
        DOCK[Docker Container]
        BENCH[Benchmark Engine]
    end
    
    subgraph "AI Models"
        Y5[YOLOv5]
        Y8[YOLOv8] 
        EFF[EfficientNet]
        DET[Detectron2]
    end
    
    FE --> EXP
    UP --> RP
    RP --> DOCK
    DOCK --> BENCH
    BENCH --> Y5 & Y8 & EFF & DET
    BENCH --> SUPA
    SUPA --> DASH
    EXP --> VELL
    
    style BENCH fill:#ff9999
    style SUPA fill:#99ccff
    style RP fill:#99ff99
```

## Available Scripts
- `npm run dev`: Start both frontend and backend
- `npm run client`: Start only frontend  
- `npm run server`: Start only backend
- `npm run build`: Build for production

### 🚀 RunPod Deployment Scripts
- `cd runpod && ./deploy.bat`: Windows deployment script
- `cd runpod && docker build -t vision-benchmark:latest .`: Build container
- `python test_worker.py`: Run comprehensive tests

## 📊 Performance Metrics Collected

The system measures comprehensive performance across multiple dimensions:

### 🎯 Accuracy Metrics
- **mAP (Mean Average Precision)**: Overall detection accuracy
- **Precision**: True positives / (True positives + False positives)  
- **Recall**: True positives / (True positives + False negatives)
- **F1 Score**: Harmonic mean of precision and recall

### ⚡ Speed Metrics  
- **Inference Time**: Time per image processing (ms)
- **Throughput**: Images processed per second (FPS)
- **Latency**: End-to-end response time
- **P95 Latency**: 95th percentile response time

### 💾 Memory Metrics
- **RAM Usage**: System memory consumption (MB)
- **GPU Memory**: CUDA memory utilization (MB)
- **Peak Memory**: Maximum memory during processing

### 🌱 Environmental Metrics
- **CO2 Emissions**: Carbon footprint per inference (kg)
- **Green Score**: Environmental efficiency rating (1-10)
- **Energy Consumption**: Power usage during processing

## 🔄 Real-time Data Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant FE as 🖥️ Frontend
    participant BE as 🔧 Backend
    participant RP as ☁️ RunPod
    participant DB as 🗄️ Supabase
    
    User->>FE: Upload images & CSV
    FE->>BE: Validate request
    BE->>RP: POST benchmark job
    
    Note over RP: Auto-scale container
    RP->>RP: Load AI models
    RP->>RP: Process images
    RP->>RP: Calculate metrics
    
    RP->>DB: Store results
    RP->>BE: Return performance data
    BE->>FE: Stream results
    FE->>User: Display dashboard
    
    Note over DB: Real-time updates
    DB-->>FE: WebSocket notifications
```

## 🚀 Quick Start for Vision Benchmark

### 1. RunPod Setup
```bash
# Navigate to RunPod directory
cd runpod

# Install dependencies
npm install
pip install -r requirements.txt

# Build Docker container
docker build -t vision-benchmark:latest .

# Deploy to RunPod (after pushing to registry)
# Use RunPod dashboard to create serverless endpoint
```

### 2. Environment Configuration
```properties
# .env file
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
RUNPOD_API_KEY=your_runpod_api_key_here
RUNPOD_ENDPOINT_ID=your_deployed_endpoint_id
NODE_ENV=development
PORT=3000
```

### 3. Test the System
```bash
# Run comprehensive tests
cd runpod
python test_worker.py

# Expected output: "🚀💻 ALGORITHM EXECUTED SUCCESSFULLY! 🚀💻"
```

## 🔧 System Requirements

### Local Development
- **Node.js**: v14+ (v22.2.0 confirmed working)
- **Python**: 3.11+ with CUDA support
- **Docker**: Latest version for containerization
- **RAM**: 8GB+ recommended
- **GPU**: NVIDIA GPU with CUDA 12.1+ (for model inference)

### Production (RunPod)
- **Container**: nvidia/cuda:12.1-devel-ubuntu22.04
- **Auto-scaling**: 0-3 workers
- **Timeout**: 300 seconds
- **Memory**: 8GB+ per worker
- **Storage**: 20GB+ for model caching

## 🎯 API Response Format

```json
{
  "status": "success",
  "execution_time": 127.5,
  "timestamp": "2025-07-20T15:30:45Z",
  "results": {
    "yolov5": {
      "accuracy": {
        "map": 0.85,
        "precision": 0.82, 
        "recall": 0.88,
        "f1": 0.85
      },
      "speed": {
        "inference_time": 0.045,
        "throughput": 22.2,
        "latency_p95": 67.8
      },
      "memory": {
        "ram_mb": 1248,
        "gpu_mb": 2100,
        "peak_mb": 2350
      },
      "carbon": {
        "co2_kg": 0.00012,
        "green_score": 8.5
      }
    },
    "yolov8": { /* similar structure */ },
    "efficientnet": { /* similar structure */ },
    "detectron2": { /* similar structure */ }
  },
  "comparison": {
    "best_accuracy": "yolov8",
    "fastest": "yolov5", 
    "most_efficient": "efficientnet",
    "greenest": "efficientnet"
  }
}
```

## 📞 Support & Documentation

### 🔗 Key Resources
- **RunPod Dashboard**: https://runpod.io
- **Supabase Console**: https://supabase.com/dashboard
- **Docker Hub**: For container registry
- **GitHub Repository**: Source code and issues

### 🛠️ Troubleshooting
- **Container Issues**: Check `runpod/DEPLOYMENT_READY.md`
- **Model Errors**: Review `runpod/helper-docs/`
- **API Problems**: Verify RunPod endpoint configuration
- **Database Issues**: Check Supabase connection strings

### 📧 Contact Information
Contact team lead for access to:
- RunPod API credentials
- Supabase dashboard access
- Docker registry permissions
- Production environment keys

## 🔒 Security Notes
- Never commit .env file
- Keep Supabase keys private
- Use proper authentication
