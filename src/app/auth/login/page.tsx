'use client';

import React from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3 },
      }}
    >
      <LoginForm />
    </Box>
  );
}
