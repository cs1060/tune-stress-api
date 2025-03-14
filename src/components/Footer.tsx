
import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/30 py-16 px-6 md:px-8">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-primary">Stress</span>
              <span className="text-foreground">API</span>
            </a>
            <p className="text-foreground/60 mb-6">
              High-performance load testing designed specifically for FastAPI applications.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Github size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" },
                { icon: <Mail size={20} />, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={`Social link ${i+1}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Documentation", "API Reference", "Changelog"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Blog", "Community", "GitHub", "Discord", "Status Page"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Team", "Careers", "Contact", "Terms", "Privacy"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <div className="text-foreground/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} StressAPI. All rights reserved.
          </div>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
