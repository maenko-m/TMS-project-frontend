/* RepositoryPage.tsx */
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { gql } from '@apollo/client';
import AppSnackbar from '@/components/atoms/AppSnackbar';

const TEST_SUITES_QUERY = gql`
  query testSuitesByProjectId($projectId: UUID!) {
    testSuitesByProjectId(projectId: $projectId) {
      nodes {
        id
        name
        description
        preconditions
        testCasesCount
      }
    }
  }
`;

const TEST_CASES_QUERY = gql`
  query testCasesByProjectId($projectId: UUID!, $filter: TestCaseFilterInput) {
    testCasesByProjectId(projectId: $projectId, filter: $filter) {
      nodes {
        id
        title
        priority
        severity
      }
    }
  }
`;

const CREATE_TEST_SUITE = gql`
  mutation createTestSuite($input: TestSuiteCreateInput!) {
    createTestSuite(input: $input)
  }
`;

const UPDATE_TEST_SUITE = gql`
  mutation updateTestSuite($id: UUID!, $input: TestSuiteUpdateInput!) {
    updateTestSuite(id: $id, input: $input)
  }
`;

const DELETE_TEST_SUITE = gql`
  mutation deleteTestSuite($id: UUID!) {
    deleteTestSuite(id: $id)
  }
`;

export default function RepositoryPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = React.use(params);
  const router = useRouter();

  const [selectedSuiteId, setSelectedSuiteId] = React.useState<string | null>(null);
  const [currentSuite, setCurrentSuite] = React.useState<any>(null);
  const [testSuiteFormOpen, setTestSuiteFormOpen] = React.useState(false);
  const [testSuiteFormData, setTestSuiteFormData] = React.useState<any>({
    title: '',
    description: '',
    preconditions: '',
  });
  const [editingSuite, setEditingSuite] = React.useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { data: suiteData, refetch: refetchSuites } = useQuery(TEST_SUITES_QUERY, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });
  const [fetchTestCases, { data: caseData, refetch }] = useLazyQuery(TEST_CASES_QUERY);
  const [createTestSuite] = useMutation(CREATE_TEST_SUITE);
  const [updateTestSuite] = useMutation(UPDATE_TEST_SUITE);
  const [deleteTestSuite] = useMutation(DELETE_TEST_SUITE);

  const handleSelectSuite = (suite: any) => {
    setSelectedSuiteId(suite.id);
    setCurrentSuite(suite);
    fetchTestCases({
      variables: { projectId, filter: { suiteId: suite.id } },
      fetchPolicy: 'network-only',
    });
    refetch();
  };

  const handleTestSuiteFormOpen = (suite: any = null) => {
    setEditingSuite(suite);
    if (suite) {
      setTestSuiteFormData({
        title: suite.name,
        description: suite.description,
        preconditions: suite.preconditions,
      });
    } else {
      setTestSuiteFormData({ title: '', description: '', preconditions: '' });
    }
    setTestSuiteFormOpen(true);
  };

  const handleTestSuiteFormClose = () => {
    setTestSuiteFormOpen(false);
    setEditingSuite(null);
  };

  const handleTestSuiteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestSuiteFormData({ ...testSuiteFormData, [e.target.name]: e.target.value });
  };

  const handleTestSuiteFormSubmit = async () => {
    const input = {
      projectId,
      name: testSuiteFormData.title,
      description: testSuiteFormData.description,
      preconditions: testSuiteFormData.preconditions,
    };

    if (editingSuite) {
      await updateTestSuite({ variables: { id: editingSuite.id, input } });
    } else {
      await createTestSuite({ variables: { input } });
    }
    showSnackbar('Успешно сохранено', 'success');
    refetchSuites();
    handleTestSuiteFormClose();
  };

  const handleDelete = async () => {
    if (currentSuite) {
      await deleteTestSuite({ variables: { id: currentSuite.id } });
      setSelectedSuiteId(null);
      setCurrentSuite(null);
      refetchSuites();
      showSnackbar('Успешно удалено', 'success');
      setConfirmOpen(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    const map = {
      LOW: (
        <Tooltip title="Приоритет: низкий">
          <KeyboardArrowDownIcon color="info" />
        </Tooltip>
      ),
      MEDIUM: (
        <Tooltip title="Приоритет: средний">
          <RemoveIcon color="warning" />
        </Tooltip>
      ),
      HIGH: (
        <Tooltip title="Приоритет: высокий">
          <KeyboardArrowUpIcon color="error" />
        </Tooltip>
      ),
    };
    return map[priority as keyof typeof map];
  };

  const getSeverityIcon = (severity: string) => {
    const map = {
      MINOR: (
        <Tooltip title="Серьёзность: незначительная">
          <InfoIcon color="info" />
        </Tooltip>
      ),
      MAJOR: (
        <Tooltip title="Серьёзность: серьёзная">
          <WarningIcon color="warning" />
        </Tooltip>
      ),
      CRITICAL: (
        <Tooltip title="Серьёзность: критическая">
          <ErrorIcon color="error" />
        </Tooltip>
      ),
    };
    return map[severity as keyof typeof map];
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
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 6 * 8px)',
        p: 3,
        gap: 3,
        flexDirection: 'column',
      }}
    >
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">Репозиторий</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={() => router.push('test-create')}>
          <Typography variant="body1" color="white">
            Новый тест-кейс
          </Typography>
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: 'background.paper' }}
          onClick={() => handleTestSuiteFormOpen()}
        >
          <Typography variant="body1" color="white">
            Новый набор
          </Typography>
        </Button>
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
            {suiteData?.testSuitesByProjectId.nodes.map((suite: any) => (
              <ListItem key={suite.id} disablePadding>
                <ListItemButton
                  selected={suite.id === selectedSuiteId}
                  onClick={() => handleSelectSuite(suite)}
                >
                  <ListItemIcon>
                    <FolderOpenOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={suite.name}
                    secondary={`Тест-кейсов: ${suite.testCasesCount}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
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
          {currentSuite && (
            <>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="h6">{currentSuite.name}</Typography>
                <IconButton onClick={() => handleTestSuiteFormOpen(currentSuite)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setConfirmOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                Описание: {currentSuite.description}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                Предусловия: {currentSuite.preconditions}
              </Typography>
              <List sx={{ mt: 2 }}>
                {caseData?.testCasesByProjectId.nodes.map((tc: any) => (
                  <ListItem key={tc.id} disablePadding>
                    <ListItemButton onClick={() => router.push(`repository/${tc.id}`)}>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 0.5 }}>
                        {getPriorityIcon(tc.priority)}
                      </ListItemIcon>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 0.5 }}>
                        {getSeverityIcon(tc.severity)}
                      </ListItemIcon>
                      <ListItemText primary={tc.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
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
            {editingSuite ? 'Редактировать' : 'Новый'} тестовый набор
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить тестовый набор?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы точно хотите удалить этот тестовый набор? Это действие нельзя отменить.
          </Typography>
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
