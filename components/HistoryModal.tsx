import React from 'react';
import { StudySession } from '../types';
import { HistoryIcon, StarIcon, MessageSquareIcon, XIcon } from './icons';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: StudySession[];
    onResumeSession: (sessionId: string) => void;
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onResumeSession }) => {
    if (!isOpen) {
        return null;
    }
    
    const sortedHistory = [...history].sort((a, b) => b.lastAccessed - a.lastAccessed);

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl m-4 transform transition-all flex flex-col max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <HistoryIcon className="w-6 h-6" />
                  Past Sessions
                </h2>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                    aria-label="Close history modal"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            {sortedHistory.length > 0 ? (
                <div className="space-y-3 overflow-y-auto custom-scrollbar">
                    {sortedHistory.map((session, index) => (
                        <button 
                          key={session.id}
                          onClick={() => onResumeSession(session.id)}
                          className="w-full p-4 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg flex justify-between items-start hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                        >
                            <div className="flex-grow text-left mr-4">
                              <div className="flex items-center gap-2 mb-1.5">
                                  <p className="font-semibold text-gray-800 dark:text-white leading-tight">{session.topic}</p>
                                  {index === 0 && (
                                      <span className="flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
                                          <StarIcon className="w-3 h-3" />
                                          Recent
                                      </span>
                                  )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full capitalize font-medium">{session.learningLevel}</span>
                                  <span className="flex items-center gap-1.5">
                                      <MessageSquareIcon className="w-3.5 h-3.5" />
                                      <span>{session.chatHistory.length} message{session.chatHistory.length === 1 ? '' : 's'}</span>
                                  </span>
                              </div>
                          </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{formatDate(session.lastAccessed)}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">You have no past study sessions.</p>
                </div>
            )}
          </div>
        </div>
    );
};