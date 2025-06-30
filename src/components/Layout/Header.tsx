import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogIn,
  LogOut,
  UserCircle,
  Sun,
  Moon
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
              className="flex items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="StockSence Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </Link>

          {/* Auth Section with Theme Toggle */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Enhanced Single Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`relative p-3 rounded-xl transition-all duration-500 group ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600 shadow-lg'
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 border border-gray-200 shadow-md'
              }`}
              title={theme === 'dark' ? (t('lightMode') || 'Switch to Light Mode') : (t('darkMode') || 'Switch to Dark Mode')}
            >
              {/* Icon Container with Smooth Transition */}
              <motion.div
                animate={{ 
                  rotate: theme === 'dark' ? 0 : 180,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 0.6, ease: "easeInOut" },
                  scale: { duration: 0.3 }
                }}
                className="relative"
              >
                {/* Sun Icon */}
                <motion.div
                  animate={{ 
                    opacity: theme === 'dark' ? 0 : 1,
                    scale: theme === 'dark' ? 0.8 : 1,
                    rotate: theme === 'dark' ? -90 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sun className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-yellow-500'
                  }`} />
                </motion.div>

                {/* Moon Icon */}
                <motion.div
                  animate={{ 
                    opacity: theme === 'dark' ? 1 : 0,
                    scale: theme === 'dark' ? 1 : 0.8,
                    rotate: theme === 'dark' ? 0 : 90
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center"
                >
                  <Moon className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-gray-500'
                  }`} />
                </motion.div>
              </motion.div>

              {/* Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-blue-400 shadow-blue-400/50' 
                    : 'bg-yellow-400 shadow-yellow-400/50'
                } shadow-lg`}
              />

              {/* Sparkle Effects for Dark Mode */}
              {theme === 'dark' && (
                <>
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: 0
                    }}
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-300 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, -180, -360]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: 1
                    }}
                    className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-300 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: 2
                    }}
                    className="absolute top-0 left-0 w-0.5 h-0.5 bg-yellow-300 rounded-full"
                  />
                </>
              )}

              {/* Sun Rays for Light Mode */}
              {theme === 'light' && (
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="absolute inset-0 rounded-xl"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-2 bg-yellow-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '50% 20px',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg)`
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.button>

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