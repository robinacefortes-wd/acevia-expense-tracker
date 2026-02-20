import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Receipt, Sun, Moon, LogOut, LucideIcon } from 'lucide-react';
import { useTheme } from '@/components/dashboard/ThemeContext';

declare const route: any;

interface MenuItem {
  icon: LucideIcon;
  label: string;
  active: boolean;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Receipt, label: 'Records', active: false },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isActive = (label: string) => {
    if (label === 'Dashboard') return window.location.pathname === '/dashboard';
    if (label === 'Transactions') return window.location.pathname === '/transactions';
    return false;
  };
  const { theme, toggleTheme } = useTheme();

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
        zIndex: 40
      }}
    >
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <div className="px-4 mb-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={false}
          >
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
            <Link 
              key={index} 
              href={item.label === 'Dashboard' ? '/dashboard' : '/transactions'}
              className="block w-full"
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl mb-2 transition-colors theme-nav-item"
                style={{
                  backgroundColor: isActive(item.label) ? 'rgba(129, 81, 217, 0.15)' : 'transparent',
                  color: isActive(item.label) ? '#8151d9' : undefined
                }}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {isExpanded && (
                  <motion.span className="font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions Section */}
        <div className="px-3 mt-auto flex flex-col gap-2">
          {/* Theme Toggle */}
          <motion.button
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

          {/* Divider */}
          <div className="mx-4 my-4 border-t border-gray-200 dark:border-gray-800 opacity-50" />

          {/* Logout Button */}
          <Link
            href="/logout" 
            method="post"
            as="button"
            className="w-full text-left"
          >
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors theme-nav-item text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-6 h-6 flex-shrink-0" />
              {isExpanded && (
                <motion.span className="font-medium whitespace-nowrap overflow-hidden">
                  Log Out
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;