import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Test, TestAttempt } from '@/types';

interface TestContextType {
  tests: Test[];
  attempts: TestAttempt[];
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  submitAttempt: (attempt: Omit<TestAttempt, 'id'>) => void;
  getTestById: (id: string) => Test | undefined;
  getAttemptsByUser: (userId: string) => TestAttempt[];
  getAttemptsByTest: (testId: string) => TestAttempt[];
}

const TestContext = createContext<TestContextType | undefined>(undefined);

// Sample test data
const sampleTests: Test[] = [
  {
    id: '1',
    title: 'Mathematics Fundamentals',
    description: 'Test your knowledge of basic mathematical concepts including algebra, geometry, and arithmetic.',
    duration: 30,
    questions: [
      {
        id: 'q1',
        text: 'What is 15 × 8?',
        options: ['100', '120', '125', '130'],
        correctAnswer: 1,
        explanation: '15 × 8 = 120'
      },
      {
        id: 'q2',
        text: 'Solve for x: 2x + 6 = 18',
        options: ['x = 4', 'x = 6', 'x = 8', 'x = 12'],
        correctAnswer: 1,
        explanation: '2x + 6 = 18 → 2x = 12 → x = 6'
      },
      {
        id: 'q3',
        text: 'What is the area of a rectangle with length 12 and width 5?',
        options: ['17', '34', '60', '72'],
        correctAnswer: 2,
        explanation: 'Area = length × width = 12 × 5 = 60'
      },
    ],
    createdBy: '1',
    createdAt: new Date(),
    isPublished: true,
  },
  {
    id: '2',
    title: 'English Grammar',
    description: 'Evaluate your understanding of English grammar rules, sentence structure, and vocabulary.',
    duration: 25,
    questions: [
      {
        id: 'q1',
        text: 'Which sentence is grammatically correct?',
        options: [
          'She don\'t like apples.',
          'She doesn\'t likes apples.',
          'She doesn\'t like apples.',
          'She don\'t likes apples.'
        ],
        correctAnswer: 2,
        explanation: 'The correct form uses "doesn\'t" with the base form "like".'
      },
      {
        id: 'q2',
        text: 'Choose the correct past tense: "Yesterday, I ___ to the store."',
        options: ['go', 'went', 'gone', 'going'],
        correctAnswer: 1,
        explanation: '"Went" is the simple past tense of "go".'
      },
    ],
    createdBy: '1',
    createdAt: new Date(),
    isPublished: true,
  },
  {
    id: '3',
    title: 'General Science',
    description: 'Test your knowledge of physics, chemistry, and biology fundamentals.',
    duration: 45,
    questions: [
      {
        id: 'q1',
        text: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctAnswer: 0,
        explanation: 'Water is composed of 2 hydrogen atoms and 1 oxygen atom, hence H2O.'
      },
      {
        id: 'q2',
        text: 'What is the speed of light in vacuum?',
        options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
        correctAnswer: 1,
        explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second.'
      },
      {
        id: 'q3',
        text: 'Which organ is responsible for pumping blood in humans?',
        options: ['Liver', 'Brain', 'Heart', 'Lungs'],
        correctAnswer: 2,
        explanation: 'The heart is the muscular organ that pumps blood throughout the body.'
      },
    ],
    createdBy: '1',
    createdAt: new Date(),
    isPublished: true,
  },
];

export function TestProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    // Load from localStorage or use sample data
    const savedTests = localStorage.getItem('topaz_tests');
    const savedAttempts = localStorage.getItem('topaz_attempts');
    
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    } else {
      setTests(sampleTests);
      localStorage.setItem('topaz_tests', JSON.stringify(sampleTests));
    }
    
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  const saveTests = (newTests: Test[]) => {
    setTests(newTests);
    localStorage.setItem('topaz_tests', JSON.stringify(newTests));
  };

  const saveAttempts = (newAttempts: TestAttempt[]) => {
    setAttempts(newAttempts);
    localStorage.setItem('topaz_attempts', JSON.stringify(newAttempts));
  };

  const addTest = (test: Omit<Test, 'id' | 'createdAt'>) => {
    const newTest: Test = {
      ...test,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    saveTests([...tests, newTest]);
  };

  const updateTest = (id: string, updates: Partial<Test>) => {
    saveTests(tests.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTest = (id: string) => {
    saveTests(tests.filter(t => t.id !== id));
  };

  const submitAttempt = (attempt: Omit<TestAttempt, 'id'>) => {
    const newAttempt: TestAttempt = {
      ...attempt,
      id: Date.now().toString(),
    };
    saveAttempts([...attempts, newAttempt]);
  };

  const getTestById = (id: string) => tests.find(t => t.id === id);

  const getAttemptsByUser = (userId: string) => attempts.filter(a => a.userId === userId);

  const getAttemptsByTest = (testId: string) => attempts.filter(a => a.testId === testId);

  return (
    <TestContext.Provider value={{
      tests,
      attempts,
      addTest,
      updateTest,
      deleteTest,
      submitAttempt,
      getTestById,
      getAttemptsByUser,
      getAttemptsByTest,
    }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTests() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
}
