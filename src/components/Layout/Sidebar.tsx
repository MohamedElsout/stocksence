import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  X,
  Menu,
  Home,
  Info,
  Download,
  LogIn,
  LogOut,
  User,
  UserCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, currentUser, isAuthenticated, logout } = useStore();
  const isRTL = i18n.language === 'ar';

  const sidebarItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, requireAuth: true },
    { path: '/sales', label: t('sales'), icon: ShoppingCart, requireAuth: true },
    { path: '/reports', label: t('reports'), icon: BarChart3, requireAuth: true },
    { path: '/about', label: t('aboutUs'), icon: Info },
    { path: '/download', label: t('downloadSystem'), icon: Download, requireAuth: true },
    { path: '/settings', label: t('settings'), icon: Settings, requireAuth: true },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: isRTL ? 280 : -280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      visibility: "visible" as const,
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      visibility: "hidden" as const,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleLogout = () => {
    logout();
    onToggle();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`fixed top-20 ${isRTL ? 'right-4' : 'left-4'} z-50 p-3 rounded-lg shadow-lg ${
          theme === 'dark'
            ? 'bg-gray-800/20 text-white border border-gray-700/20'
            : 'bg-white/20 text-gray-900 border border-gray-200/20'
        } hover:shadow-xl transition-all duration-300 backdrop-blur-md`}
        style={{ opacity: 0.7 }}
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onToggle}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 z-50 ${
              theme === 'dark'
                ? 'bg-gray-900/90 border-gray-700'
                : 'bg-white/90 border-gray-200'
            } border-${isRTL ? 'l' : 'r'} shadow-2xl flex flex-col backdrop-blur-lg`}
            style={{
              paddingTop: '4rem'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-lg ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              } transition-all duration-200`}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
            } flex-shrink-0`}>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/logo2 copy copy.png" 
                    alt="StockSence Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`font-bold text-lg bg-gradient-to-r ${
                    theme === 'dark' 
                      ? 'from-blue-400 via-purple-400 to-pink-400' 
                      : 'from-blue-600 via-purple-600 to-pink-600'
                  } bg-clip-text text-transparent`}
                >
                  StockSence
                </motion.h2>
              </div>
            </div>

            {/* User Info Section */}
            {isAuthenticated && currentUser && (
              <div className={`px-6 py-4 border-b ${
                theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
              } flex-shrink-0`}>
                <Link to="/profile" onClick={onToggle}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-all duration-300 ${
                      location.pathname === '/profile'
                        ? theme === 'dark'
                          ? 'bg-purple-600/80 text-white'
                          : 'bg-purple-500/80 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800/50 hover:bg-gray-700/50'
                        : 'bg-gray-100/50 hover:bg-gray-200/50'
                    }`}
                  >
                    <UserCircle className={`w-8 h-8 ${
                      location.pathname === '/profile'
                        ? 'text-white'
                        : currentUser.role === 'admin' 
                        ? 'text-purple-500' 
                        : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentUser.username}
                      </p>
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
                    </div>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Navigation with Custom Scrollbar */}
            <nav className="flex-1 px-4 py-6 overflow-hidden hover:overflow-y-auto transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500">
              <div className="space-y-2">
                {filteredSidebarItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link key={item.path} to={item.path} onClick={onToggle}>
                      <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.02, 
                          x: isRTL ? -3 : 3,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white shadow-lg'
                              : 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/30'
                        }`}
                      >
                        <motion.div
                          animate={isActive ? { 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 0.6 }}
                          className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-white/20' 
                              : theme === 'dark'
                              ? 'group-hover:bg-gray-700/50'
                              : 'group-hover:bg-gray-200/50'
                          } transition-all duration-300`}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <span className="font-medium text-sm">{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`ml-auto w-2 h-2 rounded-full bg-white`}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Auth Section */}
                <div className={`pt-4 mt-4 border-t ${
                  theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
                }`}>
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        x: isRTL ? -3 : 3,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 group ${
                        theme === 'dark'
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                          : 'text-red-600 hover:text-red-500 hover:bg-red-50/50'
                      }`}
                    >
                      <motion.div
                        className={`p-2 rounded-lg ${
                          theme === 'dark'
                            ? 'group-hover:bg-red-900/30'
                            : 'group-hover:bg-red-100/50'
                        } transition-all duration-300`}
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.div>
                      <span className="font-medium text-sm">{t('logout')}</span>
                    </motion.button>
                  ) : (
                    <Link to="/auth" onClick={onToggle}>
                      <motion.div
                        whileHover={{ 
                          scale: 1.02, 
                          x: isRTL ? -3 : 3,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 group ${
                          theme === 'dark'
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                            : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50/50'
                        }`}
                      >
                        <motion.div
                          className={`p-2 rounded-lg ${
                            theme === 'dark'
                              ? 'group-hover:bg-blue-900/30'
                              : 'group-hover:bg-blue-100/50'
                          } transition-all duration-300`}
                        >
                          <LogIn className="w-5 h-5" />
                        </motion.div>
                        <span className="font-medium text-sm">{t('login')}</span>
                      </motion.div>
                    </Link>
                  )}
                </div>
              </div>
            </nav>

            <div className={`px-6 py-4 border-t ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
            } flex-shrink-0`}>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } text-center`}>
                {t('version')}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
          background-color: rgb(156 163 175);
          border-radius: 0.375rem;
        }
        
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
          border-radius: 0.375rem;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .hover\\:scrollbar-thumb-gray-500:hover::-webkit-scrollbar-thumb {
          background-color: rgb(107 114 128);
        }
        
        .dark .hover\\:scrollbar-thumb-gray-500:hover::-webkit-scrollbar-thumb {
          background-color: rgb(107 114 128);
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
          transition: background-color 0.3s ease;
        }
        
        .overflow-hidden:hover::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(156 163 175)'};
        }
        
        .overflow-hidden:hover::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgb(107 114 128)' : 'rgb(107 114 128)'};
        }
      `}</style>
    </>
  );
};

export default Sidebar;