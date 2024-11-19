import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {type === 'success' ? (
          <CheckCircleIcon className="w-5 h-5" />
        ) : (
          <XCircleIcon className="w-5 h-5" />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 text-white hover:bg-green-600"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
}