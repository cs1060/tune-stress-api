
import { 
  TestResult, 
  TestConfig, 
  RequestMetric, 
  SystemMetric, 
  AggregatedMetrics 
} from '../models/PerformanceMetrics';

// Helper function to generate random number within a range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to create a timestamp within a range
const timestampInRange = (startTime: number, endTime: number): number => {
  return startTime + Math.floor(Math.random() * (endTime - startTime));
};

// Generate mock request metrics
const generateRequestMetrics = (
  config: TestConfig, 
  count: number
): RequestMetric[] => {
  const startTime = config.testStartTime;
  const endTime = config.testEndTime || startTime + (config.duration * 1000);
  const endpoints = ['/api/users', '/api/products', '/api/orders', '/api/auth'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const statusCodes = [200, 201, 400, 401, 403, 404, 500];
  
  return Array.from({ length: count }, () => {
    const success = Math.random() > 0.1; // 10% failure rate
    return {
      endpoint: endpoints[randomInRange(0, endpoints.length - 1)],
      method: methods[randomInRange(0, methods.length - 1)],
      statusCode: success 
        ? statusCodes.slice(0, 2)[randomInRange(0, 1)] 
        : statusCodes.slice(2)[randomInRange(0, 4)],
      responseTime: success 
        ? randomInRange(5, 500) 
        : randomInRange(500, 2000),
      timestamp: timestampInRange(startTime, endTime),
      success,
      errorMessage: success ? undefined : "Mock error message"
    };
  });
};

// Generate mock system metrics
const generateSystemMetrics = (
  config: TestConfig, 
  sampleCount: number
): SystemMetric[] => {
  const startTime = config.testStartTime;
  const endTime = config.testEndTime || startTime + (config.duration * 1000);
  const interval = (endTime - startTime) / sampleCount;
  
  return Array.from({ length: sampleCount }, (_, i) => ({
    timestamp: startTime + (i * interval),
    cpuUsage: 10 + randomInRange(0, 70) + (i / sampleCount) * 10,
    memoryUsage: 20 + randomInRange(0, 40) + (i / sampleCount) * 20,
    activeConnections: config.concurrentUsers * (1 - Math.exp(-i / (sampleCount / 3)))
  }));
};

// Compute aggregated metrics
const computeAggregatedMetrics = (
  requestMetrics: RequestMetric[], 
  config: TestConfig
): AggregatedMetrics => {
  const startTime = config.testStartTime;
  const endTime = config.testEndTime || startTime + (config.duration * 1000);
  const duration = (endTime - startTime) / 1000; // in seconds
  
  const totalRequests = requestMetrics.length;
  const successCount = requestMetrics.filter(m => m.success).length;
  const failureCount = totalRequests - successCount;
  
  const responseTimes = requestMetrics.map(m => m.responseTime).sort((a, b) => a - b);
  const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / totalRequests;
  
  const byEndpoint: Record<string, {
    requestCount: number;
    successCount: number;
    failureCount: number;
    avgResponseTime: number;
  }> = {};
  
  // Group by endpoint
  requestMetrics.forEach(metric => {
    if (!byEndpoint[metric.endpoint]) {
      byEndpoint[metric.endpoint] = {
        requestCount: 0,
        successCount: 0,
        failureCount: 0,
        avgResponseTime: 0
      };
    }
    
    byEndpoint[metric.endpoint].requestCount++;
    if (metric.success) {
      byEndpoint[metric.endpoint].successCount++;
    } else {
      byEndpoint[metric.endpoint].failureCount++;
    }
    
    // Incrementally update the average
    const current = byEndpoint[metric.endpoint];
    current.avgResponseTime = (
      (current.avgResponseTime * (current.requestCount - 1)) + metric.responseTime
    ) / current.requestCount;
  });
  
  return {
    totalRequests,
    successCount,
    failureCount,
    errorRate: (failureCount / totalRequests) * 100,
    avgResponseTime,
    p50ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.5)],
    p90ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.9)],
    p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)],
    minResponseTime: responseTimes[0],
    maxResponseTime: responseTimes[responseTimes.length - 1],
    requestsPerSecond: totalRequests / duration,
    startTime,
    endTime,
    duration,
    byEndpoint
  };
};

export const generateMockTestResult = (): TestResult => {
  const now = Date.now();
  const testDuration = 300; // 5 minutes
  
  const config: TestConfig = {
    id: `test-${now}`,
    name: "API Performance Test",
    url: "https://api.example.com",
    concurrentUsers: 50,
    duration: testDuration,
    rampUpTime: 30,
    requestsPerSecond: 100,
    testStartTime: now - (testDuration * 1000),
    testEndTime: now
  };
  
  const requestCount = config.requestsPerSecond! * testDuration;
  const sampleCount = 60; // One sample per 5 seconds for a 5-minute test
  
  const rawRequestMetrics = generateRequestMetrics(config, requestCount);
  const systemMetrics = generateSystemMetrics(config, sampleCount);
  const metrics = computeAggregatedMetrics(rawRequestMetrics, config);
  
  return {
    config,
    metrics,
    rawRequestMetrics,
    systemMetrics
  };
};

export const getTestHistoryMock = (): TestConfig[] => {
  const now = Date.now();
  
  return [
    {
      id: 'test-1',
      name: 'Production API Benchmark',
      url: 'https://api.production.com',
      concurrentUsers: 100,
      duration: 600, // 10 min
      rampUpTime: 60,
      requestsPerSecond: 200,
      testStartTime: now - (7 * 24 * 60 * 60 * 1000), // 7 days ago
      testEndTime: now - (7 * 24 * 60 * 60 * 1000) + (600 * 1000)
    },
    {
      id: 'test-2',
      name: 'User Authentication Flow',
      url: 'https://api.example.com/auth',
      concurrentUsers: 50,
      duration: 300, // 5 min
      requestsPerSecond: 50,
      testStartTime: now - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      testEndTime: now - (3 * 24 * 60 * 60 * 1000) + (300 * 1000)
    },
    {
      id: 'test-3',
      name: 'API Stress Test',
      url: 'https://api.staging.com',
      concurrentUsers: 200,
      duration: 900, // 15 min
      rampUpTime: 120,
      requestsPerSecond: 500,
      testStartTime: now - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      testEndTime: now - (1 * 24 * 60 * 60 * 1000) + (900 * 1000)
    },
    {
      id: 'test-4',
      name: 'Latest Performance Check',
      url: 'https://api.example.com',
      concurrentUsers: 50,
      duration: 300, // 5 min
      rampUpTime: 30,
      requestsPerSecond: 100,
      testStartTime: now - (6 * 60 * 60 * 1000), // 6 hours ago
      testEndTime: now - (6 * 60 * 60 * 1000) + (300 * 1000)
    }
  ];
};
