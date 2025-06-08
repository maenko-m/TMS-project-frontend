import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
    error: {
      main: '#CF6679',
    },
    success: {
      main: '#03DAC6',
    },
  },
  typography: {
    fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#2A2A2A',
            '& fieldset': {
              borderColor: '#4A4A4A',
            },
            '&:hover fieldset': {
              borderColor: '#BB86FC',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#BB86FC',
            },
            '& input': {
              fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0',
            fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#BB86FC',
            fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#2A2A2A',
          fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Geist", "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
  },
});

export default theme;
