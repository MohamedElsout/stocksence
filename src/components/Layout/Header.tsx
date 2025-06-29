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
  Moon,
  Palette
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, currentUser, isAuthenticated, logout, toggleTheme } = useStore();
  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
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
                } shadow-lg`}
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

          {/* Center Section - Enhanced Theme Toggle */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`relative p-1 rounded-2xl transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 shadow-xl border border-gray-600'
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg border border-gray-200'
              }`}
            >
              {/* Background Slider */}
              <motion.div
                animate={{
                  x: theme === 'dark' ? (isRTL ? 0 : 44) : (isRTL ? 44 : 0),
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-10 h-10 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
                }`}
                style={{
                  left: isRTL ? 'auto' : '4px',
                  right: isRTL ? '4px' : 'auto'
                }}
              />

              {/* Theme Buttons Container */}
              <div className="relative flex items-center">
                {/* Light Mode Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`relative z-10 p-2.5 rounded-xl transition-all duration-300 ${
                    theme === 'light'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={t('lightMode') || 'Light Mode'}
                >
                  <motion.div
                    animate={{ 
                      rotate: theme === 'light' ? [0, 180, 360] : 0,
                      scale: theme === 'light' ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Light rays effect */}
                  {theme === 'light' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl border-2 border-yellow-300"
                    />
                  )}
                </motion.button>

                {/* Dark Mode Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`relative z-10 p-2.5 rounded-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={t('darkMode') || 'Dark Mode'}
                >
                  <motion.div
                    animate={{ 
                      rotate: theme === 'dark' ? [0, -15, 15, 0] : 0,
                      scale: theme === 'dark' ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Stars effect for dark mode */}
                  {theme === 'dark' && (
                    <>
                      <motion.div
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: 0
                        }}
                        className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full"
                      />
                      <motion.div
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: 0.5
                        }}
                        className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-300 rounded-full"
                      />
                      <motion.div
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: 1
                        }}
                        className="absolute top-0 left-0 w-0.5 h-0.5 bg-purple-300 rounded-full"
                      />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Theme indicator text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {theme === 'dark' ? (isRTL ? 'مظلم' : 'Dark') : (isRTL ? 'فاتح' : 'Light')}
              </motion.div>
            </motion.div>
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