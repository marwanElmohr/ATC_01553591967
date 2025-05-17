import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedTitle from './AnimatedTitle';
import AnimatedLogo from './AnimatedLogo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default' 
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <AnimatedTitle />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/events">
                  Events
                </Button>
                {user?.role === 'admin' && (
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Dashboard
                  </Button>
                )}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{ ml: 1 }}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          position: 'relative',
          py: 8,
          px: 4,
          mt: 'auto',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'flex-end',
          background: mode === 'light'
            ? 'linear-gradient(180deg, #f5f9f9 0%, #00857B 100%)'
            : 'linear-gradient(180deg, #1A2729 0%, #004a43 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle, ${mode === 'light' ? '#00857B' : '#242F31'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.15,
            pointerEvents: 'none'
          }
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            pb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <AnimatedLogo />
          <Typography 
            variant="body1"
            sx={{ 
              color: mode === 'light' ? '#000000' : '#FFFFFF',
              opacity: 0.8,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              fontWeight: 500
            }}
          >
            © {new Date().getFullYear()} Evently Booking Ltd.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}; 