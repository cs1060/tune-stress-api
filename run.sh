#!/bin/bash

echo "Starting StressAPI..."

# Check if Python and required packages are installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

if ! pip show fastapi uvicorn streamlit &> /dev/null; then
    echo "Installing required packages..."
    pip install -r requirements.txt
fi

# Start FastAPI backend in the background
echo "Starting FastAPI backend..."
uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Streamlit frontend
echo "Starting Streamlit frontend..."
streamlit run streamlit_app.py

# Kill the backend process when Streamlit exits
kill $BACKEND_PID
