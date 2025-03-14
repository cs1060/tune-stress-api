from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any, Optional

from .schema_parser import SchemaParser, EndpointInfo
from .data_generator import DataGeneratorFactory

app = FastAPI(title="API Tester")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiscoverEndpointsRequest(BaseModel):
    api_url: HttpUrl

class GenerateTestDataRequest(BaseModel):
    endpoint_path: str
    method: str
    custom_parameters: Optional[Dict[str, Any]] = None

class EndpointResponse(BaseModel):
    endpoints: List[EndpointInfo]

@app.post("/discover-endpoints", response_model=EndpointResponse)
async def discover_endpoints(request: DiscoverEndpointsRequest):
    """Discover all endpoints from a FastAPI application."""
    parser = SchemaParser()
    try:
        endpoints = await parser.parse_endpoints(str(request.api_url))
        await parser.close()
        return {"endpoints": endpoints}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate-test-data")
async def generate_test_data(request: GenerateTestDataRequest):
    """Generate test data for a specific endpoint."""
    generator = DataGeneratorFactory()
    
    # In a real implementation, we would:
    # 1. Get the endpoint schema from the parser
    # 2. Apply any custom parameters
    # 3. Generate the test data
    
    # For now, we'll return a sample response
    sample_schema = {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "email": {"type": "string", "format": "email"},
            "created_at": {"type": "string", "format": "date-time"}
        }
    }
    
    generated_data = generator.generate_data(sample_schema)
    return generated_data
