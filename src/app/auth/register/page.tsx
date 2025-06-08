'use client';

import React from 'react';
import { Box } from '@mui/material';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
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
      <RegisterForm />
    </Box>
  );
}
