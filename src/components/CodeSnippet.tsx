
import React, { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Define Test", id: "define" },
  { name: "Run Test", id: "run" },
  { name: "View Results", id: "results" },
];

const codeSnippets = {
  define: `
# Define your test scenario
from stressapi import TestScenario, RequestPattern

# Create a new test scenario
scenario = TestScenario(
    name="User Authentication Flow",
    base_url="https://api.example.com",
    concurrent_users=100
)

# Add sequential API calls
scenario.add_sequential_pattern(
    name="Login Flow",
    requests=[
        {"endpoint": "/api/login", "method": "POST", "payload": {"username": "{{user.email}}", "password": "{{user.password}}"}},
        {"endpoint": "/api/profile", "method": "GET", "headers": {"Authorization": "Bearer {{response.token}}"}},
        {"endpoint": "/api/settings", "method": "GET", "headers": {"Authorization": "Bearer {{response.token}}"}}
    ],
    variables={
        "user": {"email": "user@example.com", "password": "securepass"}
    }
)

# Add random traffic pattern
scenario.add_random_pattern(
    name="Random Product Views",
    requests=[
        {"endpoint": "/api/products/{{product_id}}", "method": "GET"},
    ],
    variables={
        "product_id": {"type": "random_int", "min": 1, "max": 1000}
    },
    rate=50  # requests per second
)

# Save the scenario
scenario.save("user_auth_test.json")
`,

  run: `
# Run the test
from stressapi import TestRunner

# Load the scenario
runner = TestRunner.from_file("user_auth_test.json")

# Start the test with real-time monitoring
results = runner.start(
    duration_seconds=60,
    ramp_up_seconds=10,
    monitor=True
)

# Test is running with real-time metrics in the dashboard
# Visit http://localhost:8080 to view progress
`,

  results: `
# Analyze the results
from stressapi import ResultsAnalyzer

# Load results from the completed test
analyzer = ResultsAnalyzer(results)

# Generate summary
summary = analyzer.get_summary()
print(f"Test completed with {summary.success_rate:.2f}% success rate")
print(f"Average latency: {summary.avg_latency_ms}ms")
print(f"Peak throughput: {summary.peak_throughput} req/s")

# Find bottlenecks
bottlenecks = analyzer.find_bottlenecks()
for bottleneck in bottlenecks:
    print(f"Bottleneck detected in {bottleneck.endpoint}")
    print(f"  - Issue: {bottleneck.issue}")
    print(f"  - Recommendation: {bottleneck.recommendation}")

# Export detailed report
analyzer.export_report("test_results.html")
`,
};

const CodeSnippet = () => {
  const [activeTab, setActiveTab] = useState("define");
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab as keyof typeof codeSnippets]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = codeRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={codeRef}
      className="section-padding"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 reveal opacity-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-4 text-sm font-medium">
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple to Use, Powerful Results
          </h2>
          <p className="text-muted-foreground">
            StressAPI makes it easy to create, run, and analyze complex load tests with just a few lines of code.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-background/50 backdrop-blur-sm reveal opacity-0">
          <div className="flex items-center border-b border-border px-4">
            <div className="flex space-x-1 py-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex ml-4 border-b-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "py-3 px-4 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="ml-auto pr-2">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-md hover:bg-secondary"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-gray-900 p-4 overflow-auto max-h-[500px]">
            <pre className="text-gray-300 text-sm font-mono">
              <code>{codeSnippets[activeTab as keyof typeof codeSnippets]}</code>
            </pre>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 reveal opacity-0" data-delay="100">
          <div className="p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">Define Your Test</h3>
            <p className="text-sm text-muted-foreground">
              Create test scenarios with sequential, interleaved, or random traffic patterns tailored to your API's needs.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">Run the Test</h3>
            <p className="text-sm text-muted-foreground">
              Execute tests with fine-grained control over concurrency, duration, and ramp-up periods while monitoring in real-time.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">Analyze Results</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed performance metrics, identify bottlenecks, and receive actionable recommendations to optimize your API.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeSnippet;
