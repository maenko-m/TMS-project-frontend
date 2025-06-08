'use client';

import React, { use } from 'react';
import {
  Box,
  Button,
  Typography,
  Tab,
  Tabs,
  Avatar,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import { Project } from '@/features/projects/types';

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

export default function TestCasesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const [accessValue, setAccessValue] = React.useState('public');

  const handleAccesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessValue((event.target as HTMLInputElement).value);
  };

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  type User = {
    id: number;
    email: string;
    fullName: string;
    role: string;
    avatarUrl: string;
  };

  const rows: User[] = [
    {
      id: 1,
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      role: 'Admin',
      avatarUrl: '/avatars/alice.png',
    },
    {
      id: 2,
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      role: 'Admin',
      avatarUrl: '/avatars/alice.png',
    },
    {
      id: 3,
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      role: 'Admin',
      avatarUrl: '/avatars/alice.png',
    },
    {
      id: 4,
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      role: 'Admin',
      avatarUrl: '/avatars/alice.png',
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const project: Project = {
    createdAt: 'string',
    defectsCount: 1,
    description:
      'stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring',
    iconBase64: 'string',
    accessType: 'public',
    id: projectId,
    name: 'string',
    ownerFullName: 'string',
    ownerId: 'string',
    projectUsersCount: 0,
    testCasesCount: 1,
    updatedAt: 'string',
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h1">Настройки проекта</Typography>
        <Button color="error" variant="contained" startIcon={<DeleteOutlineIcon />}>
          Удалить проект
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Основные" />
            <Tab label="Контроль доступа" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <Avatar
              variant="rounded"
              src={project.iconBase64}
              sx={{ width: '64px', height: '64px' }}
            >
              {(project.name[0] + project.name[1]).toUpperCase()}
            </Avatar>
            <Button
              sx={{ bgcolor: 'background.paper', color: 'white' }}
              variant="contained"
              startIcon={<FileUploadIcon />}
            >
              Сменить лого
            </Button>
          </Box>
          <TextField
            required
            label="Имя проекта"
            defaultValue={project.name}
            sx={{ width: '250px' }}
            size="small"
          />
          <TextField
            multiline
            label="Описание проекта"
            defaultValue={project.description}
            sx={{ width: '800px' }}
            rows={5}
            size="small"
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">Владелец проекта</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar
                sx={{ width: '24px', height: '24px' }}
                variant="rounded"
                src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
              >
                MI
              </Avatar>
              <Typography variant="body2">Михаил Вялков</Typography>
              <Button
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  color: 'white',
                  width: '200px',
                  padding: '6px 0',
                }}
                variant="contained"
              >
                Изменить владельца
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body1">Тип доступности проекта</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: 'column' }}>
              <RadioGroup value={accessValue} onChange={handleAccesChange}>
                <FormControlLabel value="public" control={<Radio />} label="Публичный" />
                <FormControlLabel value="private" control={<Radio />} label="Приватный" />
              </RadioGroup>
              <Button
                size="small"
                sx={{
                  color: 'white',
                  width: '200px',
                  padding: '6px 0',
                  display: accessValue === 'public' ? 'none' : 'block',
                }}
                variant="contained"
              >
                Добавить пользователя
              </Button>
            </Box>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
                display: accessValue === 'public' ? 'none' : 'block',
              }}
            >
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead color="background.default">
                    <TableRow>
                      <TableCell sx={{ width: 60 }} /> {/* Иконка */}
                      <TableCell>Email</TableCell>
                      <TableCell>ФИО</TableCell>
                      <TableCell>Роль</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody color="background.paper">
                    {paginatedRows.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Avatar
                            sx={{ width: '36px', height: '36px' }}
                            variant="rounded"
                            src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
                          >
                            MI
                          </Avatar>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </CustomTabPanel>
      </Box>
      <Button
        sx={{ color: 'white', width: '200px', mt: 4 }}
        variant="contained"
        startIcon={<SaveIcon />}
      >
        Обновить настройки
      </Button>
    </Box>
  );
}
