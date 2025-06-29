import React, { useState, useEffect } from 'react';
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
  XCircle,
  Info,
  Mail,
  Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';

// Declare Google types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// Google OAuth Component
const GoogleSignIn: React.FC<{ onSuccess: (email: string) => void; onError: () => void }> = ({ onSuccess, onError }) => {
  const { theme } = useStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          // 🔥 هنا تضع Google Client ID الحقيقي بعد الرفع
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
          callback: (response: any) => {
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              onSuccess(payload.email);
            } catch (error) {
              console.error('Google Sign-In error:', error);
              onError();
            }
          }
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onSuccess, onError]);

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      onError();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={handleGoogleSignIn}
      className={`w-full flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
        theme === 'dark'
          ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600 hover:border-gray-500'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
      } shadow-sm hover:shadow-md`}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className="font-medium">
        {isRTL ? 'تسجيل الدخول بـ Google' : 'Sign in with Google'}
      </span>
    </motion.button>
  );
};

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
    isAuthenticated,
    autoLoginWithGoogle,
    setAutoLoginWithGoogle,
    addNotification
  } = useStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    serialNumber: '',
    email: ''
  });

  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        // تسجيل الدخول - مع الرقم التسلسلي
        success = await login(formData.username, formData.password, formData.serialNumber);
      } else {
        // إنشاء حساب - بدون رقم تسلسلي
        success = await register(formData.username, formData.password, formData.email);
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

  const handleGoogleSuccess = (email: string) => {
    setFormData({ ...formData, email });
    addNotification({
      type: 'success',
      message: isRTL ? `تم ربط الإيميل: ${email}` : `Email linked: ${email}`
    });
  };

  const handleGoogleError = () => {
    addNotification({
      type: 'error',
      message: isRTL ? 'فشل في ربط حساب Google' : 'Failed to link Google account'
    });
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

            {/* رسالة توضيحية */}
            {isLogin ? (
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
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                } border border-green-500/30`}
              >
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <Info className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {users.length === 0 
                      ? (isRTL ? 'أول مستخدم سيكون أدمن تلقائياً' : 'First user will be admin automatically')
                      : (isRTL ? 'المستخدمون الجدد سيكونون موظفين' : 'New users will be employees')
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Google Auto-Login Option - محسّن */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                autoLoginWithGoogle
                  ? theme === 'dark' 
                    ? 'bg-blue-900/20 border-blue-500/50' 
                    : 'bg-blue-50 border-blue-300'
                  : theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <motion.div
                    animate={autoLoginWithGoogle ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded-lg ${
                      autoLoginWithGoogle
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark' 
                        ? 'bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className={`font-semibold ${
                      autoLoginWithGoogle
                        ? theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isRTL ? 'تسجيل دخول تلقائي بـ Google' : 'Auto-login with Google'}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {isRTL ? 'سيتم حفظ إيميل Google للتسجيل السريع' : 'Google email will be saved for quick login'}
                    </p>
                  </div>
                </div>
                
                {/* Toggle Switch محسّن */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoLoginWithGoogle(!autoLoginWithGoogle)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    autoLoginWithGoogle 
                      ? 'bg-blue-600 shadow-lg' 
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <motion.span
                    animate={{ 
                      x: autoLoginWithGoogle ? (isRTL ? -20 : 20) : 0,
                      scale: autoLoginWithGoogle ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`inline-block h-5 w-5 transform rounded-full transition-all duration-300 ${
                      autoLoginWithGoogle ? 'bg-white shadow-lg' : 'bg-white'
                    }`}
                    style={{ 
                      marginLeft: isRTL ? (autoLoginWithGoogle ? '4px' : '24px') : '4px',
                      marginRight: isRTL ? '4px' : (autoLoginWithGoogle ? '4px' : '24px')
                    }}
                  />
                </motion.button>
              </div>
              
              {/* Google Sign-In Button */}
              {autoLoginWithGoogle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GoogleSignIn onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                  {formData.email && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {isRTL ? `مرتبط: ${formData.email}` : `Linked: ${formData.email}`}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

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

            {/* Email - للتسجيل فقط */}
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {isRTL ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>
            )}

            {/* Serial Number - فقط في تسجيل الدخول */}
            {isLogin && (
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
                  {isRTL ? 'الرقم التسلسلي مطلوب لتسجيل الدخول' : 'Serial number required for login'}
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
                  setFormData({ username: '', password: '', serialNumber: '', email: '' });
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
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
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

          {/* معلومات إضافية */}
          <div className={`mt-8 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
          } backdrop-blur-sm`}>
            <h4 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? 'كيف يعمل النظام؟' : 'How does it work?'}
            </h4>
            <div className="text-sm space-y-2">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• إنشاء حساب: اسم مستخدم + كلمة مرور فقط' : '• Register: Username + Password only'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• تسجيل دخول: اسم مستخدم + كلمة مرور + رقم تسلسلي' : '• Login: Username + Password + Serial Number'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• الرقم التسلسلي يُعطى تلقائياً عند التسجيل' : '• Serial number is auto-generated on registration'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• أول مستخدم يصبح أدمن تلقائياً' : '• First user becomes admin automatically'}
              </p>
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
                        <th className={`px-4 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('serialNumber')}
                        </th>
                        <th className={`px-4 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('status')}
                        </th>
                        <th className={`px-4 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {t('createdAt')}
                        </th>
                        <th className={`px-4 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
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