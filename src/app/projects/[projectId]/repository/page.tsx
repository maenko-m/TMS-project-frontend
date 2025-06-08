'use client';

import React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { use } from 'react';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import AddIcon from '@mui/icons-material/Add';

export default function RepositoryPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 6 * 8px)',
        p: 3,
        gap: 3,
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">{projectId} репозиторий</Typography>
        <Typography variant="caption" color="text.secondary">
          3 набора | 10 тест-кейсов
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white">
            Новый тест-кейс
          </Typography>
        </Button>
        <Button variant="contained" size="small" sx={{ bgcolor: 'background.paper' }}>
          <Typography variant="body1" color="white">
            Новый набор
          </Typography>
        </Button>
        <TextField size="small" label="Поиск" />
      </Box>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Paper
          sx={{
            width: '30%',
            minWidth: 200,
            overflowY: 'auto',
            background: 'none',
            boxShadow: 'none',
            borderRadius: '0',
            borderRight: '1px solid #403F3F',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1 }}>
            <FolderCopyOutlinedIcon />
            <Typography variant="h6">Тестовые наборы</Typography>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected>
                <ListItemIcon>
                  <FolderOpenOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Проекты" secondary="Тест-кесов: 4" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FolderOpenOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Проекты" secondary="Тест-кесов: 4" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FolderOpenOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Проекты" secondary="Тест-кесов: 4" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>

        <Paper
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            background: 'none',
            boxShadow: 'none',
            p: 2,
            pt: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="h6">Проекты</Typography>
            <Button sx={{ color: 'white' }}>
              <MoreHorizOutlinedIcon />
            </Button>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <ArrowUpwardOutlinedIcon sx={{ color: '#D0021B' }} />
                </ListItemIcon>
                <ListItemIcon>
                  <BackHandOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Создать новый проект" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <ArrowUpwardOutlinedIcon sx={{ color: '#D0021B' }} />
                </ListItemIcon>
                <ListItemIcon>
                  <BackHandOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Создать новый проект" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <ArrowUpwardOutlinedIcon sx={{ color: '#D0021B' }} />
                </ListItemIcon>
                <ListItemIcon>
                  <BackHandOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Создать новый проект" />
              </ListItemButton>
            </ListItem>
          </List>
          <Button
            sx={{ bgcolor: 'background.paper', color: 'white' }}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Быстрый тест
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
