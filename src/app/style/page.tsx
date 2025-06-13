import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import theme from '@/lib/theme';

const StyleGuide = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Типографика */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h1" style={{ color: theme.palette.primary.main }}>
          Типографика
        </Typography>
        <Typography variant="h1">Заголовок H1 (2rem, 700)</Typography>
        <Typography variant="h2">Заголовок H2 (1.5rem, 600)</Typography>
        <Typography variant="subtitle1">Подзаголовок (1.125rem, 500)</Typography>
        <Typography variant="body1">Основной текст (1rem, 400)</Typography>
        <Typography variant="body2">Второстепенный текст (0.875rem, 400)</Typography>
        <Typography variant="caption">Подпись (0.75rem, 400)</Typography>
      </div>

      {/* Кнопки */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h2" style={{ color: theme.palette.primary.main }}>
          Кнопки
        </Typography>
        <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
          Основная кнопка
        </Button>
        <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
          Вторичная кнопка
        </Button>
        <Button variant="outlined" color="primary" style={{ marginRight: '10px' }}>
          Контурная кнопка
        </Button>
        <Button variant="text" color="success">
          Кнопка успеха
        </Button>
      </div>

      {/* Карточки */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h2" style={{ color: theme.palette.primary.main }}>
          Карточки
        </Typography>
        <Card sx={{ maxWidth: 345, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h2">Карточка</Typography>
            <Typography variant="body1">
              Это пример карточки с использованием тёмной темы и MUI.
            </Typography>
            <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Действие
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Поля ввода */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h2" style={{ color: theme.palette.primary.main }}>
          Поля ввода
        </Typography>
        <TextField
          label="Основное поле"
          variant="outlined"
          color="primary"
          fullWidth
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Поле с ошибкой"
          variant="outlined"
          color="error"
          error
          helperText="Ошибка ввода"
          fullWidth
        />
      </div>

      {/* Таблицы */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h2" style={{ color: theme.palette.primary.main }}>
          Таблицы
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Тест-кейс 1</TableCell>
                <TableCell>Пройден</TableCell>
                <TableCell>
                  <Button variant="text" color="primary">
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Тест-кейс 2</TableCell>
                <TableCell>Провален</TableCell>
                <TableCell>
                  <Button variant="text" color="error">
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default StyleGuide;
