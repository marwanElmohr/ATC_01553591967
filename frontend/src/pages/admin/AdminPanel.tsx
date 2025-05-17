import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Switch,
  Divider,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { eventsService } from '../../services/events.service';
import { usersService, User } from '../../services/users.service';
import { Event } from '../../types';

export const AdminPanel = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<Event> | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new state for user management
  const [userError, setUserError] = useState<string>('');

  const { data: events, isLoading, error: queryError } = useQuery({
    queryKey: ['events'],
    queryFn: eventsService.getAllEvents
  });

  const { data: users, isLoading: isLoadingUsers, error: userQueryError } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAllUsers
  });

  const createMutation = useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      handleCloseDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      eventsService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      handleCloseDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error('Event ID is required');
      await eventsService.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      setError(error.message || 'Failed to delete event. Please try again.');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'user' }) =>
      usersService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      setUserError(error.message || 'Failed to update user role. Please try again.');
    }
  });

  const handleOpenDialog = (event?: Event) => {
    setSelectedEvent(event || {});
    setImageBase64(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setImageBase64(null);
    setError('');
    setOpenDialog(false);
  };

  const handleDeleteClick = (event: Event) => {
    console.log('Delete clicked for event:', event);
    if (!event?._id) {
      console.error('Missing event ID:', event);
      setError('Cannot delete event: Missing event ID');
      return;
    }
    setEventToDelete(event);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Confirming delete for event:', eventToDelete);
    if (!eventToDelete?._id) {
      console.error('Missing event ID for deletion:', eventToDelete);
      setError('Cannot delete event: Missing event ID');
      return;
    }
    try {
      console.log('Attempting to delete event with ID:', eventToDelete._id);
      deleteMutation.mutate(eventToDelete._id);
    } catch (error: any) {
      console.error('Delete confirmation error:', error);
      setError(error.message || 'Failed to delete event. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
    setError('');
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB');
          return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setError('Please upload a valid image file (JPEG, PNG, or GIF)');
          return;
        }

        const base64 = await convertToBase64(file);
        setImageBase64(base64);
        setError('');
      } catch (error) {
        console.error('Error converting image:', error);
        setError('Error processing image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Validate required fields
      const requiredFields = ['name', 'description', 'date', 'category', 'venue', 'price'];
      const missingFields = requiredFields.filter(field => !formData.get(field));
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate price is a number
      const price = Number(formData.get('price'));
      if (isNaN(price)) {
        setError('Price must be a valid number');
        return;
      }

      // Prepare event data
      const eventData: any = {
        name: formData.get('name'),
        description: formData.get('description'),
        date: new Date(formData.get('date') as string).toISOString(),
        price: price,
        category: formData.get('category'),
        venue: formData.get('venue'),
    };

      // Handle image
      if (selectedEvent?._id) {
        // For update: only include the image if a new one is selected
        if (imageBase64) {
          eventData.image = imageBase64;
        }
      updateMutation.mutate({
          id: selectedEvent._id,
        data: eventData
      });
    } else {
        // For create: ensure image is included
        if (!imageBase64) {
          setError('Please select an image');
          return;
        }
        eventData.image = imageBase64;
        createMutation.mutate(eventData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('An error occurred while submitting the form. Please try again.');
    }
  };

  const handleRoleToggle = (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateRoleMutation.mutate({ userId: user._id, role: newRole });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (queryError) {
    return (
      <Container>
        <Alert severity="error">Error loading events. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Events Section */}
      <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Event Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add New Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
                <TableCell sx={{ width: '40%' }}>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((event) => (
                <TableRow key={event._id}>
                <TableCell>{event.name}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        py: 1
                      }}
                    >
                      {event.description}
                    </Typography>
                  </TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>${event.price}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(event)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                      onClick={() => handleDeleteClick(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Users Section */}
      <Box sx={{ mb: 6 }}>
        {userError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUserError('')}>
            {userError}
          </Alert>
        )}

        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          User Management
        </Typography>

        {isLoadingUsers ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : userQueryError ? (
          <Alert severity="error">Error loading users. Please try again later.</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Toggle Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name || '-'}</TableCell>
                    <TableCell align="center">
                      <Typography
                        color={user.role === 'admin' ? 'primary' : 'textSecondary'}
                        sx={{ fontWeight: user.role === 'admin' ? 'bold' : 'normal' }}
                      >
                        {user.role.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={user.role === 'admin'}
                        onChange={() => handleRoleToggle(user)}
                        color="primary"
                        disabled={updateRoleMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent?._id ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Event Name"
              name="name"
              defaultValue={selectedEvent?.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              defaultValue={selectedEvent?.description}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              defaultValue={selectedEvent?.category}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="date"
              label="Date"
              name="date"
              defaultValue={selectedEvent?.date?.split('T')[0]}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Venue"
              name="venue"
              defaultValue={selectedEvent?.venue}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Price"
              name="price"
              defaultValue={selectedEvent?.price}
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
              fullWidth
                >
                  {imageBase64 ? 'Change Image' : 'Upload Image'}
                </Button>
              </label>
              {(imageBase64 || selectedEvent?.image) && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imageBase64 || selectedEvent?.image}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.png';
                      target.onerror = null;
                    }}
            />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{eventToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 