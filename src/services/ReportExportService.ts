
import { TestResult } from '../models/PerformanceMetrics';

// Convert TestResult to JSON format
export const exportAsJSON = (result: TestResult): string => {
  return JSON.stringify(result, null, 2);
};

// Convert TestResult to CSV format
export const exportAsCSV = (result: TestResult): string => {
  // Header row
  let csv = 'Endpoint,Method,Status Code,Response Time (ms),Timestamp,Success\n';
  
  // Convert request metrics to CSV rows
  result.rawRequestMetrics.forEach(metric => {
    const row = [
      metric.endpoint,
      metric.method,
      metric.statusCode,
      metric.responseTime,
      new Date(metric.timestamp).toISOString(),
      metric.success
    ].join(',');
    
    csv += row + '\n';
  });
  
  return csv;
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Convert TestResult to text summary for PDF export
export const generateReportSummary = (result: TestResult): string => {
  const { config, metrics } = result;
  
  return `
StressAPI Performance Test Report
================================

Test Configuration:
------------------
Test Name: ${config.name}
API URL: ${config.url}
Concurrent Users: ${config.concurrentUsers}
Test Duration: ${config.duration} seconds
${config.rampUpTime ? `Ramp-up Time: ${config.rampUpTime} seconds` : ''}
${config.requestsPerSecond ? `Target RPS: ${config.requestsPerSecond}` : ''}
Test Started: ${formatDate(config.testStartTime)}
Test Completed: ${formatDate(config.testEndTime || 0)}

Summary Results:
--------------
Total Requests: ${metrics.totalRequests}
Success Rate: ${(100 - metrics.errorRate).toFixed(2)}%
Error Rate: ${metrics.errorRate.toFixed(2)}%
Requests Per Second: ${metrics.requestsPerSecond.toFixed(2)}

Response Time Statistics:
-----------------------
Average: ${metrics.avgResponseTime.toFixed(2)} ms
Median (P50): ${metrics.p50ResponseTime.toFixed(2)} ms
P90: ${metrics.p90ResponseTime.toFixed(2)} ms
P99: ${metrics.p99ResponseTime.toFixed(2)} ms
Min: ${metrics.minResponseTime.toFixed(2)} ms
Max: ${metrics.maxResponseTime.toFixed(2)} ms

Endpoint Performance:
-------------------
${Object.entries(metrics.byEndpoint).map(([endpoint, data]) => 
  `${endpoint}:
   - Requests: ${data.requestCount}
   - Success Rate: ${((data.successCount / data.requestCount) * 100).toFixed(2)}%
   - Avg Response Time: ${data.avgResponseTime.toFixed(2)} ms
  `
).join('\n')}
`;
};

// Function to trigger CSV file download
export const downloadCSV = (result: TestResult, filename = 'stress-api-report.csv'): void => {
  const csvContent = exportAsCSV(result);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to trigger JSON file download
export const downloadJSON = (result: TestResult, filename = 'stress-api-report.json'): void => {
  const jsonContent = exportAsJSON(result);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
