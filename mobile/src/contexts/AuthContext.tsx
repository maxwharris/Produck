import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import API_BASE_URL from the api service
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.165:3000' // Replace with your computer's actual IP
  : 'https://your-production-api.com'; // For production

interface User {
  id: string;
  name: string;
  email: string;
}

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
      const existingUsers = await fetch(`${API_BASE_URL}/api/users?search=${encodeURIComponent(email.split('@')[0])}`)
        .then(res => res.json())
        .catch(() => []);

      let userId = '68c652806029388b2ec02548'; // Default user ID
      let userName = 'Demo User';

      if (existingUsers.length > 0) {
        // Use existing user data
        userId = existingUsers[0]._id;
        userName = existingUsers[0].name;
      }

      // Fetch complete user data from database
      const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      let userData: User;

      if (userResponse.ok) {
        const dbUser = await userResponse.json();
        userData = {
          id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
        };
      } else {
        // Fallback with search result or default
        userData = {
          id: userId,
          name: userName,
          email: email,
        };
      }

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
      // For now, simulate registration and fetch user data from database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use the same default user ID for registration
      const userId = '68c652806029388b2ec02548';

      // Fetch complete user data from database
      const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      let userData: User;

      if (userResponse.ok) {
        const dbUser = await userResponse.json();
        userData = {
          id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
        };
      } else {
        // Fallback with provided registration data
        userData = {
          id: userId,
          name: name,
          email: email,
        };
      }

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
