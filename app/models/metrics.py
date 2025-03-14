from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TestRun(Base):
    __tablename__ = "test_runs"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    config = Column(JSON)
    total_requests = Column(Integer, default=0)
    successful_requests = Column(Integer, default=0)
    failed_requests = Column(Integer, default=0)
    avg_response_time = Column(Float)
    p50_response_time = Column(Float)
    p90_response_time = Column(Float)
    p99_response_time = Column(Float)
    max_response_time = Column(Float)
    min_response_time = Column(Float)
    avg_cpu_usage = Column(Float)
    avg_memory_usage = Column(Float)
    test_duration = Column(Float)  # in seconds
    errors = Column(JSON)

class MetricPoint(Base):
    __tablename__ = "metric_points"

    id = Column(Integer, primary_key=True, index=True)
    test_run_id = Column(Integer, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    endpoint = Column(String)
    response_time = Column(Float)
    status_code = Column(Integer)
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    error = Column(String, nullable=True)
