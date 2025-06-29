import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon,
  Sun,
  Moon,
  DollarSign,
  Globe,
  Palette,
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
  Bell,
  Shield,
  User,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Package,
  RefreshCw,
  Eye,
  Calendar,
  RotateCcw as RestoreIcon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import Modal from '../components/UI/Modal';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    currencies, 
    currentCurrency, 
    setCurrency,
    addNotification,
    products,
    sales,
    deletedSales,
    restoreSale,
    permanentlyDeleteSale,
    emptyTrash,
    formatPrice
  } = useStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    theme,
    language,
    currency: currentCurrency
  });

  const isRTL = i18n.language === 'ar';

  const handleSaveSettings = () => {
    if (tempSettings.theme !== theme) {
      toggleTheme();
    }
    
    if (tempSettings.language !== language) {
      setLanguage(tempSettings.language as 'en' | 'ar');
      i18n.changeLanguage(tempSettings.language);
      document.dir = tempSettings.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = tempSettings.language;
    }
    
    if (tempSettings.currency !== currentCurrency) {
      setCurrency(tempSettings.currency);
    }
    
    addNotification({ 
      type: 'success', 
      message: language === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!' 
    });
  };

  const handleResetSettings = () => {
    setTempSettings({
      theme: 'light',
      language: 'en',
      currency: 'EGP'
    });
    setIsResetModalOpen(false);
    addNotification({ 
      type: 'success', 
      message: language === 'ar' ? 'تم إعادة تعيين الإعدادات!' : 'Settings reset successfully!' 
    });
  };

  const exportData = () => {
    const data = {
      products,
      sales,
      deletedSales,
      settings: {
        theme,
        language,
        currency: currentCurrency
      },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stocksence-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addNotification({ 
      type: 'success', 
      message: language === 'ar' ? 'تم تصدير البيانات بنجاح!' : 'Data exported successfully!' 
    });
  };

  const handleRestoreSale = (saleId: string) => {
    restoreSale(saleId);
  };

  const handlePermanentlyDeleteSale = (saleId: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف النهائي؟' : 'Are you sure you want to permanently delete this sale?')) {
      permanentlyDeleteSale(saleId);
    }
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    setIsEmptyTrashModalOpen(false);
  };

  const settingsSections = [
    {
      id: 'appearance',
      title: language === 'ar' ? 'المظهر' : 'Appearance',
      icon: Palette,
      items: [
        {
          id: 'theme',
          title: language === 'ar' ? 'المود (الثيم)' : 'Theme Mode',
          description: language === 'ar' ? 'اختر بين المود الفاتح والمظلم' : 'Choose between light and dark mode',
          type: 'theme'
        },
        {
          id: 'language',
          title: language === 'ar' ? 'اللغة' : 'Language',
          description: language === 'ar' ? 'اختر لغة الواجهة' : 'Choose interface language',
          type: 'language'
        }
      ]
    },
    {
      id: 'currency',
      title: language === 'ar' ? 'العملة' : 'Currency',
      icon: DollarSign,
      items: [
        {
          id: 'currency',
          title: language === 'ar' ? 'العملة الأساسية' : 'Primary Currency',
          description: language === 'ar' ? 'اختر العملة لعرض الأسعار' : 'Choose currency for price display',
          type: 'currency'
        }
      ]
    },
    {
      id: 'data',
      title: t('dataManagement'),
      icon: Database,
      items: [
        {
          id: 'salesTrash',
          title: t('salesTrash'),
          description: t('salesTrashDesc'),
          type: 'salesTrash'
        },
        {
          id: 'export',
          title: language === 'ar' ? 'تصدير البيانات' : 'Export Data',
          description: language === 'ar' ? 'تصدير جميع البيانات كنسخة احتياطية' : 'Export all data as backup',
          type: 'export'
        },
        {
          id: 'reset',
          title: language === 'ar' ? 'إعادة تعيين الإعدادات' : 'Reset Settings',
          description: language === 'ar' ? 'إعادة جميع الإعدادات للقيم الافتراضية' : 'Reset all settings to default values',
          type: 'reset'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="w-full" style={{ paddingTop: '4rem' }}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('settings')}
                </h1>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'إدارة إعدادات التطبيق والتفضيلات' : 'Manage application settings and preferences'}
                </p>
              </div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                } shadow-lg`}
              >
                <SettingsIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {settingsSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className={`rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {/* Section Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <SectionIcon className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </motion.div>
                      <h2 className={`text-xl font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Section Items */}
                  <div className="p-4 sm:p-6 space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                        className={`p-4 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-700 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-medium mb-1 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {item.description}
                            </p>
                          </div>

                          <div className="ml-4">
                            {/* Theme Selector */}
                            {item.type === 'theme' && (
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTempSettings({ ...tempSettings, theme: 'light' })}
                                  className={`p-3 rounded-lg transition-all duration-300 ${
                                    tempSettings.theme === 'light'
                                      ? 'bg-yellow-500 text-white shadow-lg'
                                      : theme === 'dark'
                                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  <Sun className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTempSettings({ ...tempSettings, theme: 'dark' })}
                                  className={`p-3 rounded-lg transition-all duration-300 ${
                                    tempSettings.theme === 'dark'
                                      ? 'bg-gray-800 text-white shadow-lg'
                                      : theme === 'dark'
                                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  <Moon className="w-5 h-5" />
                                </motion.button>
                              </div>
                            )}

                            {/* Language Selector */}
                            {item.type === 'language' && (
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTempSettings({ ...tempSettings, language: 'en' })}
                                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    tempSettings.language === 'en'
                                      ? 'bg-blue-500 text-white shadow-lg'
                                      : theme === 'dark'
                                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  English
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTempSettings({ ...tempSettings, language: 'ar' })}
                                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    tempSettings.language === 'ar'
                                      ? 'bg-blue-500 text-white shadow-lg'
                                      : theme === 'dark'
                                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  العربية
                                </motion.button>
                              </div>
                            )}

                            {/* Currency Selector */}
                            {item.type === 'currency' && (
                              <select
                                value={tempSettings.currency}
                                onChange={(e) => setTempSettings({ ...tempSettings, currency: e.target.value })}
                                className={`px-4 py-2 border rounded-lg min-w-[200px] ${
                                  theme === 'dark'
                                    ? 'bg-gray-600 border-gray-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              >
                                {currencies.map((currency) => (
                                  <option key={currency.code} value={currency.code}>
                                    {currency.symbol} - {language === 'ar' ? currency.nameAr : currency.name}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Sales Trash */}
                            {item.type === 'salesTrash' && (
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  deletedSales.length > 0
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                }`}>
                                  {deletedSales.length} {t('trashItems')}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setIsTrashModalOpen(true)}
                                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  {t('viewTrash')}
                                </motion.button>
                              </div>
                            )}

                            {/* Export Button */}
                            {item.type === 'export' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={exportData}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {language === 'ar' ? 'تصدير' : 'Export'}
                              </motion.button>
                            )}

                            {/* Reset Button */}
                            {item.type === 'reset' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsResetModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Save Settings Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
            </motion.button>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-8 p-4 sm:p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? 'معلومات النظام' : 'System Information'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'الإصدار' : 'Version'}
                </p>
                <p className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  v1.0.0
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'المنتجات' : 'Products'}
                </p>
                <p className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {products.length}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'المبيعات' : 'Sales'}
                </p>
                <p className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {sales.length}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'سلة القمامة' : 'Trash'}
                </p>
                <p className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {deletedSales.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={language === 'ar' ? 'تأكيد إعادة التعيين' : 'Confirm Reset'}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' 
                  ? 'سيتم إعادة جميع الإعدادات إلى القيم الافتراضية. لا يمكن التراجع عن هذا الإجراء.'
                  : 'All settings will be reset to default values. This action cannot be undone.'
                }
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsResetModalOpen(false)}
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetSettings}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Sales Trash Modal */}
      <Modal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        title={`${t('salesTrash')} (${deletedSales.length})`}
      >
        <div className="space-y-4">
          {/* Empty Trash Button */}
          {deletedSales.length > 0 && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {deletedSales.length} {t('trashItems')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEmptyTrashModalOpen(true)}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('emptyTrash')}
              </motion.button>
            </div>
          )}

          {/* Deleted Sales List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {deletedSales.length === 0 ? (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('noItemsInTrash')}</p>
              </div>
            ) : (
              deletedSales.map((sale) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'border-gray-700 bg-gray-700/50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {sale.productName}
                      </h4>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse mt-1">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {t('quantity')}: {sale.quantity}
                        </span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {formatPrice(sale.totalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('deletedOn')}: {new Date(sale.deletedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRestoreSale(sale.id)}
                        className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title={t('restoreSale')}
                      >
                        <RestoreIcon className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePermanentlyDeleteSale(sale.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('permanentlyDelete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Empty Trash Confirmation Modal */}
      <Modal
        isOpen={isEmptyTrashModalOpen}
        onClose={() => setIsEmptyTrashModalOpen(false)}
        title={t('emptyTrash')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('confirmEmptyTrash')}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' 
                  ? `سيتم حذف ${deletedSales.length} عنصر نهائياً. لا يمكن التراجع عن هذا الإجراء.`
                  : `${deletedSales.length} items will be permanently deleted. This action cannot be undone.`
                }
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEmptyTrashModalOpen(false)}
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEmptyTrash}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              {t('emptyTrash')}
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;