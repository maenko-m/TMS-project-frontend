'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/utils/validators';
import { LoginInput } from '../types';
import { useState } from 'react';

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
    } catch {
      setError('Неверная почта или пароль');
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
      <Typography variant="h2" textAlign="center">
        Войти в систему
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
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
