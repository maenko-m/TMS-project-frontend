'use client';

import React, { use } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h1">Вложения</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white">
            Добавить файл
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
                <TableCell>Название файла</TableCell>
                <TableCell>MIME</TableCell>
                <TableCell>Размер</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell sx={{ width: '30px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody color="background.paper">
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <MoreVertIcon sx={{ color: 'white' }} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                      <EditIcon />
                      Изменить
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <MoreVertIcon sx={{ color: 'white' }} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                      <EditIcon />
                      Изменить
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>testewts</TableCell>
                <TableCell>
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <MoreVertIcon sx={{ color: 'white' }} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                      <EditIcon />
                      Изменить
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </TableCell>
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
