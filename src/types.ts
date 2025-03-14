export interface PerformanceMetric {
  timestamp: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpu: number;
  memory: number;
}

export interface TestConfig {
  id: string;
  startTime: number;
  endTime: number;
  totalRequests: number;
  concurrentUsers: number;
  targetUrl: string;
}

export interface TestReport {
  config: TestConfig;
  metrics: PerformanceMetric[];
  summary: {
    avgResponseTime: number;
    p50ResponseTime: number;
    p90ResponseTime: number;
    p99ResponseTime: number;
    totalErrors: number;
    errorRate: number;
    peakThroughput: number;
    avgCpu: number;
    peakMemory: number;
  };
}