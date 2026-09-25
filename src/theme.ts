'use client';

import { createTheme } from '@mui/material/styles';

// Palette sampled directly from the mockup PNG.
export const brand = {
  green: '#1DA646',
  greenTint: '#E3F0E7',
  labelGreen: '#39B15D',
  blue: '#3658B7',
  red: '#F9595F',
  border: '#C8C6C5',
  text: '#303030',
  disabledBg: '#E4E2E1',
  placeholder: '#9E9E9E',
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: brand.blue },
    success: { main: brand.green },
    error: { main: brand.red },
    text: { primary: brand.text },
    background: { default: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'var(--font-thai), "IBM Plex Sans Thai", sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.border,
          },
          '&.Mui-disabled': {
            backgroundColor: brand.disabledBg,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          },
        },
        input: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 18,
          fontSize: 16,
          '&::placeholder': { color: brand.placeholder, opacity: 1 },
          '&.Mui-disabled': { WebkitTextFillColor: brand.text },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: 17,
          boxShadow: 'none',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: { padding: 4 },
      },
    },
  },
});

export default theme;
