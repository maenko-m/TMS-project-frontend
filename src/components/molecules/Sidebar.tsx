'use client';

import React from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BugReportIcon from '@mui/icons-material/BugReport';
import TerrainIcon from '@mui/icons-material/Terrain';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Project } from '@/features/projects/types';

const project: Project = {
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
};

export default function Sidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  const getFullPath = (pagename: string) => {
    return `/projects/${projectId}${pagename}`;
  };

  const itemIsActive = (pagename: string) => {
    return pathname === getFullPath(pagename);
  };

  return (
    <Box
      sx={{
        width: 'calc(200px + 2 * (2 * 8px))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: 'background.paper',
        height: '100vh',
      }}
    >
      <div>
        <div>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              pb: 2,
              mb: 2,
              borderBottom: '3px solid #403F3F',
            }}
          >
            <Avatar variant="rounded" src={project.iconBase64} sx={{ width: 32, height: 32 }}>
              <Typography variant="caption" color="textPrimary">
                {(project.name[0] + project.name[1]).toUpperCase()}
              </Typography>
            </Avatar>
            <Typography variant="body1">{project.name}</Typography>
          </Box>
        </div>
        <div>
          <Accordion
            disableGutters
            defaultExpanded
            sx={{
              background: 'none',
              boxShadow: 'none',
              '&::before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, background: 'none' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ТЕСТЫ
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, background: 'none' }}>
              <List component="nav">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/repository')}
                    selected={itemIsActive('/repository')}
                  >
                    <ListItemIcon>
                      <FolderOpenOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Репозиторий" />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded
            sx={{
              background: 'none',
              boxShadow: 'none',
              '&::before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, background: 'none' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ВЫПОЛНЕНИЕ
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, background: 'none' }}>
              <List component="nav">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/test-plans')}
                    selected={itemIsActive('/test-plans')}
                  >
                    <ListItemIcon>
                      <ListAltRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Тест-планы" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/test-runs')}
                    selected={itemIsActive('/test-runs')}
                  >
                    <ListItemIcon>
                      <PlayArrowIcon />
                    </ListItemIcon>
                    <ListItemText primary="Тест-раны" />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded
            sx={{
              background: 'none',
              boxShadow: 'none',
              '&::before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, background: 'none' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ПРОЧЕЕ
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, background: 'none' }}>
              <List component="nav">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/defects')}
                    selected={itemIsActive('/defects')}
                  >
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Дефекты" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/milestones')}
                    selected={itemIsActive('/milestones')}
                  >
                    <ListItemIcon>
                      <TerrainIcon />
                    </ListItemIcon>
                    <ListItemText primary="Вехи" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/tags')}
                    selected={itemIsActive('/tags')}
                  >
                    <ListItemIcon>
                      <LocalOfferIcon />
                    </ListItemIcon>
                    <ListItemText primary="Тэги" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ padding: '2px 8px' }}
                    component={Link}
                    href={getFullPath('/attachments')}
                    selected={itemIsActive('/attachments')}
                  >
                    <ListItemIcon>
                      <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Вложения" />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <List component="nav">
        <ListItem disablePadding>
          <ListItemButton
            sx={{ padding: '2px 8px' }}
            component={Link}
            href={getFullPath('/settings')}
            selected={itemIsActive('/settings')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Настройки" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
