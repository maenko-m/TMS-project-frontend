'use client';

import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { useRouter } from 'next/navigation';

// ==========================
// GraphQL ЗАПРОСЫ/МУТАЦИИ
// ==========================

const ME_QUERY = gql`
  query Me {
    me {
      id
      fullName
    }
  }
`;

const PROJECTS_QUERY = gql`
  query Projects($filter: ProjectFilter, $first: Int, $after: String, $before: String) {
    projects(filter: $filter, first: $first, after: $after, before: $before) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        ownerId
        name
        description
        accessType
        iconBase64
        testCasesCount
        defectsCount
        projectUsersCount
      }
    }
  }
`;

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: UUID!) {
    deleteProject(id: $id)
  }
`;

export default function ProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [afterCursor, setAfterCursor] = React.useState<string | null>(null);
  const [beforeCursor, setBeforeCursor] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { data: meData } = useQuery(ME_QUERY);

  const { data, loading, refetch } = useQuery(PROJECTS_QUERY, {
    variables: {
      filter: search ? { name: search } : undefined,
      first: 5,
      after: afterCursor,
      before: beforeCursor,
    },
    fetchPolicy: 'network-only',
  });

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => {
      setConfirmOpen(false);
      refetch();
    },
  });

  const handleDelete = () => {
    if (selectedProjectId) {
      deleteProject({ variables: { id: selectedProjectId } });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    return parts
      .map((s) => s[0])
      .join('')
      .toUpperCase();
  };

  const projects = data?.projects?.nodes || [];
  const pageInfo = data?.projects?.pageInfo;

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, [router]);

  if (!isMounted) return <CircularProgress />;

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, sm: 4 }, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h1" color="#E4E4E4">
          Проекты
        </Typography>
        <Avatar
          variant="rounded"
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push('/profile')}
        >
          {meData?.me ? getInitials(meData.me.fullName) : 'MI'}
        </Avatar>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button variant="contained" onClick={() => router.push('/projects/create')}>
          Создать новый проект
        </Button>
        <TextField
          size="small"
          label="Поиск по проектам"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setAfterCursor(null);
            setBeforeCursor(null);
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {!loading ? (
          projects.map((project: any) => (
            <Box
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}/repository`)}
              sx={{
                p: 3,
                width: 450,
                height: 330,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid #403F3F',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Avatar variant="rounded" src={project.iconBase64}>
                  {(project.name[0] + project.name[1]).toUpperCase()}
                </Avatar>
              </Box>

              <Typography variant="subtitle1" color="#939393">
                {project.name}
              </Typography>

              <Box
                sx={{
                  background: project.accessType === 'PUBLIC' ? '#37BD47' : '#D0011B',
                  padding: '2px 6px',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="white">
                  {project.accessType === 'PUBLIC' ? 'Публичный' : 'Приватный'}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="#939393"
                sx={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {project.description}
              </Typography>

              <Typography variant="body2" color="#939393">
                {project.testCasesCount} тест кейсов
              </Typography>

              <Typography variant="body2" color="#939393">
                {project.defectsCount} дефектов
              </Typography>

              {project.accessType === 'PRIVATE' && (
                <Typography variant="body2" color="#939393">
                  {project.projectUsersCount} участников
                </Typography>
              )}
              {project.ownerId == meData?.me?.id && (
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.id}/settings`);
                    }}
                    startIcon={<EditIcon />}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(project.id);
                      setConfirmOpen(true);
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <CircularProgress />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        {pageInfo?.hasPreviousPage && (
          <Button
            onClick={() => {
              setBeforeCursor(pageInfo.startCursor);
              setAfterCursor(null);
            }}
          >
            ← Назад
          </Button>
        )}
        {pageInfo?.hasNextPage && (
          <Button
            onClick={() => {
              setAfterCursor(pageInfo.endCursor);
              setBeforeCursor(null);
            }}
          >
            Вперёд →
          </Button>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Удалить проект?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы уверены, что хотите удалить этот проект?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
