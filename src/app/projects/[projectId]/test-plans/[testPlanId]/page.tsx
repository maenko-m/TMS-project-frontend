'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';

const TEST_PLAN_BY_ID = gql`
  query testPlanById($id: UUID!) {
    testPlanById(id: $id) {
      id
      projectId
      name
      description
      createdAt
      updatedAt
      testCases {
        id
        title
        priority
        severity
      }
      createdById
    }
  }
`;

const DELETE_TEST_PLAN = gql`
  mutation deleteTestPlan($id: UUID!) {
    deleteTestPlan(id: $id)
  }
`;

export default function TestPlanDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const testPlanId = params?.testPlanId as string;
  const projectId = params?.projectId as string;

  const { data, loading, error } = useQuery(TEST_PLAN_BY_ID, {
    variables: { id: testPlanId },
  });

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [deleteTestPlan] = useMutation(DELETE_TEST_PLAN);

  const handleDelete = async () => {
    try {
      await deleteTestPlan({ variables: { id: testPlanId } });
      router.push(`/projects/${projectId}/test-plans`);
    } catch (err) {
      console.error('Ошибка при удалении тест-плана:', err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error.message}</Typography>;

  const plan = data?.testPlanById;

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
    <Box sx={{ p: 3 , overflow: 'auto' }}>
      <Typography variant="h1">Тест план: {plan.name}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Описание: {plan.description}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Дата создания: {new Date(plan.createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant="h6">Тест-кейсы:</Typography>
      <List sx={{ mt: 2 }}>
        {plan.testCases.map((tc: any) => (
          <ListItem key={tc.id} disablePadding>
            <ListItemButton
              onClick={() => router.push(`/projects/${plan.projectId}/repository/${tc.id}`)}
            >
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
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => setConfirmOpen(true)}>
          Удалить
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить тест-план?</DialogTitle>
        <DialogContent>
          <Typography>Вы точно хотите удалить тест-план? Это действие нельзя отменить.</Typography>
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
