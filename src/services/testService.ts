
interface Endpoint {
  path: string;
  method: string;
  headers?: Record<string, string>;
  payload?: any;
}

interface TestConfig {
  baseUrl: string;
  workers: number;
  duration: string;
  pattern: string;
  rateLimit: number;
  endpoints: Endpoint[];
}

interface TestResult {
  id: string;
  status: string;
  summary?: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
}

// This is a mock implementation for the frontend prototype
// In a real app, this would connect to your backend API
export const runTest = async (config: TestConfig): Promise<TestResult> => {
  console.log('Starting test with config:', config);
  
  // Simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, we'll just simulate a successful test response
  // In a real app, this would come from your backend
  return {
    id: `test-${Date.now()}`,
    status: 'running',
    summary: {
      totalRequests: 0,
      successRate: 0,
      avgResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0
    }
  };
};

export const getTestStatus = async (testId: string): Promise<TestResult> => {
  console.log('Getting status for test:', testId);
  
  // Simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate a response with random metrics
  return {
    id: testId,
    status: Math.random() > 0.3 ? 'completed' : 'running',
    summary: {
      totalRequests: Math.floor(Math.random() * 10000),
      successRate: 95 + Math.random() * 5,
      avgResponseTime: Math.random() * 200,
      p95ResponseTime: Math.random() * 400,
      p99ResponseTime: Math.random() * 600
    }
  };
};
