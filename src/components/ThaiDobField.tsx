'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { brand } from '@/theme';
import {
  type DobErrors,
  type DobState,
  type PickerView,
  fromDayjs,
  toDayjsOrNull,
  viewsFor,
} from '@/lib/thaiDate';

/** Background of the bottom sheet, sampled from the mockup. */
const SHEET_BG = '#EEF0FF';

type Props = {
  value: DobState;
  onChange: (next: DobState) => void;
  errors: DobErrors;
};

const digitsOnly = (raw: string, max: number) =>
  raw.replace(/\D/g, '').slice(0, max);

export default function ThaiDobField({ value, onChange, errors }: Props) {
  const [open, setOpen] = React.useState(false);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  const views = viewsFor(value);
  const lastView = views[views.length - 1];
  const [view, setView] = React.useState<PickerView>(views[0]);

  const openSheet = () => {
    setView(views[0]);
    setOpen(true);
  };

  // Blur fires after the focus-advance re-render, so handlers that run on blur
  // must read the latest state rather than their render-time closure.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const handleDay = (raw: string) => {
    const day = digitsOnly(raw, 2);
    onChange({ ...value, day });
    // Two digits, or a leading digit that cannot start a valid day: move on.
    if (day.length === 2 || Number(day) > 3) monthRef.current?.focus();
  };

  const handleMonth = (raw: string) => {
    const month = digitsOnly(raw, 2);
    onChange({ ...value, month });
    if (month.length === 2 || Number(month) > 1) yearRef.current?.focus();
  };

  const handleYear = (raw: string) => {
    onChange({ ...value, year: digitsOnly(raw, 4) });
  };

  const pad =
    (key: 'day' | 'month') => (e: React.FocusEvent<HTMLInputElement>) => {
      const current = e.target.value;
      if (current.length === 1) {
        onChange({ ...valueRef.current, [key]: current.padStart(2, '0') });
      }
    };

  const toggleNoDay = (checked: boolean) => {
    onChange({ ...value, noDay: checked, day: '' });
  };

  // Not knowing the month makes a known day meaningless, so the day follows.
  const toggleNoMonth = (checked: boolean) => {
    onChange({
      ...value,
      noMonth: checked,
      month: '',
      ...(checked ? { noDay: true, day: '' } : {}),
    });
  };

  const noDataCheckbox = (
    ariaLabel: string,
    checked: boolean,
    onToggle: (checked: boolean) => void,
  ) => (
    <FormControlLabel
      sx={{
        ml: 0,
        mt: 0.25,
        '& .MuiFormControlLabel-label': {
          fontSize: 12,
          whiteSpace: 'nowrap',
          color: '#6B6B6B',
        },
      }}
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          slotProps={{ input: { 'aria-label': ariaLabel } }}
          sx={{ color: brand.border, '&.Mui-checked': { color: brand.green } }}
        />
      }
      label="ไม่มีข้อมูล"
    />
  );

  const firstError = errors.day ?? errors.month ?? errors.year;

  return (
    <Box>
      <Typography
        sx={{ color: brand.labelGreen, fontWeight: 600, fontSize: 15, mb: 0.75 }}
      >
        วันเกิด
      </Typography>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ width: 84 }}>
          <TextField
            fullWidth
            placeholder="วัน"
            value={value.day}
            disabled={value.noDay}
            error={Boolean(errors.day)}
            onChange={(e) => handleDay(e.target.value)}
            onBlur={pad('day')}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                maxLength: 2,
                'aria-label': 'วัน',
                'data-testid': 'dob-day',
                style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 },
              },
            }}
          />
          {noDataCheckbox('ไม่มีข้อมูลวันเกิด', value.noDay, toggleNoDay)}
        </Box>

        <Box sx={{ width: 84 }}>
          <TextField
            fullWidth
            placeholder="เดือน"
            value={value.month}
            disabled={value.noMonth}
            error={Boolean(errors.month)}
            onChange={(e) => handleMonth(e.target.value)}
            onBlur={pad('month')}
            inputRef={monthRef}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                maxLength: 2,
                'aria-label': 'เดือน',
                'data-testid': 'dob-month',
                style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 },
              },
            }}
          />
          {noDataCheckbox('ไม่มีข้อมูลเดือนเกิด', value.noMonth, toggleNoMonth)}
        </Box>

        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            placeholder="ปี (พ.ศ.)"
            value={value.year}
            error={Boolean(errors.year)}
            onChange={(e) => handleYear(e.target.value)}
            inputRef={yearRef}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                maxLength: 4,
                'aria-label': 'ปี พ.ศ.',
                'data-testid': 'dob-year',
                style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 },
              },
            }}
          />
        </Box>

        <IconButton
          onClick={openSheet}
          aria-label="เปิดปฏิทินเลือกวันเกิด"
          data-testid="dob-calendar-button"
          sx={{
            border: `1px solid ${brand.border}`,
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: brand.text,
          }}
        >
          <CalendarTodayOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>

      {firstError && (
        <Typography
          role="alert"
          sx={{ color: brand.red, fontSize: 13, mt: 0.5, ml: 1 }}
        >
          {firstError}
        </Typography>
      )}

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            id: 'dob-sheet',
            sx: {
              bgcolor: SHEET_BG,
              borderRadius: '20px 20px 0 0',
              maxWidth: 480,
              mx: 'auto',
              px: 1.5,
              pb: 2,
            },
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5 }}
        >
          <Typography sx={{ color: brand.blue, fontWeight: 700, fontSize: 18 }}>
            วันเกิด
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="ปิดปฏิทิน"
            sx={{ color: brand.text }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <DateCalendar
          value={toDayjsOrNull(value)}
          onChange={(picked) => {
            if (!picked || !picked.isValid()) return;
            onChange(fromDayjs(picked, valueRef.current));
            // The sheet stays open while drilling down year → month → day.
            if (view === lastView) setOpen(false);
          }}
          views={views}
          view={view}
          onViewChange={setView}
          minDate={dayjs().subtract(100, 'year')}
          maxDate={dayjs()}
          // MUI's default trims the weekday to one letter, which is ambiguous in
          // Thai (อาทิตย์/อังคาร, พุธ/พฤหัสบดี). Use dayjs' own abbreviations.
          dayOfWeekFormatter={(date) => date.format('dd')}
          sx={{
            width: '100%',
            maxHeight: 'none',
            '& .MuiPickersCalendarHeader-label': { fontWeight: 600 },
            '& .MuiPickersDay-root.Mui-selected': { bgcolor: brand.blue },
            // Thai weekday abbreviations are wider than the 36px default cell.
            '& .MuiDayCalendar-weekDayLabel': { width: 42, fontSize: 12 },
            '& .MuiDayCalendar-weekContainer': { justifyContent: 'center' },
            '& .MuiPickersDay-root': { width: 42, height: 42, fontSize: 15 },
          }}
        />
      </Drawer>
    </Box>
  );
}
