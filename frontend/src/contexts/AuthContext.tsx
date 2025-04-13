
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate initialization check (would connect to backend in production)
  React.useEffect(() => {
    // Check if user is stored in localStorage (temporary solution)
    const storedUser = localStorage.getItem('whisper_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function (replace with actual implementation)
  const login = async (email: string, password: string) => {
    // This is a simplified mock. In a real app, you would:
    // 1. Make an API call to your authentication service
    // 2. Store tokens securely
    // 3. Handle errors appropriately
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const newUser = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
      };
      
      setUser(newUser);
      localStorage.setItem('whisper_user', JSON.stringify(newUser));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const newUser = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
      };
      
      setUser(newUser);
      localStorage.setItem('whisper_user', JSON.stringify(newUser));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear user data
      setUser(null);
      localStorage.removeItem('whisper_user');
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('whisper_user', JSON.stringify(updatedUser));
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
