'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const TEST_SUITES_BY_PROJECT_ID = gql`
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

const CREATE_TEST_CASE = gql`
  mutation createTestCase($input: TestCaseCreateInput!) {
    createTestCase(input: $input)
  }
`;

const CREATE_TEST_STEP = gql`
  mutation createTestStep($input: TestStepCreateInput!) {
    createTestStep(input: $input)
  }
`;

const ME_QUERY = gql`
  query me {
    me {
      id
    }
  }
`;

interface Step {
  description: string;
  expected: string;
}

export default function CreateTestCase() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [suiteId, setSuiteId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preconditions, setPreconditions] = useState('');
  const [postconditions, setPostconditions] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [priority, setPriority] = useState('LOW');
  const [severity, setSeverity] = useState('MINOR');
  const [steps, setSteps] = useState<Step[]>([]);
  const [suiteOptions, setSuiteOptions] = useState<{ id: string; name: string }[]>([]);

  const { data: suitesData } = useQuery(TEST_SUITES_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const { data: meData } = useQuery(ME_QUERY);
  const createdById = meData?.me?.id;

  const [createTestCase] = useMutation(CREATE_TEST_CASE);
  const [createTestStep] = useMutation(CREATE_TEST_STEP);

  useEffect(() => {
    if (suitesData?.testSuitesByProjectId?.nodes) {
      setSuiteOptions(suitesData.testSuitesByProjectId.nodes);
    }
  }, [suitesData]);

  const handleAddStep = () => setSteps([...steps, { description: '', expected: '' }]);

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const { data } = await createTestCase({
        variables: {
          input: {
            projectId,
            suiteId: suiteId,
            title,
            description,
            preconditions,
            postconditions,
            status,
            priority,
            severity,
            createdById,
          },
        },
      });

      const testCaseId = data.createTestCase;

      await Promise.all(
        steps.map((step, index) =>
          createTestStep({
            variables: {
              input: {
                testCaseId,
                description: step.description,
                expectedResult: step.expected,
                position: index + 1,
              },
            },
          }),
        ),
      );

      console.log('Test case and steps created successfully');
      router.push('repository');
    } catch (err) {
      console.error('Error creating test case:', err);
    }
  };

  const fieldSx = { flex: '1 1 200px', backgroundColor: 'background.paper' };

  return (
    <Box
      component="form"
      sx={{
        height: 'calc(100vh - 6 * 8px)',
        overflowY: 'auto',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h1">Создать тест-кейс</Typography>

      <TextField
        label="Название"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ backgroundColor: 'background.paper' }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={fieldSx}>
          <InputLabel>Suite</InputLabel>
          <Select
            value={suiteId}
            label="Тестовый набор"
            onChange={(e) => setSuiteId(e.target.value)}
          >
            {suiteOptions.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Статус" onChange={(e) => setStatus(e.target.value)}>
            {['DRAFT', 'ACTIVE', 'ARCHIVED'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} label="Приоритет" onChange={(e) => setPriority(e.target.value)}>
            {['LOW', 'MEDIUM', 'HIGH'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={severity}
            label="Серьезность"
            onChange={(e) => setSeverity(e.target.value)}
          >
            {['MINOR', 'MAJOR', 'CRITICAL'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        label="Описание"
        multiline
        rows={3}
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ backgroundColor: 'background.paper' }}
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Предусловия"
          value={preconditions}
          onChange={(e) => setPreconditions(e.target.value)}
          sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
        />
        <TextField
          label="Постусловия"
          value={postconditions}
          onChange={(e) => setPostconditions(e.target.value)}
          sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
        />
      </Box>

      <Box>
        <Typography variant="h6" mb={1}>
          Шаги
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAddStep}>
          Добавить шаг
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Описание шага"
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
              <TextField
                placeholder="Ожидаемый результат"
                value={step.expected}
                onChange={(e) => handleStepChange(index, 'expected', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Box>
    </Box>
  );
}
