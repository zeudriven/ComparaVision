# Real-Time Stats Integration

## Overview
The dashboard now supports real-time stats from your backend. When the backend is ready, the frontend will automatically fetch and display live data from model comparisons.

## Current Implementation

### Frontend API Route
- **File**: `src/app/api/dashboard/stats/route.ts`
- **Purpose**: Proxies requests to your backend
- **Fallback**: Returns mock data when backend is unavailable

### Custom Hook
- **File**: `src/hooks/useRealTimeStats.ts`
- **Purpose**: Manages real-time data fetching with polling
- **Features**: Error handling, loading states, manual refresh

### Dashboard Integration
- **File**: `src/app/dashboard/page.tsx`
- **Features**: 
  - Real-time status indicators
  - Error display
  - Manual refresh button
  - Fallback data when backend is unavailable

## Backend Integration Requirements

### Environment Variables
Add to your `.env.local`:
```bash
BACKEND_URL=http://localhost:8000  # Your backend URL
```

### Expected Backend API Response
Your backend should return data in this format:

```json
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
  }
}
```

### Backend API Endpoint
- **URL**: `GET /api/dashboard/stats`
- **Headers**: `Content-Type: application/json`
- **Authentication**: Add your auth headers as needed

## Features

### Real-Time Indicators
- **Green dot**: Backend connected, showing live data
- **Yellow dot**: Using fallback data (backend unavailable)
- **Timestamp**: Shows last successful update
- **Refresh button**: Manual data refresh

### Error Handling
- Graceful fallback to mock data
- User-friendly error messages
- Automatic retry on connection issues

### Polling
- Updates every 3 seconds when backend is available
- Configurable polling interval
- Efficient resource usage

## Development Notes

1. **Current State**: Frontend is ready for backend integration
2. **Fallback Data**: Mock data ensures UI works while backend is developed
3. **No Breaking Changes**: Backend integration is additive, not required
4. **Easy Testing**: Can test with mock data or real backend

## Next Steps for Backend Team

1. Implement the `/api/dashboard/stats` endpoint
2. Return data in the expected JSON format
3. Add proper authentication if needed
4. Test with the frontend API route