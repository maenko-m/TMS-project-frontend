import React from 'react';
import { Typography } from '@mui/material';

export default function TestRunsPage({ params }: { params: { projectId: string } }) {
  return <Typography variant="h2">Test Runs for Project {params.projectId}</Typography>;
}
