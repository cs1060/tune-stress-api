import axios from 'axios';
import { OpenAPIV3 } from 'openapi-types';

export interface ParsedEndpoint {
  path: string;
  method: string;
  parameters: OpenAPIV3.ParameterObject[];
  requestBody?: OpenAPIV3.RequestBodyObject;
  responses: Record<string, OpenAPIV3.ResponseObject>;
}

export class OpenAPIParser {
  private cache: Map<string, any> = new Map();
  private spec?: OpenAPIV3.Document;

  async fetchAndParseSpec(url: string): Promise<void> {
    if (this.cache.has(url)) {
      this.spec = this.cache.get(url);
      return;
    }

    try {
      const response = await axios.get(url);
      this.spec = response.data;
      this.cache.set(url, this.spec);
    } catch (error) {
      throw new Error(`Failed to fetch OpenAPI spec: ${error}`);
    }
  }

  getEndpoints(): ParsedEndpoint[] {
    if (!this.spec) {
      throw new Error('OpenAPI spec not loaded');
    }

    const endpoints: ParsedEndpoint[] = [];

    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      if (!pathItem) continue;

      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
      
      for (const method of methods) {
        const operation = pathItem[method];
        if (!operation) continue;

        endpoints.push({
          path,
          method: method.toUpperCase(),
          parameters: [...(pathItem.parameters || []), ...(operation.parameters || [])],
          requestBody: operation.requestBody as OpenAPIV3.RequestBodyObject,
          responses: operation.responses as Record<string, OpenAPIV3.ResponseObject>
        });
      }
    }

    return endpoints;
  }
}