import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import { eventApi, bookingApi } from '../../services/api';
import { Event } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const { data: event, isLoading, isError } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      const response = await eventApi.getEvent(id);
      return response.data;
    },
    retry: false,
    enabled: !!id
  });

  const bookMutation = useMutation({
    mutationFn: (data: { eventId: string; quantity: number }) =>
      bookingApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (event) {
        navigate('/booking-success', {
          state: {
            eventName: event.name,
            price: event.price * quantity,
            date: event.date,
            venue: event.venue
          },
          replace: true
        });
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.msg || 'Failed to book event');
    },
  });

  const handleBook = () => {
    if (!id) return;
    setError('');
    bookMutation.mutate({ eventId: id, quantity });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (isError || !event) {
    return <ErrorAlert message="Error loading event details. Please try again later." />;
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="480"
              image={event.image}
              alt={event.name}
              sx={{ objectFit: 'cover' }}
              onError={(e: any) => {
                e.target.src = '/placeholder-event.jpg';
                e.target.onerror = null;
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${event.price}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Venue:</strong> {event.venue}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Category:</strong> {event.category}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            <Box sx={{ mt: 12 }}>
              <ErrorAlert message={error} />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleBook}
                  disabled={bookMutation.isPending}
                >
                  {bookMutation.isPending ? 'Booking...' : 'Book Now'}
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Price: ${(event.price * quantity).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 