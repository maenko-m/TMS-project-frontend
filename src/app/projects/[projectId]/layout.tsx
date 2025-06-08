'use client';

import React, { use } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/components/molecules/Sidebar'), { ssr: false });

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar projectId={projectId} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
