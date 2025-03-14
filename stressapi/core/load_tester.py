import asyncio
import time
from typing import List, Dict, Optional
from dataclasses import dataclass
import httpx
import random
from rich.progress import Progress, TaskID

@dataclass
class RequestResult:
    latency: float
    status_code: int
    timestamp: float
    error: Optional[str] = None

class LoadTester:
    def __init__(self, target_url: str, num_requests: int = 100, 
                 concurrent_users: int = 1, request_interval: float = 0.1):
        self.target_url = target_url
        self.num_requests = num_requests
        self.concurrent_users = concurrent_users
        self.request_interval = request_interval
        self.results: List[RequestResult] = []
        
    async def make_request(self) -> RequestResult:
        async with httpx.AsyncClient() as client:
            start_time = time.time()
            try:
                response = await client.get(self.target_url)
                latency = time.time() - start_time
                return RequestResult(
                    latency=latency,
                    status_code=response.status_code,
                    timestamp=start_time
                )
            except Exception as e:
                return RequestResult(
                    latency=time.time() - start_time,
                    status_code=500,
                    timestamp=start_time,
                    error=str(e)
                )

    async def sequential_traffic(self, progress: Progress, task: TaskID) -> List[RequestResult]:
        results = []
        for _ in range(self.num_requests):
            result = await self.make_request()
            results.append(result)
            progress.update(task, advance=1)
            await asyncio.sleep(self.request_interval)
        return results

    async def interleaved_traffic(self, progress: Progress, task: TaskID) -> List[RequestResult]:
        tasks = []
        requests_per_user = self.num_requests // self.concurrent_users
        
        async def user_sequence():
            user_results = []
            for _ in range(requests_per_user):
                result = await self.make_request()
                user_results.append(result)
                progress.update(task, advance=1)
                await asyncio.sleep(self.request_interval)
            return user_results

        for _ in range(self.concurrent_users):
            tasks.append(asyncio.create_task(user_sequence()))
        
        all_results = await asyncio.gather(*tasks)
        return [result for user_results in all_results for result in user_results]

    async def random_traffic(self, progress: Progress, task: TaskID) -> List[RequestResult]:
        results = []
        for _ in range(self.num_requests):
            result = await self.make_request()
            results.append(result)
            progress.update(task, advance=1)
            await asyncio.sleep(random.uniform(0, self.request_interval * 2))
        return results

    def generate_report(self) -> Dict:
        if not self.results:
            return {"error": "No test results available"}

        latencies = [r.latency for r in self.results]
        status_codes = [r.status_code for r in self.results]
        errors = [r for r in self.results if r.error is not None]

        return {
            "summary": {
                "total_requests": len(self.results),
                "successful_requests": len([r for r in self.results if 200 <= r.status_code < 300]),
                "failed_requests": len([r for r in self.results if r.status_code >= 400]),
                "total_errors": len(errors)
            },
            "latency": {
                "min": min(latencies),
                "max": max(latencies),
                "avg": sum(latencies) / len(latencies),
                "p95": sorted(latencies)[int(len(latencies) * 0.95)]
            },
            "status_codes": {
                str(code): status_codes.count(code)
                for code in set(status_codes)
            }
        }

    async def run_test(self, traffic_pattern: str = "sequential") -> Dict:
        with Progress() as progress:
            task = progress.add_task(
                f"[cyan]Running {traffic_pattern} traffic test...",
                total=self.num_requests
            )
            
            if traffic_pattern == "sequential":
                self.results = await self.sequential_traffic(progress, task)
            elif traffic_pattern == "interleaved":
                self.results = await self.interleaved_traffic(progress, task)
            elif traffic_pattern == "random":
                self.results = await self.random_traffic(progress, task)
            else:
                raise ValueError(f"Unknown traffic pattern: {traffic_pattern}")

        return self.generate_report()
