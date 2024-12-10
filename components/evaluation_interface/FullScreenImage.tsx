'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MindMapFile } from '../types/type';

interface FullScreenImageProps {
  image: MindMapFile;
  onClose: () => void;
}

export const FullScreenImage: React.FC<FullScreenImageProps> = ({ image, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/90 z-[9999] overflow-hidden"
      onClick={onClose}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={image.url}
            alt={image.name}
            onClick={handleImageClick}
            className="hover:opacity-75 transition-opacity duration-200 cursor-pointer"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
              userSelect: 'none'
            }}
            draggable={false}
          />
        </div>
      </div>
    </motion.div>
  );
};