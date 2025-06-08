'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { REGISTER_MUTATION } from '../queries';
import { registerSchema } from '@/utils/validators';
import { RegisterInput } from '../types';
import { useState } from 'react';

export function RegisterForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const { data: result } = await registerMutation({ variables: { input: data } });
      if (result == null) throw new Error();
      await login(data.email, data.password); // Используем REST-логин после регистрации
      setError(null);
    } catch {
      setError('Registration failed. Email may already be in use.');
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
        Регистрация
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Имя"
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        required
        fullWidth
      />
      <TextField
        label="Фамилия"
        {...register('lastName')}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        required
        fullWidth
      />
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
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ color: 'white' }}>
        Зарегистрироваться
      </Button>
      <Typography textAlign="center">
        Уже есть аккаунт?{' '}
        <Button href="/auth/login" color="secondary">
          Войти
        </Button>
      </Typography>
    </Box>
  );
}
