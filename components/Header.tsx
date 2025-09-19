import React from 'react';
import { LogoIcon, PlusCircleIcon, TrashIcon, HistoryIcon, SunIcon, MoonIcon, GiftIcon } from './icons';

interface HeaderProps {
  currentTopic: string;
  onNewTopic: () => void;
  studyStarted: boolean;
  historyLength: number;
  onClearHistory: () => void;
  onViewHistory: () => void;
  onViewBonusTip: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTopic, onNewTopic, studyStarted, historyLength, onClearHistory, onViewHistory, onViewBonusTip, theme, onThemeToggle }) => {
  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Study Mode
            </h1>
            {studyStarted && currentTopic && (
              <div className="hidden sm:flex items-center gap-2">
                 <span className="text-gray-400 dark:text-gray-500">/</span>
                 <span className="font-medium text-gray-600 dark:text-gray-300">{currentTopic}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
                onClick={onViewBonusTip}
                className="flex items-center justify-center w-9 h-9 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors relative"
                title="View daily bonus tip"
                aria-label="View daily bonus tip"
              >
                <GiftIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
            </button>
            <button
                onClick={onThemeToggle}
                className="flex items-center justify-center w-9 h-9 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            {studyStarted && (
              <button
                onClick={onNewTopic}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">New Topic</span>
              </button>
            )}
            {historyLength > 0 && (
                 <>
                    <button
                        onClick={onViewHistory}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="View past sessions"
                    >
                        <HistoryIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                    <button
                        onClick={onClearHistory}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-full hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                        title="Clear all past sessions"
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Clear History</span>
                    </button>
                 </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};