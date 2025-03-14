
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "StressAPI helped us identify performance bottlenecks in our e-commerce API that we couldn't catch with traditional testing methods. Our API now handles 3x more traffic with lower latency.",
    author: "Sarah Chen",
    role: "CTO at ShopWave",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    quote: "The real-time metrics and customizable traffic patterns have been invaluable for our team. We've integrated StressAPI into our CI/CD pipeline, which has significantly improved our confidence in each release.",
    author: "Michael Rodriguez",
    role: "Lead Backend Developer, FinTech Labs",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "As a startup handling sensitive health data, we needed a reliable way to ensure our API could scale with user growth while maintaining strict performance SLAs. StressAPI delivered on all fronts.",
    author: "Aisha Johnson",
    role: "Engineering Manager, HealthSecure",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="section bg-secondary/40" id="testimonials">
      <div className="container-content px-6 md:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Developers Worldwide</h2>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
            See what developers and engineering teams are saying about how StressAPI has transformed their approach to API testing and performance optimization.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 flex flex-col h-full animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="text-primary opacity-50 w-10 h-10 mb-4" />
              <p className="text-foreground/80 italic mb-6 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-foreground/60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 animate-on-scroll">
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 text-center">
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "3x", label: "Performance Improvement" },
                { value: "500+", label: "Active Users" },
                { value: "100M+", label: "Requests Tested Daily" }
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
