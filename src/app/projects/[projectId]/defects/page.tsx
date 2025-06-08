import React from 'react';
import { Typography } from '@mui/material';

export default function TestCasesPage({ params }: { params: { projectId: string } }) {
  return <Typography variant="h2">Defects for Project {params.projectId}</Typography>;
}
