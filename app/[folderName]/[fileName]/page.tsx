'use client';

import { useEffect, useState } from 'react';
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import ImageEvaluation from '@/components/evaluation_interface/ImageEvaluationPage';
import { useFileContext } from '@/context/FileContext';
import { notFound } from 'next/navigation';
import { FileResponse, MindMapFile } from '@/components/types/type';

export default function ImagePage({ params: { folderName, fileName } }: { params: { folderName: string; fileName: string } }) {
  const { initialFiles } = useFileContext();
  const [fileDetails, setFileDetails] = useState<FileResponse | null>(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!initialFiles || initialFiles.length === 0) {
        notFound();
      }

      const decodedFolderName = decodeURIComponent(folderName);
      const decodedFileName = decodeURIComponent(fileName);

      const response = await StorageOperations.fetchFileDetails(decodedFolderName, decodedFileName);

      if (!response.success || !response.data) {
        notFound();
      }

      setFileDetails(response); // Set the entire response
    };

    fetchFileDetails();
  }, [folderName, fileName, initialFiles]);

  if (!fileDetails || !fileDetails.data) {
    // Show a loading or error state if `fileDetails` is not ready
    return <div>Loading...</div>;
  }

  return (
    <ImageEvaluation
      bucketName={folderName}
      file={fileDetails.data.file} // Pass the file data
      initialFiles={initialFiles}
    />
  );
}
