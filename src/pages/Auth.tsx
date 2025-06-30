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
  Globe,
  Building,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';

// Google Login Component - مدمج في نفس الملف
declare global {
  interface Window {
    google: any;
    googleLoginCallback: (response: any) => void;
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, addNotification, loginWithGoogle } = useStore();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: '471947379169-237jmoal7gd9e5vflqs5br3851bngchn.apps.googleusercontent.com',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      if (response.credential) {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const googleUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          verified_email: payload.email_verified
        };

        // Login with Google
        const success = await loginWithGoogle(googleUser);
        
        if (success) {
          addNotification({
            type: 'success',
            message: isRTL 
              ? `مرحباً ${googleUser.name}! تم تسجيل الدخول بنجاح عبر Google` 
              : `Welcome ${googleUser.name}! Successfully logged in with Google`
          });
          
          onSuccess?.();
          navigate('/dashboard');
        } else {
          throw new Error('Google login failed');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = isRTL 
        ? 'فشل في تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.' 
        : 'Google login failed. Please try again.';
      
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      onError?.(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      addNotification({
        type: 'error',
        message: isRTL 
          ? 'خدمة Google غير متاحة حالياً' 
          : 'Google service is not available'
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleLogin}
      className={`w-full flex items-center justify-center px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
        theme === 'dark'
          ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
      } shadow-lg hover:shadow-xl`}
    >
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* Google Logo SVG */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        
        <span className="text-sm font-medium">
          {isRTL ? 'تسجيل الدخول بحساب Google' : 'Continue with Google'}
        </span>
      </div>
    </motion.button>
  );
};

const Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    theme, 
    currentUser, 
    isAuthenticated, 
    users, 
    serialNumbers, 
    addSerialNumber, 
    removeSerialNumber,
    login, 
    register, 
    logout, 
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
    companyId: '',
    email: ''
  });

  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.username, formData.password, formData.companyId);
      } else {
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
    if (newSerialNumber.trim() && /^\d{6}$/.test(newSerialNumber.trim())) {
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

          {/* Test Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-green-900/20 border-green-500/50' 
                : 'bg-green-50 border-green-300'
            }`}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Info className="w-5 h-5 text-green-500" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {t('testAccountInfo')}
              </span>
            </div>
          </motion.div>

          {/* Google Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GoogleLoginButton 
              onSuccess={() => navigate('/dashboard')}
              onError={(error) => console.error('Google login error:', error)}
            />
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className={`absolute inset-0 flex items-center ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-full border-t ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
              }`}>
                {isRTL ? 'أو' : 'OR'}
              </span>
            </div>
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
                  <Building className="w-5 h-5 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {isRTL ? 'مطلوب: اسم المستخدم، كلمة المرور، ورقم الشركة' : 'Required: Username, Password, and Company ID'}
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

            {/* Company ID - فقط في تسجيل الدخول */}
            {isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('companyId')} *
                </label>
                <div className="relative">
                  <Building className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder={t('companyIdPlaceholder')}
                    required
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isRTL ? 'رقم الشركة مطلوب لتسجيل الدخول' : 'Company ID required for login'}
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
                  setFormData({ username: '', password: '', companyId: '', email: '' });
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
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
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
              <Building className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isRTL ? 'إدارة الشركات' : 'Company Management'}
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
                {isRTL ? '• تسجيل دخول: اسم مستخدم + كلمة مرور + رقم الشركة' : '• Login: Username + Password + Company ID'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• رقم الشركة يُعطى تلقائياً عند التسجيل' : '• Company ID is auto-generated on registration'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• أول مستخدم يصبح أدمن تلقائياً' : '• First user becomes admin automatically'}
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? '• تسجيل دخول سريع بحساب Google' : '• Quick login with Google account'}
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setNewSerialNumber(value);
                    }}
                    placeholder={isRTL ? 'مثال: 123456' : 'Example: 123456'}
                    className={`flex-1 px-3 py-2 border rounded-lg font-mono ${
                      theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      newSerialNumber && !/^\d{6}$/.test(newSerialNumber) 
                        ? 'border-red-500 focus:ring-red-500' 
                        : ''
                    }`}
                    maxLength={6}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddSerialNumber}
                    disabled={!newSerialNumber.trim() || !/^\d{6}$/.test(newSerialNumber)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                {newSerialNumber && !/^\d{6}$/.test(newSerialNumber) && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1 rtl:space-x-reverse">
                    <XCircle className="w-4 h-4" />
                    <span>{isRTL ? 'يجب أن يكون 6 أرقام فقط' : 'Must be exactly 6 digits'}</span>
                  </p>
                )}
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
                          <td className={`px-4 py-4 whitespace-nowrap font-mono text-lg font-bold ${
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