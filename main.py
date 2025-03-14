from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict
import json
from datetime import datetime
import os

app = FastAPI(title="StressAPI Reporter")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# In-memory storage for metrics (in production, use a proper database)
performance_metrics = []

class MetricData(BaseModel):
    endpoint: str
    method: str
    response_time: float
    status_code: int
    timestamp: datetime
    concurrent_users: int

@app.post("/api/metrics")
async def record_metrics(metric: MetricData):
    performance_metrics.append(metric.dict())
    return {"status": "success"}

@app.get("/api/metrics/summary")
async def get_metrics_summary():
    if not performance_metrics:
        return JSONResponse(
            content={"error": "No metrics data available"},
            status_code=404
        )
    
    # Calculate summary statistics
    total_requests = len(performance_metrics)
    avg_response_time = sum(m["response_time"] for m in performance_metrics) / total_requests
    success_requests = sum(1 for m in performance_metrics if 200 <= m["status_code"] < 300)
    
    return {
        "total_requests": total_requests,
        "average_response_time": round(avg_response_time, 3),
        "success_rate": round((success_requests / total_requests) * 100, 2),
        "metrics_by_endpoint": get_metrics_by_endpoint()
    }

def get_metrics_by_endpoint():
    endpoint_metrics = {}
    for metric in performance_metrics:
        endpoint = metric["endpoint"]
        if endpoint not in endpoint_metrics:
            endpoint_metrics[endpoint] = {
                "total_requests": 0,
                "avg_response_time": 0,
                "success_rate": 0
            }
        
        stats = endpoint_metrics[endpoint]
        stats["total_requests"] += 1
        stats["avg_response_time"] = (
            (stats["avg_response_time"] * (stats["total_requests"] - 1) + metric["response_time"])
            / stats["total_requests"]
        )
        if 200 <= metric["status_code"] < 300:
            stats["success_rate"] = (
                (stats["success_rate"] * (stats["total_requests"] - 1) + 100)
                / stats["total_requests"]
            )
    
    return endpoint_metrics

@app.get("/")
async def root():
    return {"message": "Welcome to StressAPI Reporter"}
