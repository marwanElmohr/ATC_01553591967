import axios from 'axios';
import { API_URL } from '../utils/config';

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

export const usersService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/auth/allusers`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'admin' | 'user'): Promise<User> => {
    const response = await axios.put(`${API_URL}/auth/users/${userId}/role`, { role });
    return response.data;
  }
}; 