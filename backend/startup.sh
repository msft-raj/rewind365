#!/bin/bash

# Azure App Service startup script for Rewind365
# This script runs when the app starts in Azure

echo "Starting Rewind365 application..."

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI application with Gunicorn for production
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT