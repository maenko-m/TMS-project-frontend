'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const CREATE_TEST_PLAN = gql`
  mutation createTestPlan($input: TestPlanCreateInput!) {
    createTestPlan(input: $input)
  }
`;

const TEST_CASES_BY_PROJECT_ID = gql`
  query testCasesByProjectId($projectId: UUID!) {
    testCasesByProjectId(projectId: $projectId) {
      nodes {
        id
        title
      }
    }
  }
`;

const ME = gql`
  query me {
    me {
      id
    }
  }
`;

export default function CreateTestPlanPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCases, setSelectedCases] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();

  const { data: testCasesData } = useQuery(TEST_CASES_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const { data: userData } = useQuery(ME);

  const [createTestPlan] = useMutation(CREATE_TEST_PLAN);

  const handleCreate = async () => {
    try {
      await createTestPlan({
        variables: {
          input: {
            projectId,
            name,
            description,
            testCaseIds: selectedCases.map((c) => c.id),
            createdById: userData?.me?.id,
          },
        },
      });
      router.push(`/projects/${projectId}/test-plans`);
    } catch (err) {
      console.error('Ошибка при создании тест-плана:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3, maxWidth: 600 }}>
      <Typography variant="h1">Новый тест-план</Typography>
      <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField
        label="Описание"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Autocomplete
        multiple
        options={testCasesData?.testCasesByProjectId?.nodes || []}
        getOptionLabel={(option: any) => option.title}
        onChange={(e, value) => setSelectedCases(value)}
        renderInput={(params) => <TextField {...params} label="Тест-кейсы" />}
      />
      <Button variant="contained" onClick={handleCreate} disabled={!name || !userData}>
        Создать
      </Button>
    </Box>
  );
}
