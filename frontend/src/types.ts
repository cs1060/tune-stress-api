export interface EndpointParameter {
  name: string;
  location: 'path' | 'query' | 'body';
  type: string;
  required: boolean;
  schema: any;
}

export interface EndpointInfo {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  parameters: EndpointParameter[];
  request_body?: any;
  response_schema?: any;
  description?: string;
}

export interface GeneratedTestData {
  [key: string]: any;
}
