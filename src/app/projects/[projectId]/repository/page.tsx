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
  Tooltip,
} from '@mui/material';
import { use } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import AddIcon from '@mui/icons-material/Add';
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

  const [selectedSuiteId, setSelectedSuiteId] = React.useState<string | null>(null);
  const [currentSuite, setCurrentSuite] = React.useState<any>(null);

  const { data: suiteData } = useQuery(TEST_SUITES_QUERY, { variables: { projectId } });
  const { data: caseData } = useQuery(TEST_CASES_QUERY, {
    variables: { projectId, filter: { suiteId: selectedSuiteId } },
    skip: !selectedSuiteId,
  });

  const handleSelectSuite = (suite: any) => {
    setSelectedSuiteId(suite.id);
    setCurrentSuite(suite);
    console.log(caseData);
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
        <Typography variant="h1">Репозиторий</Typography>
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
            {suiteData &&
              suiteData.testSuitesByProjectId.nodes.map((suite: any) => (
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
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                {currentSuite.description}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                {currentSuite.preconditions}
              </Typography>
              <List>
                {caseData &&
                  caseData.testCasesByProjectId.nodes.map((tc: any) => (
                    <ListItem key={tc.id} disablePadding>
                      <ListItemButton onClick={() => router.push(`test/${tc.id}`)}>
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
