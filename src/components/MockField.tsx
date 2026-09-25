'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { brand } from '@/theme';

type Props = {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
};

/** Pill text field with the mockup's green label. Mock only — no validation. */
export default function MockField({
  label,
  placeholder,
  defaultValue,
  disabled,
  endAdornment,
}: Props) {
  return (
    <Box sx={{ flex: 1 }}>
      {label && (
        <Typography
          sx={{
            color: brand.labelGreen,
            fontWeight: 600,
            fontSize: 15,
            mb: 0.75,
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        slotProps={{
          input: { endAdornment },
          htmlInput: { 'aria-label': label ?? placeholder },
        }}
      />
    </Box>
  );
}
