import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export const BookingLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              border: '4px solid #13FFAA',
              borderRadius: '50%',
              position: 'absolute',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
          />
          <motion.div
            style={{
              width: '80%',
              height: '80%',
              border: '4px solid #1E67C6',
              borderRadius: '50%',
              position: 'absolute',
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 2.5,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </Box>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            mt: 3,
            textAlign: 'center',
          }}
        >
          Confirming your booking...
        </Typography>
      </motion.div>
    </Box>
  );
}; 