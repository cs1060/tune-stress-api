from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.metrics import TestRun, MetricPoint
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import numpy as np

class MetricsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def record_metric(self, test_run_id: int, endpoint: str, response_time: float,
                          status_code: int, cpu_usage: float, memory_usage: float,
                          error: str = None):
        metric = MetricPoint(
            test_run_id=test_run_id,
            endpoint=endpoint,
            response_time=response_time,
            status_code=status_code,
            cpu_usage=cpu_usage,
            memory_usage=memory_usage,
            error=error
        )
        self.session.add(metric)
        await self.session.commit()

    async def create_test_run(self, config: dict) -> TestRun:
        test_run = TestRun(
            start_time=datetime.utcnow(),
            config=config
        )
        self.session.add(test_run)
        await self.session.commit()
        return test_run

    async def finalize_test_run(self, test_run_id: int):
        metrics = await self.session.execute(
            select(MetricPoint).where(MetricPoint.test_run_id == test_run_id)
        )
        metrics = metrics.scalars().all()
        
        response_times = [m.response_time for m in metrics]
        
        test_run = await self.session.get(TestRun, test_run_id)
        test_run.end_time = datetime.utcnow()
        test_run.total_requests = len(metrics)
        test_run.successful_requests = len([m for m in metrics if m.status_code < 400])
        test_run.failed_requests = len([m for m in metrics if m.status_code >= 400])
        test_run.avg_response_time = np.mean(response_times)
        test_run.p50_response_time = np.percentile(response_times, 50)
        test_run.p90_response_time = np.percentile(response_times, 90)
        test_run.p99_response_time = np.percentile(response_times, 99)
        test_run.max_response_time = max(response_times)
        test_run.min_response_time = min(response_times)
        test_run.avg_cpu_usage = np.mean([m.cpu_usage for m in metrics])
        test_run.avg_memory_usage = np.mean([m.memory_usage for m in metrics])
        test_run.test_duration = (test_run.end_time - test_run.start_time).total_seconds()
        
        error_counts = {}
        for metric in metrics:
            if metric.error:
                error_counts[metric.error] = error_counts.get(metric.error, 0) + 1
        test_run.errors = error_counts
        
        await self.session.commit()
        return test_run

    async def generate_report(self, test_run_id: int, format: str = "json"):
        test_run = await self.session.get(TestRun, test_run_id)
        metrics = await self.session.execute(
            select(MetricPoint).where(MetricPoint.test_run_id == test_run_id)
        )
        metrics = metrics.scalars().all()
        
        if format == "json":
            return {
                "test_run": {
                    "id": test_run.id,
                    "start_time": test_run.start_time.isoformat(),
                    "end_time": test_run.end_time.isoformat(),
                    "duration": test_run.test_duration,
                    "total_requests": test_run.total_requests,
                    "successful_requests": test_run.successful_requests,
                    "failed_requests": test_run.failed_requests,
                    "avg_response_time": test_run.avg_response_time,
                    "p50_response_time": test_run.p50_response_time,
                    "p90_response_time": test_run.p90_response_time,
                    "p99_response_time": test_run.p99_response_time,
                    "avg_cpu_usage": test_run.avg_cpu_usage,
                    "avg_memory_usage": test_run.avg_memory_usage,
                    "errors": test_run.errors
                }
            }
        elif format == "csv":
            df = pd.DataFrame([{
                "timestamp": m.timestamp,
                "endpoint": m.endpoint,
                "response_time": m.response_time,
                "status_code": m.status_code,
                "cpu_usage": m.cpu_usage,
                "memory_usage": m.memory_usage,
                "error": m.error
            } for m in metrics])
            return df.to_csv(index=False)
        
        raise ValueError(f"Unsupported format: {format}")

    def generate_visualizations(self, test_run_id: int):
        # Response Time Distribution
        fig_resp_time = go.Figure(data=[go.Histogram(x=[m.response_time for m in metrics])])
        fig_resp_time.update_layout(title="Response Time Distribution",
                                  xaxis_title="Response Time (ms)",
                                  yaxis_title="Count")

        # Error Rate Over Time
        df = pd.DataFrame([{
            "timestamp": m.timestamp,
            "is_error": 1 if m.status_code >= 400 else 0
        } for m in metrics])
        df = df.set_index("timestamp").resample("1min").mean()
        fig_errors = px.line(df, y="is_error", title="Error Rate Over Time")

        # Resource Usage
        df_resources = pd.DataFrame([{
            "timestamp": m.timestamp,
            "cpu_usage": m.cpu_usage,
            "memory_usage": m.memory_usage
        } for m in metrics]).set_index("timestamp")
        
        fig_resources = go.Figure()
        fig_resources.add_trace(go.Scatter(x=df_resources.index, y=df_resources.cpu_usage,
                                         name="CPU Usage"))
        fig_resources.add_trace(go.Scatter(x=df_resources.index, y=df_resources.memory_usage,
                                         name="Memory Usage"))
        fig_resources.update_layout(title="Resource Usage Over Time")

        return {
            "response_time_dist": fig_resp_time,
            "error_rate": fig_errors,
            "resource_usage": fig_resources
        }
