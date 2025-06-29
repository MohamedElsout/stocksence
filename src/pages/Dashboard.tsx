import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  Eye,
  Filter,
  Download,
  Hash,
  Copy,
  CheckCircle,
  Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import Modal from '../components/UI/Modal';
import AnimatedCounter from '../components/UI/AnimatedCounter';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    theme, 
    sales,
    formatPrice,
    convertPrice,
    currentCurrency
  } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: ''
  });

  const isRTL = i18n.language === 'ar';

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const lowStockItems = products.filter(product => product.quantity < 5).length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const categories = [...new Set(products.map(p => p.category))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      addProduct(formData);
    }
    setFormData({ name: '', description: '', quantity: 0, price: 0, category: '' });
    setIsAddModalOpen(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      category: product.category
    });
    setIsAddModalOpen(true);
  };

  const handleView = (product: any) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteProduct(id);
    }
  };

  const copySerialNumber = async (serialNumber: string) => {
    try {
      await navigator.clipboard.writeText(serialNumber);
      setCopiedSerial(serialNumber);
      setTimeout(() => setCopiedSerial(null), 2000);
    } catch (err) {
      console.error('Failed to copy serial number:', err);
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Description,Quantity,Price,Category,Serial Number,Created At\n"
      + products.map(p => `"${p.name}","${p.description}",${p.quantity},${p.price},"${p.category}","${p.serialNumber}","${p.createdAt}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    {
      icon: Package,
      label: t('totalProducts'),
      value: products.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%'
    },
    {
      icon: DollarSign,
      label: t('totalValue'),
      value: totalValue,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      isPrice: true,
      change: '+8.5%'
    },
    {
      icon: TrendingUp,
      label: t('totalRevenue'),
      value: totalRevenue,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      isPrice: true,
      change: '+15.3%'
    },
    {
      icon: AlertTriangle,
      label: t('lowStockItems'),
      value: lowStockItems,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: '-5%'
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('dashboardTitle')}
                </h1>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('dashboardSubtitle')}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('exportData')}
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`p-4 sm:p-6 rounded-xl shadow-lg ${
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
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.change.startsWith('+') 
                        ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                        : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                    <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                      {stat.isPrice ? (
                        formatPrice(stat.value)
                      ) : (
                        <AnimatedCounter 
                          end={stat.value} 
                          duration={1.5}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            {/* Products Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('productsManagement')} ({filteredProducts.length})
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      placeholder={t('search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg w-full sm:w-64 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg w-full sm:w-48 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">{t('allCategories')}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Add Product Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addProduct')}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">{t('noProductsFound')}</p>
                    <p className="text-sm">{t('addSomeProducts')}</p>
                  </motion.div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <tr>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('productName')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('serialNumber')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('category')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('quantity')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('price')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('totalValueProduct')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        } transition-colors`}
                      >
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description}
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono text-sm px-2 py-1 rounded ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.serialNumber}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copySerialNumber(product.serialNumber)}
                              className={`p-1 rounded transition-colors ${
                                copiedSerial === product.serialNumber
                                  ? 'text-green-500'
                                  : theme === 'dark' 
                                  ? 'text-gray-400 hover:text-white' 
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title="Copy Serial Number"
                            >
                              {copiedSerial === product.serialNumber ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.category}
                          </span>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            product.quantity < 5
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : product.quantity < 10
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatPrice(product.price)}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-semibold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {formatPrice(product.quantity * product.price)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleView(product)}
                              className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
          setFormData({ name: '', description: '', quantity: 0, price: 0, category: '' });
        }}
        title={editingProduct ? t('editProduct') : t('addProduct')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('productName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('quantity')} *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                min="0"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('price')} (EGP) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                min="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('category')} *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>

          {!editingProduct && (
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            } border border-blue-500/30`}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Info className="w-5 h-5 text-blue-500" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {t('serialNumberAutoGenerated')}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
                setFormData({ name: '', description: '', quantity: 0, price: 0, category: '' });
              }}
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {t('cancel')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              {t('save')}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* View Product Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        title={t('productDetails')}
      >
        {viewingProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('productName')}
                </label>
                <p className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {viewingProduct.name}
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('category')}
                </label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {viewingProduct.category}
                </span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('serialNumber')}
              </label>
              <div className="flex items-center space-x-2">
                <span className={`font-mono text-lg px-3 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  {viewingProduct.serialNumber}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copySerialNumber(viewingProduct.serialNumber)}
                  className={`p-2 rounded-lg transition-colors ${
                    copiedSerial === viewingProduct.serialNumber
                      ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                      : theme === 'dark' 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Copy Serial Number"
                >
                  {copiedSerial === viewingProduct.serialNumber ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('description')}
              </label>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {viewingProduct.description || t('noDescriptionAvailable')}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('quantity')}
                </label>
                <p className={`text-xl font-bold ${
                  viewingProduct.quantity < 5 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {viewingProduct.quantity}
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('price')}
                </label>
                <p className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatPrice(viewingProduct.price)}
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('totalValueProduct')}
                </label>
                <p className={`text-xl font-bold text-green-500`}>
                  {formatPrice(viewingProduct.quantity * viewingProduct.price)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('createdAt')}
                </label>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(viewingProduct.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('lastUpdated')}
                </label>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(viewingProduct.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;