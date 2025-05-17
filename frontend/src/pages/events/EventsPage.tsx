import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  Alert,
  Tooltip
} from '@mui/material';
import { eventApi } from '../../services/api';
import { Event } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventApi.getEvents();
      return response.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  if (error) {
    return <ErrorAlert message="Error loading events. Please try again later." />;
  }

  const handleViewDetails = (eventId: string) => {
    if (!eventId) {
      console.error('No event ID provided');
      return;
    }

    if (!isAuthenticated) {
      // Save current location before redirecting to login
      navigate('/login', { 
        state: { 
          from: { 
            pathname: `/events/${eventId}`,
            // Preserve any existing search params or state
            search: location.search,
            hash: location.hash
          } 
        } 
      });
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Events
      </Typography>
      <Grid container spacing={3}>
        {events?.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="1000"
                image={event.image}
                alt={event.name}
                sx={{ objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.src = '/placeholder-event.jpg'; // Fallback image
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {event.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Tooltip 
                  title={event.description}
                  placement="top"
                  arrow
                  enterDelay={500}
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      maxWidth: '400px',
                      fontSize: '14px',
                      padding: '8px 12px',
                      whiteSpace: 'pre-wrap'
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {event.description}
                  </Typography>
                </Tooltip>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${event.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.venue}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewDetails(event._id)}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 