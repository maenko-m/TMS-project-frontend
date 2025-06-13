import React from 'react';
import { Box, Tooltip } from '@mui/material';

type StatusBarProps = {
  errors: number;
  success: number;
  skipped: number;
};

const StatusBar: React.FC<StatusBarProps> = ({ errors, success, skipped }) => {
  const total = errors + success + skipped;

  const getWidth = (count: number) => `${(count / total) * 100}%`;

  const renderSegment = (count: number, label: string, color: string, textColor = '#fff') => {
    if (count === 0) return null;
    const percent = ((count / total) * 100).toFixed(1);

    return (
      <Tooltip title={`${label}: ${count} (${percent}%)`} arrow>
        <Box
          sx={{
            width: getWidth(count),
            bgcolor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            fontWeight: 'bold',
            fontSize: 14,
            cursor: 'default',
          }}
        >
          {count}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: 32, borderRadius: 1, overflow: 'hidden', boxShadow: 1 }}>
      {renderSegment(errors, 'Ошибки', '#f44336')}
      {renderSegment(success, 'Успешно', '#4caf50')}
      {renderSegment(skipped, 'Пропущено', '#9e9e9e')}
    </Box>
  );
};

export default StatusBar;
