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
      {/* Logo Circle - Based on the provided image */}
      <motion.div
        whileHover={{ 
          scale: 1.05,
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          scale: { duration: 0.2 },
          rotate: { duration: 0.8, repeat: Infinity }
        }}
        className={`relative ${container} rounded-full shadow-lg overflow-hidden`}
      >
        {/* Gradient Background - Matching the image */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(135deg, #00D4FF 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, #F59E0B 100%)',
              'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 25%, #EC4899 50%, #F59E0B 75%, #00D4FF 100%)',
              'linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #F59E0B 50%, #00D4FF 75%, #3B82F6 100%)',
              'linear-gradient(135deg, #00D4FF 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, #F59E0B 100%)'
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
        />
        
        {/* Chart Icon - Recreating the bar chart from the image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${icon} relative z-10`}
          >
            {/* Bar 1 - Shortest (Left) */}
            <motion.rect 
              x="6" 
              y="22" 
              width="3" 
              height="6" 
              rx="1.5"
              fill="rgba(255, 255, 255, 0.9)"
              initial={{ height: 0, y: 28 }}
              animate={{ height: 6, y: 22 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Bar 2 - Medium */}
            <motion.rect 
              x="11" 
              y="18" 
              width="3" 
              height="10" 
              rx="1.5"
              fill="rgba(255, 255, 255, 0.9)"
              initial={{ height: 0, y: 28 }}
              animate={{ height: 10, y: 18 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            
            {/* Bar 3 - Taller */}
            <motion.rect 
              x="16" 
              y="14" 
              width="3" 
              height="14" 
              rx="1.5"
              fill="rgba(255, 255, 255, 0.9)"
              initial={{ height: 0, y: 28 }}
              animate={{ height: 14, y: 14 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            
            {/* Bar 4 - Tallest (Right) */}
            <motion.rect 
              x="21" 
              y="10" 
              width="3" 
              height="18" 
              rx="1.5"
              fill="rgba(255, 255, 255, 0.9)"
              initial={{ height: 0, y: 28 }}
              animate={{ height: 18, y: 10 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
            
            {/* Curved Trend Line - Following the bar tops */}
            <motion.path 
              d="M7.5 22 Q12.5 18 17.5 14 Q22.5 10 26 8" 
              stroke="rgba(255, 255, 255, 0.95)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            />
            
            {/* Arrow Head - Pointing upward and to the right */}
            <motion.path 
              d="M24 8 L26 8 L26 10 M26 8 L28 6" 
              stroke="rgba(255, 255, 255, 0.95)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.5, type: "spring", stiffness: 200 }}
            />
            
            {/* Glowing dots on trend line */}
            <motion.circle 
              cx="7.5" 
              cy="22" 
              r="1.2" 
              fill="white"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle 
              cx="12.5" 
              cy="18" 
              r="1.2" 
              fill="white"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle 
              cx="17.5" 
              cy="14" 
              r="1.2" 
              fill="white"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            />
            <motion.circle 
              cx="22.5" 
              cy="10" 
              r="1.2" 
              fill="white"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.8 }}
            />
          </svg>
        </div>
        
        {/* Outer Glow Ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.1, 0.4]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border-2 border-white/30"
        />
        
        {/* Inner Shine Effect */}
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-1 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.1) 45deg, transparent 90deg, rgba(255,255,255,0.1) 135deg, transparent 180deg, rgba(255,255,255,0.1) 225deg, transparent 270deg, rgba(255,255,255,0.1) 315deg, transparent 360deg)'
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