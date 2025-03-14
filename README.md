# StressAPI Reporter

A high-performance reporting and visualization module for StressAPI load testing tool.

## Features

- Data collection and storage of key performance metrics
- Automated report generation in multiple formats (JSON, CSV, PDF)
- Interactive visualization dashboard
- CLI interface for report generation
- RESTful API endpoints for programmatic access
- Integration with external monitoring tools

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
uvicorn app.main:app --reload
```

3. Access the dashboard at `http://localhost:8000`

## Usage

### CLI Report Generation
```bash
python -m stressapi.cli report generate --format json --output report.json
```

### API Endpoints
- GET `/api/reports` - List all reports
- GET `/api/reports/{id}` - Get specific report
- POST `/api/tests` - Start a new load test
- GET `/api/metrics` - Get real-time metrics

## Development

The project structure follows clean architecture principles:
- `app/` - Main application code
- `app/core/` - Core business logic
- `app/api/` - API routes and handlers
- `app/models/` - Data models
- `app/services/` - Business services
- `app/utils/` - Utility functions
- `static/` - Static files for web dashboard
- `templates/` - HTML templates
