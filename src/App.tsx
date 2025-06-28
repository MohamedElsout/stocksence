import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from './store/useStore';
import Header from './components/Layout/Header';
import Notification from './components/UI/Notification';
import './i18n';

// Lazy load components for better performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Reports = React.lazy(() => import('./pages/Reports'));
const About = React.lazy(() => import('./pages/About'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Download = React.lazy(() => import('./pages/Download'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const { theme, language, currentCurrency, setCurrency, addNotification } = useStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    try {
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      // Apply language direction
      document.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      // Change i18n language
      i18n.changeLanguage(language);
      
      // Load saved currency
      const savedCurrency = localStorage.getItem('currency');
      if (savedCurrency && savedCurrency !== currentCurrency) {
        setCurrency(savedCurrency);
      }

      // Register Service Worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
              console.log('✅ SW registered: ', registration);
              
              // Check for updates
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      addNotification({
                        type: 'success',
                        message: language === 'ar' 
                          ? 'تحديث جديد متاح! أعد تحميل الصفحة للحصول على أحدث إصدار.'
                          : 'New update available! Reload the page to get the latest version.'
                      });
                    }
                  });
                }
              });
            })
            .catch((registrationError) => {
              console.log('❌ SW registration failed: ', registrationError);
            });
        });
      }

      // Handle PWA install prompt
      let deferredPrompt: any;
      
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install notification after 3 seconds
        setTimeout(() => {
          addNotification({
            type: 'success',
            message: language === 'ar' 
              ? '📱 يمكنك تثبيت StockSence كتطبيق! اذهب لصفحة "تحميل النظام"'
              : '📱 You can install StockSence as an app! Go to "Download System" page'
          });
        }, 3000);
      };

      const handleAppInstalled = () => {
        addNotification({
          type: 'success',
          message: language === 'ar' 
            ? '🎉 تم تثبيت StockSence بنجاح! يمكنك الآن استخدامه بدون إنترنت'
            : '🎉 StockSence installed successfully! You can now use it offline'
        });
        deferredPrompt = null;
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    } catch (error) {
      console.error('Error in App useEffect:', error);
    }
  }, [theme, language, i18n, currentCurrency, setCurrency, addNotification]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Header />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/about" element={<About />} />
              <Route path="/download" element={<Download />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
        <Notification />
      </div>
    </Router>
  );
}

export default App;