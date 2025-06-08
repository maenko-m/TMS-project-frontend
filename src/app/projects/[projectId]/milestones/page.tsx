'use client';

import React, { use } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export default function TestCasesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">Вехи</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white">
            Новая веха
          </Typography>
        </Button>
        <TextField size="small" label="Поиск" />
      </Box>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead color="background.default">
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Кол-во кейсов</TableCell>
                <TableCell>Срок</TableCell>
              </TableRow>
            </TableHead>
            <TableBody color="background.paper">
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={3}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
