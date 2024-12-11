import React from 'react';
import { Tooltip } from 'flowbite-react';

interface InfoIconWithTooltipProps {
  message: string;
}

const InfoIconWithTooltip: React.FC<InfoIconWithTooltipProps> = ({ message }) => {
  return (
    <Tooltip
      content={
        <div className="max-w-xs text-sm text-center">
          {message}
        </div>
      }
      placement="right"
    >
      <button className="ml-2 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M12 1.75a10.25 10.25 0 100 20.5 10.25 10.25 0 000-20.5zm-.75 6.5a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0V8.25zm1.5 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </Tooltip>
  );
};

export default InfoIconWithTooltip;
