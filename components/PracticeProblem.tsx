
import React, { useState } from 'react';
import { PracticeProblemData } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface PracticeProblemProps {
  problem: PracticeProblemData;
}

export const PracticeProblem: React.FC<PracticeProblemProps> = ({ problem }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
  };
  
  if (problem.correctAnswerIndex === -1) {
    return (
        <div className="p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <h3 className="font-bold text-red-800 dark:text-red-300">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{problem.question}</p>
            <p className="text-xs mt-2 text-red-600 dark:text-red-500">{problem.explanation}</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base">{problem.question}</h3>
      <div className="space-y-2">
        {problem.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = problem.correctAnswerIndex === index;
          
          let buttonClass = "w-full text-left p-3 border rounded-lg transition-colors duration-200 flex items-center justify-between text-sm ";
          if (isAnswered) {
            if (isCorrect) {
              buttonClass += "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300";
            } else if (isSelected) {
              buttonClass += "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300";
            } else {
               buttonClass += "bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 opacity-70";
            }
          } else {
            buttonClass += "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500";
          }

          return (
            <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isAnswered} className={buttonClass}>
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
              {isAnswered && isSelected && !isCorrect && <XCircleIcon className="w-5 h-5 text-red-500" />}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="p-3 mt-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-sm">Explanation</h4>
          <p className="text-sm mt-1">{problem.explanation}</p>
        </div>
      )}
    </div>
  );
};
