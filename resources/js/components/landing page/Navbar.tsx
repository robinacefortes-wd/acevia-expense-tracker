import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`flex items-center justify-between h-14 px-4 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-xl' 
              : 'bg-transparent border border-transparent rounded-full'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/acevia logo.png" 
                alt="Acevia Logo" 
                className="h-12 w-auto object-contain" 
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#features"
              className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 rounded-full transition-all duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 rounded-full transition-all duration-200 font-medium"
            >
              How It Works
            </a>
            <a
              href="/login"
              className="ml-2 px-6 py-2.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-sm"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-[var(--text-primary)] hover:bg-black/5 rounded-full transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-[var(--border-light)] rounded-2xl shadow-lg p-4 space-y-2">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-[var(--text-body)] hover:bg-black/5 rounded-xl transition-all font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-[var(--text-body)] hover:bg-black/5 rounded-xl transition-all font-medium"
            >
              How It Works
            </a>
            <a
              href="#cta"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-3 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold text-center shadow-sm"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
