import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', email: 'admin@topaz.com', name: 'Admin User', role: 'admin', createdAt: new Date() },
  { id: '2', email: 'student@topaz.com', name: 'Student User', role: 'student', createdAt: new Date() },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('topaz_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would call Supabase
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('topaz_user', JSON.stringify(foundUser));
      return true;
    }
    
    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('topaz_registered_users') || '[]');
    const registeredUser = registeredUsers.find((u: User) => u.email === email);
    if (registeredUser) {
      setUser(registeredUser);
      localStorage.setItem('topaz_user', JSON.stringify(registeredUser));
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<boolean> => {
    // Mock signup
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
    };
    
    const registeredUsers = JSON.parse(localStorage.getItem('topaz_registered_users') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('topaz_registered_users', JSON.stringify(registeredUsers));
    
    setUser(newUser);
    localStorage.setItem('topaz_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('topaz_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
