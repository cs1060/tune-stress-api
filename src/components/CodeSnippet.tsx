
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  
  const tabs = [
    { id: 'python', label: 'Python' },
    { id: 'curl', label: 'cURL' },
    { id: 'js', label: 'JavaScript' }
  ];
  
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  
  const codeSnippets = {
    python: `# Install the StressAPI client
# pip install stressapi-client

from stressapi import FastAPITest

# Create and configure your test
test = FastAPITest(
    base_url="https://api.example.com",
    workers=100,
    duration="2m",
    rate_limit=200  # 200 requests per second
)

# Define your endpoints
test.add_endpoint("/users", method="GET")
test.add_endpoint("/products", method="POST", 
                  payload={"name": "New Product", "price": 29.99})

# Run test with a specific traffic pattern
results = test.run(pattern="interleaved")

# Export detailed results
results.export_csv("performance_results.csv")
`,
    curl: `# Install the StressAPI CLI
# curl -sSL https://get.stressapi.com | sh

# Run a basic test
stressapi run \\
  --url https://api.example.com \\
  --workers 50 \\
  --duration 30s \\
  --pattern random \\
  --rate-limit 100 \\
  --output json

# Run with a test definition file
stressapi run --config stress_test.yaml
`,
    js: `// Install the StressAPI client
// npm install stressapi-client

import { FastAPITest } from 'stressapi-client';

// Create and configure the test
const test = new FastAPITest({
  baseUrl: 'https://api.example.com',
  workers: 50,
  duration: '1m',
  rateLimit: 150  // 150 requests per second
});

// Define endpoints to test
test.addEndpoint('/users', { method: 'GET' });
test.addEndpoint('/auth/login', { 
  method: 'POST',
  payload: { username: 'test', password: 'password' }
});

// Run test and process results
test.run({ pattern: 'sequential' })
  .then(results => {
    console.log('Average response time:', results.avgResponseTime);
    results.exportJson('./performance_report.json');
  });
`
  };
  
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[activeTab as keyof typeof codeSnippets]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="section" id="code-example">
      <div className="container-content px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Simple Integration
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Easy to Use, Powerful to Deploy</h2>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
              Our simple API lets you create complex test scenarios with just a few lines of code. 
              Available in multiple languages to fit your workflow.
            </p>
          </div>
          
          <div className="glass rounded-2xl border border-white/20 shadow-lg overflow-hidden animate-on-scroll">
            <div className="bg-secondary/70 p-2 flex items-center justify-between">
              <div className="flex gap-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/60 hover:text-foreground/90 hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleCopyClick}
                className="flex items-center gap-1 text-foreground/60 hover:text-primary px-3 py-1 rounded transition-colors text-sm mr-2"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="bg-card/20 p-6 text-left overflow-auto">
              <pre className="font-mono text-sm text-foreground/90">
                <code>
                  {codeSnippets[activeTab as keyof typeof codeSnippets]}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeSnippet;
