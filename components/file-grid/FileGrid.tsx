'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowLeftIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { MindMapFile } from '../types/type';
import { generatePagination } from './Pagination';
interface FileGridProps {
  bucketName: string;
  initialFiles: MindMapFile[];
}

interface EvaluationStatus {
  isFinished: boolean;
  patterns: Record<string, boolean>;
}

interface FileStatus {
  [key: string]: EvaluationStatus | null;
}

export default function FileGrid({ bucketName, initialFiles }: FileGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fileStatuses, setFileStatuses] = useState<FileStatus>({});
  const itemsPerPage = 12;

  // Calculate paginated files
  const paginatedFiles = useMemo(() => {
    const filtered = initialFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      currentFiles: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalFiles: filtered.length
    };
  }, [initialFiles, searchQuery, currentPage, itemsPerPage]);

  // Calculate total evaluated files
  const evaluatedCount = useMemo(() => {
    return Object.values(fileStatuses).filter(status => 
      status !== null && status.isFinished
    ).length;
  }, [fileStatuses]);

  const fetchStatus = async (fileName: string) => {
    try {
      const response = await fetch(
        `/api/firestore/?collection=${bucketName}&docName=${encodeURIComponent(fileName)}`
      );
      
      const result = await response.json();
      
      return result.success ? result.data : null;
    } catch (error) {
      console.error(`Error fetching status for ${fileName}:`, error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchStatuses = async () => {
      const newStatuses: FileStatus = {};
      
      for (const file of paginatedFiles.currentFiles) {
        if (!mounted) {
          break;
        }
        
        const status = await fetchStatus(file.name);
        
        if (mounted) {
          newStatuses[file.name] = status;
        }
      }

      if (mounted) {
        setFileStatuses(newStatuses);
      }
    };

    fetchStatuses();

    return () => {
      mounted = false;
    };
  }, [bucketName, paginatedFiles.currentFiles]);

  // Handle URL page parameter
  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      const pageNum = Number(page);
      if (pageNum > 0 && pageNum <= paginatedFiles.totalPages) {
        setCurrentPage(pageNum);
      }
    }
  }, [searchParams, paginatedFiles.totalPages]);

  const handleFileSelect = (file: MindMapFile) => {
    const fileName = file.name.includes('/')
      ? file.name.split('/').pop() || file.name
      : file.name;
    router.push(
      `/${encodeURIComponent(bucketName)}/${encodeURIComponent(fileName)}?page=${currentPage}`
    );
  };

  const handleBackClick = () => {
    router.push(`/`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/${encodeURIComponent(bucketName)}?page=${page}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    router.push(`/${encodeURIComponent(bucketName)}?page=1`);
  };

  const renderStatusIndicator = (file: MindMapFile) => {
    const status = fileStatuses[file.name];
    
    if (status === undefined) {
      return (
        <div className="flex items-center text-gray-400 text-xs">
          <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
          Loading...
        </div>
      );
    }

    if (status === null) {
      return (
        <div className="flex items-center text-gray-400 text-xs">
          <ClockIcon className="h-4 w-4 mr-1" />
          Not evaluated
        </div>
      );
    }

    const patternsCount = Object.values(status.patterns || {}).filter(Boolean).length;

    return (
      <div className="flex items-center space-x-2">
        
        <div className={`flex items-center ${status.isFinished ? 'text-green-500' : 'text-yellow-500'} text-xs`}>
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          {status.isFinished ? 'Completed' : 'In Progress'}
        </div>
        <div className="text-gray-400 text-xs">
          {patternsCount} pattern{patternsCount !== 1 ? 's' : ''} marked
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Navigation and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Buckets
          </button>
          
          <span className="text-sm bg-gray-700 px-3 py-1 rounded-full flex items-center gap-3">
            <span>
              <span className="text-green-400 font-medium">{evaluatedCount}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-300">{initialFiles.length}</span>
              <span className="text-gray-400"> completed</span>
            </span>
            <span className="text-gray-400">•</span>
            <span>
              <span className="text-yellow-400 font-medium">{Object.values(fileStatuses).filter(status => 
                status !== null && !status.isFinished
              ).length}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-300">{initialFiles.length}</span>
              <span className="text-gray-400"> in progress</span>
            </span>
          </span>
          
        </div>
        {evaluatedCount === initialFiles.length && (
          <div className="bg-green-500 text-white p-4 rounded-md mb-4 text-center">
            🎉 Congratulations! You have completed all the labeling tasks. Please contact the developer team for the next step.
          </div>
        )}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedFiles.currentFiles.map((file) => (
          <motion.div
            key={file.blobPath}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFileSelect(file)}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
              />
            </div>

            <div className="p-3">
              <p className="text-sm text-gray-300 truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(file.timeCreated).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {renderStatusIndicator(file)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {paginatedFiles.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          {generatePagination(currentPage, paginatedFiles.totalPages).map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-3 py-2 text-gray-400">
                {page}
              </span>
            )
          )}
        </div>
      )}

      {paginatedFiles.totalFiles === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No files found</p>
        </div>
      )}
    </div>
  );
}