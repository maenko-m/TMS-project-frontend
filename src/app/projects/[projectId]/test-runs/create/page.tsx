'use client';

import React, { use, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';

const MILESTONES_QUERY = gql`
  query milestonesByProjectId($projectId: UUID!) {
    milestonesByProjectId(projectId: $projectId) {
      nodes {
        id
        name
      }
    }
  }
`;

const DEFECTS_QUERY = gql`
  query defectsByProjectId($projectId: UUID!) {
    defectsByProjectId(projectId: $projectId) {
      nodes {
        id
        title
      }
    }
  }
`;

const TEST_CASES_QUERY = gql`
  query testCasesByProjectId($projectId: UUID!) {
    testCasesByProjectId(projectId: $projectId) {
      nodes {
        id
        title
      }
    }
  }
`;

const CREATE_TEST_RUN = gql`
  mutation createTestRun($input: TestRunCreateInput!) {
    createTestRun(input: $input)
  }
`;

const CREATE_TEST_RUN_CASE = gql`
  mutation createTestRunTestCase($input: TestRunTestCaseCreateInput!) {
    createTestRunTestCase(input: $input)
  }
`;

export default function CreateTestRunPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [milestoneId, setMilestoneId] = useState('');
  const [selectedDefects, setSelectedDefects] = useState([]);
  const [testRunCases, setTestRunCases] = useState<any[]>([]);

  const { data: milestonesData } = useQuery(MILESTONES_QUERY, { variables: { projectId } });
  const { data: defectsData } = useQuery(DEFECTS_QUERY, { variables: { projectId } });
  const { data: testCasesData } = useQuery(TEST_CASES_QUERY, { variables: { projectId } });

  const [createTestRun] = useMutation(CREATE_TEST_RUN);
  const [createTestRunTestCase] = useMutation(CREATE_TEST_RUN_CASE);

  const handleAddTestRunCase = () => {
    setTestRunCases([...testRunCases, { testCaseId: '', status: 'PASSED' }]);
  };

  const handleUpdateCase = (index: number, field: string, value: any) => {
    const updated = [...testRunCases];
    updated[index][field] = value;
    setTestRunCases(updated);
  };

  const handleCreate = async () => {
    try {
      const result = await createTestRun({
        variables: {
          input: {
            projectId,
            name,
            description,
            environment: '123',
            milestoneId: milestoneId || null,
            status: 'ACTIVE',
            defectIds: selectedDefects.map((d: any) => d.id),
          },
        },
      });

      const testRunId = result.data.createTestRun;

      await Promise.all(
        testRunCases.map((tc) =>
          createTestRunTestCase({
            variables: {
              input: {
                testRunId,
                testCaseId: tc.testCaseId,
                status: tc.status,
                executionTime: 1,
              },
            },
          }),
        ),
      );

      router.back();
    } catch (err) {
      console.error('Ошибка при создании тест-рана:', err);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
      <Typography variant="h1">Создание тест-рана</Typography>

      <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField
        label="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
      />

      <FormControl fullWidth>
        <InputLabel>Веха</InputLabel>
        <Select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)} label="Веха">
          {milestonesData?.milestonesByProjectId?.nodes.map((m: any) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        multiple
        options={defectsData?.defectsByProjectId?.nodes || []}
        getOptionLabel={(option: any) => option.title}
        onChange={(e, value: any) => setSelectedDefects(value)}
        renderInput={(params) => <TextField {...params} label="Дефекты" />}
      />

      <Typography variant="h6">Тест-кейсы</Typography>
      {testRunCases.map((tc, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Тест-кейс</InputLabel>
            <Select
              value={tc.testCaseId}
              onChange={(e) => handleUpdateCase(index, 'testCaseId', e.target.value)}
              label="Тест-кейс"
            >
              {testCasesData?.testCasesByProjectId?.nodes.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={tc.status}
              onChange={(e) => handleUpdateCase(index, 'status', e.target.value)}
              label="Статус"
            >
              <MenuItem value="PASSED">Пройден</MenuItem>
              <MenuItem value="FAILED">Провален</MenuItem>
              <MenuItem value="SKIPPED">Пропущен</MenuItem>
            </Select>
          </FormControl>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddTestRunCase}>
        Добавить тест-кейс
      </Button>

      <Button variant="contained" onClick={handleCreate} disabled={!name}>
        Создать тест-ран
      </Button>
    </Box>
  );
}
