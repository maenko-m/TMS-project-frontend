'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
  ListItemButton,
  Tooltip,
} from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';

const TEST_RUN_BY_ID = gql`
  query testRunById($id: UUID!) {
    testRunById(id: $id) {
      id
      name
      description
      milestoneId
      status
      createdAt
      testRunTestCases {
        testCase {
          id
          title
          priority
          severity
        }
        status
      }
      defects {
        id
        title
        actualResult
      }
    }
  }
`;

const MILESTONE_BY_ID = gql`
  query milestoneById($id: UUID!) {
    milestoneById(id: $id) {
      id
      name
    }
  }
`;

const DELETE_TEST_RUN = gql`
  mutation deleteTestRun($id: UUID!) {
    deleteTestRun(id: $id)
  }
`;

function getStatusIcon(status: string) {
  switch (status) {
    case 'PASSED':
      return <CheckCircleIcon color="success" />;
    case 'FAILED':
      return <CancelIcon color="error" />;
    case 'SKIPPED':
      return <PauseCircleFilledIcon color="warning" />;
    default:
      return <BugReportIcon />;
  }
}

export default function TestRunDetailsPage() {
  const router = useRouter();
  const { testRunId } = useParams();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, loading, error } = useQuery(TEST_RUN_BY_ID, {
    variables: { id: testRunId },
  });

  const milestoneId = data?.testRunById?.milestoneId;

  const { data: milestoneData, loading: milestoneLoading } = useQuery(MILESTONE_BY_ID, {
    variables: { id: milestoneId },
    skip: !milestoneId,
  });

  const [deleteTestRun, { loading: deleting }] = useMutation(DELETE_TEST_RUN, {
    variables: { id: testRunId },
    onCompleted() {
      router.push('test-runs');
    },
    onError(err) {
      console.error('Ошибка при удалении тест-рана:', err);
    },
  });

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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка загрузки данных: {error.message}</Typography>;

  const testRun = data.testRunById;

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h1" mb={2}>
        Тест-ран: {testRun.name}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" mb={1} mt={1}>
        Описание: {testRun.description || '-'}
      </Typography>
      <Typography variant="body2" mb={1}>
        Статус: {testRun.status === 'ACTIVE' ? 'В процессе' : 'Завершен'}
      </Typography>
      <Typography variant="body2" mb={1}>
        Создан: {new Date(testRun.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="body2" mb={3}>
        Веха:{' '}
        {milestoneLoading ? 'Загрузка...' : milestoneData?.milestoneById?.name || 'Не выбрана'}
      </Typography>

      <Typography variant="h6" mb={1}>
        Тест-кейсы
      </Typography>
      {testRun.testRunTestCases.length === 0 ? (
        <Typography color="textSecondary">Нет тест-кейсов</Typography>
      ) : (
        <List>
          {testRun.testRunTestCases.map(({ testCase, status }: any) => (
            <ListItem key={testCase.id} disablePadding>
              <ListItemButton onClick={() => router.push(`/test-cases/${testCase.id}`)}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 0.5 }}>
                  {getPriorityIcon(testCase.priority)}
                </ListItemIcon>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 0.5 }}>
                  {getSeverityIcon(testCase.severity)}
                </ListItemIcon>
                <ListItemText primary={testCase.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <Typography variant="h6" mt={3} mb={1}>
        Дефекты
      </Typography>
      {testRun.defects.length === 0 ? (
        <Typography color="textSecondary">Нет дефектов</Typography>
      ) : (
        <List>
          {testRun.defects.map(({ id, title, actualResult }: any) => (
            <ListItem key={id}>
              <ListItemText primary={title} secondary={`Актуальный результат: ${actualResult}`} />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmOpen(true)}
          disabled={deleting}
        >
          Удалить тест-ран
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить тест-ран?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы точно хотите удалить этот тест-ран? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              deleteTestRun();
              setConfirmOpen(false);
            }}
            disabled={deleting}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
