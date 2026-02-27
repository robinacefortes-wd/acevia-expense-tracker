import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LucideIcon} from 'lucide-react';
import { LayoutDashboard, Banknote, Sun, Moon, LogOut, BarChart2, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/dashboard/ThemeContext';
import type { SharedData } from '@/types/index';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',  href: '/dashboard'    },
  { icon: Banknote,        label: 'Records',    href: '/transactions' },
  { icon: BarChart2,       label: 'Analytics',  href: '/analytics'    },
  { icon: UserCircle,      label: 'Profile',    href: '/profile'      },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { auth } = usePage<SharedData>().props;
  const user = auth.user;

  const firstName = user?.first_name ?? '';
  const lastName = user?.last_name ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const isActive = (href: string) => window.location.pathname === href;

  return (
    <motion.aside
      data-testid="sidebar"
      initial={{ width: 72 }}
      animate={{ width: isExpanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="relative flex-shrink-0 border-r theme-sidebar"
      style={{ position: 'fixed', height: '100vh', zIndex: 40 }}
    >
      <div className="flex flex-col h-full py-6">

        {/* User Avatar + Name */}
        <div className="px-4 mb-8">
          <Link href="/profile" className="block">
            <motion.div
              className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors theme-nav-item cursor-pointer"
            >
              {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={`/storage/${user.avatar}`}
                  alt={fullName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)' }}
                >
                  {initials}
                </div>
              )}

              {/* Name + Email */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="theme-text font-semibold text-sm whitespace-nowrap leading-tight">
                    {fullName || 'User'}
                  </p>
                  <p className="theme-text-secondary text-xs whitespace-nowrap truncate max-w-[140px]">
                    {user?.email ?? ''}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="block w-full">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl mb-2 transition-colors theme-nav-item cursor-pointer"
                style={{
                  backgroundColor: isActive(item.href) ? 'rgba(129, 81, 217, 0.15)' : 'transparent',
                  color: isActive(item.href) ? '#8151d9' : undefined,
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
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 mt-auto flex flex-col gap-2">

          {/* Theme Toggle */}
          <motion.button
            data-testid="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors theme-nav-item cursor-pointer"
          >
            {theme === 'dark'
              ? <Sun className="w-6 h-6 flex-shrink-0" />
              : <Moon className="w-6 h-6 flex-shrink-0" />
            }
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
          <div className="mx-4 my-1 border-t border-gray-200 dark:border-gray-800 opacity-50" />

          {/* Logout */}
          <Link href="/logout" method="post" as="button" className="w-full text-left cursor-pointer">
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