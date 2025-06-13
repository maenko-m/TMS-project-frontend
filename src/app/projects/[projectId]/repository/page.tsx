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
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RepositoryPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [testSuiteFormOpen, setTestSuiteFormOpen] = React.useState(false);
  const [testSuiteFormData, setTestSuiteFormData] = React.useState({
    title: '',
    description: '',
    preconditions: '',
  });

  const handleTestSuiteFormOpen = () => setTestSuiteFormOpen(true);
  const handleTestSuiteFormClose = () => setTestSuiteFormOpen(false);

  const handleTestSuiteFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTestSuiteFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestSuiteFormSubmit = () => {
    console.log('Данные формы:', testSuiteFormData);
    handleTestSuiteFormClose();
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log('Изменить');
    handleClose();
  };

  const handleDelete = () => {
    console.log('Удалить');
    handleClose();
  };

  const handleAddTestCase = () => {
    console.log('Добавить тест-кейс');
    handleClose();
  };

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
          <Typography variant="body1" color="white" onClick={() => router.push('test-create')}>
            Новый тест-кейс
          </Typography>
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: 'background.paper' }}
          onClick={handleTestSuiteFormOpen}
        >
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
            <Button sx={{ color: 'white' }} onClick={handleClick}>
              <MoreHorizOutlinedIcon />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleAddTestCase}>
                <ListItemIcon>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Добавить тест-кейс</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Изменить</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
              </MenuItem>
            </Menu>
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
        </Paper>
      </Box>
      <Modal open={testSuiteFormOpen} onClose={handleTestSuiteFormClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleTestSuiteFormClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            Новый тестовый набор
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              name="title"
              label="Название"
              fullWidth
              value={testSuiteFormData.title}
              onChange={handleTestSuiteFormChange}
            />
            <TextField
              name="description"
              label="Описание"
              multiline
              rows={3}
              fullWidth
              value={testSuiteFormData.description}
              onChange={handleTestSuiteFormChange}
            />
            <TextField
              name="preconditions"
              label="Предусловия"
              fullWidth
              value={testSuiteFormData.preconditions}
              onChange={handleTestSuiteFormChange}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleTestSuiteFormSubmit}
                sx={{ color: 'white' }}
              >
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
