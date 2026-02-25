import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeType } from '@/types/index';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  if (typeof window !== 'undefined') localStorage.removeItem('appearance');

  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('acevia-theme');
    return (saved as ThemeType) || 'dark';
  });

  useEffect(() => {
      localStorage.setItem('acevia-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
      } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
      }
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};