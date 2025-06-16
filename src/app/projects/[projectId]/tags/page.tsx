'use client';

import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, gql } from '@apollo/client';
import AppSnackbar from '@/components/atoms/AppSnackbar';

const TAGS_QUERY = gql`
  query Tags($filter: TagFilterInput) {
    tags(filter: $filter) {
      nodes {
        id
        name
        createdAt
      }
    }
  }
`;

const CREATE_TAG = gql`
  mutation CreateTag($input: TagCreateInput!) {
    createTag(input: $input)
  }
`;

const UPDATE_TAG = gql`
  mutation UpdateTag($id: UUID!, $input: TagUpdateInput!) {
    updateTag(id: $id, input: $input)
  }
`;

const DELETE_TAG = gql`
  mutation DeleteTag($id: UUID!) {
    deleteTag(id: $id)
  }
`;

export default function TagsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = React.use(params);

  const [search, setSearch] = React.useState('');
  const { data, refetch } = useQuery(TAGS_QUERY, {
    variables: { filter: { name: search } },
    fetchPolicy: 'network-only',
  });

  const [createTag] = useMutation(CREATE_TAG);
  const [updateTag] = useMutation(UPDATE_TAG);
  const [deleteTag] = useMutation(DELETE_TAG);

  const [tagFormOpen, setTagFormOpen] = React.useState(false);
  const [tagFormData, setTagFormData] = React.useState<{ id?: string; name: string }>({ name: '' });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuIndex, setMenuIndex] = React.useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [tagToDelete, setTagToDelete] = React.useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    refetch({ filter: { name: e.target.value } });
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(e.currentTarget);
    setMenuIndex(index);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleTagFormOpen = () => setTagFormOpen(true);
  const handleTagFormClose = () => {
    setTagFormOpen(false);
    setTagFormData({ name: '' });
  };

  const handleEdit = (tag: { id: string; name: string }) => {
    setTagFormData({ id: tag.id, name: tag.name });
    setTagFormOpen(true);
  };

  const handleTagFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleTagFormSubmit = async () => {
    try {
      if (tagFormData.id) {
        await updateTag({ variables: { id: tagFormData.id, input: { name: tagFormData.name } } });
      } else {
        await createTag({ variables: { input: { name: tagFormData.name } } });
      }
      refetch();
      handleTagFormClose();
      showSnackbar('Успешно сохранено', 'success');
    } catch (error) {
      showSnackbar('Ошибка при сохранении', 'error');
      console.error('Ошибка при сохранении:', error);
    }
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;
    try {
      await deleteTag({ variables: { id: tagToDelete } });
      refetch();
    } catch (e) {
      showSnackbar('Ошибка при удалении', 'error');
      console.error('Ошибка при удалении:', e);
    } finally {
      setConfirmOpen(false);
      setTagToDelete(null);
      showSnackbar('Успешно удалено', 'success');
    }
  };

  const tags = data?.tags?.nodes || [];

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Typography variant="h1">Тэги</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={handleTagFormOpen}>
          <Typography variant="body1" color="white">
            Новый тэг
          </Typography>
        </Button>
        <TextField size="small" label="Поиск" value={search} onChange={handleSearchChange} />
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag: { id: string; name: string; createdAt: string }, index: number) => (
                <TableRow key={tag.id} hover>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{new Date(tag.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, index)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuIndex === index} onClose={handleCloseMenu}>
                      <MenuItem onClick={() => handleEdit(tag)}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Изменить
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setTagToDelete(tag.id);
                          setConfirmOpen(true);
                          handleCloseMenu();
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Удалить
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={tagFormOpen} onClose={handleTagFormClose}>
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
            onClick={handleTagFormClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            {tagFormData.id ? 'Редактировать тэг' : 'Новый тэг'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              name="name"
              label="Название"
              fullWidth
              value={tagFormData.name}
              onChange={handleTagFormChange}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="contained" onClick={handleTagFormSubmit}>
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить тэг?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить тэг? Это действие необратимо.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
          <Button color="error" onClick={handleDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
