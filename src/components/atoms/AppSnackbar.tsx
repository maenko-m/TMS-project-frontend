'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { forwardRef } from 'react';

interface AppSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  duration?: number;
}

const AppSnackbar = forwardRef(function AppSnackbar(
  { open, onClose, message, severity = 'info', duration = 3000 }: AppSnackbarProps,
  ref,
) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
});

export default AppSnackbar;
