import React from 'react';
import { GiftIcon, XIcon } from './icons';

interface BonusTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip: string;
}

export const BonusTipModal: React.FC<BonusTipModalProps> = ({ isOpen, onClose, tip }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm m-4 transform transition-all flex flex-col p-6 text-center"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4 mx-auto text-blue-600 dark:text-blue-400">
          <GiftIcon className="w-8 h-8"/>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Bonus Tip!
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          {tip}
        </p>
        <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300"
        >
            Got it!
        </button>
        <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close bonus tip"
        >
            <XIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};