'use client';

import React, { useState, useEffect } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, FlagIcon } from '@heroicons/react/24/outline';
import { MindMapFile, PatternState } from '../types/type';
import { constructVercelURL } from '@/utils/generateURL';
import Toast from '../notification/Toast';
import InfoIconWithTooltip from '../Tooltip';
import { Tooltip, Table, TextInput, Textarea } from "flowbite-react";
import { EvaluationStatus } from '../types/type';
import { useEvaluation } from '@/context/EvaluationContext';
import { FullScreenImage } from './FullScreenImage';
import QualityAssessment from './QualityAssesmentSection';

// 1. 引入 KolbReflectionForm
import KolbReflectionForm from './KolbReflectionForm';

// 用于 KolbReflectionForm 的类型（如果你需要在这里也使用）
interface FormData {
  testCaseId: string;
  tester: string;
  stage: string;
  isKolbCycleReflection: string;
  experienceToReflect: string;
  marginalGain: string;
  sequenceOfEvents: string;
  feelingsAboutExperience: string;
  processAspects: string;
  challengeResponse: string;
  feelingTriggers: string;
  actionReasons: string;
  habitsAndBeliefs: string;
  similarResponses: string;
  potentialSolutions: string;
}

const patterns = [
  'unclear_backbone',
  'too_wordy',
  'lines_over_arrows',
  'single_node_chain',
  'insufficient_chunking',
  'question_chunked',
  'segmental_mapping',
  'islands',
  'spiderwebbing',
  'waterfalling',
] as const;

type Pattern = typeof patterns[number];

interface ImageEvaluationProps {
  bucketName: string;
  file: MindMapFile;
  initialFiles: MindMapFile[]; // Add this to track all files in the bucket
  onStatusUpdate?: (fileName: string, status: EvaluationStatus) => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}


