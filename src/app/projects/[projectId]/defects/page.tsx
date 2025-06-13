'use client';

import React, { use } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import AppSnackbar from '@/components/atoms/AppSnackbar';
import { useRouter } from 'next/navigation';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import OutlinedInput from '@mui/material/OutlinedInput';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import theme from '@/lib/theme';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[]) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default function TestCasesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = (message: string, severity: typeof snackbar.severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 3 }}>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography onClick={() => showSnackbar('Аккаунт успешно создан', 'success')} variant="h1">
          Дефекты
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white" onClick={() => router.push('defect-create')}>
            Новый дефект
          </Typography>
        </Button>
        <TextField size="small" label="Поиск" />
        <Select
          sx={{ width: '250px' }}
          size="small"
          multiple
          displayEmpty
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Серьезность не выбрана</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
        >
          <MenuItem disabled value="">
            <em>Серьезность не выбрана</em>
          </MenuItem>
          {names.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName)}>
              {name}
            </MenuItem>
          ))}
        </Select>
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
                <TableCell>Серьезность</TableCell>
                <TableCell>Веха</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell sx={{ widht: '30px' }}></TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <KeyboardDoubleArrowUpIcon sx={{ color: '#D0021B' }} />
                    <Typography variant="body2">Критичный</Typography>
                  </Box>
                </TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <KeyboardDoubleArrowUpIcon sx={{ color: '#D0021B' }} />
                    <Typography variant="body2">Критичный</Typography>
                  </Box>
                </TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <KeyboardDoubleArrowUpIcon sx={{ color: '#D0021B' }} />
                    <Typography variant="body2">Критичный</Typography>
                  </Box>
                </TableCell>
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
