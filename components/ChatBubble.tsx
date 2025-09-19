import React from 'react';
import { Message, Sender } from '../types';
import { UserIcon, SparklesIcon } from './icons';
import Markdown from 'react-markdown';
import { PracticeProblem } from './PracticeProblem';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start';
  
  const icon = isUser ? (
    <UserIcon className="w-6 h-6 text-white bg-blue-400 dark:bg-blue-500 rounded-full p-1" />
  ) : (
    <SparklesIcon className="w-6 h-6 text-white bg-purple-500 rounded-full p-1" />
  );

  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className={`max-w-2xl px-5 py-3 rounded-2xl ${bubbleClasses}`}>
        {message.text && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
                 <Markdown>{message.text}</Markdown>
            </div>
        )}
        {message.practiceProblem && (
          <PracticeProblem problem={message.practiceProblem} />
        )}
      </div>
    </div>
  );
};
