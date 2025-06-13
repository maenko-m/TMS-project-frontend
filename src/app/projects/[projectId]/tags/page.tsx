'use client';

import React, { use } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Stack,
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
import CloseIcon from '@mui/icons-material/Close';

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

  const [tagFormOpen, setTagFormOpen] = React.useState(false);
  const [tagFormData, setTagFormData] = React.useState({
    title: '',
  });

  const handleTagFormOpen = () => setTagFormOpen(true);
  const handleTagFormClose = () => setTagFormOpen(false);

  const handleTagFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTagFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagFormSubmit = () => {
    console.log('Данные формы:', tagFormData);
    handleTagFormClose();
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
        <Typography variant="h1">Тэги</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white" onClick={handleTagFormOpen}>
            Новый тэг
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
                <TableCell>Автор</TableCell>
                <TableCell sx={{ width: '30px' }}>Кейсы</TableCell>
                <TableCell sx={{ width: '30px' }}>Раны</TableCell>
                <TableCell sx={{ width: '30px' }}>Дефекты</TableCell>
                <TableCell sx={{ width: '30px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody color="background.paper">
              <TableRow hover>
                <TableCell>testewts</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Avatar
                      sx={{ width: '24px', height: '24px' }}
                      variant="rounded"
                      src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
                    >
                      MI
                    </Avatar>
                    <Typography variant="body2">Михаил Вялков</Typography>
                  </Box>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Avatar
                      sx={{ width: '24px', height: '24px' }}
                      variant="rounded"
                      src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
                    >
                      MI
                    </Avatar>
                    <Typography variant="body2">Михаил Вялков</Typography>
                  </Box>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Avatar
                      sx={{ width: '24px', height: '24px' }}
                      variant="rounded"
                      src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
                    >
                      MI
                    </Avatar>
                    <Typography variant="body2">Михаил Вялков</Typography>
                  </Box>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
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
      <Modal open={tagFormOpen} onClose={handleTagFormClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleTagFormClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            Новый тэг
          </Typography>
          <Stack spacing={2}>
            <TextField
              required
              name="title"
              label="Название"
              fullWidth
              value={tagFormData.title}
              onChange={handleTagFormChange}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="contained" onClick={handleTagFormSubmit} sx={{ color: 'white' }}>
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
