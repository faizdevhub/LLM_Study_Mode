import React, { useState, useEffect, useRef } from 'react';

interface LanguageModalProps {
  onClose: () => void;
  onTranslate: (language: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ onClose, onTranslate }) => {
  const [language, setLanguage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (language.trim()) {
      onTranslate(language);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Translate To...
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please enter the target language for translation.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g., Spanish, French, Japanese"
            className="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            aria-label="Target Language"
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!language.trim()}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Translate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};