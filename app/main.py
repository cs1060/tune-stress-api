from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, init_db, engine
from app.services.metrics_service import MetricsService
from app.models.metrics import TestRun, MetricPoint, Base
import json
from pathlib import Path
import aiofiles
from datetime import datetime

app = FastAPI(title="StressAPI Reporter")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await init_db()

@app.post("/api/tests")
async def create_test(config: dict, db: AsyncSession = Depends(get_db)):
    metrics_service = MetricsService(db)
    test_run = await metrics_service.create_test_run(config)
    return {"test_run_id": test_run.id}

@app.post("/api/tests/{test_run_id}/metrics")
async def record_metric(
    test_run_id: int,
    endpoint: str,
    response_time: float,
    status_code: int,
    cpu_usage: float,
    memory_usage: float,
    error: str = None,
    db: AsyncSession = Depends(get_db)
):
    metrics_service = MetricsService(db)
    await metrics_service.record_metric(
        test_run_id, endpoint, response_time,
        status_code, cpu_usage, memory_usage, error
    )
    return {"status": "recorded"}

@app.post("/api/tests/{test_run_id}/finalize")
async def finalize_test(test_run_id: int, db: AsyncSession = Depends(get_db)):
    metrics_service = MetricsService(db)
    test_run = await metrics_service.finalize_test_run(test_run_id)
    return {"status": "finalized", "test_run": test_run}

@app.get("/api/reports/{test_run_id}")
async def get_report(
    test_run_id: int,
    format: str = "json",
    db: AsyncSession = Depends(get_db)
):
    metrics_service = MetricsService(db)
    report = await metrics_service.generate_report(test_run_id, format)
    
    if format == "json":
        return report
    elif format == "csv":
        return Response(
            content=report,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=report_{test_run_id}.csv"
            }
        )
    
    raise HTTPException(status_code=400, detail="Unsupported format")

@app.get("/api/visualizations/{test_run_id}")
async def get_visualizations(test_run_id: int, db: AsyncSession = Depends(get_db)):
    metrics_service = MetricsService(db)
    visualizations = metrics_service.generate_visualizations(test_run_id)
    return visualizations

@app.get("/")
async def dashboard(request):
    return templates.TemplateResponse(
        "dashboard.html",
        {"request": request}
    )
