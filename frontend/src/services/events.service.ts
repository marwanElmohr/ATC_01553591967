import axios from 'axios';
import { Event } from '../types';
import { authService } from './auth.service';
import { API_URL } from '../utils/config';

// Add token to requests
axios.interceptors.request.use(
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

export const eventsService = {
  async getAllEvents(): Promise<Event[]> {
    const response = await axios.get(`${API_URL}/events`);
    return transformEvents(response.data);
  },

  async getEventById(id: string): Promise<Event> {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return transformEvent(response.data);
  },

  async createEvent(eventData: any): Promise<Event> {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData);
      return transformEvent(response.data);
    } catch (error: any) {
      console.error('Create event error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async updateEvent(id: string, eventData: any): Promise<Event> {
    const response = await axios.put(`${API_URL}/events/${id}`, eventData);
    return transformEvent(response.data);
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }
      await axios.delete(`${API_URL}/events/${id}`);
    } catch (error: any) {
      console.error('Delete event error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        eventId: id
      });
      throw error;
    }
  },

  async bookEvent(eventId: string): Promise<void> {
    await axios.post(`${API_URL}/events/${eventId}/book`);
  },

  async getMyBookings(): Promise<Event[]> {
    const response = await axios.get(`${API_URL}/bookings/my`);
    return transformEvents(response.data);
  },
}; 