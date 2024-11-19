import { useState, useEffect } from 'react';
import { FileStatus,MindMapFile } from '@/components/types/type';
import { evaluationService } from '@/components/file-grid/EvaluationService';
export function useEvaluationStatus(files: MindMapFile[], bucketName: string) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus>({});
  const [loadingStatuses, setLoadingStatuses] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    async function fetchStatuses() {
      if (!files.length) return;

      setFileStatuses({});
      setLoadingStatuses(new Set(files.map(f => f.name)));

      try {
        const statusPromises = files.map(async (file) => {
          const status = await evaluationService.fetchStatus(bucketName, file.name);
          if (isMounted) {
            setFileStatuses(prev => ({
              ...prev,
              [file.name]: status
            }));
            setLoadingStatuses(prev => {
              const newSet = new Set(prev);
              newSet.delete(file.name);
              return newSet;
            });
          }
        });

        await Promise.all(statusPromises);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    }

    fetchStatuses();

    return () => {
      isMounted = false;
    };
  }, [files, bucketName]);

  return { fileStatuses, loadingStatuses };
}