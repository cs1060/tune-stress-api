
export interface RequestMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
  success: boolean;
  errorMessage?: string;
}

export interface SystemMetric {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
}

export interface AggregatedMetrics {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  errorRate: number;
  avgResponseTime: number;
  p50ResponseTime: number;
  p90ResponseTime: number;
  p99ResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  startTime: number;
  endTime: number;
  duration: number;
  byEndpoint: Record<string, {
    requestCount: number;
    successCount: number;
    failureCount: number;
    avgResponseTime: number;
  }>;
}

export interface TestConfig {
  id: string;
  name: string;
  url: string;
  concurrentUsers: number;
  duration: number;
  rampUpTime?: number;
  requestsPerSecond?: number;
  headers?: Record<string, string>;
  testStartTime: number;
  testEndTime?: number;
}

export interface TestResult {
  config: TestConfig;
  metrics: AggregatedMetrics;
  rawRequestMetrics: RequestMetric[];
  systemMetrics: SystemMetric[];
}
