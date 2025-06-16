'use client';

import React from 'react';
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
  TextFieldProps,
} from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';
import AppSnackbar from '@/components/atoms/AppSnackbar';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface MeData {
  me: {
    id: string;
  };
}

interface UsersData {
  users: {
    nodes: User[];
  };
}

interface ProjectCreateInput {
  name: string;
  description: string;
  accessType: 'PUBLIC' | 'PRIVATE';
  ownerId: string;
  projectUserIds: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const ME_QUERY = gql`
  query Me {
    me {
      id
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

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: ProjectCreateInput!) {
    createProject(input: $input)
  }
`;

export default function CreateProjectPage() {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const { data: meData, loading: meLoading, error: meError } = useQuery<MeData>(ME_QUERY);
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<UsersData>(USERS_QUERY);

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT_MUTATION);

  const [tabValue, setTabValue] = React.useState(0);
  const [accessValue, setAccessValue] = React.useState<'public' | 'private'>('public');

  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessValue((event.target as HTMLInputElement).value as 'public' | 'private');
    if ((event.target as HTMLInputElement).value === 'public') {
      setSelectedUsers([]);
    }
  };

  if (meLoading) return <Typography>Загрузка данных пользователя...</Typography>;
  if (meError) return <Typography color="error">Ошибка загрузки пользователя</Typography>;
  if (!meData?.me) return <Typography color="error">Пользователь не найден</Typography>;

  const currentUserId = meData.me.id;

  const handleCreateProject = async () => {
    try {
      const input: any = {
        name: projectName,
        description: projectDescription,
        accessType: accessValue.toUpperCase(), // PUBLIC или PRIVATE
        ownerId: currentUserId,
      };

      if (input.accessType === 'PRIVATE') {
        input.projectUserIds = selectedUsers.map((u) => u.id);
      }

      await createProject({
        variables: { input },
      });

      showSnackbar('Проект успешно создан', 'success');
      setProjectName('');
      setProjectDescription('');
      setSelectedUsers([]);
    } catch (e) {
      showSnackbar('Ошибка при создании проекта', 'error');
      console.error(e);
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
      <Typography variant="h1">Создать проект</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Основные" />
          <Tab label="Контроль доступа" />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <TextField
          required
          label="Имя проекта"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ width: '250px' }}
          size="small"
        />
        <TextField
          multiline
          label="Описание проекта"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          sx={{ width: '800px' }}
          rows={5}
          size="small"
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <Typography variant="body1">Тип доступности проекта</Typography>
        <RadioGroup row value={accessValue} onChange={handleAccessChange}>
          <FormControlLabel value="public" control={<Radio />} label="Публичный" />
          <FormControlLabel value="private" control={<Radio />} label="Приватный" />
        </RadioGroup>

        {accessValue === 'private' && (
          <>
            {usersLoading && <Typography>Загрузка пользователей...</Typography>}
            {usersError && <Typography color="error">Ошибка загрузки пользователей</Typography>}
            {!usersLoading && !usersError && (
              <Autocomplete
                multiple
                options={(usersData?.users.nodes || []).filter((u) => u.id !== currentUserId)}
                getOptionLabel={(option) => option.fullName}
                value={selectedUsers}
                onChange={(event, newValue) => setSelectedUsers(newValue)}
                filterSelectedOptions
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography>{option.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderTags={(tagValue: User[], getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={`${option.fullName} (${option.email})`}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params: TextFieldProps) => (
                  <TextField {...params} label="Добавить пользователей" placeholder="Поиск..." />
                )}
                sx={{ width: 400, mt: 2 }}
              />
            )}
          </>
        )}
      </CustomTabPanel>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleCreateProject}
          disabled={!projectName || creating}
        >
          Создать проект
        </Button>
      </Box>
    </Box>
  );
}
