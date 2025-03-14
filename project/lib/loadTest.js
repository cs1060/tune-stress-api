const fetch = require('node-fetch');
const logger = require('./logger');

class LoadTest {
  constructor(config) {
    this.url = config.url;
    this.pattern = config.pattern;
    this.duration = config.duration;
    this.requestsPerSecond = config.requestsPerSecond;
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      latencies: [],
      errors: []
    };
  }

  async makeRequest() {
    const start = Date.now();
    try {
      const response = await fetch(this.url);
      const latency = Date.now() - start;
      
      this.results.totalRequests++;
      if (response.ok) {
        this.results.successfulRequests++;
        this.results.latencies.push(latency);
      } else {
        this.results.failedRequests++;
        this.results.errors.push(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.results.failedRequests++;
      this.results.errors.push(error.message);
    }
  }

  async run() {
    logger.info(`Starting load test for ${this.url}`);
    
    const interval = 1000 / this.requestsPerSecond;
    const endTime = Date.now() + (this.duration * 1000);

    while (Date.now() < endTime) {
      await this.makeRequest();
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    return this.generateReport();
  }

  generateReport() {
    const avgLatency = this.results.latencies.reduce((a, b) => a + b, 0) / this.results.latencies.length;
    
    return {
      summary: {
        totalRequests: this.results.totalRequests,
        successRate: (this.results.successfulRequests / this.results.totalRequests) * 100,
        averageLatency: avgLatency,
        errorRate: (this.results.failedRequests / this.results.totalRequests) * 100
      },
      errors: this.results.errors
    };
  }
}

function createLoadTest(config) {
  return new LoadTest(config);
}

module.exports = { createLoadTest };