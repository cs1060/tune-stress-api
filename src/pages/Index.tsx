
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TestForm from '@/components/TestForm';
import ResultsView from '@/components/ResultsView';
import About from '@/components/About';
import Footer from '@/components/Footer';
import testService from '@/utils/testService';
import { TestResult } from '@/interfaces/test';

const Index = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Animation observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Poll for test results if a test is running
  useEffect(() => {
    if (!showResults) return;
    
    const intervalId = setInterval(() => {
      const activeTest = testService.getActiveTest();
      if (activeTest) {
        setTestResult({ ...activeTest });
      } else if (testResult?.status === 'running') {
        // If we had a running test but it's no longer active, grab the latest from history
        const history = testService.getTestHistory();
        if (history.length > 0) {
          setTestResult(history[history.length - 1]);
        }
      }
    }, 500);
    
    return () => clearInterval(intervalId);
  }, [showResults, testResult]);
  
  const handleTestStarted = () => {
    const activeTest = testService.getActiveTest();
    if (activeTest) {
      setTestResult({ ...activeTest });
      setShowResults(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <TestForm onTestStarted={handleTestStarted} />
        {showResults && <ResultsView testResult={testResult} isVisible={showResults} />}
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
