'use client';

import React, { useEffect, useState, useMemo, use } from 'react';
import {
  Box,
  Button,
  Typography,
  Tab,
  Tabs,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import AppSnackbar from '@/components/atoms/AppSnackbar';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

interface User {
  id: string;
  fullName: string;
  email: string;
}

const PROJECT_QUERY = gql`
  query ProjectById($id: UUID!) {
    projectById(id: $id) {
      id
      name
      description
      accessType
      ownerId
      projectUserIds
    }
  }
`;

const USERS_QUERY = gql`
  query Users {
    users {
      nodes {
        id
        fullName
        email
      }
    }
  }
`;

const USER_BY_ID_QUERY = gql`
  query UserById($id: UUID!) {
    userById(id: $id) {
      id
      fullName
      email
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: UUID!, $input: ProjectUpdateInput!) {
    updateProject(id: $id, input: $input)
  }
`;

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: UUID!) {
    deleteProject(id: $id)
  }
`;

export default function SettingsProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  const [tabValue, setTabValue] = useState(0);
  const [accessValue, setAccessValue] = useState<'public' | 'private'>('public');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [initialState, setInitialState] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const { data: meData, loading: meLoading, error: meError } = useQuery(ME_QUERY);
  const { data: projectData } = useQuery(PROJECT_QUERY, { variables: { id: projectId } });
  const { data: usersData } = useQuery(USERS_QUERY);
  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION);
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION);

  useEffect(() => {
    if (projectData?.projectById && usersData?.users.nodes) {
      const proj = projectData.projectById;
      const allUsers = usersData.users.nodes;
      const matchedUsers = proj.projectUserIds
        .filter((id: string) => id !== proj.ownerId)
        .map((id: string) => allUsers.find((u: User) => u.id === id))
        .filter(Boolean);

      setProjectName(proj.name);
      setProjectDescription(proj.description);
      setAccessValue(proj.accessType.toLowerCase());
      setSelectedUsers(matchedUsers);

      setInitialState({
        name: proj.name,
        description: proj.description,
        accessType: proj.accessType.toLowerCase(),
        userIds: matchedUsers.map((u: User) => u.id).sort(),
      });
    }
  }, [projectData, usersData]);

  const isChanged = useMemo(() => {
    if (!initialState) return false;
    return (
      projectName !== initialState.name ||
      projectDescription !== initialState.description ||
      accessValue !== initialState.accessType ||
      selectedUsers
        .map((u) => u.id)
        .sort()
        .join() !== initialState.userIds.join()
    );
  }, [projectName, projectDescription, accessValue, selectedUsers, initialState]);

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  if (meLoading) return <Typography>Загрузка данных пользователя...</Typography>;
  if (meError) return <Typography color="error">Ошибка загрузки пользователя</Typography>;
  if (!meData?.me) return <Typography color="error">Пользователь не найден</Typography>;

  const currentUserId = meData.me.id;

  const handleUpdate = async () => {
    try {
      const input: any = {
        name: projectName,
        description: projectDescription,
        accessType: accessValue.toUpperCase(),
        ownerId: meData?.me.id,
      };
      if (input.accessType === 'PRIVATE') {
        input.projectUserIds = selectedUsers.map((u) => u.id);
      }
      await updateProject({ variables: { id: projectId, input } });
      showSnackbar('Проект обновлен', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Ошибка при обновлении проекта', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject({ variables: { id: projectId } });
      router.push('/projects');
    } catch (err) {
      console.error(err);
      showSnackbar('Ошибка при удалении проекта', 'error');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h1">Настройки проекта</Typography>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setConfirmOpen(true)}
        >
          Удалить проект
        </Button>
      </Box>
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
        <Tab label="Основные" />
        <Tab label="Контроль доступа" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 3 }}>
          <TextField
            label="Имя проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="small"
          />
          <TextField
            multiline
            label="Описание проекта"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={5}
            size="small"
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}>
          <RadioGroup
            row
            value={accessValue}
            onChange={(e) => setAccessValue(e.target.value as 'public' | 'private')}
          >
            <FormControlLabel value="public" control={<Radio />} label="Публичный" />
            <FormControlLabel value="private" control={<Radio />} label="Приватный" />
          </RadioGroup>

          {accessValue === 'private' && (
            <Autocomplete
              multiple
              options={(usersData?.users.nodes || []).filter((u: any) => u.id !== currentUserId)}
              getOptionLabel={(option) => `${option.fullName} (${option.email})`}
              value={selectedUsers}
              onChange={(_, newValue) => setSelectedUsers(newValue)}
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={`user-option-${option.id}`}>
                  <Box>
                    <Typography>{option.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...rest } = getTagProps({ index });
                  return (
                    <Chip
                      key={`user-tag-${option.id}`}
                      label={`${option.fullName} (${option.email})`}
                      {...rest}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Пользователи"
                  placeholder="Начните вводить имя или email..."
                />
              )}
              sx={{ width: 500, mt: 2 }}
            />
          )}
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          sx={{ color: 'white', width: '200px', mt: 4 }}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!isChanged}
          onClick={handleUpdate}
        >
          Обновить настройки
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить проект?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить проект? Это действие необратимо.</Typography>
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
