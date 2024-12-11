'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { constructVercelURL } from '@/utils/generateURL';

interface EvaluationAnalyticsProps {
  bucketName: string; // The name of the folder or bucket
}

interface AnalyticsData {
  inProgress: number;
  finished: number;
  goodQuality: number;
  badQuality: number;
  badQualityTypes: Record<string, number>;
  patterns: { name: string; truePositive: number; trueNegative: number }[];
}

export default function EvaluationAnalytics({ bucketName }: EvaluationAnalyticsProps) {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          constructVercelURL(`/api/firestore/analytics?collection=${bucketName}`)
        );
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        } else {
          setStats(null);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bucketName]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-400">No evaluations for any images.</div>;
  }

  // Prepare data for bar chart
  const patternsData = {
    labels: stats.patterns.map((pattern) => pattern.name),
    datasets: [
      {
        label: 'True Positive',
        backgroundColor: '#4CAF50',
        data: stats.patterns.map((pattern) => pattern.truePositive),
      },
      {
        label: 'True Negative',
        backgroundColor: '#FF5722',
        data: stats.patterns.map((pattern) => pattern.trueNegative),
      },
    ],
  };

  const qualityData = {
    labels: ['Good Quality', 'Bad Quality'],
    datasets: [
      {
        label: 'Quality Distribution',
        backgroundColor: ['#4CAF50', '#FF5722'],
        data: [stats.goodQuality, stats.badQuality],
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Detailed Analytics</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Overview</h2>
        <p className="text-gray-400">Images in Progress: <span className="text-yellow-400">{stats.inProgress}</span></p>
        <p className="text-gray-400">Images Finished: <span className="text-green-400">{stats.finished}</span></p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Quality Assessment</h2>
        <Bar data={qualityData} options={{ responsive: true }} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Pattern Distribution</h2>
        <Bar data={patternsData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
