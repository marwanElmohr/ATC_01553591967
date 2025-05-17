import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EventsPage } from './pages/events/EventsPage';
import { EventDetailsPage } from './pages/events/EventDetailsPage';
import { AdminPanel } from './pages/admin/AdminPanel';
import { useTheme } from './context/ThemeContext';
import { BookingSuccess } from './pages/BookingSuccess';

// Create Query Client with caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
      retry: 1, // Only retry failed requests once
    },
  },
});

// Theme configuration
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#00857B' : '#81cdc6',
      light: mode === 'light' ? '#33a99f' : '#007F7F',
      dark: mode === 'light' ? '#006c63' : '#004040'
    },
    secondary: {
      main: mode === 'light' ? '#00635A' : '#05998C',
      light: mode === 'light' ? '#338b83' : '#B2FEF7',
      dark: mode === 'light' ? '#004a43' : '#4F9A94'
    },
    background: {
      default: mode === 'light' ? '#f5f9f9' : '#1A2729',
      paper: mode === 'light' ? '#ffffff' : '#242F31'
    },
    error: {
      main: mode === 'light' ? '#d32f2f' : '#FF6B6B'
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#FFFFFF',
      secondary: mode === 'light' ? '#333333' : '#C4E0E0'
    },
    divider: mode === 'light' 
      ? 'rgba(0, 0, 0, 0.12)' 
      : 'rgba(128, 203, 196, 0.15)'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f5f9f9' : '#1A2729',
          minHeight: '100vh',
          transition: 'background-color 0.5s ease-in-out, color 0.5s ease-in-out'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#242F31',
          transition: 'background-color 0.5s ease-in-out',
          '& .MuiButton-root': {
            color: mode === 'light' ? '#000000' : '#FFFFFF',
            '&:hover': {
              color: mode === 'light' ? '#FFFFFF' : '#c4e0e0'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'background-color 0.5s ease-in-out, color 0.5s ease-in-out'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.5s ease-in-out',
          '&:hover': {
            color: mode === 'light' ? '#00857B' : '#c4e0e0',
            backgroundColor: mode === 'light' ? 'rgba(0, 133, 123, 0.08)' : 'rgba(129, 205, 198, 0.08)'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.5s ease-in-out',
          color: mode === 'light' ? '#000000' : '#FFFFFF',
          '&:hover': {
            color: mode === 'light' ? '#00857B' : '#c4e0e0'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.5s ease-in-out'
        }
      }
    }
  }
});

const ThemedApp = () => {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EventsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/events/:id" 
                element={
                  <ProtectedRoute>
                    <EventDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/booking-success"
                element={
                  <ProtectedRoute>
                    <BookingSuccess />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 