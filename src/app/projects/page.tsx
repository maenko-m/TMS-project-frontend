'use client';

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import { Project } from '@/features/projects/types';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

const projects: Project[] = [
  {
    createdAt: 'string',
    defectsCount: 1,
    description:
      'stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring',
    iconBase64: 'string',
    accessType: 'public',
    id: 'string1',
    name: 'string',
    ownerFullName: 'string',
    ownerId: 'string',
    projectUsersCount: 0,
    testCasesCount: 1,
    updatedAt: 'string',
  },
  {
    createdAt: 'string',
    defectsCount: 1,
    description: 'string',
    accessType: 'private',
    id: 'string2',
    name: 'string',
    ownerFullName: 'string',
    ownerId: 'string',
    projectUsersCount: 1,
    testCasesCount: 1,
    updatedAt: 'string',
  },
];

export default function ProjectsPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        bgcolor: 'background.default',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h1" color="#E4E4E4">
          Проекты
        </Typography>
        <Avatar
          variant="rounded"
          src="https://d2cxucsjd6xvsd.cloudfront.net/public/user/thumb/cbf6ae7f66b7dd7c5792dd123c3b74fe.jpg"
          sx={{
            cursor: 'pointer',
          }}
        >
          MI
        </Avatar>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button variant="contained" size="small">
          <Typography variant="body1" color="white">
            Создать новый проект
          </Typography>
        </Button>
        <TextField size="small" label="Поиск по проектам" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        {projects.map((project: Project) => (
          <Box
            key={project.id}
            sx={{
              p: { xs: 2, sm: 3 },
              width: '450px',
              height: '330px',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: 1,
              border: '1px solid #403F3F',
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Avatar variant="rounded" src={project.iconBase64}>
                {(project.name[0] + project.name[1]).toUpperCase()}
              </Avatar>
              <div>
                <IconButton aria-label="more" onClick={handleClick}>
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
              </div>
            </Box>

            <Typography variant="subtitle1" color="#939393">
              {project.name}
            </Typography>

            {project.accessType === 'public' ? (
              <Box sx={{ background: '#37BD47', padding: '2px 6px', borderRadius: 1 }}>
                <Typography variant="body1" color="white">
                  Публичный
                </Typography>
              </Box>
            ) : (
              <Box sx={{ background: '#D0011B', padding: '2px 6px', borderRadius: 1 }}>
                <Typography variant="body1" color="white">
                  Приватный
                </Typography>
              </Box>
            )}

            <Typography
              variant="body1"
              color="#939393"
              sx={{
                maxHeight: '70px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
              }}
            >
              {project.description}
            </Typography>

            <Typography variant="body1" color="#939393">
              {project.testCasesCount} тест кейсов
            </Typography>

            <Typography variant="body1" color="#939393">
              {project.defectsCount} дефектов
            </Typography>

            {project.accessType === 'private' && (
              <Typography variant="body1" color="#939393">
                {project.projectUsersCount} участников
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Pagination></Pagination>
    </Box>
  );
}
