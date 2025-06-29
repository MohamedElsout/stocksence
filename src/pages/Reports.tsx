import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Filter,
  RefreshCw,
  Target,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
  Share2,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Legend,
  RadialBarChart,
  RadialBar,
  Pie
} from 'recharts';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import AnimatedCounter from '../components/UI/AnimatedCounter';

const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, sales, theme, formatPrice } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedChart, setSelectedChart] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === 'ar';

  const analytics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProducts = products.length;
    const totalSales = sales.length;
    const lowStockItems = products.filter(p => p.quantity < 5).length;
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    
    const revenueGrowth = 15.3;
    const salesGrowth = 8.7;
    const inventoryGrowth = 12.1;
    const lowStockGrowth = -23.5;

    const productSales = sales.reduce((acc: any, sale) => {
      if (acc[sale.productId]) {
        acc[sale.productId].quantity += sale.quantity;
        acc[sale.productId].revenue += sale.totalAmount;
      } else {
        acc[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          quantity: sale.quantity,
          revenue: sale.totalAmount
        };
      }
      return acc;
    }, {});

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    // Improved category data with better colors
    const categoryData = products.reduce((acc: any[], product) => {
      const existing = acc.find(item => item.category === product.category);
      if (existing) {
        existing.count += 1;
        existing.value += product.quantity * product.price;
        existing.quantity += product.quantity;
        existing.avgPrice = existing.value / existing.quantity;
      } else {
        // Assign a color from the predefined palette
        const colorIndex = acc.length % COLORS.length;
        acc.push({
          category: product.category,
          count: 1,
          value: product.quantity * product.price,
          quantity: product.quantity,
          avgPrice: product.price,
          fill: COLORS[colorIndex],
          // Add a contrasting text color
          textColor: isLightColor(COLORS[colorIndex]) ? '#333333' : '#FFFFFF'
        });
      }
      return acc;
    }, []);

    const salesTrendData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayRevenue = Math.random() * 5000 + 1000;
      const daySales = Math.floor(Math.random() * 20) + 5;
      
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        revenue: dayRevenue,
        sales: daySales,
        profit: dayRevenue * 0.3
      };
    });

    const monthlyData = [
      { month: 'Jan', revenue: 45000, sales: 120, profit: 13500, growth: 8.2 },
      { month: 'Feb', revenue: 52000, sales: 140, profit: 15600, growth: 15.6 },
      { month: 'Mar', revenue: 48000, sales: 130, profit: 14400, growth: -7.7 },
      { month: 'Apr', revenue: 61000, sales: 165, profit: 18300, growth: 27.1 },
      { month: 'May', revenue: 55000, sales: 150, profit: 16500, growth: -9.8 },
      { month: 'Jun', revenue: 67000, sales: 180, profit: 20100, growth: 21.8 }
    ];

    return {
      totalRevenue,
      totalProducts,
      totalSales,
      lowStockItems,
      totalInventoryValue,
      revenueGrowth,
      salesGrowth,
      inventoryGrowth,
      lowStockGrowth,
      topProducts,
      categoryData,
      salesTrendData,
      monthlyData
    };
  }, [products, sales, isRTL]);

  // Function to determine if a color is light or dark
  function isLightColor(color: string) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }

  // Enhanced color palette with better contrast
  const COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#D946EF', // fuchsia
    '#0EA5E9', // sky
    '#84CC16'  // lime
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const exportReport = (format: 'pdf' | 'csv', chartType?: string) => {
    const fileName = chartType 
      ? `${chartType}-report-${new Date().toISOString().split('T')[0]}.${format}`
      : `full-report-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      let csvContent = '';
      
      if (chartType === 'categories') {
        csvContent = "Category,Products,Value,Quantity\n" +
          analytics.categoryData.map(cat => 
            `"${cat.category}",${cat.count},${cat.value},${cat.quantity}`
          ).join("\n");
      } else if (chartType === 'performance') {
        csvContent = "Month,Revenue,Sales,Profit\n" +
          analytics.monthlyData.map(month => 
            `${month.month},${month.revenue},${month.sales},${month.profit}`
          ).join("\n");
      } else {
        csvContent = "Month,Revenue,Sales,Profit\n" +
          analytics.monthlyData.map(month => 
            `${month.month},${month.revenue},${month.sales},${month.profit}`
          ).join("\n");
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Simple PDF generation using window.print()
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const html = `
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #3B82F6; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { display: flex; justify-content: space-between; align-items: center; }
                .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
                .date { color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">StockSence</div>
                <div class="date">${new Date().toLocaleDateString()}</div>
              </div>
              <h1>${chartType ? `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Report` : 'Full Report'}</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
              
              <h2>Summary</h2>
              <p>Total Products: ${analytics.totalProducts}</p>
              <p>Total Sales: ${analytics.totalSales}</p>
              <p>Total Revenue: ${formatPrice(analytics.totalRevenue)}</p>
              <p>Inventory Value: ${formatPrice(analytics.totalInventoryValue)}</p>
              
              ${chartType === 'categories' ? `
                <h2>Category Performance</h2>
                <table>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Value</th>
                    <th>Quantity</th>
                  </tr>
                  ${analytics.categoryData.map(cat => `
                    <tr>
                      <td>${cat.category}</td>
                      <td>${cat.count}</td>
                      <td>${formatPrice(cat.value)}</td>
                      <td>${cat.quantity}</td>
                    </tr>
                  `).join('')}
                </table>
              ` : ''}
              
              ${chartType === 'performance' || !chartType ? `
                <h2>Monthly Performance</h2>
                <table>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Sales</th>
                    <th>Profit</th>
                    <th>Growth</th>
                  </tr>
                  ${analytics.monthlyData.map(month => `
                    <tr>
                      <td>${month.month}</td>
                      <td>${formatPrice(month.revenue)}</td>
                      <td>${month.sales}</td>
                      <td>${formatPrice(month.profit)}</td>
                      <td>${month.growth}%</td>
                    </tr>
                  `).join('')}
                </table>
              ` : ''}
              
              <h2>Top Performing Products</h2>
              <table>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                </tr>
                ${analytics.topProducts.map((product: any) => `
                  <tr>
                    <td>${product.productName}</td>
                    <td>${product.quantity}</td>
                    <td>${formatPrice(product.revenue)}</td>
                  </tr>
                `).join('')}
              </table>
              
              <div style="margin-top: 50px; text-align: center; color: #666;">
                <p>© ${new Date().getFullYear()} StockSence - All Rights Reserved</p>
              </div>
            </body>
          </html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = function() {
          printWindow.print();
        };
      }
    }
  };

  const stats = [
    {
      icon: DollarSign,
      label: t('totalRevenue'),
      value: analytics.totalRevenue,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      isPrice: true,
      change: `+${analytics.revenueGrowth}%`,
      trend: 'up'
    },
    {
      icon: ShoppingCart,
      label: t('totalSales'),
      value: analytics.totalSales,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: `+${analytics.salesGrowth}%`,
      trend: 'up'
    },
    {
      icon: Package,
      label: t('inventoryValue'),
      value: analytics.totalInventoryValue,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      isPrice: true,
      change: `+${analytics.inventoryGrowth}%`,
      trend: 'up'
    },
    {
      icon: AlertTriangle,
      label: t('lowStockItems'),
      value: analytics.lowStockItems,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: `${analytics.lowStockGrowth}%`,
      trend: 'down'
    }
  ];

  const chartOptions = [
    { id: 'overview', label: t('overview'), icon: BarChart3 },
    { id: 'sales', label: t('salesTrend'), icon: TrendingUp },
    { id: 'categories', label: t('categories'), icon: PieChart },
    { id: 'performance', label: t('performance'), icon: Target }
  ];

  // Custom tooltip for category pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <p className={`font-bold ${data.textColor}`}>{data.category}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('products')}: <span className="font-medium">{data.count}</span>
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('value')}: <span className="font-medium">{formatPrice(data.value)}</span>
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('quantity')}: <span className="font-medium">{data.quantity}</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('reportsTitle')}
                </h1>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('reportsSubtitle')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className={`px-4 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="7days">{t('last7Days')}</option>
                  <option value="30days">{t('last30Days')}</option>
                  <option value="90days">{t('last90Days')}</option>
                  <option value="1year">{t('lastYear')}</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={`flex items-center px-4 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors disabled:opacity-50`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('refresh')}
                </motion.button>

                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('export')}
                  </motion.button>
                  
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="py-2">
                      <button
                        onClick={() => exportReport('pdf')}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors flex items-center`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('exportAsPDF')}
                      </button>
                      <button
                        onClick={() => exportReport('csv')}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors flex items-center`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('exportAsCSV')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
              
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
                    <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up' 
                        ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                        : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                    }`}>
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
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

          {/* Chart Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 overflow-x-auto"
          >
            <div className="flex flex-nowrap gap-2 min-w-max">
              {chartOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChart(option.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedChart === option.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`lg:col-span-2 p-4 sm:p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedChart === 'overview' && t('revenueAndSales')}
                  {selectedChart === 'sales' && t('salesTrendAnalysis')}
                  {selectedChart === 'categories' && t('categoryPerformance')}
                  {selectedChart === 'performance' && t('monthlyPerformance')}
                </h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => exportReport('pdf', selectedChart)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    } transition-colors`}
                    title="Export as PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => exportReport('csv', selectedChart)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    } transition-colors`}
                    title="Export as CSV"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedChart === 'overview' && (
                    <ComposedChart data={analytics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="month" 
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                          border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                          borderRadius: '8px',
                          color: theme === 'dark' ? '#FFFFFF' : '#000000'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3B82F6" name={t('totalRevenue')} />
                      <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name={t('profitMargin')} />
                    </ComposedChart>
                  )}

                  {selectedChart === 'sales' && (
                    <AreaChart data={analytics.salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="day" 
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                          border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                          borderRadius: '8px',
                          color: theme === 'dark' ? '#FFFFFF' : '#000000'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                        name={t('totalRevenue')}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                        name={t('profitMargin')}
                      />
                    </AreaChart>
                  )}

                  {selectedChart === 'categories' && (
                    <RechartsPieChart>
                      <Pie
                        data={analytics.categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="category"
                        label={({ category, percent, textColor }) => (
                          <text 
                            x={0} 
                            y={0} 
                            fill={textColor || '#FFFFFF'} 
                            textAnchor="middle" 
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {`${category} ${(percent * 100).toFixed(0)}%`}
                          </text>
                        )}
                      >
                        {analytics.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  )}

                  {selectedChart === 'performance' && (
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
                      { name: t('totalRevenue'), value: 85, fill: '#3B82F6' },
                      { name: t('totalSales'), value: 70, fill: '#10B981' },
                      { name: t('profitMargin'), value: 60, fill: '#F59E0B' },
                      { name: 'Growth', value: 90, fill: '#8B5CF6' }
                    ]}>
                      <RadialBar dataKey="value" cornerRadius={10} label={{ fill: theme === 'dark' ? '#FFFFFF' : '#000000', position: 'insideStart' }} />
                      <Tooltip />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('topPerformingProducts')}
                </h3>
                
                <div className="space-y-4">
                  {analytics.topProducts.slice(0, 5).map((product: any, index) => (
                    <motion.div
                      key={product.productId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {product.productName}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {product.quantity} {t('sold')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {formatPrice(product.revenue)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('quickInsights')}
                </h3>
                
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {t('avgOrderValue')}
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {formatPrice(analytics.totalSales ? analytics.totalRevenue / analytics.totalSales : 0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {t('profitMargin')}
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        30.2%
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {t('inventoryTurnover')}
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        4.2x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('inventoryAlerts')}
                </h3>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-4">
                {products
                  .filter(product => product.quantity < 10)
                  .slice(0, 6)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                        product.quantity === 0
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                          : product.quantity < 5
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                          : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {product.name}
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.quantity === 0
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : product.quantity < 5
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {product.quantity === 0 ? t('outOfStock') : `${product.quantity} ${t('left')}`}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                
                {products.filter(product => product.quantity < 10).length === 0 && (
                  <div className={`text-center py-8 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('allProductsWellStocked')}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('categoryPerformance')}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => exportReport('pdf', 'categories')}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                  title="Download Category Data"
                >
                  <Download className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                {analytics.categoryData.map((category, index) => {
                  const percentage = (category.value / analytics.totalInventoryValue) * 100;
                  return (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      } border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`font-semibold text-lg ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {category.category}
                        </span>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {formatPrice(category.value)}
                          </span>
                          <span className={`text-sm ml-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                          className="h-3 rounded-full"
                          style={{ backgroundColor: category.fill }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {category.count}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {t('products')}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {category.quantity}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {t('units')}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {formatPrice(category.avgPrice)}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Avg Price
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;