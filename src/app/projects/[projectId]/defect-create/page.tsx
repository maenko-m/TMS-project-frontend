'use client';

import React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
  Typography,
  Modal,
  Tabs,
  Tab,
  IconButton,
  Checkbox,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';

export default function CreateDefect() {
  const [title, setTitle] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [severity, setSeverity] = useState('MINOR');
  const [milestone, setMilestone] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(['ui', 'critical']);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [selectedExisting, setSelectedExisting] = useState<string[]>([]);

  const existingFiles = [
    { id: '1', name: 'log.txt', size: '14 KB' },
    { id: '2', name: 'screenshot.png', size: '82 KB' },
  ];

  const handleDrop = (acceptedFiles: File[]) => {
    setAttachments([...attachments, ...acceptedFiles]);
    setAttachmentModalOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  const handleFileSelect = (id: string) => {
    setSelectedExisting((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAddSelectedFiles = () => {
    // Stub: Attach selected files to defect (IDs are stored)
    setAttachmentModalOpen(false);
  };

  const fieldSx = {
    flex: '1 1 300px',
    backgroundColor: 'background.paper',
    minWidth: '300px',
  };

  return (
    <Box
      component="form"
      sx={{
        height: '100vh',
        overflowY: 'auto',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h5">Добавить дефект</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Название"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={fieldSx}
        />

        <FormControl sx={fieldSx}>
          <InputLabel>Серьезность</InputLabel>
          <Select
            value={severity}
            label="Серьезность"
            onChange={(e) => setSeverity(e.target.value)}
          >
            {['MINOR', 'MAJOR', 'CRITICAL'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Веха</InputLabel>
          <Select value={milestone} label="Веха" onChange={(e) => setMilestone(e.target.value)}>
            {['v1.0', 'v1.1'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        label="Актуальный результат"
        fullWidth
        value={actualResult}
        onChange={(e) => setActualResult(e.target.value)}
        sx={{ backgroundColor: 'background.paper' }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={allTags}
        value={tags}
        onChange={(e, newTags) => setTags(newTags as string[])}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Теги"
            placeholder="Добавить или выбрать тег"
            sx={{ backgroundColor: 'background.paper' }}
          />
        )}
      />

      <Box>
        <Button variant="outlined" onClick={() => setAttachmentModalOpen(true)}>
          Добавить вложение
        </Button>

        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
          {attachments.map((file, index) => (
            <Box key={index} sx={{ p: 2, border: '1px solid', borderRadius: 2 }}>
              <Typography>{file.name}</Typography>
              <Typography variant="body2">{(file.size / 1024).toFixed(1)} KB</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Modal open={attachmentModalOpen} onClose={() => setAttachmentModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setAttachmentModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Уже загруженные" />
            <Tab label="Загрузить" />
          </Tabs>

          {tab === 0 && (
            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              {existingFiles.map((file) => (
                <Box
                  key={file.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Box>
                    <Typography>{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.size}
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={selectedExisting.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                  />
                </Box>
              ))}
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleAddSelectedFiles}>
                  Добавить
                </Button>
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box
              {...getRootProps()}
              sx={{
                mt: 2,
                p: 4,
                border: '2px dashed #aaa',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <Typography>Перетащите файлы сюда или нажмите для выбора</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
