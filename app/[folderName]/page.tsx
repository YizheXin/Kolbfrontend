'use client';

import { useEffect } from 'react';
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import FileGrid from '@/components/file-grid/FileGrid';
import { useFileContext } from '@/context/FileContext';
import { notFound } from 'next/navigation';
import { EvaluationStatus } from '@/components/types/type';

export default function BucketPage({ params: { folderName } }: { params: { folderName: string } }) {
  const { setInitialFiles } = useFileContext();

  // Move the status update function here
  const updateStatus = (fileName: string, status: EvaluationStatus) => {
    // This will be called from the ImageEvaluation component through context
    // Update the FileGrid's status through props or context
    console.log('Status updated:', fileName, status);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const decodedFolderName = decodeURIComponent(folderName);
      const { data } = await StorageOperations.fetchFiles(decodedFolderName);
      if (!data) {
        notFound();
      }
      setInitialFiles(data.files); // Set files in the context
    };

    fetchFiles();
  }, [folderName, setInitialFiles]);

  return (
      <FileGrid bucketName={folderName} />
  );
}