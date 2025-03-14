export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        parameters?: any[];
        requestBody?: {
          content: {
            'application/json': {
              schema: any;
            };
          };
        };
        responses: {
          [statusCode: string]: {
            description: string;
            content?: {
              'application/json': {
                schema: any;
              };
            };
          };
        };
      };
    };
  };
}

export interface Endpoint {
  path: string;
  method: string;
  summary?: string;
  schema?: any;
}

export interface LoadTestConfig {
  url: string;
  endpoint: Endpoint;
  concurrent: number;
  duration: number;
  data: any;
}