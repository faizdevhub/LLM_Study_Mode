import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons';
import { LearningLevel } from '../types';
import { TopicService } from '../services/topicService';

interface TopicInputProps {
  onStartStudy: (topic: string, level: LearningLevel) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onStartStudy }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<LearningLevel>('beginner');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);

  useEffect(() => {
    setSuggestedTopics(TopicService.getDailySuggestedTopics(5));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartStudy(topic, level);
    }
  };
  
  const levelButtonClass = (buttonLevel: LearningLevel) => 
    `px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 ${
      level === buttonLevel 
      ? 'bg-blue-600 text-white' 
      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
    
  return (
    <div className="w-full max-w-2xl text-center">
      <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
        <LogoIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-600 dark:text-gray-400 mb-3">
        Gemini Study Mode
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        What complex topic do you want to master today?
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Quantum Computing, General Relativity, Neural Networks"
          className="w-full px-5 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          aria-label="Study Topic"
        />
        
        <div className="flex justify-center items-center gap-3">
            <span className="text-sm font-medium text-black dark:text-white">I am a:</span>
            <button type="button" onClick={() => setLevel('beginner')} className={levelButtonClass('beginner')}>
                Beginner
            </button>
            <button type="button" onClick={() => setLevel('basic')} className={levelButtonClass('basic')}>
                Basic
            </button>
            <button type="button" onClick={() => setLevel('advanced')} className={levelButtonClass('advanced')}>
                Advanced
            </button>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!topic.trim()}
          aria-label="Start Studying"
        >
          Start Studying
        </button>
      </form>
      
      {suggestedTopics.length > 0 && (
          <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Or try a daily suggestion:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                  {suggestedTopics.map((suggestedTopic) => (
                      <button
                          key={suggestedTopic}
                          onClick={() => onStartStudy(suggestedTopic, level)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white transition-colors duration-200"
                      >
                          {suggestedTopic}
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};