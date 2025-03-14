# StressAPI

A high-performance command-line load testing tool built specifically for FastAPI applications. Simulate real-world traffic patterns, stress-test endpoints, and uncover performance bottlenecks with ease.

## Features

- **Multiple Traffic Patterns**: 
  - Sequential: Requests in strict order (A → B → C)
  - Interleaved: Multiple users with overlapping requests
  - Random: Unpredictable intervals and patterns
- **Rich Terminal UI**: Beautiful progress bars and result tables
- **Detailed Metrics**: Latency, status codes, and error analysis
- **Easy to Use**: Simple CLI interface with sensible defaults

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stress-api.git
cd stress-api

# Install the package
pip install -e .
```

## Usage

Basic usage:
```bash
# Run a simple sequential test
stressapi test http://localhost:8000/api/endpoint

# Run an interleaved test with 5 concurrent users
stressapi test http://localhost:8000/api/endpoint -p interleaved -u 5

# Run a random traffic test with 1000 requests
stressapi test http://localhost:8000/api/endpoint -p random -n 1000
```

Full command options:
```bash
Options:
  -p, --pattern TEXT     Traffic pattern: sequential, interleaved, or random
                        [default: sequential]
  -n, --requests INTEGER  Number of requests to make [default: 100]
  -u, --users INTEGER    Number of concurrent users [default: 1]
  -i, --interval FLOAT   Interval between requests in seconds [default: 0.1]
  --help                Show this message and exit.
```

## Example Output

The tool provides rich terminal output with:
- Test progress with a progress bar
- Summary statistics (total requests, success/failure rates)
- Latency metrics (min, max, average, p95)
- Status code distribution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
