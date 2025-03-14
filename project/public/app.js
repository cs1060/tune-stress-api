document.addEventListener('DOMContentLoaded', () => {
  const startTestButton = document.getElementById('startTest');
  
  startTestButton.addEventListener('click', async () => {
    try {
      startTestButton.disabled = true;
      startTestButton.textContent = 'Running Test...';

      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'http://localhost:3000/api/health', // Example endpoint to test
          pattern: 'sequential',
          duration: 10, // 10 seconds test
          requestsPerSecond: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      
      alert(
        `Test Results:\n` +
        `Success Rate: ${results.summary.successRate.toFixed(2)}%\n` +
        `Average Latency: ${results.summary.averageLatency.toFixed(2)}ms\n` +
        `Total Requests: ${results.summary.totalRequests}\n` +
        `Error Rate: ${results.summary.errorRate.toFixed(2)}%`
      );
    } catch (error) {
      alert('Error running test: ' + error.message);
    } finally {
      startTestButton.disabled = false;
      startTestButton.textContent = 'Run a Test Now';
    }
  });
});

// WebSocket connection for real-time updates
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received test update:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};