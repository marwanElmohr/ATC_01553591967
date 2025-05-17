import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

interface BookingSuccessState {
  eventName: string;
  price: number;
  date: string;
  venue: string;
}

const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingSuccessState;
  const color = useMotionValue(COLORS[0]);

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  if (!bookingDetails) {
    navigate('/events');
    return null;
  }

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative min-h-screen overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 64, mb: 2, color: '#13FFAA' }}
          />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(to bottom right, #FFFFFF, #CCCCCC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 500
            }}
          >
            Congratulations!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
            Your booking has been confirmed
          </Typography>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box sx={{ textAlign: 'left', mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" gutterBottom>
              Booking Details:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Event:</strong> {bookingDetails.eventName}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Venue:</strong> {bookingDetails.venue}
            </Typography>
            <Typography variant="body1" sx={{ color: '#13FFAA', fontWeight: 'bold' }}>
              Total Amount: ${bookingDetails.price}
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <motion.button
              style={{
                border,
                boxShadow,
              }}
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
              onClick={() => navigate('/events')}
              className="group relative flex items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
            >
              Browse More Events
              <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
            </motion.button>
          </Box>
        </Paper>
      </Container>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}; 