import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Shield, 
  Hash, 
  Eye, 
  EyeOff, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Users, 
  Key, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Crown,
  Briefcase,
  Lock,
  UserPlus,
  Settings as SettingsIcon,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import Modal from '../components/UI/Modal';

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    theme, 
    currentUser, 
    users, 
    serialNumbers, 
    addSerialNumber, 
    removeSerialNumber,
    addNotification 
  } = useStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddSerialModalOpen, setIsAddSerialModalOpen] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [editForm, setEditForm] = useState({
    username: currentUser?.username || '',
    password: currentUser?.password || ''
  });

  const isRTL = i18n.language === 'ar';
  const isAdmin = currentUser?.role === 'admin';

  const handleSaveProfile = () => {
    // Here you would typically update the user profile
    // For now, we'll just show a success message
    addNotification({
      type: 'success',
      message: isRTL ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!'
    });
    setIsEditingProfile(false);
  };

  const handleAddSerialNumber = () => {
    if (newSerialNumber.trim()) {
      addSerialNumber(newSerialNumber.trim());
      setNewSerialNumber('');
      setIsAddSerialModalOpen(false);
    }
  };

  // التحقق من صحة الرقم التسلسلي (6 أرقام فقط)
  const isValidSerial = (serial: string) => {
    return /^\d{6}$/.test(serial);
  };

  const userStats = [
    {
      icon: Users,
      label: isRTL ? 'إجمالي المستخدمين' : 'Total Users',
      value: users.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      adminOnly: true
    },
    {
      icon: Key,
      label: isRTL ? 'الأرقام التسلسلية' : 'Serial Numbers',
      value: serialNumbers.length,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      adminOnly: true
    },
    {
      icon: CheckCircle,
      label: isRTL ? 'أرقام مستخدمة' : 'Used Numbers',
      value: serialNumbers.filter(s => s.isUsed).length,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      adminOnly: true
    },
    {
      icon: Calendar,
      label: isRTL ? 'تاريخ الانضمام' : 'Member Since',
      value: currentUser ? new Date(currentUser.createdAt).toLocaleDateString() : '',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      adminOnly: false
    }
  ];

  const filteredStats = userStats.filter(stat => !stat.adminOnly || isAdmin);

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{isRTL ? 'لم يتم العثور على بيانات المستخدم' : 'User data not found'}</p>
        </div>
      </div>
    );
  }

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
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isRTL ? 'الملف الشخصي' : 'User Profile'}
                </h1>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isRTL ? 'إدارة معلومات حسابك الشخصي' : 'Manage your account information'}
                </p>
              </div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`p-3 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                } shadow-lg`}
              >
                {currentUser.role === 'admin' ? (
                  <Crown className="w-8 h-8 text-white" />
                ) : (
                  <Briefcase className="w-8 h-8 text-white" />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-lg ${stat.bgColor}`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </motion.div>
                  </div>
                  
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`lg:col-span-2 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'معلومات الحساب' : 'Account Information'}
                  </h3>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      isEditingProfile
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isEditingProfile ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        {isRTL ? 'تعديل' : 'Edit'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture & Role */}
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      currentUser.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-700'
                    } shadow-lg`}
                  >
                    {currentUser.role === 'admin' ? (
                      <Crown className="w-12 h-12 text-white" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </motion.div>
                  
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentUser.username}
                    </h2>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {currentUser.role === 'admin' ? (
                          <>
                            <Crown className="w-4 h-4 inline mr-1" />
                            {isRTL ? 'مدير النظام' : 'Administrator'}
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-4 h-4 inline mr-1" />
                            {isRTL ? 'موظف' : 'Employee'}
                          </>
                        )}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentUser.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {currentUser.isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {isRTL ? 'نشط' : 'Active'}
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 inline mr-1" />
                            {isRTL ? 'غير نشط' : 'Inactive'}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Details Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isRTL ? 'اسم المستخدم' : 'Username'}
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    ) : (
                      <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}>
                        <User className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {currentUser.username}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isRTL ? 'كلمة المرور' : 'Password'}
                    </label>
                    {isEditingProfile ? (
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          } transition-colors`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    ) : (
                      <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}>
                        <Lock className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {'•'.repeat(8)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowPassword(!showPassword)}
                          className={`ml-auto ${
                            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          } transition-colors`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Serial Number */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isRTL ? 'الرقم التسلسلي' : 'Serial Number'}
                    </label>
                    <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <Hash className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`font-mono text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentUser.serialNumber || (isRTL ? 'غير محدد' : 'Not assigned')}
                      </span>
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        currentUser.serialNumber
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {currentUser.serialNumber ? (isRTL ? 'مُعيّن' : 'Assigned') : (isRTL ? 'غير مُعيّن' : 'Unassigned')}
                      </span>
                    </div>
                    {currentUser.serialNumber && (
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {isRTL ? 'رقم تسلسلي بسيط من 6 أرقام' : 'Simple 6-digit serial number'}
                      </p>
                    )}
                  </div>

                  {/* Created At */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isRTL ? 'تاريخ الإنشاء' : 'Created At'}
                    </label>
                    <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <Calendar className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* User ID */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isRTL ? 'معرف المستخدم' : 'User ID'}
                    </label>
                    <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <Hash className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`font-mono text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentUser.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditingProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingProfile(false)}
                      className={`px-4 py-2 border rounded-lg ${
                        theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isRTL ? 'حفظ التغييرات' : 'Save Changes'}</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Admin Panel - Serial Numbers Management */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isRTL ? 'إدارة الأرقام التسلسلية' : 'Serial Numbers Management'}
                    </h3>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddSerialModalOpen(true)}
                      className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isRTL ? 'إضافة' : 'Add'}
                    </motion.button>
                  </div>
                  
                  {/* تنبيه حول الأرقام التسلسلية */}
                  <div className={`mt-4 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  } border border-blue-500/30`}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <AlertTriangle className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {isRTL ? 'الأرقام التسلسلية يجب أن تكون 6 أرقام فقط' : 'Serial numbers must be exactly 6 digits'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {serialNumbers.map((serial, index) => (
                      <motion.div
                        key={serial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-700 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Hash className={`w-4 h-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <span className={`font-mono text-lg font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {serial.serialNumber}
                              </span>
                              {serial.serialNumber.length === 6 && /^\d{6}$/.test(serial.serialNumber) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                serial.isUsed
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              }`}>
                                {serial.isUsed ? (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    {isRTL ? 'مستخدم' : 'Used'}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {isRTL ? 'متاح' : 'Available'}
                                  </>
                                )}
                              </span>
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {new Date(serial.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
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
                        </div>
                      </motion.div>
                    ))}
                    
                    {serialNumbers.length === 0 && (
                      <div className={`text-center py-8 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>{isRTL ? 'لا توجد أرقام تسلسلية' : 'No serial numbers found'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Employee View - Limited Info */}
            {!isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'معلومات إضافية' : 'Additional Information'}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  } border border-blue-500/30`}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {isRTL ? 'صلاحيات الموظف' : 'Employee Permissions'}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {isRTL 
                        ? 'يمكنك عرض وإدارة المنتجات والمبيعات والتقارير'
                        : 'You can view and manage products, sales, and reports'
                      }
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                  } border border-green-500/30`}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {isRTL ? 'الأمان' : 'Security'}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {isRTL 
                        ? 'حسابك محمي برقم تسلسلي فريد من 6 أرقام وكلمة مرور آمنة'
                        : 'Your account is protected with a unique 6-digit serial number and secure password'
                      }
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                  } border border-purple-500/30`}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <SettingsIcon className="w-5 h-5 text-purple-500" />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {isRTL ? 'الإعدادات' : 'Settings'}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {isRTL 
                        ? 'يمكنك تخصيص إعدادات النظام من صفحة الإعدادات'
                        : 'You can customize system settings from the settings page'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Serial Number Modal */}
      <Modal
        isOpen={isAddSerialModalOpen}
        onClose={() => {
          setIsAddSerialModalOpen(false);
          setNewSerialNumber('');
        }}
        title={isRTL ? 'إضافة رقم تسلسلي جديد' : 'Add New Serial Number'}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {isRTL ? 'الرقم التسلسلي (6 أرقام)' : 'Serial Number (6 digits)'}
            </label>
            <input
              type="text"
              value={newSerialNumber}
              onChange={(e) => {
                // السماح بالأرقام فقط وحد أقصى 6 أرقام
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setNewSerialNumber(value);
              }}
              placeholder={isRTL ? 'مثال: 123456' : 'Example: 123456'}
              className={`w-full px-3 py-2 border rounded-lg font-mono text-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                newSerialNumber && !isValidSerial(newSerialNumber) 
                  ? 'border-red-500 focus:ring-red-500' 
                  : ''
              }`}
              maxLength={6}
            />
            
            {/* Validation Message */}
            {newSerialNumber && !isValidSerial(newSerialNumber) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 flex items-center space-x-1 rtl:space-x-reverse"
              >
                <XCircle className="w-4 h-4" />
                <span>
                  {isRTL ? 'يجب أن يكون 6 أرقام فقط' : 'Must be exactly 6 digits'}
                </span>
              </motion.p>
            )}
            
            {newSerialNumber && isValidSerial(newSerialNumber) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 text-sm mt-1 flex items-center space-x-1 rtl:space-x-reverse"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isRTL ? 'رقم تسلسلي صحيح' : 'Valid serial number'}
                </span>
              </motion.p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsAddSerialModalOpen(false);
                setNewSerialNumber('');
              }}
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSerialNumber}
              disabled={!newSerialNumber.trim() || !isValidSerial(newSerialNumber)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة' : 'Add'}</span>
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;