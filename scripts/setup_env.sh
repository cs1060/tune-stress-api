#!/bin/bash

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .

# Print success message
echo "Python environment setup complete!"
echo "To activate the environment, run: source venv/bin/activate"
