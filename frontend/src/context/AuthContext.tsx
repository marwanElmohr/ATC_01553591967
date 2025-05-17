import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and token change
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token validity and get user data
        const response = await authApi.getCurrentUser();
        if (response.data) {
          setUser({
            email: response.data.email,
            role: response.data.role || 'user'
          });
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      console.log('Making login API call...');
      const response = await authApi.login({ email, password });
      console.log('Login response:', response.data);

      if (!response.data) {
        throw new Error('No response data received from server');
      }

      const { token, user: userData } = response.data as AuthResponse;

      if (!token) {
        throw new Error('No token received from server');
      }

      if (!userData || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage');

      setUser(userData);
      console.log('User state updated:', userData);

    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  const register = async ({ name, email, password }: RegisterCredentials) => {
    try {
      console.log('Making registration API call...');
      const response = await authApi.register({ name, email, password });
      console.log('Registration response:', response);

      // Check if we have a response
      if (!response || !response.data) {
        throw new Error('No response data received from server');
      }

      // Handle both possible response formats
      const data = response.data;
      let token, userData;

      if (typeof data === 'string') {
        // If the response is just a success message, we need to log in
        await login({ email, password });
        return;
      } else {
        // If we have the expected response format
        token = data.token;
        userData = data.user;

        if (!token) {
          throw new Error('No token received from server');
        }

        if (!userData || !userData.email) {
          throw new Error('Invalid user data received from server');
        }

        localStorage.setItem('token', token);
        console.log('Token stored in localStorage');

        setUser(userData);
        console.log('User state updated:', userData);
      }

    } catch (error: any) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  console.log('Auth context state:', {
    isAuthenticated: !!user,
    hasUser: !!user,
    loading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 