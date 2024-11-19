import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EvaluationStatus } from '../types/type';

interface StatusIndicatorProps {
  isLoading: boolean;
  status: EvaluationStatus | null;
}

export function StatusIndicator({ isLoading, status }: StatusIndicatorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center text-gray-400 text-xs">
        <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!status) {
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
}