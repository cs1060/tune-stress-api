// Dashboard functionality
let currentTestRun = null;

async function loadTestRuns() {
    try {
        const response = await axios.get('/api/tests');
        const testRuns = response.data;
        const select = document.getElementById('testRunSelect');
        select.innerHTML = '<option value="">Select a test run...</option>';
        testRuns.forEach(run => {
            const option = document.createElement('option');
            option.value = run.id;
            option.textContent = `Test Run ${run.id} - ${new Date(run.start_time).toLocaleString()}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading test runs:', error);
    }
}

async function loadTestRun() {
    const testRunId = document.getElementById('testRunSelect').value;
    if (!testRunId) return;

    try {
        const response = await axios.get(`/api/reports/${testRunId}`);
        currentTestRun = response.data.test_run;
        updateDashboard();
        loadVisualizations(testRunId);
    } catch (error) {
        console.error('Error loading test run:', error);
    }
}

function updateDashboard() {
    if (!currentTestRun) return;

    // Update request stats
    document.getElementById('totalRequests').textContent = currentTestRun.total_requests;
    document.getElementById('successRate').textContent = 
        `${((currentTestRun.successful_requests / currentTestRun.total_requests) * 100).toFixed(2)}%`;
    document.getElementById('avgResponseTime').textContent = 
        currentTestRun.avg_response_time.toFixed(2);

    // Update performance stats
    document.getElementById('p50').textContent = currentTestRun.p50_response_time.toFixed(2);
    document.getElementById('p90').textContent = currentTestRun.p90_response_time.toFixed(2);
    document.getElementById('p99').textContent = currentTestRun.p99_response_time.toFixed(2);

    // Update resource stats
    document.getElementById('avgCpu').textContent = currentTestRun.avg_cpu_usage.toFixed(2);
    document.getElementById('avgMemory').textContent = currentTestRun.avg_memory_usage.toFixed(2);
    document.getElementById('duration').textContent = currentTestRun.duration.toFixed(2);
}

async function loadVisualizations(testRunId) {
    try {
        const response = await axios.get(`/api/visualizations/${testRunId}`);
        const visualizations = response.data;

        Plotly.newPlot('responseTimeDistribution', visualizations.response_time_dist.data,
                       visualizations.response_time_dist.layout);
        Plotly.newPlot('errorRateGraph', visualizations.error_rate.data,
                       visualizations.error_rate.layout);
        Plotly.newPlot('resourceUsageGraph', visualizations.resource_usage.data,
                       visualizations.resource_usage.layout);
    } catch (error) {
        console.error('Error loading visualizations:', error);
    }
}

async function exportReport(format) {
    if (!currentTestRun) {
        alert('Please select a test run first');
        return;
    }

    try {
        const response = await axios.get(
            `/api/reports/${currentTestRun.id}?format=${format}`,
            { responseType: format === 'csv' ? 'blob' : 'json' }
        );

        if (format === 'csv') {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${currentTestRun.id}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const link = document.createElement('a');
            link.href = dataUri;
            link.setAttribute('download', `report_${currentTestRun.id}.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    } catch (error) {
        console.error('Error exporting report:', error);
        alert('Error exporting report. Please try again.');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadTestRuns();
});
