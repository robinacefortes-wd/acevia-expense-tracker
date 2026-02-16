import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Target,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* =======================
   Types
======================= */

interface MenuItem {
  icon: React.ElementType;
  label: string;
  active: boolean;
}

/* =======================
   Constants
======================= */

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Receipt, label: 'Transactions', active: false },
  { icon: Target, label: 'Budgets', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

/* =======================
   Component
======================= */

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme() as {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };

  return (
    <motion.aside
      data-testid="sidebar"
      initial={{ width: 72 }}
      animate={{ width: isExpanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="relative flex-shrink-0 border-r theme-sidebar"
      style={{
        position: 'fixed',
        height: '100vh',
        zIndex: 40,
      }}
    >
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <div className="px-4 mb-8">
          <motion.div className="flex items-center gap-3" initial={false}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#8151d9' }}
            >
              <span className="text-white font-bold text-xl">A</span>
            </div>

            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="theme-text font-semibold text-lg whitespace-nowrap overflow-hidden"
              >
                Acevia
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              type="button"
              data-testid={`nav-${item.label.toLowerCase()}`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl mb-2 transition-colors theme-nav-item"
              style={{
                backgroundColor: item.active
                  ? 'rgba(129, 81, 217, 0.15)'
                  : 'transparent',
                color: item.active ? '#8151d9' : undefined,
              }}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />

              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="px-3 mt-auto">
          <motion.button
            type="button"
            data-testid="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors theme-nav-item"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 flex-shrink-0" />
            ) : (
              <Moon className="w-6 h-6 flex-shrink-0" />
            )}

            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
