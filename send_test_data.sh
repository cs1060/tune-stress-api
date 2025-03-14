#!/bin/bash

# Send metrics for different endpoints with varying response times and resource usage
for i in {1..50}; do
    # Simulate /users endpoint
    curl -X POST "http://localhost:8000/api/tests/1/metrics" \
        -H "Content-Type: application/json" \
        -d "{
            \"endpoint\": \"/users\",
            \"response_time\": $((50 + RANDOM % 150)),
            \"status_code\": 200,
            \"cpu_usage\": $((40 + RANDOM % 30)),
            \"memory_usage\": $((200 + RANDOM % 100))
        }"

    # Simulate /products endpoint with occasional errors
    status_code=200
    if [ $((RANDOM % 10)) -eq 0 ]; then
        status_code=500
    fi
    
    curl -X POST "http://localhost:8000/api/tests/1/metrics" \
        -H "Content-Type: application/json" \
        -d "{
            \"endpoint\": \"/products\",
            \"response_time\": $((100 + RANDOM % 200)),
            \"status_code\": $status_code,
            \"cpu_usage\": $((50 + RANDOM % 20)),
            \"memory_usage\": $((250 + RANDOM % 150)),
            \"error\": $([ $status_code -eq 500 ] && echo '\"Internal Server Error\"' || echo 'null')
        }"

    sleep 0.1
done

# Finalize the test run
curl -X POST "http://localhost:8000/api/tests/1/finalize"
