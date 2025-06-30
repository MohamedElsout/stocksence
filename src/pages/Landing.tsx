import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  ChevronLeft,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';
import AnimatedCounter from '../components/UI/AnimatedCounter';
import Logo from '../components/UI/Logo';

const Landing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const isRTL = i18n.language === 'ar';

  // مراقبة التمرير لإظهار الشعار
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // إظهار الشعار عندما يصل المستخدم إلى 70% من الصفحة أو أكثر
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      setShowLogo(scrollPercentage > 0.7);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { 
      icon: Users, 
      count: 1250, 
      label: t('happyClients'),
      color: 'text-blue-500'
    },
    { 
      icon: TrendingUp, 
      count: 50000, 
      label: t('totalProducts'),
      color: 'text-green-500'
    },
    { 
      icon: Zap, 
      count: 8, 
      label: t('yearsExperience'),
      color: 'text-purple-500'
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Al-Rashid',
      role: 'CEO, Tech Solutions',
      content: t('testimonial1'),
      rating: 5,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      content: t('testimonial2'),
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Mohammed Hassan',
      role: 'Store Owner',
      content: t('testimonial3'),
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: t('smartInventory'),
      description: t('smartInventoryDesc'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: TrendingUp,
      title: t('advancedAnalytics'),
      description: t('advancedAnalyticsDesc'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Users,
      title: t('multiUserSupport'),
      description: t('multiUserSupportDesc'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className={`min-h-screen relative ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Floating Logo - يظهر فقط عند النزول للأسفل - بدون حواف بيضاء نهائياً */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ 
          opacity: showLogo ? 1 : 0, 
          scale: showLogo ? 1 : 0.5,
          y: showLogo ? 0 : 100
        }}
        transition={{ 
          duration: 0.6, 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 ${
          showLogo ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <motion.div
          animate={{ rotate: showLogo ? 360 : 0 }}
          transition={{ 
            duration: 10, 
            repeat: showLogo ? Infinity : 0, 
            ease: "linear"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer"
        >
          {/* Main Logo - بدون حواف بيضاء نهائياً مع تحسينات إضافية */}
          <div 
            className="w-20 h-20 rounded-full overflow-hidden shadow-2xl relative landing-logo-enhanced"
            style={{
              background: 'transparent',
              // قناع دائري متقدم للشعار العائم
              mask: 'radial-gradient(circle at center, black 72%, transparent 77%)',
              WebkitMask: 'radial-gradient(circle at center, black 72%, transparent 77%)'
            }}
          >
            <img 
              src="/logo.png" 
              alt="StockSence Logo" 
              className="w-full h-full object-cover rounded-full"
              style={{
                // تكبير قوي جداً لإزالة الحواف البيضاء نهائياً
                transform: 'scale(2.2)',
                filter: 'contrast(1.8) saturate(1.8) brightness(1.3) blur(0.03px)',
                clipPath: 'circle(22% at center)',
                background: 'transparent',
                imageRendering: 'crisp-edges',
                WebkitImageRendering: 'crisp-edges'
              }}
            />
            
            {/* طبقة حماية متقدمة من الحواف البيضاء */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, transparent 55%, ${
                  theme === 'dark' ? 'rgba(31, 41, 55, 0.2)' : 'rgba(249, 250, 251, 0.2)'
                } 70%, ${
                  theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.5)'
                } 80%)`,
                mixBlendMode: 'multiply',
                zIndex: 1
              }}
            />
            
            {/* طبقة إضافية للتأكد من عدم ظهور الحواف */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${
                  theme === 'dark' ? 'rgba(31, 41, 55, 0.1)' : 'rgba(249, 250, 251, 0.1)'
                } 90deg, transparent 180deg, ${
                  theme === 'dark' ? 'rgba(31, 41, 55, 0.1)' : 'rgba(249, 250, 251, 0.1)'
                } 270deg, transparent 360deg)`,
                mask: 'radial-gradient(circle, transparent 70%, black 85%)',
                WebkitMask: 'radial-gradient(circle, transparent 70%, black 85%)',
                zIndex: 2
              }}
            />
          </div>
          
          {/* تأثير النبض */}
          <motion.div
            animate={showLogo ? {
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            } : {}}
            transition={{
              duration: 2,
              repeat: showLogo ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full border-2 border-blue-500"
          />
          
          {/* تأثير الإضاءة عند التحويم */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
          />
        </motion.div>
        
        {/* نص صغير تحت الشعار */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: showLogo ? 1 : 0,
            y: showLogo ? 0 : 10
          }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          StockSence
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      <div className="w-full" style={{ paddingTop: '4rem' }}>
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
              className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500"
              style={{ backgroundSize: '400% 400%' }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <Logo size="xl" />
              </motion.div>

              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent"
                >
                  {t('heroTitle')}
                </motion.span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {t('heroSubtitle')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg"
                  >
                    <span className="mr-2">{t('getToDashboard')}</span>
                    {isRTL ? (
                      <ChevronLeft className="w-6 h-6" />
                    ) : (
                      <ArrowRight className="w-6 h-6" />
                    )}
                  </motion.button>
                </Link>

                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center px-8 py-4 border-2 ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } font-semibold rounded-xl transition-all duration-300 text-lg`}
                  >
                    {t('learnMore')}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-20 left-10 opacity-20"
            >
              <Logo size="lg" showText={false} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-20 right-10 opacity-20"
            >
              <TrendingUp className="w-12 h-12 text-green-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-1/2 right-20 opacity-20"
            >
              <Users className="w-14 h-14 text-purple-500" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-20 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('powerfulFeatures')}
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('featuresSubtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`p-8 rounded-xl text-center ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-50 hover:bg-white'
                    } transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-full mb-6 ${feature.bgColor}`}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className={`py-20 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('trustedByThousands')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`p-8 rounded-xl text-center ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-white hover:bg-gray-50'
                    } transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-full mb-4 ${stat.color} bg-opacity-10`}
                    >
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </motion.div>
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                      <AnimatedCounter end={stat.count} suffix={stat.count > 1000 ? '+' : ''} />
                    </div>
                    <p className={`text-lg ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`py-20 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('aboutTitle')}
                </h2>
                <p className={`text-lg mb-8 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('aboutDescription')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } shadow-md`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t('realTimeUpdates')}
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('realTimeUpdatesDesc')}
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } shadow-md`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t('smartAnalyticsFeature')}
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('smartAnalyticsDesc')}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Inventory Management"
                  className="rounded-xl shadow-2xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Logo size="lg" showText={false} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-20 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('testimonialsTitle')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center mb-4">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('readyToTransformBusiness')}
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('joinThousands')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('startFreeTrial')}
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 border-2 ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } font-semibold rounded-xl transition-all duration-300`}
                  >
                    {t('contactSales')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;