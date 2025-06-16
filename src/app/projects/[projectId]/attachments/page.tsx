'use client';

import React, { use } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import AppSnackbar from '@/components/atoms/AppSnackbar';

const ATTACHMENTS_QUERY = gql`
  query Attachments($projectId: UUID!, $filter: String) {
    attachmentsByProjectId(projectId: $projectId, where: { fileName: { contains: $filter } }) {
      nodes {
        id
        fileName
        contentType
        fileSize
        fileUrl
        uploadedById
      }
    }
  }
`;

const USER_BY_ID = gql`
  query UserById($id: UUID!) {
    userById(id: $id) {
      id
      fullName
    }
  }
`;

function UserName({ userId }: { userId: string }) {
  const { data } = useQuery(USER_BY_ID, { variables: { id: userId } });
  return <>{data?.userById.fullName || '—'}</>;
}

export default function AttachmentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [filter, setFilter] = React.useState('');
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  const { data, refetch } = useQuery(ATTACHMENTS_QUERY, {
    variables: { projectId, filter },
    fetchPolicy: 'network-only',
  });

  const attachments = data?.attachmentsByProjectId.nodes || [];

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('tms_token');
    const form = new FormData();

    form.append('File', file);
    form.append('ProjectId', projectId);

    await fetch('http://localhost:7265/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    setFile(null);
    setUploadOpen(false);
    refetch();
    showSnackbar('Успешно загружено', 'success');
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
      <Typography variant="h1">Вложения</Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={() => setUploadOpen(true)}>
          <Typography variant="body1" color="white">
            Добавить файл
          </Typography>
        </Button>
        <TextField
          size="small"
          label="Поиск"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Название файла</TableCell>
                <TableCell>MIME</TableCell>
                <TableCell>Размер</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Ссылка</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attachments.map((att: any) => (
                <TableRow key={att.id} hover>
                  <TableCell>{att.fileName}</TableCell>
                  <TableCell>{att.contentType}</TableCell>
                  <TableCell>{(att.fileSize / 1024).toFixed(1)} KB</TableCell>
                  <TableCell>
                    <UserName userId={att.uploadedById} />
                  </TableCell>
                  <TableCell>
                    <Button
                      href={`http://localhost:7265/${att.fileUrl}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Скачать
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <DialogTitle>Добавить вложение</DialogTitle>
        <DialogContent>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="*" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Отмена</Button>
          <Button onClick={handleUpload} disabled={!file}>
            Загрузить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
