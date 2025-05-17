import axios from 'axios';
import { LoginCredentials, RegisterCredentials, Event } from '../types';

const API_BASE_URL = 'http://localhost:5000'; // Adjust this port if your backend runs on a different port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Transform MongoDB _id to id
const transformEvent = (event: any): Event => ({
  _id: event._id,
  name: event.name,
  description: event.description,
  date: event.date,
  price: event.price,
  category: event.category,
  venue: event.venue,
  image: event.image
});

const transformEvents = (events: any[]): Event[] => 
  events.map(transformEvent);

// Auth related API calls
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post('/api/auth/login', credentials),
  
  register: (credentials: RegisterCredentials) =>
    api.post('/api/auth/register', credentials),
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return {
      data: {
        email: response.data.email,
        role: response.data.role
      }
    };
  }
};

// Event related API calls
export const eventApi = {
  getEvents: async () => {
    const response = await api.get('/api/events');
    return { ...response, data: transformEvents(response.data) };
  },
  
  getEvent: async (id: string) => {
    const response = await api.get(`/api/events/${id}`);
    return { ...response, data: transformEvent(response.data) };
  },
  
  createEvent: async (eventData: any) => {
    const response = await api.post('/api/events', eventData);
    return { ...response, data: transformEvent(response.data) };
  },
  
  updateEvent: async (id: string, eventData: any) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return { ...response, data: transformEvent(response.data) };
  },
  
  deleteEvent: (id: string) => api.delete(`/api/events/${id}`),
};

// Booking related API calls
export const bookingApi = {
  getBookings: () => api.get('/api/bookings'),
  createBooking: (bookingData: { eventId: string; quantity: number }) => 
    api.post('/api/bookings', bookingData),
  cancelBooking: (id: string) => api.delete(`/api/bookings/${id}`),
};

export default api; 