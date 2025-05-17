import axios from 'axios';
import { AuthResponse, User } from '../types';

const API_URL = 'http://localhost:5000/api';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration request failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
}; 