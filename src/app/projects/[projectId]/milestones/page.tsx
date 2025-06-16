'use client';

import React from 'react';
import {
  Box,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { gql, useQuery, useMutation } from '@apollo/client';
import { use } from 'react';
import AppSnackbar from '@/components/atoms/AppSnackbar';

const MILESTONES_QUERY = gql`
  query milestonesByProjectId($projectId: UUID!, $filter: MilestoneFilterInput) {
    milestonesByProjectId(projectId: $projectId, filter: $filter) {
      nodes {
        id
        name
        description
        dueDate
        testRunsCount
      }
    }
  }
`;

const CREATE_MILESTONE = gql`
  mutation createMilestone($input: MilestoneCreateInput!) {
    createMilestone(input: $input)
  }
`;

const UPDATE_MILESTONE = gql`
  mutation updateMilestone($id: UUID!, $input: MilestoneUpdateInput!) {
    updateMilestone(id: $id, input: $input)
  }
`;

const DELETE_MILESTONE = gql`
  mutation deleteMilestone($id: UUID!) {
    deleteMilestone(id: $id)
  }
`;

type Milestone = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  testRunsCount: number;
};

type MilestoneFormData = {
  id?: string;
  name?: string;
  description?: string;
  dueDate?: Date | null;
};

export default function MilestonesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [search, setSearch] = React.useState('');

  const { data, refetch } = useQuery(MILESTONES_QUERY, {
    variables: { projectId, filter: { name: search } },
  });

  const [createMilestone] = useMutation(CREATE_MILESTONE);
  const [updateMilestone] = useMutation(UPDATE_MILESTONE);
  const [deleteMilestone] = useMutation(DELETE_MILESTONE);

  const [formData, setFormData] = React.useState<MilestoneFormData>({});
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedMilestone, setSelectedMilestone] = React.useState<Milestone | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, milestone: Milestone) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMilestone(milestone);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedMilestone(null);
  };

  const openEdit = (m: Milestone) => {
    setFormData({
      id: m.id,
      name: m.name,
      description: m.description,
      dueDate: new Date(m.dueDate),
    });
    setModalOpen(true);
    closeMenu();
  };

  const openNew = () => {
    setFormData({ dueDate: null });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.dueDate) return;
    const input = {
      projectId,
      name: formData.name,
      description: formData.description ?? '',
      dueDate: formData.dueDate.toISOString(),
    };
    try {
      if (formData.id) {
        await updateMilestone({ variables: { id: formData.id, input } });
      } else {
        await createMilestone({ variables: { input } });
      }
      setModalOpen(false);
      refetch();
      showSnackbar('Успешно сохранено', 'success');
    } catch (err) {
      showSnackbar('Ошибка при сохранении', 'error');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMilestone({ variables: { id: deleteId } });
      setConfirmOpen(false);
      setDeleteId(null);
      refetch();
      showSnackbar('Успешно удалено', 'success');
    } catch (err) {
      showSnackbar('Ошибка при удалении', 'error');
      console.error(err);
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

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Typography variant="h1">Вехи</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={openNew}>
          <Typography variant="body1" color="white">
            Новая веха
          </Typography>
        </Button>
        <TextField
          size="small"
          label="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => refetch()}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Кол-во тест-ранов</TableCell>
              <TableCell>Дата окончания</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.milestonesByProjectId.nodes.map((m: Milestone, index: number) => (
              <TableRow key={index} hover>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.description}</TableCell>
                <TableCell>{m.testRunsCount}</TableCell>
                <TableCell>{new Date(m.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => openMenu(e, m)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        <MenuItem onClick={() => selectedMilestone && openEdit(selectedMilestone)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Изменить
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedMilestone) {
              setDeleteId(selectedMilestone.id);
              setConfirmOpen(true);
              closeMenu();
            }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Удалить
        </MenuItem>
      </Menu>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            Новая веха
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              name="name"
              label="Название"
              fullWidth
              value={formData.name || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              name="description"
              label="Описание"
              multiline
              rows={3}
              fullWidth
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата окончания"
                value={formData.dueDate || null}
                onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSubmit}>
                Сохранить
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить веху?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить веху? Это действие необратимо.</Typography>
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
