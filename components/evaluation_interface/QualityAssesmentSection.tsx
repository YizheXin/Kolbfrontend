import React, { useState,useEffect } from 'react';
import InfoIconWithTooltip from '../Tooltip';
interface QualityAssessmentProps {
    onQualityChange: (isGoodQuality: boolean | null, badQualityType: string | null) => void;
    initialIsGoodQuality: boolean | null; // Added prop
    initialBadQualityType: string | null; // Added prop
  }
  
  export default function QualityAssessment({
    onQualityChange,
    initialIsGoodQuality,
    initialBadQualityType,
  }: QualityAssessmentProps) {
    const [isGoodQuality, setIsGoodQuality] = useState<boolean | null>(initialIsGoodQuality);
    const [badQualityType, setBadQualityType] = useState<string | null>(initialBadQualityType);
  
    useEffect(() => {
      // Notify parent about the initial state
      onQualityChange(isGoodQuality, badQualityType);
    }, [isGoodQuality, badQualityType, onQualityChange]);
  
    const handleQualityChange = (quality: boolean) => {
      setIsGoodQuality(quality);
      if (quality) {
        setBadQualityType(null); // Clear bad quality type if marked as good
        onQualityChange(true, null);
      } else {
        onQualityChange(false, badQualityType);
      }
    };
  
    const handleBadQualityTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedType = event.target.value;
      setBadQualityType(selectedType);
      onQualityChange(isGoodQuality, selectedType);
    };
  
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center mb-4">
        <h3 className="text-xl text-white">Quality Assessment</h3>
        <InfoIconWithTooltip
            message="Select 'Good Quality' if the image is clear and meets expectations. If 'Bad Quality', select the reason for why it doesn't meet the criteria (e.g., low resolution, noisy background)."
        />
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="good-quality"
              name="quality"
              value="good"
              checked={isGoodQuality === true}
              onChange={() => handleQualityChange(true)}
              className="form-radio h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600"
            />
            <label htmlFor="good-quality" className="text-gray-300">
              Good Quality
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="bad-quality"
              name="quality"
              value="bad"
              checked={isGoodQuality === false}
              onChange={() => handleQualityChange(false)}
              className="form-radio h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600"
            />
            <label htmlFor="bad-quality" className="text-gray-300">
              Bad Quality
            </label>
          </div>
          {isGoodQuality === false && (
            <div className="mt-3">
              <label htmlFor="bad-quality-type" className="text-gray-300 mb-2 block">
                Select Issue:
              </label>
              <select
                id="bad-quality-type"
                value={badQualityType || ''}
                onChange={handleBadQualityTypeChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3"
              >
                <option value="">Select an issue...</option>
                <option value="low_resolution">Low Resolution</option>
                <option value="noisy_background">Noisy Background</option>
                <option value="not_white_background">Not White Background</option>
                <option value="messy_handwriting">Messy Handwriting</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }
  
