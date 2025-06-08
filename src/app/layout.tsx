import React from 'react';
import { CssBaseline } from '@mui/material';
import './globals.css';
import type { Metadata } from 'next';
import ClientProvider from '@/components/utils/ClientProvider';

export const metadata: Metadata = {
  title: 'TMS - Test Management System',
  description: 'Manage your testing process efficiently',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
      </head>
      <body>
        <ClientProvider>
          <CssBaseline />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
