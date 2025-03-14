import typer
import asyncio
from rich.console import Console
from rich.table import Table
from typing import Optional
from ..core.load_tester import LoadTester

app = typer.Typer(help="StressAPI - High-Performance Load Testing Tool for FastAPI")
console = Console()

@app.command()
def test(
    target_url: str = typer.Argument(..., help="Target URL to test"),
    pattern: str = typer.Option(
        "sequential",
        "--pattern", "-p",
        help="Traffic pattern: sequential, interleaved, or random"
    ),
    requests: int = typer.Option(
        100,
        "--requests", "-n",
        help="Number of requests to make"
    ),
    users: int = typer.Option(
        1,
        "--users", "-u",
        help="Number of concurrent users (for interleaved pattern)"
    ),
    interval: float = typer.Option(
        0.1,
        "--interval", "-i",
        help="Interval between requests in seconds"
    )
):
    """Run a load test against a target URL."""
    console.print(f"\n[bold cyan]StressAPI Load Test[/bold cyan]")
    console.print(f"Target URL: {target_url}")
    console.print(f"Pattern: {pattern}")
    console.print(f"Requests: {requests}")
    console.print(f"Users: {users}")
    console.print(f"Interval: {interval}s\n")

    tester = LoadTester(
        target_url=target_url,
        num_requests=requests,
        concurrent_users=users,
        request_interval=interval
    )

    try:
        results = asyncio.run(tester.run_test(pattern))
        
        # Summary Table
        summary_table = Table(title="Test Summary")
        summary_table.add_column("Metric", style="cyan")
        summary_table.add_column("Value", style="green")
        
        for key, value in results["summary"].items():
            summary_table.add_row(
                key.replace("_", " ").title(),
                str(value)
            )
        console.print(summary_table)

        # Latency Table
        latency_table = Table(title="Latency Statistics (seconds)")
        latency_table.add_column("Metric", style="cyan")
        latency_table.add_column("Value", style="green")
        
        for key, value in results["latency"].items():
            latency_table.add_row(
                key.upper(),
                f"{value:.3f}"
            )
        console.print(latency_table)

        # Status Codes Table
        status_table = Table(title="Status Codes")
        status_table.add_column("Code", style="cyan")
        status_table.add_column("Count", style="green")
        
        for code, count in results["status_codes"].items():
            status_table.add_row(code, str(count))
        console.print(status_table)

    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {str(e)}")
        raise typer.Exit(1)

@app.command()
def version():
    """Show the version of StressAPI."""
    console.print("[bold cyan]StressAPI v0.1.0[/bold cyan]")

if __name__ == "__main__":
    app()
