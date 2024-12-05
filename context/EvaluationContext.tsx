// context/EvaluationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EvaluationStatus, FileStatus } from '@/components/types/type';

interface EvaluationContextType {
  updateStatus: (fileName: string, status: EvaluationStatus) => void;
  fileStatuses: FileStatus;
  setFileStatuses: React.Dispatch<React.SetStateAction<FileStatus>>;
}

export const EvaluationContext = createContext<EvaluationContextType | null>(null);

interface EvaluationProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'evaluation_statuses';

export function EvaluationProvider({ children }: EvaluationProviderProps) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error('Error loading evaluation statuses:', error);
        return {};
      }
    }
    return {};
  });

  // Persist to localStorage whenever fileStatuses changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fileStatuses));
      } catch (error) {
        console.error('Error saving evaluation statuses:', error);
      }
    }
  }, [fileStatuses]);

  const updateStatus = (fileName: string, status: EvaluationStatus) => {
    setFileStatuses(prev => {
      const newStatuses = {
        ...prev,
        [fileName]: status
      };
      return newStatuses;
    });
  };

  const value = {
    updateStatus,
    fileStatuses,
    setFileStatuses
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
}