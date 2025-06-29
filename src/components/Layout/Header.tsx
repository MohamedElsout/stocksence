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

// Professional Circular Chart Icon Component - رسم بياني دائري احترافي
const CircularChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  const { theme } = useStore();
  
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* الدائرة الخارجية */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400'
        } shadow-lg`}
        animate={{
          boxShadow: [
            '0 4px 15px rgba(0, 0, 0, 0.2)',
            '0 6px 20px rgba(0, 0, 0, 0.3)',
            '0 4px 15px rgba(0, 0, 0, 0.2)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* محتوى الرسم البياني */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-4 h-4"
      >
        {/* الأعمدة الأربعة بارتفاعات متدرجة */}
        {/* العمود الأول - قصير */}
        <motion.rect 
          x="3" 
          y="18" 
          width="2.5" 
          height="3" 
          rx="0.5"
          fill="white"
          initial={{ height: 0, y: 21 }}
          animate={{ height: 3, y: 18 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        
        {/* العمود الثاني - متوسط */}
        <motion.rect 
          x="7" 
          y="15" 
          width="2.5" 
          height="6" 
          rx="0.5"
          fill="white"
          initial={{ height: 0, y: 21 }}
          animate={{ height: 6, y: 15 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        
        {/* العمود الثالث - طويل */}
        <motion.rect 
          x="11" 
          y="12" 
          width="2.5" 
          height="9" 
          rx="0.5"
          fill="white"
          initial={{ height: 0, y: 21 }}
          animate={{ height: 9, y: 12 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        
        {/* العمود الرابع - الأطول */}
        <motion.rect 
          x="15" 
          y="9" 
          width="2.5" 
          height="12" 
          rx="0.5"
          fill="white"
          initial={{ height: 0, y: 21 }}
          animate={{ height: 12, y: 9 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        
        {/* الخط التصاعدي المنحني */}
        <motion.path 
          d="M4 19 Q8 16 12 13 Q14 11 16 10" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* السهم في نهاية الخط */}
        <motion.path 
          d="M14.5 10 L16 10 L16 11.5" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        />
        
        {/* نقاط متلألئة على الخط */}
        <motion.circle 
          cx="4" 
          cy="19" 
          r="0.8" 
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.circle 
          cx="8" 
          cy="16" 
          r="0.8" 
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle 
          cx="12" 
          cy="13" 
          r="0.8" 
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.circle 
          cx="16" 
          cy="10" 
          r="0.8" 
          fill="white"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </svg>
      
      {/* تأثير النبض الخارجي */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute inset-0 rounded-full border-2 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
        }`}
      />
    </div>
  );
};

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
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.6, repeat: Infinity }
                }}
                className={`relative p-3 rounded-full shadow-2xl overflow-hidden group ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700' 
                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600'
                }`}
              >
                {/* Background Gradient Animation */}
                <motion.div
                  animate={{
                    background: theme === 'dark' 
                      ? [
                          'linear-gradient(45deg, #1E40AF, #7C3AED, #1E40AF)',
                          'linear-gradient(45deg, #7C3AED, #1E40AF, #7C3AED)',
                          'linear-gradient(45deg, #1E40AF, #7C3AED, #1E40AF)'
                        ]
                      : [
                          'linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)',
                          'linear-gradient(45deg, #8B5CF6, #3B82F6, #8B5CF6)',
                          'linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)'
                        ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full"
                />
                
                {/* Circular Chart Icon */}
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <CircularChartIcon className="w-7 h-7" />
                </motion.div>

                {/* Sparkle Effects */}
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
                  className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"
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
                    delay: 1.5
                  }}
                  className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: 3
                  }}
                  className="absolute top-2 left-2 w-0.5 h-0.5 bg-white rounded-full"
                />

                {/* Pulse Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 rounded-full border-2 ${
                    theme === 'dark' ? 'border-blue-400' : 'border-blue-300'
                  }`}
                />

                {/* Outer Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-blue-400 shadow-blue-400/50' 
                      : 'bg-blue-500 shadow-blue-500/50'
                  } shadow-2xl`}
                />
              </motion.div>
              
              <h1 className={`text-xl font-bold bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-blue-400 to-purple-400' 
                  : 'from-blue-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                {t('stockSence')}
              </h1>
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