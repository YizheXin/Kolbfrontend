import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  // Define base styles for different toast types
  const toastStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const hoverStyles = {
    success: 'hover:bg-green-600',
    error: 'hover:bg-red-600',
    warning: 'hover:bg-yellow-600',
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg z-50 ${toastStyles[type]}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        onClick={onClose}
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-80 ${hoverStyles[type]}`}
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
}