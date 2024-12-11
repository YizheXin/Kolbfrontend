'use client';

import { useParams } from 'next/navigation';
import EvaluationAnalytics from '@/components/evaluation-analytics/EvaluationAnalytics';

export default function AnalyticsPage() {
  const params = useParams(); // Use params to access the dynamic route
  const folderName = Array.isArray(params?.folderName)
    ? params.folderName[0] // If it's an array, take the first element
    : params?.folderName; // Otherwise, use it as is

  if (!folderName) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        Analytics for <span className="text-blue-400">{decodeURIComponent(folderName)}</span>
      </h1>
      <EvaluationAnalytics bucketName={folderName} />
    </div>
  );
}
