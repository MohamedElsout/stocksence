import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const { theme } = useStore();
  
  // Size mapping
  const sizeMap = {
    sm: { container: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'w-10 h-10', text: 'text-base' },
    lg: { container: 'w-14 h-14', text: 'text-xl' },
    xl: { container: 'w-20 h-20', text: 'text-2xl' }
  };
  
  const { container, text } = sizeMap[size];
  
  return (
    <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
      {/* Logo Image - بدون حواف بيضاء */}
      <motion.div
        whileHover={{ 
          scale: 1.05,
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          scale: { duration: 0.2 },
          rotate: { duration: 0.8, repeat: Infinity }
        }}
        className={`relative ${container} rounded-full overflow-hidden`}
        style={{ 
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
        }}
      >
        {/* Main Logo Image - مباشرة بدون خلفية بيضاء */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full rounded-full overflow-hidden relative"
        >
          {/* الصورة مباشرة بدون حاوي أبيض */}
          <img 
            src="/logo.png" 
            alt="StockSence Logo" 
            className="w-full h-full object-cover rounded-full"
            style={{
              imageRendering: 'crisp-edges',
              WebkitImageRendering: 'crisp-edges',
              // قص الحواف البيضاء باستخدام CSS
              transform: 'scale(1.1)', // تكبير الصورة قليلاً لقص الحواف
              filter: 'contrast(1.1) saturate(1.1)' // تحسين الألوان
            }}
          />
          
          {/* طبقة تدرج لوني لإخفاء أي حواف متبقية */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at center, transparent 85%, ${
                theme === 'dark' ? '#1F2937' : '#F9FAFB'
              } 95%)`
            }}
          />
        </motion.div>
        
        {/* Rotating Border Effect */}
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${
              theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
            } 90deg, transparent 180deg, ${
              theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
            } 270deg, transparent 360deg)`,
            mask: 'radial-gradient(circle, transparent 88%, black 90%)',
            WebkitMask: 'radial-gradient(circle, transparent 88%, black 90%)'
          }}
        />
        
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full ${
            theme === 'dark' 
              ? 'bg-blue-400/20' 
              : 'bg-blue-500/20'
          }`}
        />
        
        {/* Shine Effect */}
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 rounded-full"
          style={{ 
            width: '50%',
            height: '100%'
          }}
        />
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.h2 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`font-bold ${text} bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-blue-400 via-purple-400 to-pink-400' 
              : 'from-blue-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent`}
        >
          StockSence
        </motion.h2>
      )}
    </div>
  );
};

export default Logo;