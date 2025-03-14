# StressAPI

StressAPI is a high-performance load testing tool built specifically for FastAPI. Simulate real-world traffic, stress-test endpoints, and uncover performance bottlenecks with ease.

## Features

- **User Authentication**: Secure registration and login system
- **Create Custom Tests**: Configure endpoints, methods, headers, and bodies
- **Concurrent Requests**: Simulate multiple users accessing your API simultaneously
- **Detailed Analytics**: View response times, success rates, and performance metrics
- **Modern UI**: Clean, responsive interface built with Streamlit

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, JWT Authentication
- **Frontend**: Streamlit
- **Database**: SQLite (local)

## Getting Started

### Prerequisites

- Python 3.7+
- pip

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the FastAPI backend:
   ```bash
   uvicorn main:app --reload
   ```

2. In a separate terminal, start the Streamlit frontend:
   ```bash
   streamlit run streamlit_app.py
   ```

3. Open your browser and navigate to the URL shown in the Streamlit terminal output (typically http://localhost:8501)

## Usage

1. Create an account or log in
2. Configure a new stress test with your target API endpoint
3. Run the test and analyze the results
4. Use insights to optimize your FastAPI application

## Project Structure

- `main.py` - FastAPI application entry point
- `models.py` - SQLAlchemy database models
- `schemas.py` - Pydantic schemas for request/response validation
- `auth.py` - JWT authentication logic
- `database.py` - Database connection and session management
- `routes.py` - API endpoints for stress testing
- `streamlit_app.py` - Streamlit frontend application
