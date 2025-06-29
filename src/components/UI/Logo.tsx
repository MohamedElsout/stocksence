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
    sm: { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-sm' },
    md: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-base' },
    lg: { container: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-xl' },
    xl: { container: 'w-20 h-20', icon: 'w-12 h-12', text: 'text-2xl' }
  };
  
  const { container, icon, text } = sizeMap[size];
  
  return (
    <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
      {/* Logo Circle */}
      <motion.div
        whileHover={{ 
          scale: 1.05,
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          scale: { duration: 0.2 },
          rotate: { duration: 0.6, repeat: Infinity }
        }}
        className={`relative ${container} rounded-full shadow-lg overflow-hidden`}
      >
        {/* Background Gradient */}
        <motion.div
          animate={{
            background: theme === 'dark' 
              ? [
                  'linear-gradient(45deg, #1E40AF, #7C3AED, #1E40AF)',
                  'linear-gradient(45deg, #7C3AED, #1E40AF, #7C3AED)',
                  'linear-gradient(45deg, #1E40AF, #7C3AED, #1E40AF)'
                ]
              : [
                  'linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)',
                  'linear-gradient(45deg, #8B5CF6, #3B82F6, #8B5CF6)',
                  'linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)'
                ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
        />
        
        {/* Chart Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${icon} relative z-10`}
          >
            {/* Bar 1 - Shortest */}
            <motion.rect 
              x="3" 
              y="18" 
              width="2.5" 
              height="3" 
              rx="0.5"
              fill="white"
              initial={{ height: 0, y: 21 }}
              animate={{ height: 3, y: 18 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            
            {/* Bar 2 - Medium */}
            <motion.rect 
              x="7" 
              y="15" 
              width="2.5" 
              height="6" 
              rx="0.5"
              fill="white"
              initial={{ height: 0, y: 21 }}
              animate={{ height: 6, y: 15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            
            {/* Bar 3 - Taller */}
            <motion.rect 
              x="11" 
              y="13" 
              width="2.5" 
              height="8" 
              rx="0.5"
              fill="white"
              initial={{ height: 0, y: 21 }}
              animate={{ height: 8, y: 13 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            
            {/* Bar 4 - Tallest */}
            <motion.rect 
              x="15" 
              y="9" 
              width="2.5" 
              height="12" 
              rx="0.5"
              fill="white"
              initial={{ height: 0, y: 21 }}
              animate={{ height: 12, y: 9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            
            {/* Trend Line */}
            <motion.path 
              d="M4 18 L8 15 L12 12 L16 8" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            />
            
            {/* Arrow at end of line */}
            <motion.path 
              d="M14 8 L16 8 L16 10" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            />
            
            {/* Glowing points on the line */}
            <motion.circle 
              cx="4" 
              cy="18" 
              r="0.8" 
              fill="white"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle 
              cx="8" 
              cy="15" 
              r="0.8" 
              fill="white"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle 
              cx="12" 
              cy="12" 
              r="0.8" 
              fill="white"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.circle 
              cx="16" 
              cy="8" 
              r="0.8" 
              fill="white"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </svg>
        </div>
        
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full border-2 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
          }`}
        />
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.h2 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`font-bold ${text} bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent`}
        >
          StockSence
        </motion.h2>
      )}
    </div>
  );
};

export default Logo;