export default function ImageEvaluation({
  bucketName,
  file,
  initialFiles, // Access all files in the bucket
}: ImageEvaluationProps) {
  const { updateStatus } = useEvaluation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionName = bucketName;

  // Find the current file's index
  const currentIndex = initialFiles.findIndex((f) => f.name === file.name);
  // Get the current page from the URL
  const currentPage = searchParams.get('page') || '1';
  // Initialize all patterns as false
  const initialPatternState = Object.fromEntries(patterns.map((p) => [p, false]));
  const [selectedPatterns, setSelectedPatterns] = useState<PatternState>(initialPatternState);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isGoodQuality, setIsGoodQuality] = useState<boolean | null>(null); 
  const [badQualityType, setBadQualityType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      try {
        const response = await fetch(
          constructVercelURL(
            `/api/firestore/?collection=${collectionName}&docName=${encodeURIComponent(file.name)}`
          )
        );
        const result = await response.json();

        if (result.success && result.data) {
          const existingPatterns = result.data.patterns || {};
          setSelectedPatterns({
            ...initialPatternState,
            ...existingPatterns,
          });
          setIsFinished(result.data.isFinished || false);
          setIsGoodQuality(result.data.isGoodQuality ?? null); 
          setBadQualityType(result.data.badQualityType ?? null)
        }
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        showToast('Failed to load evaluation data', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluation();
  }, [collectionName, file.name]);

  

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(constructVercelURL(`/api/firestore`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionName,
          fileName: file.name,
          patterns: selectedPatterns,
          isFinished,
          isGoodQuality,
          badQualityType
        }),
      });

      const result = await response.json();
      if (result.success) {
        updateStatus(file.name, {
          isFinished,
          patterns: selectedPatterns,
        });
        if (!isFinished) {
          showToast(
            'Not marked as finished - you can come back later to complete the evaluation',
            'warning'
          );
        } else {
          showToast('Evaluation submitted successfully', 'success');
          // setTimeout(() => {
          //   router.push(`/${encodeURIComponent(bucketName)}?page=${currentPage}`);
          // }, 1000);
        }
      } else {
        throw new Error(result.message || 'Failed to submit evaluation');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to submit evaluation',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatternToggle = (pattern: Pattern) => {
    setSelectedPatterns((prev) => ({
      ...prev,
      [pattern]: !prev[pattern],
    }));
  };

  const handleNext = () => {
    if (currentIndex < initialFiles.length - 1) {
      const nextFile = initialFiles[currentIndex + 1];
      const nextPage = Math.floor((currentIndex + 1) / 12) + 1; // Calculate next page
      router.push(
        `/${encodeURIComponent(bucketName)}/${encodeURIComponent(nextFile.name)}?page=${nextPage}`
      );
    }
  };
  

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevFile = initialFiles[currentIndex - 1];
      const prevPage = Math.floor((currentIndex - 1) / 12) + 1; // Calculate previous page
      router.push(
        `/${encodeURIComponent(bucketName)}/${encodeURIComponent(prevFile.name)}?page=${prevPage}`
      );
    }
  };

  // 2. 处理 KolbReflectionForm 提交的回调（你可将此函数与其他逻辑结合）
  const handleKolbFormSubmit = (data: FormData) => {
    console.log('Kolb Reflection Form Data: ', data);
    // TODO: 你可以在这里将 data 发送到后端，或者与现有的 handleSubmit 融合
  };

    
  return (
    <>
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <FullScreenImage
            image={file}
            onClose={() => setIsFullScreen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mb-6 flex justify-between">
        <button
          onClick={() => router.push(`/${encodeURIComponent(bucketName)}?page=${currentPage}`)}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Files
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= initialFiles.length - 1}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8 h-[calc(100vh-120px)]">
        {/* Table */}
        <div
          className="bg-gray-800 rounded-lg p-4 flex justify-center items-center"
          style={{ width: '65%', maxWidth: '850px'}}
        >
          {/* 放到这里面 */}
          {/* 3. 在这里放置 KolbReflectionForm */}
            {/*
              isSubmitting 你可以与本页面的 state 相结合，也可以用单独的 state
              onSubmitData 传入 handleKolbFormSubmit 方法
            */}
            <KolbReflectionForm 
              onSubmitData={handleKolbFormSubmit} 
              isSubmitting={isSubmitting}
            />
        </div>

        {/* Evaluation Panel */}
        <div className="w-[320px] bg-gray-800 rounded-lg p-6 flex flex-col">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
      
              <div className="flex items-center mb-4">
                <h3 className="text-xl text-white">Evaluation Patterns</h3>
                <InfoIconWithTooltip
                  message="Tick the pattern(s) if you think they exist in the image. You can modify your selection at any time before submission."
                />
              </div>
              <div className="space-y-3">
                {patterns.map((pattern) => (
                  <motion.label
                    key={pattern}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPatterns[pattern] || false}
                      onChange={() => handlePatternToggle(pattern)}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600"
                    />
                    <span>{pattern.replace(/_/g, ' ')}</span>
                  </motion.label>
                ))}
              </div>
              
              {/* Quality Assessment */}
              <QualityAssessment
                initialIsGoodQuality={isGoodQuality} 
                initialBadQualityType={badQualityType} 
                onQualityChange={(quality, reason) => {
                  setIsGoodQuality(quality);
                  setBadQualityType(reason);
                }}
              />
              <div className="space-y-3 mt-4">
                {/* Flag as Finished Button */}
                <Tooltip
                  content="Confirmed your evaluation? Flag it as finished before submitting. You can always resubmit later."
                  placement="right"
                >
                  <button
                    onClick={() => setIsFinished(!isFinished)}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                      isFinished
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <FlagIcon className="h-5 w-5" />
                    <span>{isFinished ? 'Evaluation Finished' : 'Flag as Finished'}</span>
                  </button>
                </Tooltip>

                {/* Submit Evaluation Button */}
                <Tooltip
                  content="Submit your evaluation even if not flagged as finished. You can always resubmit later."
                  placement="right"
                >
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                  </button>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}