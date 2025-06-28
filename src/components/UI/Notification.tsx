import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Notification: React.FC = () => {
  const { notifications, removeNotification, theme } = useStore();

  const getIcon = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getColors = (type: 'success' | 'error' | 'warning') => {
    const colors = {
      success: theme === 'dark' 
        ? 'bg-green-800 border-green-600 text-green-100' 
        : 'bg-green-50 border-green-200 text-green-800',
      error: theme === 'dark'
        ? 'bg-red-800 border-red-600 text-red-100'
        : 'bg-red-50 border-red-200 text-red-800',
      warning: theme === 'dark'
        ? 'bg-yellow-800 border-yellow-600 text-yellow-100'
        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    return colors[type];
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getColors(notification.type)}`}
          >
            <div className="flex-shrink-0 mr-3">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-3 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;