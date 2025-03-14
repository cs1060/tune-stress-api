from typing import Dict, List, Optional, Any
import httpx
from pydantic import BaseModel

class EndpointParameter(BaseModel):
    name: str
    location: str  # 'path', 'query', or 'body'
    type: str
    required: bool
    schema: Dict[str, Any]

class EndpointInfo(BaseModel):
    path: str
    method: str
    parameters: List[EndpointParameter]
    request_body: Optional[Dict[str, Any]]
    response_schema: Optional[Dict[str, Any]]

class SchemaParser:
    def __init__(self):
        self.client = httpx.AsyncClient()

    async def fetch_openapi_schema(self, base_url: str) -> Dict[str, Any]:
        """Fetch OpenAPI schema from a FastAPI application."""
        openapi_url = f"{base_url.rstrip('/')}/openapi.json"
        response = await self.client.get(openapi_url)
        return response.json()

    def parse_parameters(self, path_item: Dict[str, Any], method_info: Dict[str, Any]) -> List[EndpointParameter]:
        """Parse path and query parameters from OpenAPI spec."""
        parameters = []
        
        # Combine path-level and method-level parameters
        all_params = path_item.get('parameters', []) + method_info.get('parameters', [])
        
        for param in all_params:
            parameters.append(EndpointParameter(
                name=param['name'],
                location=param['in'],
                type=param['schema'].get('type', 'string'),
                required=param.get('required', False),
                schema=param['schema']
            ))
        
        return parameters

    def parse_request_body(self, method_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parse request body schema from OpenAPI spec."""
        if 'requestBody' not in method_info:
            return None
            
        content = method_info['requestBody'].get('content', {})
        if 'application/json' in content:
            return content['application/json']['schema']
        return None

    def parse_response_schema(self, method_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parse response schema from OpenAPI spec."""
        responses = method_info.get('responses', {})
        if '200' in responses:
            content = responses['200'].get('content', {})
            if 'application/json' in content:
                return content['application/json']['schema']
        return None

    async def parse_endpoints(self, base_url: str) -> List[EndpointInfo]:
        """Parse all endpoints from OpenAPI schema."""
        schema = await self.fetch_openapi_schema(base_url)
        endpoints = []

        for path, path_item in schema['paths'].items():
            for method in ['get', 'post', 'put', 'delete', 'patch']:
                if method not in path_item:
                    continue

                method_info = path_item[method]
                parameters = self.parse_parameters(path_item, method_info)
                request_body = self.parse_request_body(method_info)
                response_schema = self.parse_response_schema(method_info)

                endpoints.append(EndpointInfo(
                    path=path,
                    method=method.upper(),
                    parameters=parameters,
                    request_body=request_body,
                    response_schema=response_schema
                ))

        return endpoints

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
