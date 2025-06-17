'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useRouter } from 'next/navigation';

const TEST_CASE_BY_ID = gql`
  query testCaseById($id: UUID!) {
    testCaseById(id: $id) {
      id
      projectId
      suiteId
      title
      description
      preconditions
      postconditions
      status
      priority
      severity
      createdAt
      updatedAt
      createdById
      parameters
      customFields
      steps {
        id
        testCaseId
        description
        expectedResult
        position
        createdAt
        updatedAt
      }
    }
  }
`;

const USER_BY_ID = gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      fullName
    }
  }
`;

const DELETE_TEST_CASE = gql`
  mutation deleteTestCase($id: UUID!) {
    deleteTestCase(id: $id)
  }
`;

const getEnumDisplay = (type: string, value: string) => {
  const maps: Record<string, Record<string, { icon: React.ReactNode; label: string }>> = {
    priority: {
      LOW: {
        icon: (
          <Tooltip title="Приоритет: низкий">
            <KeyboardArrowDownIcon color="info" />
          </Tooltip>
        ),
        label: 'Низкий',
      },
      MEDIUM: {
        icon: (
          <Tooltip title="Приоритет: средний">
            <RemoveIcon color="warning" />
          </Tooltip>
        ),
        label: 'Средний',
      },
      HIGH: {
        icon: (
          <Tooltip title="Приоритет: высокий">
            <KeyboardArrowUpIcon color="error" />
          </Tooltip>
        ),
        label: 'Высокий',
      },
    },
    status: {
      DRAFT: {
        icon: (
          <Tooltip title="Черновик">
            <HourglassEmptyIcon color="disabled" />
          </Tooltip>
        ),
        label: 'Черновик',
      },
      ACTIVE: {
        icon: (
          <Tooltip title="Активен">
            <CheckCircleIcon color="success" />
          </Tooltip>
        ),
        label: 'Активен',
      },
      ARCHIVED: {
        icon: (
          <Tooltip title="В архиве">
            <ArchiveIcon color="action" />
          </Tooltip>
        ),
        label: 'В архиве',
      },
    },
    severity: {
      MINOR: {
        icon: (
          <Tooltip title="Незначительная">
            <ReportProblemIcon color="info" />
          </Tooltip>
        ),
        label: 'Незначительная',
      },
      MAJOR: {
        icon: (
          <Tooltip title="Серьезная">
            <WarningIcon color="warning" />
          </Tooltip>
        ),
        label: 'Серьезная',
      },
      CRITICAL: {
        icon: (
          <Tooltip title="Критическая">
            <ErrorIcon color="error" />
          </Tooltip>
        ),
        label: 'Критическая',
      },
    },
  };

  return maps[type]?.[value] ?? { icon: null, label: value };
};

export default function TestCaseViewPage() {
  const params = useParams();
  const testId = params.testId as string;

  const router = useRouter();

  const { data, loading, error } = useQuery(TEST_CASE_BY_ID, {
    variables: { id: testId },
  });

  const testCase = data?.testCaseById;

  const { data: userData } = useQuery(USER_BY_ID, {
    skip: !testCase?.createdById,
    variables: { id: testCase?.createdById },
  });

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [deleteTestCase] = useMutation(DELETE_TEST_CASE);

  const handleDelete = async () => {
    await deleteTestCase({ variables: { id: testCase.id } });
    setConfirmOpen(false);
    router.push('../repository');
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error.message}</Typography>;

  const priority = getEnumDisplay('priority', testCase.priority);
  const status = getEnumDisplay('status', testCase.status);
  const severity = getEnumDisplay('severity', testCase.severity);

  return (
    <Box sx={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 2 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Просмотр тест-кейса
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              <strong>Название:</strong> {testCase.title}
            </Typography>
            <Typography>
              <strong>Описание:</strong> {testCase.description}
            </Typography>
            <Typography>
              <strong>Предусловия:</strong> {testCase.preconditions}
            </Typography>
            <Typography>
              <strong>Постусловия:</strong> {testCase.postconditions}
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', flexDirection: 'column' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Статус:</strong> {status.icon} {status.label}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Приоритет:</strong> {priority.icon} {priority.label}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Серьезность:</strong> {severity.icon} {severity.label}
              </Typography>
            </Box>

            <Typography>
              <strong>Создано:</strong> {new Date(testCase.createdAt).toLocaleString()}
            </Typography>
            {userData?.userById?.fullName && (
              <Typography>
                <strong>Автор:</strong> {userData.userById.fullName}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Шаги</Typography>
            {testCase.steps?.length > 0 ? (
              testCase.steps.map((step: any, idx: number) => (
                <Box key={step.id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Typography>
                    <strong>Шаг {idx + 1}</strong>
                  </Typography>
                  <Typography>
                    <strong>Описание:</strong> {step.description}
                  </Typography>
                  <Typography>
                    <strong>Ожидаемый результат:</strong> {step.expectedResult}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>Нет шагов</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setConfirmOpen(true)}>
            Удалить
          </Button>
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить тест-кейс?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы точно хотите удалить этот тест-кейс? Это действие нельзя отменить.
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
