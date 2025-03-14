
import React, { useEffect, useRef } from 'react';
import { Activity, BarChart4, Bolt, Clock, Code2, LineChart, Layers, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: <BarChart4 className="w-6 h-6" />,
    title: "Real-time Performance Metrics",
    description: "Monitor latency, throughput, and error rates as they happen with our advanced real-time dashboard."
  },
  {
    icon: <Bolt className="w-6 h-6" />,
    title: "Multiple Traffic Patterns",
    description: "Test with sequential, interleaved, or random traffic patterns to simulate real-world scenarios."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Bottleneck Detection",
    description: "Automatically identify performance bottlenecks and receive actionable recommendations for improvement."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Scheduled Tests",
    description: "Set up recurring tests to monitor your API's performance over time and catch regressions early."
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Custom Test Scenarios",
    description: "Define complex test scenarios with dependencies between requests and realistic user behaviors."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "CI/CD Integration",
    description: "Integrate performance testing into your CI/CD pipeline with our GitHub Actions integration."
  }
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px' 
      }
    );
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="features" className="section bg-secondary/30" ref={sectionRef}>
      <div className="container-content px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Tools for Serious Performance Testing</h2>
          <p className="text-foreground/70 text-lg">
            StressAPI offers a comprehensive suite of features designed to help you understand and improve your FastAPI application's performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-lg animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-primary/10 rounded-xl w-12 h-12 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 animate-on-scroll">
          <div className="glass rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  Real-Time Performance
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Monitor Your API's Vital Signs in Real-Time</h3>
                <p className="text-foreground/70 mb-6">
                  Watch as your API handles the load, with millisecond-precision metrics and beautiful visualizations that update in real-time.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Response time percentiles (p50, p95, p99)",
                    "Requests per second throughput",
                    "Error rate monitoring",
                    "CPU and memory usage tracking"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1">
                <div className="glass-dark rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                  <div className="bg-secondary/50 p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-foreground/60 font-mono flex-1 text-center">
                      performance_dashboard.py
                    </div>
                  </div>
                  <div className="bg-card/30 p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-primary font-medium">Response Time (ms)</h4>
                      <div className="flex items-end justify-center h-40 mt-4 gap-2">
                        {[35, 42, 28, 65, 72, 45, 50, 58, 42, 38, 45, 60].map((value, i) => (
                          <div key={i} className="w-6 relative group">
                            <div 
                              className="absolute bottom-0 w-full bg-primary/80 rounded-t transition-all duration-300 group-hover:bg-primary"
                              style={{ height: `${value * 100 / 80}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-12 text-xs text-foreground/50 mt-1">
                        {[...Array(12)].map((_, i) => (
                          <div key={i}>{i + 1}s</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6 text-sm">
                      <div>
                        <div className="text-foreground/60">Avg Response</div>
                        <div className="font-mono font-medium">48.3 ms</div>
                      </div>
                      <div>
                        <div className="text-foreground/60">RPS</div>
                        <div className="font-mono font-medium">342</div>
                      </div>
                      <div>
                        <div className="text-foreground/60">Error Rate</div>
                        <div className="font-mono font-medium text-green-500">0.01%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
