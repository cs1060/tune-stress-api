// Initialize charts and data
let responseTimeChart;

// Fetch and update metrics
async function fetchMetrics() {
    try {
        const response = await fetch('/api/metrics/summary');
        const data = await response.json();
        
        if (response.ok) {
            updateDashboard(data);
        } else {
            console.error('Failed to fetch metrics:', data.error);
        }
    } catch (error) {
        console.error('Error fetching metrics:', error);
    }
}

function updateDashboard(data) {
    // Update summary statistics
    document.getElementById('totalRequests').textContent = data.total_requests;
    document.getElementById('avgResponseTime').textContent = `${data.average_response_time} ms`;
    document.getElementById('successRate').textContent = `${data.success_rate}%`;
    document.getElementById('activeEndpoints').textContent = Object.keys(data.metrics_by_endpoint).length;

    // Update endpoint table
    updateEndpointTable(data.metrics_by_endpoint);

    // Update response time chart
    updateResponseTimeChart(data.metrics_by_endpoint);
}

function updateEndpointTable(endpointMetrics) {
    const tableBody = document.getElementById('endpointTableBody');
    tableBody.innerHTML = '';

    Object.entries(endpointMetrics).forEach(([endpoint, metrics]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${endpoint}</td>
            <td class="px-6 py-4 whitespace-nowrap">${metrics.total_requests}</td>
            <td class="px-6 py-4 whitespace-nowrap">${metrics.avg_response_time.toFixed(2)} ms</td>
            <td class="px-6 py-4 whitespace-nowrap">${metrics.success_rate.toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateResponseTimeChart(endpointMetrics) {
    const endpoints = Object.keys(endpointMetrics);
    const responseTimes = endpoints.map(endpoint => endpointMetrics[endpoint].avg_response_time);

    if (!responseTimeChart) {
        const ctx = document.getElementById('responseTimeChart').getContext('2d');
        responseTimeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: endpoints,
                datasets: [{
                    label: 'Average Response Time (ms)',
                    data: responseTimes,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Response Time (ms)'
                        }
                    }
                }
            }
        });
    } else {
        responseTimeChart.data.labels = endpoints;
        responseTimeChart.data.datasets[0].data = responseTimes;
        responseTimeChart.update();
    }
}

// Fetch metrics every 5 seconds
setInterval(fetchMetrics, 5000);

// Initial fetch
fetchMetrics();
