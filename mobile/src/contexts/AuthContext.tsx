import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Implement actual login API call
      // For now, simulate login and fetch user data from database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find existing user by searching users API
      const existingUsers = await apiService.searchUsers(email.split('@')[0]).catch(() => []);

      if (existingUsers.length === 0) {
        // No users found - create a mock user for demo purposes
        const userData: User = {
          id: `user_${Date.now()}`, // Generate unique ID
          name: email.split('@')[0], // Use email prefix as name
          email: email,
        };

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      // Use existing user data
      const userId = existingUsers[0].id;

      // Use the user data from search results since it already has the correct format
      const userData: User = {
        id: existingUsers[0].id,
        name: existingUsers[0].name,
        email: existingUsers[0].email,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Implement actual registration API call
      // For now, simulate registration and create user data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUsers = await apiService.searchUsers(email.split('@')[0]).catch(() => []);

      if (existingUsers.length > 0) {
        // User already exists, use their data
        const userData: User = {
          id: existingUsers[0].id,
          name: existingUsers[0].name,
          email: existingUsers[0].email,
        };

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      // Create new user data for registration
      const userData: User = {
        id: `user_${Date.now()}`, // Generate unique ID
        name: name,
        email: email,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
