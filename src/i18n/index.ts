import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      dashboard: 'Dashboard',
      sales: 'Sales',
      reports: 'Reports',
      aboutUs: 'About Us',
      settings: 'Settings',
      downloadSystem: 'Download System',
      
      // Landing Page
      heroTitle: 'Manage Your Inventory with Ease',
      heroSubtitle: 'Professional inventory management system for modern businesses',
      getToDashboard: 'Go to Dashboard',
      aboutTitle: 'About StockSence',
      aboutDescription: 'We provide cutting-edge inventory management solutions to help businesses streamline their operations and maximize efficiency.',
      
      // Statistics
      happyClients: 'Happy Clients',
      totalProducts: 'Total Products',
      yearsExperience: 'Years Experience',
      
      // Testimonials
      testimonialsTitle: 'What Our Clients Say',
      testimonial1: 'StockSence transformed our inventory management completely. The interface is intuitive and the real-time updates are game-changing.',
      testimonial2: 'The best inventory system we\'ve used. Clean, fast, and incredibly reliable. Customer support is outstanding too.',
      testimonial3: 'Perfect for small businesses like mine. Easy to learn and use, with all the features I need to manage my inventory efficiently.',
      
      // Dashboard
      dashboardTitle: 'Dashboard Overview',
      dashboardSubtitle: 'Monitor and manage your inventory efficiently',
      totalValue: 'Total Value',
      lowStockItems: 'Low Stock Items',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      productName: 'Product Name',
      description: 'Description',
      quantity: 'Quantity',
      price: 'Price',
      category: 'Category',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search products...',
      confirmDelete: 'Are you sure you want to delete this product?',
      
      // Sales
      salesTitle: 'Sales Management',
      salesSubtitle: 'Track and manage your sales transactions',
      sellProduct: 'Sell Product',
      selectProduct: 'Select Product',
      totalAmount: 'Total Amount',
      confirmSale: 'Confirm Sale',
      saleDate: 'Sale Date',
      
      // Reports
      reportsTitle: 'Advanced Analytics & Reports',
      reportsSubtitle: 'Comprehensive insights and data visualization for informed decision making',
      exportData: 'Export Data',
      refresh: 'Refresh',
      export: 'Export',
      exportAsPDF: 'Export as PDF',
      exportAsExcel: 'Export as Excel',
      exportAsCSV: 'Export as CSV',
      overview: 'Overview',
      salesTrend: 'Sales Trend',
      categories: 'Categories',
      performance: 'Performance',
      revenueAndSales: 'Revenue & Sales Overview',
      salesTrendAnalysis: 'Sales Trend Analysis',
      categoryPerformance: 'Category Performance',
      monthlyPerformance: 'Monthly Performance',
      topPerformingProducts: 'Top Performing Products',
      quickInsights: 'Quick Insights',
      avgOrderValue: 'Avg. Order Value',
      profitMargin: 'Profit Margin',
      inventoryTurnover: 'Inventory Turnover',
      inventoryAlerts: 'Inventory Alerts',
      outOfStock: 'Out of Stock',
      left: 'left',
      allProductsWellStocked: 'All products are well stocked!',
      sold: 'sold',
      products: 'products',
      units: 'units',
      totalRevenue: 'Total Revenue',
      totalSales: 'Total Sales',
      inventoryValue: 'Inventory Value',
      itemsSold: 'Items Sold',
      todaysSales: "Today's Sales",
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      lastYear: 'Last Year',
      
      // About Page
      whatDrivesUs: 'What Drives Us',
      ourMission: 'Our Mission',
      ourMissionDesc: 'To provide cutting-edge inventory management solutions that help businesses streamline operations and maximize efficiency.',
      ourTeam: 'Our Team',
      ourTeamDesc: 'A dedicated team of professionals with years of experience in inventory management and software development.',
      ourValues: 'Our Values',
      ourValuesDesc: 'Innovation, reliability, and customer satisfaction are at the core of everything we do.',
      globalReach: 'Global Reach',
      globalReachDesc: 'Serving businesses worldwide with localized solutions and 24/7 support in multiple languages.',
      meetOurTeam: 'Meet Our Team',
      brilliantMinds: 'The brilliant minds behind StockSence',
      getInTouch: 'Get In Touch',
      readyToTransform: 'Ready to transform your inventory management?',
      contactInformation: 'Contact Information',
      followUs: 'Follow Us',
      sendMessage: 'Send us a Message',
      firstName: 'First Name',
      lastName: 'Last Name',
      emailAddress: 'Email Address',
      yourMessage: 'Your Message',
      sendMessageBtn: 'Send Message',
      activeUsers: 'Active Users',
      countries: 'Countries',
      uptime: 'Uptime',
      support: 'Support',
      
      // Landing Page Features
      powerfulFeatures: 'Powerful Features',
      featuresSubtitle: 'Everything you need to manage your inventory efficiently',
      smartInventory: 'Smart Inventory',
      smartInventoryDesc: 'Real-time tracking and automated alerts for low stock items',
      advancedAnalytics: 'Advanced Analytics',
      advancedAnalyticsDesc: 'Comprehensive reports and insights to optimize your business',
      multiUserSupport: 'Multi-User Support',
      multiUserSupportDesc: 'Collaborate with your team with role-based access control',
      trustedByThousands: 'Trusted by Thousands',
      realTimeUpdates: 'Real-time Updates',
      realTimeUpdatesDesc: 'Instant inventory tracking and updates',
      smartAnalyticsFeature: 'Smart Analytics',
      smartAnalyticsDesc: 'Advanced reporting and insights',
      readyToTransformBusiness: 'Ready to Transform Your Business?',
      joinThousands: 'Join thousands of businesses already using StockSence to streamline their inventory management.',
      startFreeTrial: 'Start Free Trial',
      contactSales: 'Contact Sales',
      learnMore: 'Learn More',
      
      // Common UI Elements
      productsManagement: 'Products Management',
      salesHistory: 'Sales History',
      noProductsFound: 'No products found',
      addSomeProducts: 'Add some products to get started',
      noSalesRecorded: 'No sales recorded yet',
      startSelling: 'Start selling products to see your sales history',
      productDetails: 'Product Details',
      createdAt: 'Created At',
      lastUpdated: 'Last Updated',
      noDescriptionAvailable: 'No description available',
      unitPrice: 'Unit Price',
      totalValueProduct: 'Total Value',
      availableStock: 'Available stock',
      selectProductPlaceholder: 'Select a product...',
      stock: 'Stock',
      searchSales: 'Search sales...',
      allCategories: 'All Categories',
      
      // Currency
      currency: 'EGP',
      currencySymbol: 'ج.م',
      egyptianPound: 'Egyptian Pound',
      saudiRiyal: 'Saudi Riyal',
      usDollar: 'US Dollar',
      euro: 'Euro',
      
      // Messages
      productAdded: 'Product added successfully!',
      productUpdated: 'Product updated successfully!',
      productDeleted: 'Product deleted successfully!',
      saleCompleted: 'Sale completed successfully!',
      lowStockWarning: 'Low stock warning!',
      insufficientStock: 'Insufficient stock available',
      
      // Common
      loading: 'Loading...',
      close: 'Close',
      confirm: 'Confirm',
      
      // Sidebar
      version: 'StockSence v1.0',
      
      // Header
      stockSence: 'StockSence'
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      sales: 'المبيعات',
      reports: 'التقارير',
      aboutUs: 'معلومات عنا',
      settings: 'الإعدادات',
      downloadSystem: 'تحميل النظام',
      
      // Landing Page
      heroTitle: 'إدارة مخزونك بسهولة',
      heroSubtitle: 'نظام إدارة مخزون احترافي للشركات العصرية',
      getToDashboard: 'الذهاب للوحة التحكم',
      aboutTitle: 'حول ستوك سنس',
      aboutDescription: 'نحن نوفر حلول إدارة المخزون المتطورة لمساعدة الشركات على تبسيط عملياتها وزيادة الكفاءة.',
      
      // Statistics
      happyClients: 'عميل سعيد',
      totalProducts: 'إجمالي المنتجات',
      yearsExperience: 'سنوات الخبرة',
      
      // Testimonials
      testimonialsTitle: 'ماذا يقول عملاؤنا',
      testimonial1: 'ستوك سنس غيّر إدارة مخزوننا بالكامل. الواجهة بديهية والتحديثات الفورية مذهلة.',
      testimonial2: 'أفضل نظام مخزون استخدمناه. نظيف وسريع وموثوق بشكل لا يصدق. الدعم الفني ممتاز أيضاً.',
      testimonial3: 'مثالي للشركات الصغيرة مثل شركتي. سهل التعلم والاستخدام، مع جميع الميزات التي أحتاجها لإدارة مخزوني بكفاءة.',
      
      // Dashboard
      dashboardTitle: 'نظرة عامة على لوحة التحكم',
      dashboardSubtitle: 'راقب وأدر مخزونك بكفاءة',
      totalValue: 'القيمة الإجمالية',
      lowStockItems: 'منتجات منخفضة المخزون',
      addProduct: 'إضافة منتج',
      editProduct: 'تعديل المنتج',
      productName: 'اسم المنتج',
      description: 'الوصف',
      quantity: 'الكمية',
      price: 'السعر',
      category: 'الفئة',
      actions: 'الإجراءات',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      search: 'البحث عن المنتجات...',
      confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
      
      // Sales
      salesTitle: 'إدارة المبيعات',
      salesSubtitle: 'تتبع وإدارة معاملات المبيعات الخاصة بك',
      sellProduct: 'بيع منتج',
      selectProduct: 'اختر المنتج',
      totalAmount: 'المبلغ الإجمالي',
      confirmSale: 'تأكيد البيع',
      saleDate: 'تاريخ البيع',
      
      // Reports
      reportsTitle: 'التحليلات والتقارير المتقدمة',
      reportsSubtitle: 'رؤى شاملة وتصور البيانات لاتخاذ قرارات مدروسة',
      exportData: 'تصدير البيانات',
      refresh: 'تحديث',
      export: 'تصدير',
      exportAsPDF: 'تصدير كـ PDF',
      exportAsExcel: 'تصدير كـ Excel',
      exportAsCSV: 'تصدير كـ CSV',
      overview: 'نظرة عامة',
      salesTrend: 'اتجاه المبيعات',
      categories: 'الفئات',
      performance: 'الأداء',
      revenueAndSales: 'نظرة عامة على الإيرادات والمبيعات',
      salesTrendAnalysis: 'تحليل اتجاه المبيعات',
      categoryPerformance: 'أداء الفئات',
      monthlyPerformance: 'الأداء الشهري',
      topPerformingProducts: 'أفضل المنتجات أداءً',
      quickInsights: 'رؤى سريعة',
      avgOrderValue: 'متوسط قيمة الطلب',
      profitMargin: 'هامش الربح',
      inventoryTurnover: 'معدل دوران المخزون',
      inventoryAlerts: 'تنبيهات المخزون',
      outOfStock: 'نفد من المخزون',
      left: 'متبقي',
      allProductsWellStocked: 'جميع المنتجات متوفرة بكمية جيدة!',
      sold: 'مباع',
      products: 'منتجات',
      units: 'وحدات',
      totalRevenue: 'إجمالي الإيرادات',
      totalSales: 'إجمالي المبيعات',
      inventoryValue: 'قيمة المخزون',
      itemsSold: 'العناصر المباعة',
      todaysSales: 'مبيعات اليوم',
      last7Days: 'آخر 7 أيام',
      last30Days: 'آخر 30 يوم',
      last90Days: 'آخر 90 يوم',
      lastYear: 'العام الماضي',
      
      // About Page
      whatDrivesUs: 'ما يحركنا',
      ourMission: 'مهمتنا',
      ourMissionDesc: 'توفير حلول إدارة المخزون المتطورة التي تساعد الشركات على تبسيط العمليات وزيادة الكفاءة.',
      ourTeam: 'فريقنا',
      ourTeamDesc: 'فريق متخصص من المحترفين مع سنوات من الخبرة في إدارة المخزون وتطوير البرمجيات.',
      ourValues: 'قيمنا',
      ourValuesDesc: 'الابتكار والموثوقية ورضا العملاء هي جوهر كل ما نقوم به.',
      globalReach: 'الوصول العالمي',
      globalReachDesc: 'خدمة الشركات في جميع أنحاء العالم مع حلول محلية ودعم على مدار الساعة بلغات متعددة.',
      meetOurTeam: 'تعرف على فريقنا',
      brilliantMinds: 'العقول المبدعة وراء ستوك سنس',
      getInTouch: 'تواصل معنا',
      readyToTransform: 'مستعد لتحويل إدارة مخزونك؟',
      contactInformation: 'معلومات الاتصال',
      followUs: 'تابعنا',
      sendMessage: 'أرسل لنا رسالة',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      emailAddress: 'عنوان البريد الإلكتروني',
      yourMessage: 'رسالتك',
      sendMessageBtn: 'إرسال الرسالة',
      activeUsers: 'مستخدم نشط',
      countries: 'دولة',
      uptime: 'وقت التشغيل',
      support: 'الدعم',
      
      // Landing Page Features
      powerfulFeatures: 'ميزات قوية',
      featuresSubtitle: 'كل ما تحتاجه لإدارة مخزونك بكفاءة',
      smartInventory: 'مخزون ذكي',
      smartInventoryDesc: 'تتبع في الوقت الفعلي وتنبيهات تلقائية للعناصر منخفضة المخزون',
      advancedAnalytics: 'تحليلات متقدمة',
      advancedAnalyticsDesc: 'تقارير ورؤى شاملة لتحسين عملك',
      multiUserSupport: 'دعم متعدد المستخدمين',
      multiUserSupportDesc: 'تعاون مع فريقك مع التحكم في الوصول القائم على الأدوار',
      trustedByThousands: 'موثوق من قبل الآلاف',
      realTimeUpdates: 'تحديثات فورية',
      realTimeUpdatesDesc: 'تتبع وتحديثات فورية للمخزون',
      smartAnalyticsFeature: 'تحليلات ذكية',
      smartAnalyticsDesc: 'تقارير ورؤى متقدمة',
      readyToTransformBusiness: 'مستعد لتحويل عملك؟',
      joinThousands: 'انضم إلى آلاف الشركات التي تستخدم بالفعل ستوك سنس لتبسيط إدارة مخزونها.',
      startFreeTrial: 'ابدأ تجربة مجانية',
      contactSales: 'اتصل بالمبيعات',
      learnMore: 'اعرف المزيد',
      
      // Common UI Elements
      productsManagement: 'إدارة المنتجات',
      salesHistory: 'تاريخ المبيعات',
      noProductsFound: 'لم يتم العثور على منتجات',
      addSomeProducts: 'أضف بعض المنتجات للبدء',
      noSalesRecorded: 'لم يتم تسجيل مبيعات بعد',
      startSelling: 'ابدأ ببيع المنتجات لرؤية تاريخ مبيعاتك',
      productDetails: 'تفاصيل المنتج',
      createdAt: 'تاريخ الإنشاء',
      lastUpdated: 'آخر تحديث',
      noDescriptionAvailable: 'لا يوجد وصف متاح',
      unitPrice: 'سعر الوحدة',
      totalValueProduct: 'القيمة الإجمالية',
      availableStock: 'المخزون المتاح',
      selectProductPlaceholder: 'اختر منتج...',
      stock: 'مخزون',
      searchSales: 'البحث في المبيعات...',
      allCategories: 'جميع الفئات',
      
      // Currency
      currency: 'EGP',
      currencySymbol: 'ج.م',
      egyptianPound: 'الجنيه المصري',
      saudiRiyal: 'الريال السعودي',
      usDollar: 'الدولار الأمريكي',
      euro: 'اليورو',
      
      // Messages
      productAdded: 'تم إضافة المنتج بنجاح!',
      productUpdated: 'تم تحديث المنتج بنجاح!',
      productDeleted: 'تم حذف المنتج بنجاح!',
      saleCompleted: 'تم إكمال البيع بنجاح!',
      lowStockWarning: 'تحذير: مخزون منخفض!',
      insufficientStock: 'المخزون المتاح غير كافٍ',
      
      // Common
      loading: 'جارٍ التحميل...',
      close: 'إغلاق',
      confirm: 'تأكيد',
      
      // Sidebar
      version: 'ستوك سنس الإصدار 1.0',
      
      // Header
      stockSence: 'ستوك سنس'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;