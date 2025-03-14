# StressAPI Reporter Prototype

A high-performance load testing reporting tool for FastAPI applications. This prototype demonstrates the reporting and visualization capabilities for performance metrics.

## Features

- Real-time metrics collection and visualization
- Interactive dashboard with Chart.js
- Endpoint-specific performance analysis
- Key performance indicators:
  - Total requests
  - Average response time
  - Success rate
  - Active endpoints

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
uvicorn main:app --reload
```

3. Access the dashboard at `http://localhost:8000`

## API Endpoints

- `POST /api/metrics`: Submit performance metrics
- `GET /api/metrics/summary`: Get summarized metrics data
- `GET /`: Root endpoint serving the dashboard

## Architecture

- Backend: FastAPI for efficient API handling and metrics processing
- Frontend: Modern dashboard using Chart.js and TailwindCSS
- Data Storage: In-memory storage (can be extended to use a database)

## Next Steps

- Implement persistent storage
- Add more visualization types
- Add filtering and time-range selection
- Implement real-time WebSocket updates
- Add export functionality for reports
