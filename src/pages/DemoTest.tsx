
import React, { useState } from "react";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DemoTest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<null | {
    successRate: number;
    avgLatency: number;
    maxRps: number;
    bottleneck: string | null;
  }>(null);
  
  const [formData, setFormData] = useState({
    url: "https://api.example.com",
    endpoint: "/users",
    method: "GET",
    concurrentUsers: 100,
    duration: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const runTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsTestRunning(true);
    
    // Simulate API test with a delay
    setTimeout(() => {
      setIsLoading(false);
      setIsTestRunning(true);
      
      // Simulate test running progress
      setTimeout(() => {
        setIsTestRunning(false);
        setTestResult({
          successRate: Math.floor(80 + Math.random() * 19),
          avgLatency: Math.floor(20 + Math.random() * 150),
          maxRps: Math.floor(200 + Math.random() * 600),
          bottleneck: Math.random() > 0.5 ? "Database connection pool" : null
        });
      }, 5000);
    }, 2000);
  };

  const resetTest = () => {
    setTestResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto pt-6 pb-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Demo Test</h1>
            <p className="text-muted-foreground mb-8">
              This is a simulated demo of StressAPI. In a real implementation, this would connect to your actual FastAPI endpoints.
            </p>

            <div className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6">
              <form onSubmit={runTest}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-1">
                      API Base URL
                    </label>
                    <input
                      type="text"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="endpoint" className="block text-sm font-medium mb-1">
                      Endpoint
                    </label>
                    <input
                      type="text"
                      id="endpoint"
                      name="endpoint"
                      value={formData.endpoint}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="method" className="block text-sm font-medium mb-1">
                      Method
                    </label>
                    <select
                      id="method"
                      name="method"
                      value={formData.method}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="concurrentUsers" className="block text-sm font-medium mb-1">
                      Concurrent Users
                    </label>
                    <input
                      type="number"
                      id="concurrentUsers"
                      name="concurrentUsers"
                      value={formData.concurrentUsers}
                      onChange={handleChange}
                      min="1"
                      max="1000"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="5"
                      max="300"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    {!testResult ? (
                      <button
                        type="submit"
                        disabled={isLoading || isTestRunning}
                        className="w-full button-primary"
                      >
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Setting Up Test..." : isTestRunning ? "Running Test..." : "Run Test"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={resetTest}
                        className="w-full button-secondary"
                      >
                        Reset & Run New Test
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div>
            {isTestRunning ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-16 w-16 mx-auto animate-spin text-primary mb-6" />
                  <h2 className="text-xl font-medium mb-2">Running Test...</h2>
                  <p className="text-muted-foreground">
                    Simulating {formData.concurrentUsers} concurrent users for {formData.duration} seconds
                  </p>
                </div>
              </div>
            ) : testResult ? (
              <div className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6 h-full">
                <h2 className="text-xl font-medium mb-6">Test Results</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                      <div className="text-2xl font-semibold">{testResult.successRate}%</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <div className="text-sm text-muted-foreground mb-1">Avg. Latency</div>
                      <div className="text-2xl font-semibold">{testResult.avgLatency} ms</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="text-sm text-muted-foreground mb-1">Max RPS</div>
                      <div className="text-2xl font-semibold">{testResult.maxRps}</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <div className="text-2xl font-semibold">
                        {testResult.successRate > 95 ? "Excellent" : testResult.successRate > 85 ? "Good" : "Needs Improvement"}
                      </div>
                    </div>
                  </div>
                  
                  {testResult.bottleneck && (
                    <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
                      <h3 className="font-medium mb-1">Detected Bottleneck:</h3>
                      <p>{testResult.bottleneck}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommendation: Consider increasing your connection pool size or optimizing your database queries.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Note: This is a simulated demo. In a real StressAPI implementation, you would see detailed metrics, charts, and specific optimization recommendations.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">Ready to Test</h2>
                  <p className="text-muted-foreground">
                    Configure your test parameters and click "Run Test" to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTest;
