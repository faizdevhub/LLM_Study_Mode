
import React, { useState } from 'react';
import { StudyMode } from '../types';
import { BrainIcon, LightbulbIcon, BeakerIcon, TranslateIcon, SendIcon } from './icons';

interface StudyControlsProps {
  onControlClick: (mode: StudyMode) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const controlButtons = [
  { mode: StudyMode.EXPLAIN, text: 'Explain this deeper', icon: <LightbulbIcon className="w-5 h-5" /> },
  { mode: StudyMode.PRACTICE, text: 'Give me a practice problem', icon: <BeakerIcon className="w-5 h-5" /> },
  { mode: StudyMode.SIMPLIFY, text: 'Simplify this for me', icon: <BrainIcon className="w-5 h-5" /> },
  { mode: StudyMode.TRANSLATE, text: 'Translate', icon: <TranslateIcon className="w-5 h-5" /> },
];

export const StudyControls: React.FC<StudyControlsProps> = ({ onControlClick, onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
        {controlButtons.map(({ mode, text, icon }) => (
          <button
            key={mode}
            onClick={() => onControlClick(mode)}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
          >
            {icon}
            <span>{text}</span>
          </button>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question or type a message..."
          disabled={isLoading}
          className="w-full px-4 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 disabled:opacity-50"
          aria-label="Your message"
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="flex-shrink-0 w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};