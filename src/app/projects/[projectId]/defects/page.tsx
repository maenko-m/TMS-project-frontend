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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  OutlinedInput,
  Modal,
  Stack,
} from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorIcon from '@mui/icons-material/Error';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useRouter } from 'next/navigation';

type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'NORMAL' | 'TRIVIAL';

const SEVERITY_OPTIONS: { value: Severity; label: string; icon: React.ReactNode; color: string }[] =
  [
    { value: 'CRITICAL', label: 'Критичный', icon: <ErrorIcon />, color: '#D0021B' },
    { value: 'MAJOR', label: 'Серьёзный', icon: <ReportProblemIcon />, color: '#F5A623' },
    { value: 'MINOR', label: 'Минорный', icon: <InfoIcon />, color: '#4A90E2' },
    { value: 'NORMAL', label: 'Нормальный', icon: <CheckCircleOutlineIcon />, color: '#7ED321' },
    { value: 'TRIVIAL', label: 'Тривиальный', icon: <ArrowDownwardIcon />, color: '#9B9B9B' },
  ];

const DEFECTS_QUERY = gql`
  query defectsByProjectId($projectId: UUID!, $filter: DefectFilterInput) {
    defectsByProjectId(projectId: $projectId, filter: $filter) {
      nodes {
        id
        title
        actualResult
        severity
        createdAt
        createdById
      }
    }
  }
`;

const DELETE_DEFECT = gql`
  mutation deleteDefect($id: UUID!) {
    deleteDefect(id: $id)
  }
`;

const CREATE_DEFECT = gql`
  mutation createDefect($input: DefectCreateInput!) {
    createDefect(input: $input)
  }
`;

const UPDATE_DEFECT = gql`
  mutation updateDefect($id: UUID!, $input: DefectUpdateInput!) {
    updateDefect(id: $id, input: $input)
  }
`;

const USER_BY_ID = gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      id
      fullName
    }
  }
`;

const ME_QUERY = gql`
  query me {
    me {
      id
      fullName
    }
  }
`;

interface Defect {
  id: string;
  title: string;
  severity: Severity;
  createdAt: string;
  createdById: string;
  actualResult: string;
}

function UserName({ userId }: { userId: string }) {
  const { data } = useQuery(USER_BY_ID, { variables: { id: userId } });
  return <>{data?.userById.fullName || '—'}</>;
}

export default function DefectsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const { projectId } = React.use(params);

  const [search, setSearch] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<Severity | ''>('');
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { data, refetch } = useQuery(DEFECTS_QUERY, {
    variables: {
      projectId,
      filter: { title: search || undefined, severity: severityFilter || undefined },
    },
    fetchPolicy: 'network-only',
  });

  const [deleteDefect] = useMutation(DELETE_DEFECT);

  const defects: Defect[] = data?.defectsByProjectId.nodes || [];

  const openMenu = (e: React.MouseEvent, id: string) => {
    setMenuAnchor(e.currentTarget as HTMLElement); // 👈 тут каст
    setActiveId(id);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setActiveId(null);
  };

  const confirmDelete = (id: string) => {
    setActiveId(id);
    setConfirmOpen(true);
    setMenuAnchor(null);
  };

  const handleDelete = async () => {
    console.log(activeId);
    if (!activeId) return;
    await deleteDefect({ variables: { id: activeId } });
    setConfirmOpen(false);
    setActiveId(null);
    refetch();
  };

  const [createDefect] = useMutation(CREATE_DEFECT);
  const [updateDefect] = useMutation(UPDATE_DEFECT);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: '',
    title: '',
    actualResult: '',
    severity: 'NORMAL' as Severity,
  });

  const { data: meData } = useQuery(ME_QUERY);
  const createdById = meData?.me?.id;

  const handleSubmit = async () => {
    if (!formData.title || !formData.actualResult) return;

    if (editMode && formData.id) {
      await updateDefect({
        variables: {
          id: formData.id,
          input: {
            title: formData.title,
            actualResult: formData.actualResult,
            severity: formData.severity,
          },
        },
      });
    } else {
      await createDefect({
        variables: {
          input: {
            title: formData.title,
            actualResult: formData.actualResult,
            severity: formData.severity,
            createdById,
            projectId,
          },
        },
      });
    }

    setModalOpen(false);
    setFormData({ id: '', title: '', actualResult: '', severity: 'NORMAL' });
    setEditMode(false);
    refetch();
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">Дефекты</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => {
            setEditMode(false);
            setFormData({ id: '', title: '', actualResult: '', severity: 'NORMAL' });
            setModalOpen(true);
          }}
        >
          <Typography variant="body1" color="white">
            Новый дефект
          </Typography>
        </Button>
        <TextField
          label="Поиск"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => refetch()}
        />
        <Select
          size="small"
          displayEmpty
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value as Severity);
            refetch();
          }}
          input={<OutlinedInput />}
        >
          <MenuItem value="">
            <em>Все уровни</em>
          </MenuItem>
          {SEVERITY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Результат</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Серьёзность</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {defects.map((defect) => {
                const sev = SEVERITY_OPTIONS.find((o) => o.value === defect.severity)!;
                return (
                  <TableRow key={defect.id} hover>
                    <TableCell>{defect.title}</TableCell>
                    <TableCell>{defect.actualResult}</TableCell>
                    <TableCell>
                      <UserName userId={defect.createdById} />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', gap: 0.5, alignItems: 'center', color: sev.color }}
                      >
                        {sev.icon}
                        <Typography variant="body2">{sev.label}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(defect.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => openMenu(e, defect.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            const defect = defects.find((d) => d.id === activeId);
            if (defect) {
              setEditMode(true);
              setFormData({
                id: defect.id,
                title: defect.title,
                actualResult: defect.actualResult,
                severity: defect.severity,
              });
              setModalOpen(true);
            }
            closeMenu();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Изменить
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeId) confirmDelete(activeId);
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
            {editMode ? 'Редактировать дефект' : 'Новый дефект'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              label="Название"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              required
              label="Актуальный результат"
              fullWidth
              multiline
              rows={3}
              value={formData.actualResult}
              onChange={(e) => setFormData((prev) => ({ ...prev, actualResult: e.target.value }))}
            />
            <Select
              fullWidth
              value={formData.severity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, severity: e.target.value as Severity }))
              }
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSubmit}>
                Сохранить
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить дефект?</DialogTitle>
        <DialogContent>
          <Typography>Вы точно хотите удалить дефект? Это действие нельзя отменить.</Typography>
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
