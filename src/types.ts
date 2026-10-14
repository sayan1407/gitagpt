export interface User {
  username: string;
  email: string;
  isNewUser?: boolean;
}

export interface GoogleAuthResponse {
  username: string;
  email: string;
  is_new_user?: boolean;
  message?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  responseId?: string;
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  previousResponseId: string | null;
  messages: Message[];
}

export interface GitaChapter {
  number: number;
  sanskritName: string;
  englishName: string;
  versesCount: number;
  description: string;
  summary: string;
  sampleQuestion: string;
}

export interface Shloka {
  verse: string;
  chapter: number;
  verseNumber: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
}

export interface PromptCategory {
  category: string;
  icon: string;
  prompts: string[];
}
