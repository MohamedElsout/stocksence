import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  LogIn,
  LogOut,
  UserCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, currentUser, isAuthenticated, logout, toggleTheme } = useStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/70 border-gray-700'
          : 'bg-white/70 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - يؤدي للصفحة الرئيسية */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                }`}
              >
                <Package className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('stockSence')}
              </h1>
            </motion.div>
          </Link>

          {/* Center Section - Theme Toggle */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`relative p-3 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <motion.div
                initial={false}
                animate={{ 
                  rotate: theme === 'dark' ? 0 : 180,
                  scale: theme === 'dark' ? 1 : 0.8
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.div>
              
              {/* Glow effect for dark mode */}
              {theme === 'dark' && (
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(251, 191, 36, 0.4)',
                      '0 0 0 8px rgba(251, 191, 36, 0)',
                      '0 0 0 0 rgba(251, 191, 36, 0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              )}
            </motion.button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {isAuthenticated && currentUser ? (
              <>
                {/* Profile Link */}
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`hidden sm:flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/profile'
                        ? theme === 'dark'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <UserCircle className={`w-4 h-4 ${
                      currentUser.role === 'admin' ? 'text-purple-500' : 'text-blue-500'
                    } ${location.pathname === '/profile' ? 'text-white' : ''}`} />
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentUser.username}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      currentUser.role === 'admin'
                        ? location.pathname === '/profile'
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        : location.pathname === '/profile'
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {currentUser.role === 'admin' ? 'Admin' : 'Employee'}
                    </span>
                  </motion.div>
                </Link>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
                    theme === 'dark'
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                      : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </motion.button>
              </>
            ) : (
              /* Login Button */
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('login')}</span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;