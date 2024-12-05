// app/[folderName]/[fileName]/ImagePageClient.tsx
'use client';
import ImageEvaluation from '@/components/evaluation_interface/ImageEvaluationPage';
import { useFileContext } from '@/context/FileContext';
import { EvaluationStatus, MindMapFile } from '@/components/types/type';

interface ImagePageProps {
  folderName: string;
  fileName: string;
  fileDetails: {
    file: MindMapFile;
  };
}

export default function ImagePage({ 
  folderName, 
  fileName, 
  fileDetails 
}: ImagePageProps) {
  const { initialFiles } = useFileContext();

  const updateStatus = (fileName: string, status: EvaluationStatus) => {
    // Implementation of status update logic
    console.log('Status updated:', fileName, status);
  };

  // Simple loading check for initialFiles
  if (!initialFiles || initialFiles.length === 0) {
    return <div>Loading...</div>;
  }

  return (
      <ImageEvaluation
        bucketName={folderName}
        file={fileDetails.file}
        initialFiles={initialFiles}
      />
  );
}