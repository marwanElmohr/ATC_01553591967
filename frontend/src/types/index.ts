export interface User {
  email: string;
  role: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  category: string;
  venue: string;
  price: number;
  image?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status: number;
} 