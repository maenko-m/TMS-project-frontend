'use client';

import React, { use, useState } from 'react';
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
import StatusBar from '@/components/molecules/StatusBar';
import StatusChip from '@/components/atoms/StatusChip';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const TEST_RUNS_BY_PROJECT_ID = gql`
  query testRunsByProjectId($projectId: UUID!, $filter: TestRunFilterInput) {
    testRunsByProjectId(projectId: $projectId, filter: $filter) {
      nodes {
        id
        name
        status
        createdAt
        testRunTestCases {
          status
        }
      }
    }
  }
`;

type Status = 'PASSED' | 'FAILED' | 'SKIPPED';

export default function TestRunsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const { data, loading, refetch } = useQuery(TEST_RUNS_BY_PROJECT_ID, {
    variables: {
      projectId,
      filter: search ? { name: search } : undefined,
      fetchPolicy: 'network-only',
    },
  });

  React.useEffect(() => {
    refetch();
  });

  const countStatuses = (cases: any[]) => {
    const summary: Record<Status, number> = {
      PASSED: 0,
      FAILED: 0,
      SKIPPED: 0,
    };
    cases.forEach((tc) => {
      const status = tc.status as Status;
      if (status in summary) summary[status]++;
    });
    return summary;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">Тест-раны</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white" onClick={() => router.push('test-runs/create')}>
            Новый тест-ран
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
                  <TableCell>Статус</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Статистика</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.testRunsByProjectId?.nodes.map((run: any) => {
                  const { PASSED, FAILED, SKIPPED } = countStatuses(run.testRunTestCases);
                  return (
                    <TableRow key={run.id} hover onClick={() => router.push(`test-runs/${run.id}`)}>
                      <TableCell>{run.name}</TableCell>
                      <TableCell>
                        <StatusChip status={run.status === 'ACTIVE' ? 'в процессе' : 'пройден'} />
                      </TableCell>
                      <TableCell>{new Date(run.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBar success={PASSED} errors={FAILED} skipped={SKIPPED} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
