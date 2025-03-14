
import React, { useEffect, useRef, useState } from 'react';
import CTAButton from './CTAButton';
import { ArrowRight, Play } from 'lucide-react';
import TestConfigModal from './TestConfigModal';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(0, Math.min(1, 1 - scrollY / 500));
      heroRef.current.style.opacity = opacity.toString();
    };
    
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRunTest = () => {
    setShowTestModal(true);
  };

  return (
    <section className="relative min-h-screen pt-32 flex items-center overflow-hidden" id="hero">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div ref={heroRef} className="container-content px-6 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-6 p-2 px-4 bg-secondary rounded-full inline-flex items-center gap-2 animate-fade-down">
            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-medium text-foreground/80">Introducing StressAPI 1.0</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-6 tracking-tight animate-fade-up">
            <span className="block">Stress-Test Your FastAPI</span>
            <span className="block text-primary">with Precision & Ease</span>
          </h1>
          
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto mb-10 text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Simulate real-world traffic patterns, identify bottlenecks, and optimize performance with our advanced load testing tool designed specifically for FastAPI applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <CTAButton size="lg" icon={<ArrowRight size={20} />} onClick={handleRunTest}>
              Run a Test Now
            </CTAButton>
            
            <button className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-200">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                <Play size={16} className="ml-1" />
              </span>
              <span className="font-medium">Watch Demo</span>
            </button>
          </div>
          
          <div className="mt-20 relative w-full animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-20 -bottom-px opacity-80 z-10"></div>
            <div className="glass rounded-2xl border border-white/20 shadow-xl overflow-hidden max-w-4xl mx-auto">
              <div className="bg-secondary/50 p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-foreground/60 font-mono flex-1 text-center">
                  stress_test.py
                </div>
              </div>
              <div className="bg-card/30 p-6 text-left">
                <pre className="font-mono text-sm text-foreground/90 overflow-x-auto">
                  <code>{`# Initialize StressAPI test
from stressapi import FastAPITest

# Create a test scenario
test = FastAPITest("https://api.example.com")

# Configure traffic pattern
test.configure(
    workers=50,              # Number of concurrent users
    pattern="interleaved",   # Traffic pattern type
    duration="30s",          # Test duration
    rate_limit=100           # Requests per second
)

# Add endpoints to test
test.add_endpoint("/users", method="GET")
test.add_endpoint("/products", method="GET", 
                  headers={"Authorization": "Bearer $TOKEN"})

# Run the test and get results
results = test.run()
print(results.summary())
`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <a 
          href="#features" 
          className="flex flex-col items-center text-foreground/50 hover:text-primary transition-colors duration-200"
        >
          <span className="text-sm mb-2">Discover More</span>
          <div className="w-5 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-current rounded-full animate-[float_1.5s_ease-in-out_infinite]"></div>
          </div>
        </a>
      </div>

      {/* Test Configuration Modal */}
      <TestConfigModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </section>
  );
};

export default Hero;
