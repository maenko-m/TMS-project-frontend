'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/utils/validators';
import { LoginInput } from '../types';
import AppSnackbar from '@/components/atoms/AppSnackbar';

export function LoginForm() {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
    } catch {
      showSnackbar('Неверная почта или пароль', 'error');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Typography variant="h2" textAlign="center">
        Войти в систему
      </Typography>
      <TextField
        label="Почта"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        required
        fullWidth
      />
      <TextField
        label="Пароль"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" fullWidth sx={{ color: 'white' }}>
        Войти
      </Button>
      <Typography textAlign="center">
        Нет аккаунта?{' '}
        <Button href="/auth/register" color="secondary">
          Регистрация
        </Button>
      </Typography>
    </Box>
  );
}
