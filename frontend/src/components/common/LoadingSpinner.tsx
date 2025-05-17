import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  minHeight?: string | number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  minHeight = '60vh' 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight,
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}; 