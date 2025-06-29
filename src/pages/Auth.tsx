import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  Lock, 
  Hash,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Shield,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';

const Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    theme, 
    login, 
    register, 
    users, 
    serialNumbers, 
    addSerialNumber, 
    removeSerialNumber,
    currentUser,
    isAuthenticated 
  } = useStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    serialNumber: ''
  });

  const isRTL = i18n.language === 'ar';
  const isFirstUser = users.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        // تسجيل الدخول - مع الرقم التسلسلي
        success = await login(formData.username, formData.password, formData.serialNumber);
      } else {
        // إنشاء حساب
        if (isFirstUser) {
          // المستخدم الأول (الأدمن) - بدون رقم تسلسلي
          success = await register(formData.username, formData.password);
        } else {
          // المستخدمون الآخرون - مع رقم تسلسلي
          success = await register(formData.username, formData.password, formData.serialNumber);
        }
      }

      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSerialNumber = () => {
    if (newSerialNumber.trim()) {
      addSerialNumber(newSerialNumber.trim());
      setNewSerialNumber('');
    }
  };

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md space-y-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {/* Logo */}
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`inline-flex p-4 rounded-full mb-4 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
              } shadow-2xl`}
            >
              <Package className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('stockSence')}
            </h1>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isLogin ? t('loginTitle') : t('registerTitle')}
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isLogin ? t('loginSubtitle') : t('registerSubtitle')}
            </p>
            
            {/* رسالة خاصة للمستخدم الأول */}
            {isFirstUser && !isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                } border border-green-500/30`}
              >
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {isRTL ? 'إنشاء حساب الأدمن الأول - بدون رقم تسلسلي' : 'Creating First Admin Account - No Serial Required'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* رسالة توضيحية لتسجيل الدخول */}
            {isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                } border border-blue-500/30`}
              >
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <Hash className="w-5 h-5 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {isRTL ? 'مطلوب: اسم المستخدم، كلمة المرور، والرقم التسلسلي' : 'Required: Username, Password, and Serial Number'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('username')}
              </label>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder={t('usernamePlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('password')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'} py-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder={t('passwordPlaceholder')}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Serial Number - Required for login and non-first user registration */}
            {(isLogin || (!isLogin && !isFirstUser)) && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('serialNumber')} *
                </label>
                <div className="relative">
                  <Hash className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder={t('serialNumberPlaceholder')}
                    required
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isLogin 
                    ? (isRTL ? 'الرقم التسلسلي مطلوب لتسجيل الدخول' : 'Serial number required for login')
                    : (isRTL ? 'الرقم التسلسلي مطلوب لإنشاء حساب جديد' : 'Serial number required for new account')
                  }
                </p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    <span>{isLogin ? t('loginButton') : t('registerButton')}</span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Switch Mode */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ username: '', password: '', serialNumber: '' });
                }}
                className={`text-sm ${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                } transition-colors`}
              >
                {isLogin ? t('switchToRegister') : t('switchToLogin')}
              </motion.button>
            </div>
          </form>

          {/* Admin Panel Toggle */}
          {users.length > 0 && users.some(u => u.role === 'admin') && (
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={`text-sm ${
                  theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
                } transition-colors flex items-center space-x-2 rtl:space-x-reverse mx-auto`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('adminPanel')}</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Info */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`hidden lg:flex flex-1 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
        } items-center justify-center p-8`}
      >
        <div className="max-w-md text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <div className={`inline-flex p-8 rounded-full ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            } shadow-2xl`}>
              <Users className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <h3 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {isRTL ? 'مرحباً بك في ستوك سينس' : 'Welcome to StockSence'}
          </h3>
          
          <p className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {isRTL 
              ? 'نظام إدارة المخزون الاحترافي للشركات العصرية مع دعم متعدد المستخدمين وأمان متقدم'
              : 'Professional inventory management system for modern businesses with multi-user support and advanced security'
            }
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}>
              <Shield className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isRTL ? 'أمان متقدم' : 'Advanced Security'}
              </h4>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}>
              <Users className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isRTL ? 'متعدد المستخدمين' : 'Multi-User'}
              </h4>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAdminPanel(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('manageSerialNumbers')}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Add Serial Number */}
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`text-lg font-medium mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('addSerialNumber')}
                </h4>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <input
                    type="text"
                    value={newSerialNumber}
                    onChange={(e) => setNewSerialNumber(e.target.value)}
                    placeholder={t('serialNumberPlaceholder')}
                    className={`flex-1 px-3 py-2 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddSerialNumber}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Serial Numbers List */}
              <div>
                <h4 className={`text-lg font-medium mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('serialNumbersList')}
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('serialNumber')}
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('status')}
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('createdAt')}
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                    }`}>
                      {serialNumbers.map((serial) => (
                        <tr key={serial.id} className={`hover:${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        } transition-colors`}>
                          <td className={`px-4 py-4 whitespace-nowrap font-mono ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {serial.serialNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              serial.isUsed
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {serial.isUsed ? (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  {t('used')}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {t('unused')}
                                </>
                              )}
                            </span>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(serial.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {!serial.isUsed && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeSerialNumber(serial.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Auth;