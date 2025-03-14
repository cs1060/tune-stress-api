
import { useEffect, useRef } from 'react';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sequentially animate elements
    setTimeout(() => {
      titleRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    
    setTimeout(() => {
      descriptionRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 300);
    
    setTimeout(() => {
      buttonRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 500);
    
    setTimeout(() => {
      animationRef.current?.classList.add('opacity-100', 'scale-100');
    }, 700);
  }, []);

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <div className="relative z-10">
              <span className="inline-block text-sm font-medium text-blue-500 mb-3 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full transform transition-all duration-300 animate-fade-in">
                Load Testing for FastAPI
              </span>
              
              <h1 
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight opacity-0 -translate-y-6 transition-all duration-700 ease-out"
              >
                Stress test your API with confidence
              </h1>
              
              <p 
                ref={descriptionRef}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 opacity-0 -translate-y-6 transition-all duration-700 ease-out delay-100"
              >
                StressAPI is a high-performance load testing tool built specifically for FastAPI. 
                Simulate real-world traffic, stress-test endpoints, and uncover performance bottlenecks with ease.
              </p>
              
              <a 
                ref={buttonRef}
                href="#test" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:scale-105 duration-300 opacity-0 -translate-y-6 ease-out"
              >
                Start Testing
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div 
              ref={animationRef}
              className="relative z-10 opacity-0 scale-95 transition-all duration-700 ease-out delay-300"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 glass-morphism">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">Terminal</div>
                </div>
                
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                  <p className="animate-pulse">$ stress-api run</p>
                  <p className="mt-2"><span className="text-green-500">INFO</span> Starting load test</p>
                  <p><span className="text-blue-500">CONFIG</span> Target: https://api.example.com/items</p>
                  <p><span className="text-blue-500">CONFIG</span> Users: 100</p>
                  <p><span className="text-blue-500">CONFIG</span> Duration: 30s</p>
                  <p className="mt-2"><span className="text-yellow-500">PROGRESS</span> Running...</p>
                  <p className="flex items-center">
                    <svg className="animate-spin-slow h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
              <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-70"></div>
            </div>
            
            <div className="absolute -top-10 -right-10 h-64 w-64 bg-yellow-100 dark:bg-yellow-900/10 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-12 -left-12 h-72 w-72 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
