import axios from 'axios';
import { API_URL } from '../utils/config';

export interface Booking {
  _id: string;
  userId: string;
  eventId: {
    _id: string;
    name: string;
    date: string;
    venue: string;
    price: number;
  };
  createdAt: string;
}

export interface BookingResponse {
  msg: string;
  booking: Booking;
  summary: {
    eventName: string;
    pricePerTicket: number;
  };
}

export const bookingsService = {
  bookEvent: async (eventId: string): Promise<BookingResponse> => {
    const response = await axios.post(`${API_URL}/api/bookings`, { eventId });
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await axios.get(`${API_URL}/api/bookings/user`);
    return response.data;
  }
}; 