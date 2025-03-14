
import { TestConfig, TestResult, TimeSeriesPoint } from "../interfaces/test";

export class TestService {
  private static instance: TestService;
  private testHistory: TestResult[] = [];
  private activeTest: TestResult | null = null;
  private abortController: AbortController | null = null;

  private constructor() {}

  public static getInstance(): TestService {
    if (!TestService.instance) {
      TestService.instance = new TestService();
    }
    return TestService.instance;
  }

  public async runTest(config: TestConfig): Promise<TestResult> {
    // Create a unique ID for this test
    const testId = crypto.randomUUID();
    
    // Setup abort controller for cancellation
    this.abortController = new AbortController();
    
    // Initialize test result
    this.activeTest = {
      id: testId,
      timestamp: Date.now(),
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      status: 'running',
      statusCodes: {},
      timeSeries: []
    };

    try {
      // Calculate how many requests to make based on concurrentUsers and duration
      const startTime = Date.now();
      const endTime = startTime + (config.duration * 1000);
      let totalResponseTime = 0;
      const timeSeries: TimeSeriesPoint[] = [];
      
      // Run concurrent requests
      const runBatch = async () => {
        const requests = [];
        for (let i = 0; i < config.concurrentUsers; i++) {
          if (this.abortController?.signal.aborted) break;
          if (Date.now() >= endTime) break;
          
          requests.push(this.makeRequest(config, timeSeries, totalResponseTime));
        }
        
        await Promise.allSettled(requests);
        
        if (Date.now() < endTime && !this.abortController?.signal.aborted) {
          // Schedule next batch
          setTimeout(() => runBatch(), 100);
        } else {
          // Finalize test
          this.finalizeTest(startTime);
        }
      };
      
      // Start the first batch
      await runBatch();
      
      return this.activeTest;
    } catch (error) {
      console.error("Test execution error:", error);
      if (this.activeTest) {
        this.activeTest.status = 'failed';
        this.activeTest.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.testHistory.push({...this.activeTest});
      }
      throw error;
    }
  }
  
  private async makeRequest(
    config: TestConfig, 
    timeSeries: TimeSeriesPoint[],
    totalResponseTime: number
  ): Promise<void> {
    if (!this.activeTest) return;
    
    const requestStart = Date.now();
    try {
      const requestOptions: RequestInit = {
        method: config.method,
        headers: config.headers ? new Headers(config.headers) : undefined,
        body: config.body && (config.method !== 'GET') ? config.body : undefined,
        signal: this.abortController?.signal
      };
      
      const response = await fetch(config.url, requestOptions);
      const requestEnd = Date.now();
      const responseTime = requestEnd - requestStart;
      
      // Update test metrics
      this.activeTest.totalRequests++;
      this.activeTest.successfulRequests++;
      
      // Update response time stats
      this.activeTest.minResponseTime = Math.min(this.activeTest.minResponseTime, responseTime);
      this.activeTest.maxResponseTime = Math.max(this.activeTest.maxResponseTime, responseTime);
      totalResponseTime += responseTime;
      this.activeTest.avgResponseTime = totalResponseTime / this.activeTest.totalRequests;
      
      // Track status code
      const statusCode = response.status.toString();
      this.activeTest.statusCodes[statusCode] = (this.activeTest.statusCodes[statusCode] || 0) + 1;
      
      // Add to time series
      timeSeries.push({
        timestamp: requestEnd,
        responseTime,
        statusCode: response.status
      });
      
      this.activeTest.timeSeries = [...timeSeries];
    } catch (error) {
      const requestEnd = Date.now();
      this.activeTest.totalRequests++;
      this.activeTest.failedRequests++;
      
      // Add failed request to time series
      timeSeries.push({
        timestamp: requestEnd,
        responseTime: requestEnd - requestStart,
        statusCode: 0 // 0 indicates failed request
      });
      
      this.activeTest.timeSeries = [...timeSeries];
      console.error("Request failed:", error);
    }
  }
  
