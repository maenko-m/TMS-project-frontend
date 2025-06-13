import React from 'react';
import { Box } from '@mui/material';

type Status = 'в процессе' | 'пройден' | 'не запущен';

type Props = {
  status: Status;
};

const StatusChip: React.FC<Props> = ({ status }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: 12,
        fontWeight: 500,
        bgcolor: 'primary.main',
        color: '#fff',
        letterSpacing: 0.5,
      }}
    >
      {status}
    </Box>
  );
};

export default StatusChip;
