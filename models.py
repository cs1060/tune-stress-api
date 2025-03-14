from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with stress tests
    stress_tests = relationship("StressTest", back_populates="owner")


class StressTest(Base):
    __tablename__ = "stress_tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    target_url = Column(String)
    request_method = Column(String)
    request_headers = Column(Text, nullable=True)
    request_body = Column(Text, nullable=True)
    concurrent_users = Column(Integer)
    request_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    owner = relationship("User", back_populates="stress_tests")
    # Relationship with results
    results = relationship("TestResult", back_populates="test")


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("stress_tests.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_requests = Column(Integer)
    successful_requests = Column(Integer)
    failed_requests = Column(Integer)
    average_response_time_ms = Column(Integer)
    min_response_time_ms = Column(Integer)
    max_response_time_ms = Column(Integer)
    
    # Relationship with stress test
    test = relationship("StressTest", back_populates="results")
