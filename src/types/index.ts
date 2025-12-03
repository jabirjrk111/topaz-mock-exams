export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  isPublished: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeTaken: number; // in seconds
}

export interface TestResult {
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
}
