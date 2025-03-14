from typing import Any, Dict, List, Optional
from faker import Faker
from datetime import datetime, date
import uuid
import random
from cachetools import TTLCache

class DataGeneratorFactory:
    def __init__(self):
        self.faker = Faker()
        self.cache = TTLCache(maxsize=1000, ttl=3600)  # Cache for 1 hour

    def _get_cached_value(self, key: str, generator_func) -> Any:
        """Get or generate a cached value."""
        if key not in self.cache:
            self.cache[key] = generator_func()
        return self.cache[key]

    def generate_data(self, schema: Dict[str, Any], path: str = "") -> Any:
        """Generate data based on OpenAPI schema."""
        schema_type = schema.get('type', 'object')
        format_type = schema.get('format', None)

        # Handle references
        if '$ref' in schema:
            # In a real implementation, we would resolve the reference
            # For now, we'll return a placeholder
            return {"reference": "resolved_reference"}

        # Handle different types
        if schema_type == 'object':
            return self._generate_object(schema, path)
        elif schema_type == 'array':
            return self._generate_array(schema, path)
        else:
            return self._generate_primitive(schema_type, format_type, path)

    def _generate_object(self, schema: Dict[str, Any], path: str) -> Dict[str, Any]:
        """Generate an object based on its schema."""
        result = {}
        properties = schema.get('properties', {})
        required = schema.get('required', [])

        for prop_name, prop_schema in properties.items():
            prop_path = f"{path}.{prop_name}" if path else prop_name
            
            # Skip optional properties sometimes
            if prop_name not in required and random.random() > 0.7:
                continue

            result[prop_name] = self.generate_data(prop_schema, prop_path)

        return result

    def _generate_array(self, schema: Dict[str, Any], path: str) -> List[Any]:
        """Generate an array based on its schema."""
        items_schema = schema.get('items', {})
        min_items = schema.get('minItems', 1)
        max_items = schema.get('maxItems', 5)
        length = random.randint(min_items, max_items)

        return [
            self.generate_data(items_schema, f"{path}[{i}]")
            for i in range(length)
        ]

    def _generate_primitive(self, type_: str, format_: Optional[str], path: str) -> Any:
        """Generate primitive data types."""
        # Use path as a cache key for consistent values
        if format_ == 'email':
            return self._get_cached_value(f"{path}_email", self.faker.email)
        elif format_ == 'date':
            return self._get_cached_value(f"{path}_date", 
                lambda: self.faker.date().isoformat())
        elif format_ == 'date-time':
            return self._get_cached_value(f"{path}_datetime", 
                lambda: self.faker.date_time().isoformat())
        elif format_ == 'uuid':
            return self._get_cached_value(f"{path}_uuid", 
                lambda: str(uuid.uuid4()))
        elif format_ == 'uri':
            return self._get_cached_value(f"{path}_uri", self.faker.uri)
        elif type_ == 'string':
            return self._get_cached_value(f"{path}_string", self.faker.word)
        elif type_ == 'integer':
            return self._get_cached_value(f"{path}_integer", 
                lambda: random.randint(1, 1000))
        elif type_ == 'number':
            return self._get_cached_value(f"{path}_number", 
                lambda: round(random.uniform(1, 1000), 2))
        elif type_ == 'boolean':
            return self._get_cached_value(f"{path}_boolean", 
                lambda: random.choice([True, False]))
        
        return None
