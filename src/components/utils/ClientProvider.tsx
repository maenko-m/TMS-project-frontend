'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import client from '@/lib/apollo-client';
import theme from '@/lib/theme';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ApolloProvider>
  );
}
