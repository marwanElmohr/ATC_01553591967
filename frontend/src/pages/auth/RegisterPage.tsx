import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { RegisterCredentials } from '../../types';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to '/events'
  const from = (location.state as any)?.from?.pathname || '/events';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setEmailError(validateEmail(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <ErrorAlert message={error} />
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!emailError}
            helperText={emailError}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isLoading || !!emailError}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}; 