  private finalizeTest(startTime: number): void {
    if (!this.activeTest) return;
    
    const totalTime = (Date.now() - startTime) / 1000; // in seconds
    this.activeTest.requestsPerSecond = this.activeTest.totalRequests / totalTime;
    this.activeTest.status = 'completed';
    
    // Add to history
    this.testHistory.push({...this.activeTest});
    this.abortController = null;
  }
  
  public cancelTest(): void {
    if (this.abortController) {
      this.abortController.abort();
      
      if (this.activeTest) {
        this.activeTest.status = 'failed';
        this.activeTest.errorMessage = 'Test cancelled by user';
        this.testHistory.push({...this.activeTest});
        this.activeTest = null;
      }
    }
  }
  
  public getActiveTest(): TestResult | null {
    return this.activeTest;
  }
  
  public getTestHistory(): TestResult[] {
    return [...this.testHistory];
  }
  
  public clearTestHistory(): void {
    this.testHistory = [];
  }
  
  // Simulates a test for demo purposes
  public async simulateTest(config: TestConfig): Promise<TestResult> {
    const testId = crypto.randomUUID();
    
    // Create a simulated test result
    const simulatedResult: TestResult = {
      id: testId,
      timestamp: Date.now(),
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      status: 'running',
      statusCodes: {},
      timeSeries: []
    };
    
    this.activeTest = simulatedResult;
    
    // Simulate requests over time
    const startTime = Date.now();
    const statusCodes = [200, 200, 200, 200, 201, 204, 400, 404, 500];
    const updateInterval = 100; // 100ms
    const totalUpdates = config.duration * 10; // 10 updates per second
    
    return new Promise((resolve) => {
      let updateCount = 0;
      
      const updateSimulation = () => {
        if (!this.activeTest) return;
        
        // Simulate new requests in this interval
        const newRequests = Math.floor(Math.random() * config.concurrentUsers) + 1;
        let totalResponseTimeIncrement = 0;
        
        for (let i = 0; i < newRequests; i++) {
          // Simulate response time between 50ms and 500ms
          const responseTime = Math.floor(Math.random() * 450) + 50;
          totalResponseTimeIncrement += responseTime;
          
          // Randomly pick a status code, with higher probability for 200
          const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)].toString();
          const isSuccess = statusCode.startsWith('2');
          
          // Update metrics
          this.activeTest.totalRequests++;
          if (isSuccess) {
            this.activeTest.successfulRequests++;
          } else {
            this.activeTest.failedRequests++;
          }
          
          // Update response time stats
          this.activeTest.minResponseTime = Math.min(this.activeTest.minResponseTime, responseTime);
          this.activeTest.maxResponseTime = Math.max(this.activeTest.maxResponseTime, responseTime);
          
          // Track status code
          this.activeTest.statusCodes[statusCode] = (this.activeTest.statusCodes[statusCode] || 0) + 1;
          
          // Add to time series
          this.activeTest.timeSeries.push({
            timestamp: Date.now(),
            responseTime,
            statusCode: parseInt(statusCode)
          });
        }
        
        // Update average response time
        const totalResponseTime = 
          (this.activeTest.avgResponseTime * (this.activeTest.totalRequests - newRequests)) + 
          totalResponseTimeIncrement;
        this.activeTest.avgResponseTime = totalResponseTime / this.activeTest.totalRequests;
        
        updateCount++;
        
        if (updateCount < totalUpdates) {
          setTimeout(updateSimulation, updateInterval);
        } else {
          // Finalize test
          const totalTime = (Date.now() - startTime) / 1000; // in seconds
          this.activeTest.requestsPerSecond = this.activeTest.totalRequests / totalTime;
          this.activeTest.status = 'completed';
          
          // Add to history
          this.testHistory.push({...this.activeTest});
          const finalResult = {...this.activeTest};
          this.activeTest = null;
          
          resolve(finalResult);
        }
      };
      
      // Start the simulation
      updateSimulation();
    });
  }
}

export default TestService.getInstance();
