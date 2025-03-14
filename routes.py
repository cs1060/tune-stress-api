from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import timedelta
import asyncio
import aiohttp
import time
import json
from typing import List, Dict, Any

from database import get_db
import models
import schemas
import auth

router = APIRouter()


@router.post("/register")
def register_user(request: Request, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        # Get request data
        data = asyncio.run(request.json())
        
        # Validate data structure
        try:
            user_data = schemas.UserCreate(
                username=data["username"],
                email=data["email"],
                password=data["password"]
            )
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing required field: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Check if username exists
        db_user_by_username = db.query(models.User).filter(models.User.username == user_data.username).first()
        if db_user_by_username:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        # Check if email exists
        db_user_by_email = db.query(models.User).filter(models.User.email == user_data.email).first()
        if db_user_by_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        hashed_password = auth.get_password_hash(user_data.password)
        db_user = models.User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Return user data
        user = schemas.User.from_orm(db_user)
        return user.__dict__
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")


@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Generate a JWT token for authenticated user."""
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    token = schemas.Token(access_token=access_token, token_type="bearer")
    return token.__dict__


@router.get("/users/me")
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    """Get current user information."""
    user = schemas.User.from_orm(current_user)
    return user.__dict__


@router.post("/stress-tests")
async def create_stress_test(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Create a new stress test."""
    try:
        # Get request data
        data = await request.json()
        
        # Validate data structure
        try:
            stress_test_data = schemas.StressTestCreate(
                title=data["title"],
                target_url=data["target_url"],
                request_method=data["request_method"],
                request_headers=data.get("request_headers"),
                request_body=data.get("request_body"),
                concurrent_users=data.get("concurrent_users", 10),
                request_count=data.get("request_count", 100)
            )
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing required field: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Create stress test
        data_dict = {k: v for k, v in stress_test_data.__dict__.items()}
        db_stress_test = models.StressTest(**data_dict, owner_id=current_user.id)
        db.add(db_stress_test)
        db.commit()
        db.refresh(db_stress_test)
        
        # Return stress test data
        stress_test = schemas.StressTest.from_orm(db_stress_test)
        return stress_test.__dict__
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")


@router.get("/stress-tests")
def get_stress_tests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get user's stress tests."""
    stress_tests = db.query(models.StressTest).filter(
        models.StressTest.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Convert to schema objects
    return [schemas.StressTest.from_orm(test).__dict__ for test in stress_tests]


@router.get("/stress-tests/{stress_test_id}")
def get_stress_test(
    stress_test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get a specific stress test by ID."""
    stress_test = db.query(models.StressTest).filter(
        models.StressTest.id == stress_test_id,
        models.StressTest.owner_id == current_user.id
    ).first()
    if stress_test is None:
        raise HTTPException(status_code=404, detail="Stress test not found")
    
    return schemas.StressTest.from_orm(stress_test).__dict__


@router.post("/stress-tests/{stress_test_id}/run")
async def run_stress_test(
    stress_test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Run a stress test and record results."""
    # Get the stress test
    stress_test = db.query(models.StressTest).filter(
        models.StressTest.id == stress_test_id,
        models.StressTest.owner_id == current_user.id
    ).first()
    if stress_test is None:
        raise HTTPException(status_code=404, detail="Stress test not found")
    
    # Create test result record
    test_result = models.TestResult(
        test_id=stress_test.id,
        total_requests=0,
        successful_requests=0,
        failed_requests=0,
        average_response_time_ms=0,
        min_response_time_ms=0,
        max_response_time_ms=0
    )
    db.add(test_result)
    db.commit()
    db.refresh(test_result)
    
    # Run stress test
    try:
        # Parse headers if provided
        headers = {}
        if stress_test.request_headers:
            try:
                headers = json.loads(stress_test.request_headers)
            except json.JSONDecodeError:
                pass
        
        # Parse body if provided
        data = None
        if stress_test.request_body:
            try:
                data = stress_test.request_body
            except:
                pass
        
        # Define async function for making requests
        async def make_request(session):
            start_time = time.time()
            try:
                if stress_test.request_method.upper() == "GET":
                    async with session.get(stress_test.target_url, headers=headers) as response:
                        await response.text()
                        return True, int((time.time() - start_time) * 1000)
                elif stress_test.request_method.upper() == "POST":
                    async with session.post(stress_test.target_url, headers=headers, data=data) as response:
                        await response.text()
                        return True, int((time.time() - start_time) * 1000)
                elif stress_test.request_method.upper() == "PUT":
                    async with session.put(stress_test.target_url, headers=headers, data=data) as response:
                        await response.text()
                        return True, int((time.time() - start_time) * 1000)
                elif stress_test.request_method.upper() == "DELETE":
                    async with session.delete(stress_test.target_url, headers=headers) as response:
                        await response.text()
                        return True, int((time.time() - start_time) * 1000)
                else:
                    return False, 0
            except:
                return False, 0
        
        # Function to run multiple concurrent requests
        async def run_load_test():
            async with aiohttp.ClientSession() as session:
                tasks = []
                for _ in range(stress_test.request_count):
                    tasks.append(make_request(session))
                return await asyncio.gather(*tasks)
        
        # Run the load test
        results = await run_load_test()
        
        # Process results
        successful_requests = sum(1 for success, _ in results if success)
        failed_requests = len(results) - successful_requests
        
        # Calculate response times for successful requests
        response_times = [time for success, time in results if success]
        avg_response_time = int(sum(response_times) / max(1, len(response_times)))
        min_response_time = min(response_times) if response_times else 0
        max_response_time = max(response_times) if response_times else 0
        
        # Update test result
        test_result.end_time = time.time()
        test_result.total_requests = len(results)
        test_result.successful_requests = successful_requests
        test_result.failed_requests = failed_requests
        test_result.average_response_time_ms = avg_response_time
        test_result.min_response_time_ms = min_response_time
        test_result.max_response_time_ms = max_response_time
        
        db.commit()
        db.refresh(test_result)
        
        return schemas.TestResult.from_orm(test_result).__dict__
    
    except Exception as e:
        # Update test result with error
        test_result.end_time = time.time()
        test_result.failed_requests = stress_test.request_count
        db.commit()
        
        raise HTTPException(status_code=500, detail=f"Stress test failed: {str(e)}")


@router.get("/test-results/{test_id}")
def get_test_results(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get test results for a specific stress test."""
    # Verify ownership of stress test
    stress_test = db.query(models.StressTest).filter(
        models.StressTest.id == test_id,
        models.StressTest.owner_id == current_user.id
    ).first()
    if stress_test is None:
        raise HTTPException(status_code=404, detail="Stress test not found")
    
    # Get test results
    results = db.query(models.TestResult).filter(
        models.TestResult.test_id == test_id
    ).all()
    
    # Convert to schema objects
    return [schemas.TestResult.from_orm(result).__dict__ for result in results]
