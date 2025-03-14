
import React, { useEffect, useRef } from "react";
import { ArrowRight, Clock, LineChart, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

    const elements = heroRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleRunTest = () => {
    navigate("/demo-test");
  };

  return (
    <section
      ref={heroRef}
      className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 sm:px-8 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[40%] -right-[10%] w-[60%] h-[80%] rounded-full bg-primary/10 blur-3xl opacity-60 animate-subtle-pulse" />
          <div className="absolute -bottom-[40%] -left-[10%] w-[60%] h-[80%] rounded-full bg-accent/10 blur-3xl opacity-60 animate-subtle-pulse" />
        </div>

        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 opacity-0 reveal">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-6 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span>Introducing StressAPI</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance mb-6">
            Stress-Test Your
            <span className="text-gradient"> FastAPI </span>
            with Ease
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            A high-performance load testing tool built specifically for FastAPI applications. Uncover bottlenecks, optimize performance, and ensure your API can handle real-world traffic patterns.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20 opacity-0 reveal">
          <button onClick={handleRunTest} className="button-primary group">
            Run a Test Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a href="#how-it-works" className="button-secondary">
            How It Works
          </a>
        </div>

        <div className="relative mx-auto max-w-5xl opacity-0 reveal">
          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border glass-dark shadow-xl">
            <div className="bg-gray-900 w-full h-full flex items-center justify-center p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 flex flex-col">
                  <div className="flex items-center mb-4">
                    <Server className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">API Load Test</h3>
                  </div>
                  <div className="mt-2 mb-4 bg-gray-800 rounded p-3 text-xs font-mono text-gray-300 overflow-hidden">
                    <p>Running sequential traffic pattern...</p>
                    <p className="text-green-400">200 req/s → 98.5% success</p>
                    <p className="text-yellow-400">400 req/s → 95.2% success</p>
                    <p className="text-red-400">800 req/s → 76.1% success</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Bottleneck detected</span>
                    <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">Database</span>
                  </div>
                </div>
                
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 flex flex-col">
                  <div className="flex items-center mb-4">
                    <LineChart className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Performance Metrics</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-32 bg-gray-800 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end px-2">
                        <div className="w-1/5 h-[20%] bg-green-500 rounded-t mx-[1px]"></div>
                        <div className="w-1/5 h-[40%] bg-green-500 rounded-t mx-[1px]"></div>
                        <div className="w-1/5 h-[60%] bg-yellow-500 rounded-t mx-[1px]"></div>
                        <div className="w-1/5 h-[80%] bg-yellow-500 rounded-t mx-[1px]"></div>
                        <div className="w-1/5 h-[90%] bg-red-500 rounded-t mx-[1px]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Test completed</span>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>42s ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-full py-2 px-6 flex items-center space-x-4 shadow-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium">All Systems Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
