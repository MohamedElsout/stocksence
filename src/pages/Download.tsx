import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Download as DownloadIcon,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Package,
  Zap,
  Shield,
  Rocket,
  Star,
  Globe,
  Clock,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const Download: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, addNotification } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installationStep, setInstallationStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // التحقق من حالة التثبيت
    const checkInstallation = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // مراقبة حالة الإنترنت
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // مراقبة إمكانية التثبيت
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // مراقبة التثبيت الناجح
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      addNotification({
        type: 'success',
        message: isRTL ? 'تم تثبيت التطبيق بنجاح! 🎉' : 'App installed successfully! 🎉'
      });
    };

    checkInstallation();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addNotification, isRTL]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      addNotification({
        type: 'warning',
        message: isRTL 
          ? 'التثبيت غير متاح حالياً. تأكد من استخدام متصفح متوافق.'
          : 'Installation not available. Please use a compatible browser.'
      });
      return;
    }

    setIsInstalling(true);
    setInstallationStep(1);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallationStep(2);
        setTimeout(() => {
          setInstallationStep(3);
          setIsInstalling(false);
        }, 2000);
      } else {
        setIsInstalling(false);
        setInstallationStep(0);
        addNotification({
          type: 'warning',
          message: isRTL ? 'تم إلغاء التثبيت' : 'Installation cancelled'
        });
      }
    } catch (error) {
      setIsInstalling(false);
      setInstallationStep(0);
      addNotification({
        type: 'error',
        message: isRTL ? 'حدث خطأ أثناء التثبيت' : 'Installation error occurred'
      });
    }
  };

  const features = [
    {
      icon: WifiOff,
      title: isRTL ? 'يعمل بدون إنترنت' : 'Works Offline',
      description: isRTL 
        ? 'استخدم النظام بدون اتصال بالإنترنت مع حفظ جميع البيانات محلياً'
        : 'Use the system without internet connection with all data saved locally',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Zap,
      title: isRTL ? 'سرعة فائقة' : 'Lightning Fast',
      description: isRTL
        ? 'تحميل فوري للصفحات مع أداء محسّن للتطبيقات المحلية'
        : 'Instant page loading with optimized performance for local apps',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Shield,
      title: isRTL ? 'آمان تام' : 'Fully Secure',
      description: isRTL
        ? 'بياناتك محفوظة محلياً على جهازك بدون إرسالها لأي خادم خارجي'
        : 'Your data is stored locally on your device without sending to external servers',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: HardDrive,
      title: isRTL ? 'مساحة قليلة' : 'Small Storage',
      description: isRTL
        ? 'يحتاج مساحة قليلة جداً (أقل من 5 ميجابايت) على جهازك'
        : 'Requires very little space (less than 5MB) on your device',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const steps = [
    {
      title: isRTL ? 'اضغط على زر التحميل' : 'Click Download Button',
      description: isRTL ? 'اضغط على الزر أدناه لبدء عملية التثبيت' : 'Click the button below to start installation',
      icon: DownloadIcon
    },
    {
      title: isRTL ? 'اختر "تثبيت"' : 'Choose "Install"',
      description: isRTL ? 'ستظهر نافذة من المتصفح، اختر "تثبيت" أو "Install"' : 'A browser window will appear, choose "Install"',
      icon: CheckCircle
    },
    {
      title: isRTL ? 'استمتع بالتطبيق' : 'Enjoy the App',
      description: isRTL ? 'سيظهر التطبيق على سطح المكتب ويمكنك استخدامه بدون إنترنت' : 'The app will appear on desktop and you can use it offline',
      icon: Star
    }
  ];

  const deviceSupport = [
    {
      icon: Monitor,
      title: isRTL ? 'الكمبيوتر' : 'Desktop',
      description: isRTL ? 'Windows, Mac, Linux' : 'Windows, Mac, Linux',
      browsers: ['Chrome', 'Edge', 'Firefox', 'Opera']
    },
    {
      icon: Smartphone,
      title: isRTL ? 'الموبايل' : 'Mobile',
      description: isRTL ? 'Android, iOS' : 'Android, iOS',
      browsers: ['Chrome', 'Edge Mobile', 'Safari', 'Samsung Internet']
    }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="w-full" style={{ paddingTop: '4rem' }}>
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`inline-flex p-6 rounded-full mb-6 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
              } shadow-2xl`}
            >
              <Package className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? '📥 تحميل النظام' : '📥 Download System'}
            </h1>
            
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isRTL 
                ? 'حمّل StockSence كتطبيق مستقل على جهازك واستخدمه بدون إنترنت مع جميع الميزات'
                : 'Download StockSence as a standalone app on your device and use it offline with all features'
              }
            </p>

            {/* Status Indicators */}
            <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse mb-8">
              <div className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full ${
                isOnline 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isOnline 
                    ? (isRTL ? 'متصل' : 'Online')
                    : (isRTL ? 'غير متصل' : 'Offline')
                  }
                </span>
              </div>

              <div className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full ${
                isInstalled
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {isInstalled ? <CheckCircle className="w-4 h-4" /> : <DownloadIcon className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isInstalled 
                    ? (isRTL ? 'مثبت' : 'Installed')
                    : (isRTL ? 'غير مثبت' : 'Not Installed')
                  }
                </span>
              </div>
            </div>
          </motion.div>

          {/* Installation Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            {isInstalled ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center px-8 py-4 rounded-xl ${
                  theme === 'dark' ? 'bg-green-800' : 'bg-green-100'
                } border-2 border-green-500`}
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-800'
                }`}>
                  {isRTL ? '✅ التطبيق مثبت بنجاح!' : '✅ App Successfully Installed!'}
                </span>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                disabled={!isInstallable || isInstalling}
                className={`inline-flex items-center px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 ${
                  isInstallable && !isInstalling
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-3xl'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isInstalling ? (
                  <>
                    <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                    {isRTL ? 'جاري التثبيت...' : 'Installing...'}
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-6 h-6 mr-3" />
                    {isRTL ? '📱 تثبيت التطبيق' : '📱 Install App'}
                  </>
                )}
              </motion.button>
            )}

            {!isInstallable && !isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`mt-4 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
                } border border-yellow-500/30`}
              >
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
                  }`}>
                    {isRTL 
                      ? 'التثبيت متاح فقط في المتصفحات المتوافقة (Chrome, Edge, Safari, Firefox)'
                      : 'Installation available only in compatible browsers (Chrome, Edge, Safari, Firefox)'
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Installation Steps */}
          {installationStep > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-16 p-8 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <h3 className={`text-2xl font-bold text-center mb-8 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isRTL ? 'خطوات التثبيت' : 'Installation Progress'}
              </h3>
              
              <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: installationStep >= step ? 1.1 : 0.8,
                        opacity: installationStep >= step ? 1 : 0.5
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        installationStep >= step
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {installationStep > step ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : installationStep === step ? (
                        <RefreshCw className="w-8 h-8 animate-spin" />
                      ) : (
                        <span className="text-xl font-bold">{step}</span>
                      )}
                    </motion.div>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {isRTL ? `الخطوة ${step}` : `Step ${step}`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className={`text-3xl font-bold text-center mb-12 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? '🚀 مميزات التطبيق المحلي' : '🚀 Local App Features'}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-6 rounded-xl text-center ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-white hover:bg-gray-50'
                    } shadow-lg hover:shadow-xl transition-all duration-300 border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-full mb-4 ${feature.bgColor}`}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* How to Install */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className={`text-3xl font-bold text-center mb-12 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? '📋 خطوات التثبيت' : '📋 Installation Steps'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-6 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                          theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Device Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className={`text-3xl font-bold text-center mb-12 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? '📱 الأجهزة المدعومة' : '📱 Supported Devices'}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {deviceSupport.map((device, index) => {
                const Icon = device.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-8 rounded-xl text-center ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-full mb-6 ${
                        theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                      }`}
                    >
                      <Icon className="w-12 h-12 text-purple-500" />
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {device.title}
                    </h3>
                    <p className={`text-lg mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {device.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {device.browsers.map((browser) => (
                        <span
                          key={browser}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            browser === 'Edge' || browser === 'Edge Mobile'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 ring-2 ring-blue-500/30'
                              : theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {browser}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Microsoft Edge Highlight Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mb-16 p-8 rounded-2xl ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-50 to-purple-50'
            } border-2 border-blue-500/30 shadow-xl`}
          >
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex p-4 rounded-full bg-blue-500 mb-6"
              >
                <Monitor className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isRTL ? '🌟 دعم محسّن لمتصفح Microsoft Edge' : '🌟 Enhanced Microsoft Edge Support'}
              </h2>
              
              <p className={`text-lg mb-6 max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isRTL 
                  ? 'الآن يمكنك تثبيت StockSence بسهولة على متصفح Microsoft Edge مع دعم كامل لجميع الميزات والتحديثات التلقائية'
                  : 'Now you can easily install StockSence on Microsoft Edge browser with full support for all features and automatic updates'
                }
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm`}>
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'أداء محسّن' : 'Enhanced Performance'}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {isRTL 
                      ? 'تحسينات خاصة لمتصفح Edge لأداء أسرع'
                      : 'Special optimizations for Edge browser for faster performance'
                    }
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm`}>
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'أمان متقدم' : 'Advanced Security'}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {isRTL 
                      ? 'استفادة من ميزات الأمان المتقدمة في Edge'
                      : 'Leverage advanced security features in Edge'
                    }
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm`}>
                  <RefreshCw className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'تحديثات تلقائية' : 'Auto Updates'}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {isRTL 
                      ? 'تحديثات سلسة وتلقائية عبر Edge'
                      : 'Seamless and automatic updates via Edge'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-8 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2 className={`text-3xl font-bold text-center mb-8 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isRTL ? '❓ أسئلة شائعة' : '❓ Frequently Asked Questions'}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isRTL ? 'هل يحتاج إنترنت للعمل؟' : 'Does it need internet to work?'}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isRTL 
                    ? 'لا، بعد التثبيت يعمل التطبيق بدون إنترنت تماماً مع حفظ جميع البيانات محلياً.'
                    : 'No, after installation the app works completely offline with all data saved locally.'
                  }
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isRTL ? 'كم المساحة المطلوبة؟' : 'How much storage is required?'}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isRTL 
                    ? 'أقل من 5 ميجابايت فقط، مساحة قليلة جداً مقارنة بالتطبيقات العادية.'
                    : 'Less than 5MB only, very small space compared to regular applications.'
                  }
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isRTL ? 'هل البيانات آمنة؟' : 'Is the data secure?'}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isRTL 
                    ? 'نعم، جميع البيانات محفوظة على جهازك فقط ولا يتم إرسالها لأي مكان آخر.'
                    : 'Yes, all data is stored only on your device and is not sent anywhere else.'
                  }
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isRTL ? 'هل يعمل على Microsoft Edge؟' : 'Does it work on Microsoft Edge?'}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isRTL 
                    ? 'نعم! يعمل بشكل مثالي على Microsoft Edge مع دعم كامل لجميع الميزات والتحديثات.'
                    : 'Yes! Works perfectly on Microsoft Edge with full support for all features and updates.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Download;