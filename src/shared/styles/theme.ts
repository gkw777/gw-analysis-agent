import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#1a3a6b', light: '#2c5091' },
    secondary: { main: '#2e7d6b' },
    background: { default: '#f3f5fb' },
    divider: '#e6e9f2',
  },
  typography: {
    fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
    h6: { letterSpacing: '-0.02em' },
    subtitle1: { letterSpacing: '-0.01em' },
    subtitle2: { letterSpacing: '-0.01em' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 999 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 10, fontSize: '0.72rem' },
      },
    },
  },
});
