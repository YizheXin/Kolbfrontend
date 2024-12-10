'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EvaluationStatus, FileStatus } from '@/components/types/type';

interface EvaluationContextType {
  updateStatus: (fileName: string, status: EvaluationStatus) => Promise<void>;
  fetchStatuses: (bucketName: string) => Promise<void>;
  fileStatuses: FileStatus;
  setFileStatuses: React.Dispatch<React.SetStateAction<FileStatus>>;
}

export const EvaluationContext = createContext<EvaluationContextType | null>(null);

interface EvaluationProviderProps {
  children: React.ReactNode;
}

export function EvaluationProvider({ children }: EvaluationProviderProps) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus>({});

  // Fetch statuses from the backend for a specific bucket
  const fetchStatuses = async (bucketName: string) => {
    try {
      const response = await fetch(`/api/firestore?collection=${bucketName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch statuses for bucket ${bucketName}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        setFileStatuses(result.data);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  // Update status in the backend and local state
  const updateStatus = async (fileName: string, status: EvaluationStatus) => {
    try {
      // Update the backend
      const response = await fetch(`/api/firestore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status in the backend');
      }

      // Update local state
      setFileStatuses((prev) => ({
        ...prev,
        [fileName]: status,
      }));
    } catch (error) {
      console.error(`Error updating status for ${fileName}:`, error);
    }
  };

  const value = {
    updateStatus,
    fetchStatuses,
    fileStatuses,
    setFileStatuses,
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
