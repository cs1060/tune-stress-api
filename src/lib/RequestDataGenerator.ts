import { OpenAPIParser, ParsedEndpoint } from './OpenAPIParser';
import { DataGeneratorFactory } from './DataGeneratorFactory';
import { OpenAPIV3 } from 'openapi-types';

export interface GeneratedRequest {
  path: string;
  method: string;
  parameters: Record<string, any>;
  body?: any;
}

export class RequestDataGenerator {
  private parser: OpenAPIParser;
  private cache: Map<string, GeneratedRequest> = new Map();

  constructor() {
    this.parser = new OpenAPIParser();
  }

  async initialize(specUrl: string): Promise<void> {
    await this.parser.fetchAndParseSpec(specUrl);
  }

  generateRequestData(endpoint: ParsedEndpoint): GeneratedRequest {
    const cacheKey = `${endpoint.method}-${endpoint.path}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const parameters: Record<string, any> = {};
    
    // Generate parameter values
    for (const param of endpoint.parameters) {
      if (!param.schema || typeof param.schema === 'boolean') continue;
      
      const generator = DataGeneratorFactory.createGenerator({
        schema: param.schema as OpenAPIV3.SchemaObject,
        required: param.required
      });
      
      parameters[param.name] = generator.generate();
    }

    // Generate request body if needed
    let body: any = undefined;
    if (endpoint.requestBody && endpoint.requestBody.content['application/json']) {
      const schema = endpoint.requestBody.content['application/json'].schema;
      if (schema && typeof schema !== 'boolean') {
        const generator = DataGeneratorFactory.createGenerator({
          schema: schema as OpenAPIV3.SchemaObject,
          required: endpoint.requestBody.required
        });
        body = generator.generate();
      }
    }

    const request: GeneratedRequest = {
      path: endpoint.path,
      method: endpoint.method,
      parameters,
      body
    };

    this.cache.set(cacheKey, request);
    return request;
  }

  generateAllRequests(): GeneratedRequest[] {
    const endpoints = this.parser.getEndpoints();
    return endpoints.map(endpoint => this.generateRequestData(endpoint));
  }
}