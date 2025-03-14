
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import CTAButton from './CTAButton';
import TestConfigModal from './TestConfigModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleRunTest = () => {
    setIsMenuOpen(false);
    setShowTestModal(true);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <nav className="container-content flex items-center justify-between px-6 md:px-8">
        <a href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-primary">Stress</span>
          <span className="text-foreground">API</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {['Features', 'Documentation', 'Pricing', 'About'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <CTAButton size="sm" onClick={handleRunTest}>Run a Test</CTAButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden glass shadow-lg absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-6">
          {['Features', 'Documentation', 'Pricing', 'About'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <CTAButton size="sm" onClick={handleRunTest}>
              Run a Test
            </CTAButton>
          </li>
        </ul>
      </div>

      {/* Test Configuration Modal */}
      <TestConfigModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </header>
  );
};

export default Navbar;
