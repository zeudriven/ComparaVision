# Backend Integration Guide

## Overview
This document provides integration requirements for connecting the frontend backend services, Supabase database, and Auth0 authentication.

## 🏗️ Architecture Overview

```
Frontend (Next.js) ←→ Backend API ←→ Supabase Database
       ↓
    Auth0 Authentication
```

## 🔐 Authentication Integration (Auth0)

### Frontend Auth0 Setup
- **Provider**: Auth0
- **Configuration**: Already implemented in frontend
- **Required Backend Integration**: JWT token validation

### Backend Auth0 Requirements

#### 1. JWT Validation Middleware
```python
# Python/Flask Example
import jwt
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        try:
            payload = jwt.decode(token, AUTH0_PUBLIC_KEY, algorithms=['RS256'])
            request.user = payload
            return f(*args, **kwargs)
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated
```

#### 2. Environment Variables for Backend
```bash
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_ISSUER=https://your-domain.auth0.com/
```

## 🗄️ Supabase Integration

### Database Schema Requirements

#### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. Models Table
```sql
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  model_type VARCHAR(100) NOT NULL, -- 'YOLO', 'ONNX', 'PyTorch', etc.
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  accuracy DECIMAL(5,2),
  speed DECIMAL(8,2), -- FPS
  memory_usage DECIMAL(8,2), -- GB
  carbon_footprint DECIMAL(8,2), -- g CO2
  green_score DECIMAL(5,2),
  f1_score DECIMAL(5,2),
  latency DECIMAL(8,2), -- ms
  throughput DECIMAL(8,2), -- img/s
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Comparisons Table
```sql
CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  model_a_id UUID REFERENCES models(id),
  model_b_id UUID REFERENCES models(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  results JSONB, -- Store comparison results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

#### 4. System Metrics Table
```sql
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpu_usage DECIMAL(5,2),
  gpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  network_latency DECIMAL(8,2),
  active_connections INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. Enterprise Metrics Table
```sql
CREATE TABLE enterprise_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  model_accuracy DECIMAL(5,2),
  processing_speed DECIMAL(8,2),
  system_uptime DECIMAL(5,2),
  success_rate DECIMAL(5,2),
  response_time DECIMAL(8,2),
  queue_length INTEGER,
  concurrent_comparisons INTEGER,
  data_throughput DECIMAL(10,2),
  total_comparisons INTEGER,
  active_users INTEGER,
  models_uploaded INTEGER,
  revenue_generated DECIMAL(10,2),
  cost_savings DECIMAL(10,2),
  customer_satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  subscription_tier VARCHAR(50) DEFAULT 'basic',
  max_users INTEGER DEFAULT 10,
  max_models INTEGER DEFAULT 100,
  max_comparisons_per_month INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. Team Performance Table
```sql
CREATE TABLE team_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  team_type VARCHAR(50), -- 'database', 'ml', 'backend', 'frontend'
  metric_name VARCHAR(100),
  metric_value DECIMAL(10,2),
  metric_unit VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Supabase Configuration
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🔌 Backend API Endpoints

### Base URL
```
https://your-backend-domain.com/api/v1
```

### Authentication Headers
```
Authorization: Bearer <auth0-jwt-token>
Content-Type: application/json
```

### 1. User Management

#### GET /users/profile
```json
Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /users/profile
```json
Request:
{
  "name": "John Doe"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 2. Model Management

#### POST /models/upload
```json
Request:
{
  "name": "YOLOv8n",
  "model_type": "YOLO",
  "file": "multipart/form-data"
}

Response:
{
  "id": "uuid",
  "name": "YOLOv8n",
  "model_type": "YOLO",
  "file_path": "/uploads/models/uuid.pt",
  "file_size": 1234567,
  "status": "uploaded"
}
```

#### GET /models
```json
Query Parameters:
- page: integer (default: 1)
- limit: integer (default: 10)
- model_type: string (optional)
- user_id: uuid (optional)

Response:
{
  "models": [
    {
      "id": "uuid",
      "name": "YOLOv8n",
      "model_type": "YOLO",
      "accuracy": 85.2,
      "speed": 120.5,
      "memory_usage": 2.1,
      "carbon_footprint": 2.1,
      "green_score": 87.5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### GET /models/{id}
```json
Response:
{
  "id": "uuid",
  "name": "YOLOv8n",
  "model_type": "YOLO",
  "file_path": "/uploads/models/uuid.pt",
  "accuracy": 85.2,
  "speed": 120.5,
  "memory_usage": 2.1,
  "carbon_footprint": 2.1,
  "green_score": 87.5,
  "f1_score": 0.823,
  "latency": 8.3,
  "throughput": 120.5,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 3. Model Comparison

#### POST /comparisons
```json
Request:
{
  "model_a_id": "uuid",
  "model_b_id": "uuid",
  "video_file": "multipart/form-data" (optional)
}

Response:
{
  "id": "uuid",
  "model_a_id": "uuid",
  "model_b_id": "uuid",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### GET /comparisons/{id}
```json
Response:
{
  "id": "uuid",
  "model_a": {
    "id": "uuid",
    "name": "YOLOv8n",
    "accuracy": 85.2,
    "speed": 120.5,
    "memory_usage": 2.1,
    "carbon_footprint": 2.1,
    "green_score": 87.5
  },
  "model_b": {
    "id": "uuid",
    "name": "YOLOv8s",
    "accuracy": 88.7,
    "speed": 95.2,
    "memory_usage": 3.8,
    "carbon_footprint": 3.8,
    "green_score": 82.1
  },
  "status": "completed",
  "results": {
    "winner": "model_b",
    "differences": {
      "accuracy": 3.5,
      "speed": -25.3,
      "memory_usage": 1.7,
      "carbon_footprint": 1.7,
      "green_score": -5.4
    }
  },
  "created_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:05:00Z"
}
```

#### GET /comparisons
```json
Query Parameters:
- page: integer (default: 1)
- limit: integer (default: 10)
- user_id: uuid (optional)
- status: string (optional)

Response:
{
  "comparisons": [
    {
      "id": "uuid",
      "model_a_name": "YOLOv8n",
      "model_b_name": "YOLOv8s",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### 4. Dashboard & Analytics

#### GET /dashboard/stats
```json
Response:
{
  "systemMetrics": {
    "cpuUsage": 74.79,
    "gpuUsage": 86.42,
    "memoryUsage": 79.38,
    "networkLatency": 35.22,
    "activeConnections": 14
  },
  "liveStats": {
    "activeComparisons": 12,
    "queueLength": 5,
    "systemLoad": 67,
    "carbonFootprint": 2.4,
    "energyConsumption": 45.2,
    "uptime": 99.8,
    "responseTime": 245,
    "errorRate": 0.2
  },
  "sustainability": {
    "totalCarbonSaved": 12.8,
    "greenScore": 87,
    "energyEfficiency": 92,
    "renewableEnergyUsage": 78,
    "carbonOffset": 8.5
  },
  "comparisonStats": {
    "totalComparisons": 1247,
    "modelsCompared": 45,
    "averageAccuracy": 89.2,
    "averageSpeed": 85.5
  },
  "enterpriseMetrics": {
    "modelAccuracy": 89.2,
    "processingSpeed": 85.5,
    "systemUptime": 99.8,
    "successRate": 99.5,
    "responseTime": 245,
    "queueLength": 5,
    "concurrentComparisons": 12,
    "dataThroughput": 2500
  }
}
```

#### GET /dashboard/analytics
```json
Query Parameters:
- timeRange: string (24h, 7d, 30d, 90d)

Response:
{
  "performanceData": {
    "labels": ["YOLOv8n", "YOLOv8s", "YOLOv8m", "YOLOv8l", "YOLOv8x"],
    "datasets": [
      {
        "label": "Accuracy (%)",
        "data": [85.2, 88.7, 91.3, 93.1, 94.2]
      },
      {
        "label": "Speed (FPS)",
        "data": [120, 95, 65, 45, 30]
      }
    ]
  },
  "comparisonTrends": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "datasets": [
      {
        "label": "Comparisons",
        "data": [12, 19, 15, 25, 22, 18, 24]
      }
    ]
  }
}
```

### 5. Enterprise Metrics & Business Operations

#### GET /enterprise/metrics
```json
Query Parameters:
- organization_id: uuid (required for corporate clients)
- timeRange: string (24h, 7d, 30d, 90d)

Response:
{
  "operationalMetrics": {
    "modelAccuracy": 89.2,
    "processingSpeed": 85.5,
    "systemUptime": 99.8,
    "successRate": 99.5,
    "responseTime": 245,
    "queueLength": 5,
    "concurrentComparisons": 12,
    "dataThroughput": 2500
  },
  "businessMetrics": {
    "totalComparisons": 1247,
    "activeUsers": 45,
    "modelsUploaded": 89,
    "revenueGenerated": 12500.00,
    "costSavings": 8500.00,
    "customerSatisfaction": 4.8
  },
  "teamPerformance": {
    "databaseOperations": {
      "queriesPerSecond": 150,
      "averageResponseTime": 45,
      "errorRate": 0.1
    },
    "mlOperations": {
      "modelsDeployed": 23,
      "inferenceRequests": 1250,
      "averageAccuracy": 89.2
    },
    "backendOperations": {
      "apiRequests": 5000,
      "averageResponseTime": 120,
      "uptime": 99.9
    }
  }
}
```

#### GET /enterprise/reports
```json
Query Parameters:
- organization_id: uuid (required)
- report_type: string (performance, usage, billing, team)
- format: string (json, pdf, excel)
- date_range: string (start_date,end_date)

Response:
{
  "report": {
    "id": "uuid",
    "type": "performance",
    "generated_at": "2024-01-01T00:00:00Z",
    "data": {
      "summary": "Performance report for Q1 2024",
      "metrics": {...},
      "recommendations": [...]
    },
    "download_url": "https://storage.example.com/reports/uuid.pdf"
  }
}
```

### 5. Real-time Updates (WebSocket)

#### WebSocket Connection
```
wss://your-backend-domain.com/ws
```

#### Authentication
```json
{
  "type": "auth",
  "token": "auth0-jwt-token"
}
```

#### Real-time Events
```json
// Comparison status update
{
  "type": "comparison_update",
  "data": {
    "comparison_id": "uuid",
    "status": "processing",
    "progress": 45
  }
}

// System metrics update
{
  "type": "system_metrics",
  "data": {
    "cpuUsage": 74.79,
    "gpuUsage": 86.42,
    "memoryUsage": 79.38,
    "networkLatency": 35.22,
    "activeConnections": 14
  }
}
```

## 🔧 Backend Implementation Checklist

### Phase 1: Core Setup
- [ ] Set up Auth0 JWT validation middleware
- [ ] Configure Supabase connection
- [ ] Create database tables and migrations
- [ ] Implement user management endpoints
- [ ] Set up file upload handling

### Phase 2: Model Management
- [ ] Implement model upload endpoint
- [ ] Create model analysis pipeline
- [ ] Add model metadata extraction
- [ ] Implement model listing and details

### Phase 3: Comparison Engine
- [ ] Build model comparison logic
- [ ] Implement video processing
- [ ] Create comparison queue system
- [ ] Add real-time progress tracking

### Phase 4: Analytics & Dashboard
- [ ] Implement system metrics collection
- [ ] Create analytics aggregation
- [ ] Add real-time WebSocket support
- [ ] Build dashboard statistics

### Phase 5: Integration & Testing
- [ ] Test Auth0 integration
- [ ] Validate Supabase operations
- [ ] Test real-time updates
- [ ] Performance optimization

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_ISSUER=https://your-domain.auth0.com/

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Backend
BACKEND_URL=https://your-backend-domain.com
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string

# File Storage
STORAGE_BUCKET=your-storage-bucket
STORAGE_REGION=your-storage-region
```

### Security Requirements
- JWT token validation on all protected endpoints
- CORS configuration for frontend domain
- Rate limiting on API endpoints
- File upload size and type validation
- Input sanitization and validation

### Performance Requirements
- API response time < 200ms for simple operations
- File upload support up to 500MB
- Real-time updates via WebSocket
- Database connection pooling
- Caching for frequently accessed data

## 📞 Integration Support

For integration questions or issues:
1. Check the frontend API route at `/api/dashboard/stats` for expected data format
2. Review the `REAL_TIME_INTEGRATION.md` file for frontend-specific details
3. Test with the provided mock data endpoints
4. Use the WebSocket connection for real-time updates