from dataclasses import dataclass, field, fields
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import re


def validate_email(email):
    """Simple email validation"""
    email_pattern = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    if not email_pattern.match(email):
        raise ValueError(f"Invalid email: {email}")
    return email


@dataclass
class UserBase:
    username: str
    email: str
    
    def __post_init__(self):
        validate_email(self.email)


@dataclass
class UserCreate(UserBase):
    password: str


@dataclass
class UserLogin:
    username: str
    password: str


@dataclass
class User:
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    
    @classmethod
    def from_orm(cls, db_obj):
        """Create a User instance from an ORM model instance"""
        return cls(
            id=db_obj.id,
            username=db_obj.username,
            email=db_obj.email,
            is_active=db_obj.is_active,
            created_at=db_obj.created_at
        )


@dataclass
class Token:
    access_token: str
    token_type: str


@dataclass
class TokenData:
    username: Optional[str] = None


@dataclass
class StressTestBase:
    title: str
    target_url: str
    request_method: str
    request_headers: Optional[str] = None
    request_body: Optional[str] = None
    concurrent_users: int = 10
    request_count: int = 100


@dataclass
class StressTestCreate(StressTestBase):
    pass


@dataclass
class StressTest:
    id: int
    title: str
    target_url: str
    request_method: str
    owner_id: int
    created_at: datetime
    request_headers: Optional[str] = None
    request_body: Optional[str] = None
    concurrent_users: int = 10
    request_count: int = 100
    
    @classmethod
    def from_orm(cls, db_obj):
        """Create a StressTest instance from an ORM model instance"""
        return cls(
            id=db_obj.id,
            title=db_obj.title,
            target_url=db_obj.target_url,
            request_method=db_obj.request_method,
            request_headers=db_obj.request_headers,
            request_body=db_obj.request_body,
            concurrent_users=db_obj.concurrent_users,
            request_count=db_obj.request_count,
            created_at=db_obj.created_at,
            owner_id=db_obj.owner_id
        )


@dataclass
class TestResultBase:
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time_ms: int
    min_response_time_ms: int
    max_response_time_ms: int


@dataclass
class TestResultCreate(TestResultBase):
    test_id: int
    start_time: datetime
    end_time: Optional[datetime] = None


@dataclass
class TestResult:
    id: int
    test_id: int
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time_ms: int
    min_response_time_ms: int
    max_response_time_ms: int
    start_time: datetime
    end_time: Optional[datetime] = None
    
    @classmethod
    def from_orm(cls, db_obj):
        """Create a TestResult instance from an ORM model instance"""
        return cls(
            id=db_obj.id,
            test_id=db_obj.test_id,
            total_requests=db_obj.total_requests,
            successful_requests=db_obj.successful_requests,
            failed_requests=db_obj.failed_requests,
            average_response_time_ms=db_obj.average_response_time_ms,
            min_response_time_ms=db_obj.min_response_time_ms,
            max_response_time_ms=db_obj.max_response_time_ms,
            start_time=db_obj.start_time,
            end_time=db_obj.end_time
        )
        
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        result = {k: str(v) if isinstance(v, datetime) else v for k, v in self.__dict__.items()}
        return result
