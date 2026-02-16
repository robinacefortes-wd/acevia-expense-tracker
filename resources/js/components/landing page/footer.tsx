import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
          {/* Logo Link that refreshes the page */}
          <a 
            href="/" 
            className="inline-block mb-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <img 
                src="/acevia logo.png" 
                alt="Acevia Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
          </a>
          
          <p className="text-muted text-sm leading-relaxed max-w-sm">
            The simplest way to track your expenses, manage budgets, and build better financial habits.
          </p>
        </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {currentYear} Acevia Expense Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-muted text-xs">
            <span>Developed and designed by Robin Ace Fortes</span>  
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;