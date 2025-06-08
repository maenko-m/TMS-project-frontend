'use client';

import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import React from 'react';

export default function ProfilePage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <Typography variant="h1">Настройки профиля</Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Avatar
            variant="rounded"
            src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
            sx={{ width: '128px', height: '128px' }}
          >
            MI
          </Avatar>
          <Button
            sx={{ bgcolor: 'background.paper', color: 'white' }}
            variant="contained"
            startIcon={<FileUploadIcon />}
          >
            Загрузить
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <TextField
            size="small"
            required
            label="Ваше имя"
            defaultValue="Михаил"
            sx={{ width: '320px' }}
          />
          <TextField
            size="small"
            required
            label="Ваша фамилия"
            defaultValue="Маенко"
            sx={{ width: '320px' }}
          />
          <TextField
            size="small"
            required
            type="email"
            label="Почта"
            defaultValue="maenko@11212.co"
            sx={{ width: '320px' }}
          />
          <Button
            sx={{ color: 'white', width: '320px' }}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Обновить настройки
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
