'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MindMapFile } from '@/components/types/type';

interface FileContextType {
  initialFiles: MindMapFile[];
  setInitialFiles: (files: MindMapFile[]) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [initialFiles, setInitialFiles] = useState<MindMapFile[]>([]);

  return (
    <FileContext.Provider value={{ initialFiles, setInitialFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
