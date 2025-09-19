// FIX: Removed self-import of `PracticeProblemData` which was causing a conflict as the interface is defined below.
// FIX: Removed unused `React` import.

export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: number;
  sender: Sender;
  text?: string;
  practiceProblem?: PracticeProblemData;
}

export interface PracticeProblemData {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type LearningLevel = 'beginner' | 'basic' | 'advanced';

export enum StudyMode {
  EXPLAIN = 'EXPLAIN',
  PRACTICE = 'PRACTICE',
  SIMPLIFY = 'SIMPLIFY',
  TRANSLATE = 'TRANSLATE',
}

export interface StudySession {
  id: string;
  topic: string;
  learningLevel: LearningLevel;
  chatHistory: Message[];
  lastAccessed: number;
}