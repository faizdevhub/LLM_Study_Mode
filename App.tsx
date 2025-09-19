import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, Sender, StudyMode, LearningLevel, StudySession } from './types';
import { GeminiService } from './services/geminiService';
import { HistoryService } from './services/historyService';
import { TipService } from './services/tipService';
import { TopicInput } from './components/TopicInput';
import { ChatBubble } from './components/ChatBubble';
import { StudyControls } from './components/StudyControls';
import { LoadingBubble } from './components/LoadingBubble';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { HistoryModal } from './components/HistoryModal';
import { TutorialModal } from './components/TutorialModal';
import { BonusTipModal } from './components/BonusTipModal';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('beginner');
  const [studyStarted, setStudyStarted] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<StudySession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isBonusTipModalOpen, setIsBonusTipModalOpen] = useState<boolean>(false);
  const [dailyTip, setDailyTip] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const chatSession = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Apply and persist theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load history and check for tutorial on initial render
  useEffect(() => {
    setHistory(HistoryService.getHistory());
    const hasSeenTutorial = localStorage.getItem('studyModeTutorialSeen');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    }
    setDailyTip(TipService.getDailyTip());
  }, []);
  
  // Auto-scroll chat to the bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Auto-save session to history when chat updates
  useEffect(() => {
    if (studyStarted && currentSessionId) {
      const updatedSession: StudySession = {
        id: currentSessionId,
        topic,
        learningLevel,
        chatHistory,
        lastAccessed: Date.now(),
      };
      const newHistory = HistoryService.addOrUpdateSession(history, updatedSession);
      setHistory(newHistory);
    }
  }, [chatHistory, currentSessionId, studyStarted, topic, learningLevel, history]);


  const handleStartStudy = async (newTopic: string, level: LearningLevel) => {
    if (!newTopic.trim()) return;

    const newSessionId = Date.now().toString();
    const initialUserMessage: Message = {
      id: Date.now(),
      sender: Sender.USER,
      text: `I want to learn about: ${newTopic}`,
    };

    setTopic(newTopic);
    setLearningLevel(level);
    setStudyStarted(true);
    setIsLoading(true);
    setChatHistory([initialUserMessage]);
    setCurrentSessionId(newSessionId);

    try {
      chatSession.current = GeminiService.startChatSession(level);
      const response = await chatSession.current.sendMessage({ message: `Explain the basics of "${newTopic}". I am a ${level} learner.` });
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: Sender.AI,
        text: response.text,
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to start study session:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: Sender.AI,
        text: "Sorry, I couldn't start the session. Please check your API key and try again.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSession = (sessionId: string) => {
    const session = history.find(s => s.id === sessionId);
    if (session) {
      setTopic(session.topic);
      setLearningLevel(session.learningLevel);
      setChatHistory(session.chatHistory);
      setCurrentSessionId(session.id);
      setStudyStarted(true);
      chatSession.current = GeminiService.startChatSession(session.learningLevel);
      
      // Update last accessed time
      const updatedSession = { ...session, lastAccessed: Date.now() };
      const newHistory = HistoryService.addOrUpdateSession(history, updatedSession);
      setHistory(newHistory);
      setIsHistoryModalOpen(false); // Close modal on resume
    }
  };
  
  const handleControlClick = useCallback(async (mode: StudyMode) => {
    if (!chatSession.current || isLoading) return;

    const lastAiMessage = [...chatHistory].reverse().find(m => m.sender === Sender.AI && m.text);

    if (mode === StudyMode.TRANSLATE) {
        if (!lastAiMessage) return;
        setIsLanguageModalOpen(true);
        return;
    }

    let prompt = '';
    let userMessageText = '';

    switch (mode) {
      case StudyMode.EXPLAIN:
        prompt = `Explain the topic of "${topic}" in more detail, tailored for a ${learningLevel} learner. Focus on a different aspect or go deeper than your previous explanation.`;
        userMessageText = 'Explain this in more detail.';
        break;
      case StudyMode.SIMPLIFY:
        if (!lastAiMessage) { return; }
        prompt = `Simplify the following text, which was your last response. Assume I'm a ${learningLevel} learner.\n\nText: "${lastAiMessage.text}"`;
        userMessageText = 'Can you simplify that for me?';
        break;
      case StudyMode.PRACTICE:
         userMessageText = 'Give me a practice problem.';
         break;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: Sender.USER,
      text: userMessageText,
    };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        if (mode === StudyMode.PRACTICE) {
            const problemData = await GeminiService.generatePracticeProblem(topic, learningLevel);
            const problemMessage: Message = {
                id: Date.now() + 1,
                sender: Sender.AI,
                practiceProblem: problemData
            };
            setChatHistory(prev => [...prev, problemMessage]);
        } else {
            const response = await chatSession.current.sendMessage({ message: prompt });
            const aiResponse: Message = {
                id: Date.now() + 1,
                sender: Sender.AI,
                text: response.text,
            };
            setChatHistory(prev => [...prev, aiResponse]);
        }
    } catch (error) {
      console.error(`Failed on action ${mode}:`, error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: Sender.AI,
        text: "Sorry, I encountered an error. Please try again.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [topic, isLoading, learningLevel, chatHistory]);
  
  const handleTranslate = async (targetLanguage: string) => {
    if (!chatSession.current || isLoading || !targetLanguage.trim()) return;
    const lastAiMessage = [...chatHistory].reverse().find(m => m.sender === Sender.AI && m.text);
    
    setIsLanguageModalOpen(false);
    if (!lastAiMessage) return;

    const prompt = `Please identify the difficult words or complex phrases in the following text and provide their meanings in ${targetLanguage}. List them clearly.\n\nText: "${lastAiMessage.text}"`;
    const userMessageText = `Can you explain the difficult words in ${targetLanguage}?`;

    const userMessage: Message = {
      id: Date.now(),
      sender: Sender.USER,
      text: userMessageText,
    };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const response = await chatSession.current.sendMessage({ message: prompt });
        const aiResponse: Message = {
            id: Date.now() + 1,
            sender: Sender.AI,
            text: response.text,
        };
        setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error(`Failed on action ${StudyMode.TRANSLATE}:`, error);
        const errorMessage: Message = {
            id: Date.now() + 1,
            sender: Sender.AI,
            text: "Sorry, I encountered an error during translation. Please try again.",
        };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatSession.current || isLoading || !messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: Sender.USER,
      text: messageText,
    };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (messageText.trim().toLowerCase().includes('who is faiz')) {
        const specialResponse: Message = {
            id: Date.now() + 1,
            sender: Sender.AI,
            text: "faizdevhub@gmail.com with name is a person who trained me",
        };
        setTimeout(() => {
            setChatHistory(prev => [...prev, specialResponse]);
            setIsLoading(false);
        }, 500);
        return;
    }

    try {
        const response = await chatSession.current.sendMessage({ message: messageText });
        const aiResponse: Message = {
            id: Date.now() + 1,
            sender: Sender.AI,
            text: response.text,
        };
        setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error("Failed to send message:", error);
        const errorMessage: Message = {
            id: Date.now() + 1,
            sender: Sender.AI,
            text: "Sorry, I couldn't process your message. Please try again.",
        };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleNewTopic = () => {
    setStudyStarted(false);
    setTopic('');
    setChatHistory([]);
    chatSession.current = null;
    setCurrentSessionId(null);
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all past study sessions? This action cannot be undone.")) {
      HistoryService.clearHistory();
      setHistory([]);
      setIsHistoryModalOpen(false);
    }
  };
  
  const handleCloseTutorial = () => {
    localStorage.setItem('studyModeTutorialSeen', 'true');
    setIsTutorialOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleViewBonusTip = () => {
    setIsBonusTipModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header 
        currentTopic={topic} 
        onNewTopic={handleNewTopic} 
        studyStarted={studyStarted}
        historyLength={history.length}
        onClearHistory={handleClearHistory}
        onViewHistory={() => setIsHistoryModalOpen(true)}
        onViewBonusTip={handleViewBonusTip}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        {!studyStarted ? (
          <TopicInput onStartStudy={handleStartStudy} />
        ) : (
          <div className="w-full max-w-4xl h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {chatHistory.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <LoadingBubble />}
            </div>
            <StudyControls 
              onControlClick={handleControlClick} 
              onSendMessage={handleSendMessage}
              isLoading={isLoading} 
            />
          </div>
        )}
      </main>
      {isLanguageModalOpen && (
        <LanguageModal
          onClose={() => setIsLanguageModalOpen(false)}
          onTranslate={handleTranslate}
        />
      )}
      {isHistoryModalOpen && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          history={history}
          onResumeSession={handleResumeSession}
        />
      )}
      {isTutorialOpen && (
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={handleCloseTutorial}
        />
      )}
      {isBonusTipModalOpen && (
        <BonusTipModal
          isOpen={isBonusTipModalOpen}
          onClose={() => setIsBonusTipModalOpen(false)}
          tip={dailyTip}
        />
      )}
    </div>
  );
};

export default App;