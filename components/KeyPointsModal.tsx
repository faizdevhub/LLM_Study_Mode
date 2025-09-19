import React from 'react';
import { Message } from '../types';
import { BookmarkIcon, XIcon } from './icons';
import Markdown from 'react-markdown';

interface KeyPointsModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatHistory: Message[];
    onToggleKeyPoint: (messageId: number) => void;
}

export const KeyPointsModal: React.FC<KeyPointsModalProps> = ({ isOpen, onClose, chatHistory, onToggleKeyPoint }) => {
    if (!isOpen) {
        return null;
    }
    
    const keyPoints = chatHistory.filter(msg => msg.isKeyPoint).sort((a, b) => a.id - b.id);

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
                  <BookmarkIcon className="w-6 h-6 text-yellow-500" />
                  Key Points
                </h2>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                    aria-label="Close key points modal"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            {keyPoints.length > 0 ? (
                <div className="space-y-4 overflow-y-auto custom-scrollbar p-1">
                    {keyPoints.map((message) => (
                        <div 
                          key={message.id}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-start gap-4"
                        >
                            <div className="prose prose-sm dark:prose-invert max-w-none flex-grow">
                                {message.text && <Markdown>{message.text}</Markdown>}
                            </div>
                            <button
                                onClick={() => onToggleKeyPoint(message.id)}
                                className="flex-shrink-0 p-1.5 rounded-full text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                                title="Remove from Key Points"
                            >
                                <BookmarkIcon className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookmarkIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">No Key Points Saved</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click the bookmark icon on a message to save it here.</p>
                </div>
            )}
          </div>
        </div>
    );
};
