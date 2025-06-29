import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Receipt,
  Scan,
  Hash,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import Modal from '../components/UI/Modal';
import AnimatedCounter from '../components/UI/AnimatedCounter';

const Sales: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, sales, addSale, theme, formatPrice } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    barcodeScan: false,
  });

  const isRTL = i18n.language === 'ar';

  const selectedProduct = products.find(p => p.id === saleForm.productId);
  const totalAmount = selectedProduct ? selectedProduct.price * saleForm.quantity : 0;

  const filteredSales = sales.filter(sale =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.saleDate);
    return saleDate.toDateString() === today.toDateString();
  });

  const barcodeSales = sales.filter(sale => sale.barcodeScan).length;

  const handleSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    if (selectedProduct.quantity < saleForm.quantity) {
      return;
    }

    addSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: saleForm.quantity,
      price: selectedProduct.price,
      totalAmount: totalAmount,
      barcodeScan: saleForm.barcodeScan,
    });

    setSaleForm({ productId: '', quantity: 1, barcodeScan: false });
    setIsSaleModalOpen(false);
  };

  const stats = [
    {
      icon: DollarSign,
      label: t('totalAmount'),
      value: totalSalesValue,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      isPrice: true
    },
    {
      icon: Package,
      label: t('itemsSold'),
      value: totalItemsSold,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: TrendingUp,
      label: t('todaysSales'),
      value: todaySales.length,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Scan,
      label: isRTL ? 'مبيعات الباركود' : 'Barcode Sales',
      value: barcodeSales,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
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
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('salesTitle')}
            </h1>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('salesSubtitle')}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
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
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-lg ${stat.bgColor}`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sales Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            {/* Sales Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('salesHistory')}
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      placeholder={t('searchSales')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg w-full sm:w-64 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  
                  {/* New Sale Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSaleModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('sellProduct')}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-x-auto">
              {filteredSales.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">{t('noSalesRecorded')}</p>
                    <p className="text-sm">{t('startSelling')}</p>
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
                        {t('quantity')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('unitPrice')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('totalAmount')}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {isRTL ? 'طريقة البيع' : 'Sale Method'}
                      </th>
                      <th className={`px-4 sm:px-6 py-3 text-${isRTL ? 'right' : 'left'} text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {t('saleDate')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {filteredSales.map((sale, index) => (
                      <motion.tr
                        key={sale.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`hover:${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        } transition-colors`}
                      >
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {sale.productName}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            theme === 'dark' 
                              ? 'bg-blue-900/20 text-blue-400' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sale.quantity}
                          </span>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {formatPrice(sale.price)}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-semibold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {formatPrice(sale.totalAmount)}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            sale.barcodeScan
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {sale.barcodeScan ? (
                              <>
                                <Scan className="w-3 h-3 mr-1" />
                                {isRTL ? 'باركود' : 'Barcode'}
                              </>
                            ) : (
                              <>
                                <Hash className="w-3 h-3 mr-1" />
                                {isRTL ? 'يدوي' : 'Manual'}
                              </>
                            )}
                          </span>
                        </td>
                        <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(sale.saleDate).toLocaleDateString()}
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

      {/* Sale Modal */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => {
          setIsSaleModalOpen(false);
          setSaleForm({ productId: '', quantity: 1, barcodeScan: false });
        }}
        title={t('sellProduct')}
      >
        <form onSubmit={handleSale} className="space-y-6">
          {/* Barcode Scan Option - تحسين التصميم */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            saleForm.barcodeScan
              ? theme === 'dark' 
                ? 'bg-purple-900/20 border-purple-500/50' 
                : 'bg-purple-50 border-purple-300'
              : theme === 'dark' 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <motion.div
                  animate={saleForm.barcodeScan ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-lg ${
                    saleForm.barcodeScan
                      ? 'bg-purple-500 text-white'
                      : theme === 'dark' 
                      ? 'bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Scan className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className={`font-semibold ${
                    saleForm.barcodeScan
                      ? theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isRTL ? 'مسح الباركود' : 'Barcode Scan'}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isRTL ? 'تحديد هذا البيع كمسح باركود' : 'Mark this sale as barcode scan'}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch محسّن */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setSaleForm({ ...saleForm, barcodeScan: !saleForm.barcodeScan })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  saleForm.barcodeScan 
                    ? 'bg-purple-600 shadow-lg' 
                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <motion.span
                  animate={{ 
                    x: saleForm.barcodeScan ? (isRTL ? -20 : 20) : 0,
                    scale: saleForm.barcodeScan ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`inline-block h-5 w-5 transform rounded-full transition-all duration-300 ${
                    saleForm.barcodeScan ? 'bg-white shadow-lg' : 'bg-white'
                  }`}
                  style={{ 
                    marginLeft: isRTL ? (saleForm.barcodeScan ? '4px' : '24px') : '4px',
                    marginRight: isRTL ? '4px' : (saleForm.barcodeScan ? '4px' : '24px')
                  }}
                />
              </motion.button>
            </div>
            
            {/* Status Indicator */}
            {saleForm.barcodeScan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center space-x-2 rtl:space-x-reverse"
              >
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  {isRTL ? 'سيتم تسجيل هذا البيع كمسح باركود' : 'This sale will be recorded as barcode scan'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Product Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('selectProduct')}
            </label>
            <select
              value={saleForm.productId}
              onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              required
            >
              <option value="">{t('selectProductPlaceholder')}</option>
              {products
                .filter(product => product.quantity > 0)
                .map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({t('stock')}: {product.quantity}) - {product.serialNumber}
                  </option>
                ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('quantity')}
            </label>
            <input
              type="number"
              value={saleForm.quantity}
              onChange={(e) => setSaleForm({ ...saleForm, quantity: parseInt(e.target.value) || 1 })}
              min="1"
              max={selectedProduct?.quantity || 1}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              required
            />
            {selectedProduct && (
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('availableStock')}: {selectedProduct.quantity} | {isRTL ? 'الرقم التسلسلي' : 'Serial'}: {selectedProduct.serialNumber}
              </p>
            )}
          </div>

          {/* Total Amount */}
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('totalAmount')}:
                </span>
                <span className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {saleForm.quantity} × {formatPrice(selectedProduct.price)}
              </div>
              <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse">
                {saleForm.barcodeScan ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    <Scan className="w-3 h-3 mr-1" />
                    {isRTL ? 'بيع بالباركود' : 'Barcode Sale'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                    <Hash className="w-3 h-3 mr-1" />
                    {isRTL ? 'بيع يدوي' : 'Manual Sale'}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setIsSaleModalOpen(false);
                setSaleForm({ productId: '', quantity: 1, barcodeScan: false });
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
              disabled={!selectedProduct || selectedProduct.quantity < saleForm.quantity}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {t('confirmSale')}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;