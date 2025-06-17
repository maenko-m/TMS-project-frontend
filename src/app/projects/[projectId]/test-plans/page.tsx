'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { use } from 'react';
import { useRouter } from 'next/navigation';

const TEST_PLANS_BY_PROJECT_ID = gql`
  query testPlansByProjectId($projectId: UUID!, $filter: TestPlanFilterInput) {
    testPlansByProjectId(projectId: $projectId, filter: $filter) {
      nodes {
        id
        name
        description
        createdAt
        testCases {
          id
        }
        createdById
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

export default function TestCasesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, loading, error } = useQuery(TEST_PLANS_BY_PROJECT_ID, {
    variables: {
      projectId,
      filter: search ? { name: search } : undefined,
    },
  });

  if (error) return <Typography color="error">Ошибка: {error.message}</Typography>;

  const testPlans = data?.testPlansByProjectId?.nodes || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">Тест планы</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography
            variant="body1"
            color="white"
            onClick={() => router.push('test-plans/create')}
          >
            Новый тест-план
          </Typography>
        </Button>
        <TextField
          size="small"
          label="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Автор</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Кол-во кейсов</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testPlans.map((plan: any) => (
                  <TestPlanRow key={plan.id} plan={plan} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

function TestPlanRow({ plan }: { plan: any }) {
  const router = useRouter();

  const { data } = useQuery(USER_BY_ID, {
    variables: { id: plan.createdById },
    skip: !plan.createdById,
  });

  return (
    <TableRow hover onClick={() => router.push(`test-plans/${plan.id}`)}>
      <TableCell>{plan.name}</TableCell>
      <TableCell>{data?.userById?.fullName || '—'}</TableCell>
      <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{plan.testCases.length}</TableCell>
    </TableRow>
  );
}
