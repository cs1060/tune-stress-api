
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 sm:px-8 md:px-10",
        isScrolled ? "header-blur" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center space-x-2">
          <span className="sr-only">StressAPI</span>
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-medium text-lg">StressAPI</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <a href="#features" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity link-hover">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity link-hover">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity link-hover">
            Testimonials
          </a>
          <a href="#faq" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity link-hover">
            FAQ
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-sm font-medium opacity-90 hover:opacity-100">
            Log In
          </a>
          <a
            href="#"
            className="button-primary text-sm py-2 px-4"
          >
            Sign Up Free
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background bg-opacity-95 backdrop-blur-sm transition-all duration-300 ease-in-out pt-20",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center space-y-8 p-8">
          <a
            href="#features"
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </a>
          <div className="flex flex-col items-center space-y-4 pt-4 w-full">
            <a
              href="#"
              className="text-lg font-medium w-full text-center py-2"
            >
              Log In
            </a>
            <a
              href="#"
              className="button-primary w-full text-center"
            >
              Sign Up Free
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
