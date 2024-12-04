'use client';

import { useEffect } from 'react';
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import FileGrid from '@/components/file-grid/FileGrid';
import { useFileContext } from '@/context/FileContext';
import { notFound } from 'next/navigation';

export default function BucketPage({ params: { folderName } }: { params: { folderName: string } }) {
  const { setInitialFiles } = useFileContext();

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

  return <FileGrid bucketName={folderName} />;
}
