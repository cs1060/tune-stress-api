
export interface TestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  concurrentUsers: number;
  duration: number;
  headers?: Record<string, string>;
  body?: string;
}

export interface TestResult {
  id: string;
  timestamp: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  status: 'running' | 'completed' | 'failed';
  errorMessage?: string;
  statusCodes: Record<string, number>;
  timeSeries: TimeSeriesPoint[];
}

export interface TimeSeriesPoint {
  timestamp: number;
  responseTime: number;
  statusCode: number;
}
