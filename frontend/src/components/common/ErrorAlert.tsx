import React from 'react';
import { Alert, AlertProps } from '@mui/material';

interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, sx, ...props }) => {
  if (!message) return null;
  
  return (
    <Alert 
      severity="error" 
      sx={{ mb: 2, ...sx }}
      {...props}
    >
      {message}
    </Alert>
  );
}; 