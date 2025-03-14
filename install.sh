#!/bin/bash

echo "Installing StressAPI dependencies..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Install required packages
pip install -r requirements.txt

echo "Installation complete! Run ./run.sh to start the application."
