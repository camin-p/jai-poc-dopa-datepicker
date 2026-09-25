import dayjs, { type Dayjs } from 'dayjs';

/** Buddhist Era is 543 years ahead of the Common Era. */
export const BE_OFFSET = 543;

export const toBE = (ce: number) => ce + BE_OFFSET;
export const toCE = (be: number) => be - BE_OFFSET;

/**
 * State of the birth-date field.
 *
 * `day`/`month` are zero-padded 2-digit strings, `year` is a 4-digit Buddhist
 * Era year. Empty string means "not filled in yet"; the `no*` flags mean
 * "the citizen's ID card does not carry this part" (DOPA stores it as `00`).
 */
export type DobState = {
  day: string;
  month: string;
  year: string;
  noDay: boolean;
  noMonth: boolean;
};

export const emptyDob: DobState = {
  day: '',
  month: '',
  year: '',
  noDay: false,
  noMonth: false,
};

export const MIN_YEAR_BE = 2400;
export const currentYearBE = () => toBE(dayjs().year());

/** Days in a BE month, accounting for leap years. Falls back to 31 when unknown. */
export function daysInMonth(monthBE: string, yearBE: string): number {
  const m = Number(monthBE);
  const y = Number(yearBE);
  if (!m || m < 1 || m > 12) return 31;
  if (!y) return m === 2 ? 29 : dayjs(`2001-${monthBE}-01`).daysInMonth();
  return dayjs(`${toCE(y)}-${monthBE}-01`).daysInMonth();
}

export type DobErrors = {
  day?: string;
  month?: string;
  year?: string;
};

export function validateDob(s: DobState): DobErrors {
  const errors: DobErrors = {};
  const maxYear = currentYearBE();

  if (!s.year) {
    errors.year = 'กรุณาระบุปีเกิด (พ.ศ.)';
  } else if (s.year.length !== 4) {
    errors.year = 'ปี พ.ศ. ต้องมี 4 หลัก';
  } else {
    const y = Number(s.year);
    if (y < MIN_YEAR_BE || y > maxYear) {
      errors.year = `ปี พ.ศ. ต้องอยู่ระหว่าง ${MIN_YEAR_BE} - ${maxYear}`;
    }
  }

  if (!s.noMonth) {
    const m = Number(s.month);
    if (!s.month) errors.month = 'กรุณาระบุเดือนเกิด';
    else if (!m || m < 1 || m > 12) errors.month = 'เดือนต้องอยู่ระหว่าง 01 - 12';
  }

  if (!s.noDay) {
    const d = Number(s.day);
    if (!s.day) errors.day = 'กรุณาระบุวันเกิด';
    else if (!d || d < 1 || d > 31) errors.day = 'วันต้องอยู่ระหว่าง 01 - 31';
    else if (!errors.month && !s.noMonth && d > daysInMonth(s.month, s.year)) {
      errors.day = `เดือนนี้มีเพียง ${daysInMonth(s.month, s.year)} วัน`;
    }
  }

  // Knowing the day but not the month is meaningless — the UI ticks "no day"
  // automatically when "no month" is ticked, so this is a safety net only.
  if (s.noMonth && !s.noDay && s.day) {
    errors.day = 'ไม่ทราบเดือนเกิด จึงระบุวันเกิดไม่ได้';
  }

  return errors;
}

export const hasErrors = (e: DobErrors) => Object.keys(e).length > 0;

/** DOPA format: `YYYY-MM-DD` in Buddhist Era, with `00` for unknown parts. */
export function toDopaString(s: DobState): string {
  const year = s.year || '0000';
  const month = s.noMonth ? '00' : s.month.padStart(2, '0');
  const day = s.noDay ? '00' : s.day.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Value to feed the DatePicker. The adapter works in CE internally, so the BE
 * year is converted back. Missing day/month fall back to the 1st so the
 * calendar still opens on the right year/month.
 */
export function toDayjsOrNull(s: DobState): Dayjs | null {
  if (!s.year || s.year.length !== 4) return null;
  const y = toCE(Number(s.year));
  const m = s.noMonth || !s.month ? 1 : Number(s.month);
  const d = s.noDay || !s.day ? 1 : Number(s.day);
  const value = dayjs(new Date(y, m - 1, d));
  return value.isValid() ? value : null;
}

/** Map a picker selection back into the field state, preserving the flags. */
export function fromDayjs(d: Dayjs, prev: DobState): DobState {
  return {
    ...prev,
    year: String(toBE(d.year())),
    month: prev.noMonth ? '' : String(d.month() + 1).padStart(2, '0'),
    day: prev.noDay || prev.noMonth ? '' : String(d.date()).padStart(2, '0'),
  };
}

export type PickerView = 'year' | 'month' | 'day';

/** The picker only offers the parts that are still in play. */
export function viewsFor(s: DobState): PickerView[] {
  if (s.noMonth) return ['year'];
  if (s.noDay) return ['year', 'month'];
  return ['year', 'month', 'day'];
}
