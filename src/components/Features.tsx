
import React, { useEffect, useRef } from "react";
import { Activity, AlertTriangle, BarChart4, Clock, Database, Gauge, LineChart, Package, RefreshCw, Server, Shuffle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const featureItems = [
  {
    icon: Zap,
    title: "Load Testing",
    description: "Generate high-volume traffic to test your API's performance limits and identify breaking points.",
    color: "bg-blue-500/10 text-blue-500",
    delay: 0,
  },
  {
    icon: LineChart,
    title: "Performance Metrics",
    description: "Track latency, throughput, and error rates with detailed real-time analytics.",
    color: "bg-green-500/10 text-green-500",
    delay: 100,
  },
  {
    icon: AlertTriangle,
    title: "Bottleneck Detection",
    description: "Automatically identify performance bottlenecks and receive actionable suggestions.",
    color: "bg-amber-500/10 text-amber-500",
    delay: 200,
  },
  {
    icon: RefreshCw,
    title: "Sequential Traffic",
    description: "Send requests in a strict, ordered sequence to test workflow-dependent API endpoints.",
    color: "bg-indigo-500/10 text-indigo-500",
    delay: 0,
  },
  {
    icon: Shuffle,
    title: "Interleaved Traffic",
    description: "Simulate multiple users accessing your API with overlapping but defined sequences.",
    color: "bg-violet-500/10 text-violet-500",
    delay: 100,
  },
  {
    icon: Gauge,
    title: "Random Traffic",
    description: "Generate unpredictable request patterns to mimic real-world usage scenarios.",
    color: "bg-rose-500/10 text-rose-500",
    delay: 200,
  },
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-fade-in-up");
            }, Number(entry.target.getAttribute("data-delay") || 0));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = featuresRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={featuresRef}
      className="section-padding bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-4 text-sm font-medium">
            <span>Why Choose StressAPI</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful Features for API Testing
          </h2>
          <p className="text-muted-foreground">
            StressAPI provides all the tools you need to ensure your FastAPI applications can handle production-level traffic with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureItems.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm reveal opacity-0"
              data-delay={feature.delay}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  feature.color
                )}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 reveal opacity-0" data-delay="300">
          <div className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <Server className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-lg">Backend Architecture</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg border border-border bg-background/80">
                <Activity className="h-4 w-4 text-primary mb-2" />
                <h4 className="text-sm font-medium mb-1">FastAPI Backend</h4>
                <p className="text-xs text-muted-foreground">Defines test scenarios</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background/80">
                <Package className="h-4 w-4 text-green-500 mb-2" />
                <h4 className="text-sm font-medium mb-1">Celery Workers</h4>
                <p className="text-xs text-muted-foreground">Async traffic generation</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background/80">
                <Database className="h-4 w-4 text-blue-500 mb-2" />
                <h4 className="text-sm font-medium mb-1">PostgreSQL</h4>
                <p className="text-xs text-muted-foreground">Persistent test data</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background/80">
                <BarChart4 className="h-4 w-4 text-violet-500 mb-2" />
                <h4 className="text-sm font-medium mb-1">Prometheus</h4>
                <p className="text-xs text-muted-foreground">Metrics collection</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Our architecture ensures high-performance, reliability, and scalability for even the most demanding load testing scenarios.
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-lg">Real-Time Monitoring</h3>
            </div>
            <div className="aspect-[16/9] bg-gray-900 rounded-lg overflow-hidden mb-4">
              <div className="w-full h-full p-4 flex flex-col">
                <div className="flex justify-between items-center px-2 pb-2 border-b border-gray-800">
                  <div className="text-xs font-medium text-gray-300">Test progress</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>
                <div className="flex-1 flex items-end p-2">
                  <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d="M0,40 L5,35 L10,30 L15,32 L20,25 L25,28 L30,20 L35,15 L40,18 L45,10 L50,12 L55,8 L60,15 L65,10 L70,5 L75,8 L80,12 L85,7 L90,10 L95,5 L100,2"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="1"
                      />
                      <path
                        d="M0,40 L100,40"
                        stroke="#374151"
                        strokeWidth="0.5"
                        strokeDasharray="1,1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="p-2 rounded bg-gray-800">
                    <div className="text-xs text-gray-400">Avg. Latency</div>
                    <div className="text-sm font-medium text-white">126ms</div>
                  </div>
                  <div className="p-2 rounded bg-gray-800">
                    <div className="text-xs text-gray-400">Req/sec</div>
                    <div className="text-sm font-medium text-white">312</div>
                  </div>
                  <div className="p-2 rounded bg-gray-800">
                    <div className="text-xs text-gray-400">Error Rate</div>
                    <div className="text-sm font-medium text-white">0.5%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Monitor your API's performance in real-time with detailed metrics and visualizations. Identify issues as they happen.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
