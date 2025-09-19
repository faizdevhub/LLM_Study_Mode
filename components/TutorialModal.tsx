import React, { useState } from 'react';
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  ControlsIcon,
  MessageQuestionIcon,
  HistoryPlusIcon,
  LogoIcon
} from './icons';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    icon: <BookOpenIcon className="w-10 h-10" />,
    title: "Start Your Learning Journey",
    description: "Type any topic you want to master, select your learning level (Beginner or Advanced), and hit 'Start Studying'."
  },
  {
    icon: <ControlsIcon className="w-10 h-10" />,
    title: "Powerful AI Study Controls",
    description: "Use the control buttons to go deeper into a topic, simplify complex explanations, test your knowledge, or translate difficult terms."
  },
  {
    icon: <MessageQuestionIcon className="w-10 h-10" />,
    title: "Ask Follow-up Questions",
    description: "Don't be shy! Type any question you have in the message box. Your AI tutor is here to help you understand every detail."
  },
  {
    icon: <HistoryPlusIcon className="w-10 h-10" />,
    title: "Track Your Progress",
    description: "Use the 'History' button to review past lessons. Click 'New Topic' anytime to start fresh. Your progress is auto-saved."
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const step = tutorialSteps[currentStep];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all flex flex-col"
      >
        <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4 text-blue-600 dark:text-blue-400">
                {currentStep < tutorialSteps.length -1 ? step.icon : <LogoIcon className="w-10 h-10"/>}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {step.title}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 min-h-[72px]">
              {step.description}
            </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
            <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous step"
            >
                <ChevronLeftIcon className="w-6 h-6"/>
            </button>
            
            <div className="flex items-center gap-2">
                {tutorialSteps.map((_, index) => (
                    <div 
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${currentStep === index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                ))}
            </div>

            {currentStep < tutorialSteps.length - 1 ? (
                <button
                    onClick={handleNext}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Next step"
                >
                    <ChevronRightIcon className="w-6 h-6"/>
                </button>
            ) : (
                 <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300"
                >
                    Get Started
                </button>
            )}
        </div>
        
        <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close tutorial"
        >
            <XIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};