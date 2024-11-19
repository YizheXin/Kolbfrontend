'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MindMapFile } from '../types/type';

interface SearchableFileGridProps {
  bucketName: string;
  initialFiles: MindMapFile[];
}

export default function SearchableFileGrid({ bucketName, initialFiles }: SearchableFileGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of files per page

  // Set up Fuse.js for fuzzy search
  const fuse = new Fuse(initialFiles, {
    keys: ['name'], // Searchable fields
    threshold: 0.3, // Adjust this for sensitivity
  });

  const filteredFiles = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : initialFiles;

  // Pagination Logic
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

  const handleFileSelect = (file: MindMapFile) => {
    const fileName = file.name.includes('/')
      ? file.name.split('/').pop() || file.name
      : file.name;

    router.push(
      `/${encodeURIComponent(bucketName)}/${encodeURIComponent(fileName)}`
    );
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* Navigation and Search */}
      <div className="mb-8 space-y-4">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Buckets
        </button>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentFiles.map((file) => (
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
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-white ${
              currentPage === 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-white ${
              currentPage === totalPages
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No files found</p>
        </div>
      )}
    </div>
  );
}
