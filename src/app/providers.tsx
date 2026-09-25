'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjsBuddhist } from '@mui/x-date-pickers/AdapterDayjsBuddhist';
import { thTH } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/th';
import theme from '@/theme';

const thaiLocaleText =
  thTH.components.MuiLocalizationProvider.defaultProps.localeText;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDayjsBuddhist}
        adapterLocale="th"
        localeText={thaiLocaleText}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
