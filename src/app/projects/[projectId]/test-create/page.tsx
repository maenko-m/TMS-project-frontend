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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Param {
  key: string;
  value: string;
}
interface Step {
  description: string;
  expected: string;
}

export default function CreateTestCase() {
  const [suiteId, setSuiteId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preconditions, setPreconditions] = useState('');
  const [postconditions, setPostconditions] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [priority, setPriority] = useState('LOW');
  const [severity, setSeverity] = useState('MINOR');

  const [parameters, setParameters] = useState<Param[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(['smoke', 'regression']);

  const suiteOptions = ['4', '5', '6'];

  const handleAddParam = () => setParameters([...parameters, { key: '', value: '' }]);
  const handleAddStep = () => setSteps([...steps, { description: '', expected: '' }]);

  const handleParamChange = (index: number, field: keyof Param, value: string) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleSubmit = () => {
    const payload = {
      suiteId,
      title,
      description,
      preconditions,
      postconditions,
      status,
      priority,
      severity,
      parameters: Object.fromEntries(parameters.map((p) => [p.key, p.value])),
      tags,
      steps,
    };
    console.log('Submitted', payload);
  };

  const fieldSx = { flex: '1 1 200px', backgroundColor: 'background.paper' };

  return (
    <Box
      component="form"
      sx={{
        height: 'calc(100vh - 6 * 8px)',
        overflowY: 'auto',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h1">Создать тест-кейс</Typography>

      <TextField
        label="Название"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ backgroundColor: 'background.paper' }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={fieldSx}>
          <InputLabel>Suite</InputLabel>
          <Select
            value={suiteId}
            label="Тестовый набор"
            onChange={(e) => setSuiteId(e.target.value)}
          >
            {suiteOptions.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Статус" onChange={(e) => setStatus(e.target.value)}>
            {['DRAFT', 'READY'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} label="Приоритет" onChange={(e) => setPriority(e.target.value)}>
            {['LOW', 'MEDIUM', 'HIGH'].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fieldSx}>
          <InputLabel>Severity</InputLabel>
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
      </Box>

      <TextField
        label="Описание"
        multiline
        rows={3}
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ backgroundColor: 'background.paper' }}
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Предусловия"
          value={preconditions}
          onChange={(e) => setPreconditions(e.target.value)}
          sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
        />
        <TextField
          label="Постусловия"
          value={postconditions}
          onChange={(e) => setPostconditions(e.target.value)}
          sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
        />
      </Box>

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
            label="Тэги"
            placeholder="Добавить или выбрать тег"
            sx={{ backgroundColor: 'background.paper' }}
          />
        )}
      />

      <Box>
        <Typography variant="h6" mb={1}>
          Параметры
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAddParam}>
          Добавить параметр
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          {parameters.map((param, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Название параметра"
                value={param.key}
                onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
              <TextField
                placeholder="Значение"
                value={param.value}
                onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" mb={1}>
          Шаги
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAddStep}>
          Добавить шаг
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Описание шага"
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
              <TextField
                placeholder="Ожидаемый результат"
                value={step.expected}
                onChange={(e) => handleStepChange(index, 'expected', e.target.value)}
                sx={{ flex: '1 1 48%', backgroundColor: 'background.paper' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Box>
    </Box>
  );
}
