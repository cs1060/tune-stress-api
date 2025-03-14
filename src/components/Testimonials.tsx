
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    content:
      "StressAPI helped us uncover a critical bottleneck in our payment processing API that was causing timeouts under high load. We were able to fix it before our big product launch.",
    author: "Sarah Chen",
    role: "CTO at FinTech Solutions",
    company: "FinTech Solutions",
  },
  {
    content:
      "The ability to simulate different traffic patterns was game-changing for our team. We discovered that our API performed well under sequential load but struggled with random traffic spikes.",
    author: "Mark Johnson",
    role: "Lead Backend Developer",
    company: "E-commerce Platform Inc.",
  },
  {
    content:
      "We integrated StressAPI into our CI pipeline and now we catch performance regressions before they hit production. Absolutely essential for our development workflow.",
    author: "Priya Patel",
    role: "DevOps Engineer",
    company: "SaaS Analytics",
  },
];

const Testimonials = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.getAttribute("data-delay") || 0);
            setTimeout(() => {
              entry.target.classList.add("animate-fade-in-up");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = testimonialsRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={testimonialsRef}
      className="section-padding bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal opacity-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-4 text-sm font-medium">
            <span>What Our Users Say</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by Development Teams
          </h2>
          <p className="text-muted-foreground">
            See how StressAPI has helped teams across various industries optimize their FastAPI applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-xl border border-border bg-background/80 backdrop-blur-sm reveal opacity-0"
              )}
              data-delay={index * 100}
            >
              <div className="mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-amber-400 mr-1">
                      ★
                    </span>
                  ))}
              </div>
              <blockquote className="text-foreground mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-xl border border-border bg-background/50 backdrop-blur-sm reveal opacity-0" data-delay="300">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:mr-8">
              <h3 className="text-xl font-semibold mb-2">Ready to optimize your FastAPI performance?</h3>
              <p className="text-muted-foreground max-w-xl">
                Join hundreds of development teams who trust StressAPI for their load testing needs.
              </p>
            </div>
            <a href="#" className="button-primary whitespace-nowrap">
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
