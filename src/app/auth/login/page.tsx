'use client';

import React from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('tms_token');
    if (token) {
      router.push('/projects');
    }
  }, [router]);

  if (!isMounted) return null;

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
