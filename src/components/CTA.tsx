
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
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

    const elements = ctaRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleStartTrial = () => {
    navigate("/demo-test");
  };

  return (
    <section ref={ctaRef} className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border border-border p-8 md:p-12 relative reveal opacity-0">
          <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
            <div className="absolute -top-[100%] -right-[10%] w-[80%] h-[200%] rounded-full bg-primary/5 blur-3xl opacity-60" />
            <div className="absolute -bottom-[100%] -left-[10%] w-[80%] h-[200%] rounded-full bg-accent/5 blur-3xl opacity-60" />
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Stress-Test Your FastAPI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of teams who trust StressAPI to ensure their applications can handle real-world traffic.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={handleStartTrial} className="button-primary group">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a href="#how-it-works" className="button-secondary">
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
