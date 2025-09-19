
import React from 'react';
import { SparklesIcon } from './icons';

export const LoadingBubble: React.FC = () => {
  return (
    <div className="flex items-start gap-3 w-full flex-row">
      <div className="flex-shrink-0 mt-1">
        <SparklesIcon className="w-6 h-6 text-white bg-purple-500 rounded-full p-1" />
      </div>
      <div className="max-w-2xl px-5 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 self-start">
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
