'use client';

import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, gql } from '@apollo/client';
import AppSnackbar from '@/components/atoms/AppSnackbar';

const ME_QUERY = gql`
  query me {
    me {
      id
      fullName
      email
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: UUID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input)
  }
`;

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [isMounted, setIsMounted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [initialValues, setInitialValues] = React.useState(formValues);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const { data, loading } = useQuery(ME_QUERY, {
    onCompleted: ({ me }) => {
      const [firstName, lastName] = me.fullName.split(' ');
      const values = {
        firstName,
        lastName: lastName || '',
        email: me.email,
        password: '',
      };
      setFormValues(values);
      setInitialValues(values);
    },
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, [router]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [field]: e.target.value });
  };

  const isChanged =
    formValues.firstName !== initialValues.firstName ||
    formValues.lastName !== initialValues.lastName ||
    formValues.email !== initialValues.email ||
    formValues.password !== '';

  const handleSave = async () => {
    try {
      const input: Partial<typeof formValues> = { ...formValues };
      if (!input.password) delete input.password;
      const id = data.me.id;
      await updateUser({ variables: { id, input } });
      setInitialValues({ ...formValues, password: '' });
      setFormValues((prev) => ({ ...prev, password: '' }));
      showSnackbar('Успешно сохранено', 'success');
    } catch (err) {
      showSnackbar('Ошибка', 'error');
      console.error('Failed to update user:', err);
    }
  };

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  if (!isMounted || loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h1">Настройки профиля</Typography>
        <Button variant="contained" onClick={() => logout()}>
          Выйти
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <TextField
            size="small"
            required
            label="Ваше имя"
            value={formValues.firstName}
            onChange={handleChange('firstName')}
            sx={{ width: '320px' }}
          />
          <TextField
            size="small"
            required
            label="Ваша фамилия"
            value={formValues.lastName}
            onChange={handleChange('lastName')}
            sx={{ width: '320px' }}
          />
          <TextField
            size="small"
            required
            type="email"
            label="Почта"
            value={formValues.email}
            onChange={handleChange('email')}
            sx={{ width: '320px' }}
          />
          {showPassword ? (
            <TextField
              size="small"
              type="password"
              label="Новый пароль"
              value={formValues.password}
              onChange={handleChange('password')}
              sx={{ width: '320px' }}
            />
          ) : (
            <Button onClick={() => setShowPassword(true)} sx={{ width: '320px' }}>
              Изменить пароль
            </Button>
          )}

          <Button
            sx={{ color: 'white', width: '320px' }}
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!isChanged}
          >
            Обновить настройки
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
