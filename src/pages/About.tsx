import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Github
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Layout/Sidebar';

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: Target,
      title: t('ourMission'),
      description: t('ourMissionDesc'),
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: t('ourTeam'),
      description: t('ourTeamDesc'),
      color: 'text-green-500'
    },
    {
      icon: Award,
      title: t('ourValues'),
      description: t('ourValuesDesc'),
      color: 'text-purple-500'
    },
    {
      icon: Globe,
      title: t('globalReach'),
      description: t('globalReachDesc'),
      color: 'text-orange-500'
    }
  ];

  const team = [
    {
      name: 'Mohamed Elsout',
      role: 'Backend Developer & System Logic Designer',
      image: './profile-dark.png',
      bio: 'Mohamed was responsible for building the backend architecture and implementing the core system logic that powers the platform. His work ensures the system runs securely, efficiently, and meets all technical requirements behind the scenes.',
      social: {
        linkedin: 'https://www.linkedin.com/in/mohamed-elsout-1199962a9/',
        facebook: 'https://www.facebook.com/profile.php?id=100024607056911',
        github: 'https://github.com/MohamedElsout'
      }
    },
    {
      name: 'Yousef Mansour',
      role: 'Frontend Developer & System Concept Designer',
      image: './yousef-mansour.jpg',
      bio: 'Yousef designed the user interface and crafted the overall concept of the platform. He ensured the system is intuitive, user-friendly, and visually appealing for all types of users.',
      social: {
        linkedin: 'https://www.linkedin.com/in/youssef-mansour-620845251/',
        facebook: 'https://www.facebook.com/youssef.mansour.891783',
        github: 'https://github.com/Youssef-Mansour854'
      }
    }
  ];

  const stats = [
    { number: '10,000+', label: t('activeUsers') },
    { number: '50+', label: t('countries') },
    { number: '99.9%', label: t('uptime') },
    { number: '24/7', label: t('support') }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="w-full" style={{ paddingTop: '4rem' }}>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
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
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('aboutTitle')}
              </h1>
              <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('aboutDescription')}
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg`}
                >
                  <div className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
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
                {t('whatDrivesUs')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl text-center ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-50 hover:bg-white'
                    } transition-all duration-300 shadow-lg`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-full mb-4 ${feature.color} bg-opacity-10`}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>
                    <h3 className={`text-xl font-semibold mb-3 ${
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

        {/* Team Section */}
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
                {t('meetOurTeam')}
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('brilliantMinds')}
              </p>
            </motion.div>

            <div className="flex justify-center">
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`p-8 rounded-2xl text-center ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-xl transition-all duration-300 hover:shadow-2xl`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="relative mb-6"
                    >
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-blue-500/20">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300';
                          }}
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-dashed border-blue-500/30"
                      />
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {member.name}
                    </h3>
                    
                    <p className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {member.role}
                    </p>
                    
                    <p className={`text-base leading-relaxed mb-6 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {member.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                      <motion.a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-400 hover:bg-blue-600 hover:text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white'
                        } transition-all duration-300`}
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      
                      <motion.a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-400 hover:bg-blue-500 hover:text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white'
                        } transition-all duration-300`}
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                      
                      <motion.a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-600 hover:text-white'
                        } transition-all duration-300`}
                        title="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
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
                {t('getInTouch')}
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('readyToTransform')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className={`text-2xl font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('contactInformation')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      mhmdahmdalswt@gmail.com
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      01557175859
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <MapPin className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Rashid
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('followUs')}
                  </h4>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <motion.a
                      href="https://www.linkedin.com/in/mohamed-elsout-1199962a9/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'
                      } transition-all duration-300`}
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                    
                    <motion.a
                      href="https://www.facebook.com/profile.php?id=100024607056911"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                      } transition-all duration-300`}
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </motion.a>
                    
                    <motion.a
                      href="https://github.com/MohamedElsout"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white'
                      } transition-all duration-300`}
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <h3 className={`text-2xl font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('sendMessage')}
                </h3>
                
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t('firstName')}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    <input
                      type="text"
                      placeholder={t('lastName')}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  
                  <input
                    type="email"
                    placeholder={t('emailAddress')}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  
                  <textarea
                    rows={4}
                    placeholder={t('yourMessage')}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('sendMessageBtn')}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;