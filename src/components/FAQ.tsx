
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What makes StressAPI different from other load testing tools?",
    answer: "StressAPI is specifically designed for FastAPI applications, offering traffic patterns that mimic real-world usage scenarios. Our tool understands the async nature of FastAPI and provides detailed insights into your application's performance under various conditions."
  },
  {
    question: "Can I integrate StressAPI into my CI/CD pipeline?",
    answer: "Absolutely! StressAPI offers a GitHub Actions integration, allowing you to run performance tests automatically with each PR or deployment. We also provide a CLI tool that can be easily integrated into any CI/CD system."
  },
  {
    question: "How many concurrent users can StressAPI simulate?",
    answer: "Our standard plan supports up to 10,000 concurrent virtual users across distributed workers. Enterprise plans can scale to hundreds of thousands of concurrent users, distributed globally for realistic geographic testing."
  },
  {
    question: "Does StressAPI support authentication and custom headers?",
    answer: "Yes, StressAPI supports all standard authentication methods including API keys, OAuth, JWT, and basic auth. You can also define custom headers, cookies, and session variables that persist between requests in a user session."
  },
  {
    question: "Can I test GraphQL APIs with StressAPI?",
    answer: "Yes! While StressAPI is optimized for FastAPI, it fully supports GraphQL APIs. You can define queries, mutations, and variables, and our tool will provide detailed performance metrics specific to GraphQL operations."
  },
  {
    question: "Is there a free trial available?",
    answer: "We offer a 14-day free trial with full access to all features. No credit card is required to get started. Our open-source community edition is also available for personal and small-scale projects."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section" id="faq">
      <div className="container-content px-6 md:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
            Get answers to the most common questions about StressAPI and how it can help improve your FastAPI application's performance.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto animate-on-scroll">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'shadow-md' : ''
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-medium text-lg"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`transition-transform duration-300 text-primary ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} 
                    size={20} 
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-foreground/70">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center animate-on-scroll">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-foreground/70 mb-6">
              Our team is here to help. Reach out with any questions about how StressAPI can work for your specific needs.
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
