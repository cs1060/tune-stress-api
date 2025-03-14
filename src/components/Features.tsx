
import { useEffect, useRef } from 'react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  const featureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (featureRef.current) {
      observer.observe(featureRef.current);
    }
    
    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);
  
  return (
    <div 
      ref={featureRef}
      className="animate-on-scroll flex flex-col items-center md:items-start p-6 rounded-xl"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
        {description}
      </p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to stress test your FastAPI applications
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="m4.93 4.93 2.83 2.83" />
                <path d="m16.24 16.24 2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="m4.93 19.07 2.83-2.83" />
                <path d="m16.24 7.76 2.83-2.83" />
              </svg>
            }
            title="Realistic Load Simulation"
            description="Simulate hundreds or thousands of concurrent users with realistic behavior patterns to accurately test your API under stress."
            delay={100}
          />
          
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m3 15 4-4 4 4 4-4 4 4" />
              </svg>
            }
            title="Detailed Metrics"
            description="Get comprehensive metrics including response times, throughput, error rates, and performance bottlenecks with easy-to-understand visualizations."
            delay={200}
          />
          
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            }
            title="Error Detection"
            description="Quickly identify and diagnose errors in your API responses, with detailed reporting on status codes and error messages."
            delay={300}
          />
          
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
            title="Security Testing"
            description="Test your API's security under load with customizable security tests and vulnerability scanning."
            delay={400}
          />
          
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="M8 18v-1" />
                <path d="M16 18v-3" />
              </svg>
            }
            title="Detailed Reports"
            description="Generate comprehensive reports with insights and recommendations to optimize your API performance."
            delay={500}
          />
          
          <Feature
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Customizable Tests"
            description="Create custom test scenarios with different user loads, request patterns, and authentication methods to simulate your specific use cases."
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
