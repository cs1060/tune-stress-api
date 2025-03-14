
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What makes StressAPI different from other load testing tools?",
    answer:
      "StressAPI is specifically designed for FastAPI applications with features tailored to modern Python async APIs. Unlike general-purpose load testing tools, StressAPI understands FastAPI's architecture and can simulate realistic traffic patterns that match your API's usage in production.",
  },
  {
    question: "Do I need to modify my FastAPI application to use StressAPI?",
    answer:
      "Not at all! StressAPI works with any FastAPI application without requiring any modifications. Simply point StressAPI to your API endpoints, define your test scenarios, and start testing.",
  },
  {
    question: "Can StressAPI simulate authenticated API requests?",
    answer:
      "Yes, StressAPI supports all authentication methods including API keys, JWT tokens, OAuth, and custom authentication schemes. You can define authentication sequences in your test scenarios to simulate real-world authenticated traffic.",
  },
  {
    question: "How many concurrent users can StressAPI simulate?",
    answer:
      "StressAPI is designed to scale horizontally and can simulate thousands of concurrent users. The exact number depends on your hardware resources and the complexity of your test scenarios.",
  },
  {
    question: "Does StressAPI support WebSocket testing?",
    answer:
      "Yes, StressAPI supports WebSocket testing with the ability to simulate multiple concurrent WebSocket connections and measure performance metrics specific to WebSocket applications.",
  },
  {
    question: "Can I integrate StressAPI with my CI/CD pipeline?",
    answer:
      "Absolutely! StressAPI offers a CLI tool and GitHub Actions integration that makes it easy to include performance testing as part of your continuous integration workflow.",
  },
];

const FAQ = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

    const elements = faqRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={faqRef} className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 reveal opacity-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-4 text-sm font-medium">
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about StressAPI and how it can help your team.
          </p>
        </div>

        <div className="space-y-4 reveal opacity-0">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                className="flex items-center justify-between w-full text-left px-6 py-4"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    openIndex === index ? "transform rotate-180" : ""
                  )}
                />
              </button>
              <div
                className={cn(
                  "px-6 overflow-hidden transition-all duration-200 ease-in-out",
                  openIndex === index
                    ? "max-h-96 pb-6 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center reveal opacity-0" data-delay="200">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <a
            href="#"
            className="button-secondary"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
