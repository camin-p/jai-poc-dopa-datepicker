'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { brand } from '@/theme';
import MockField from '@/components/MockField';
import IdCardArt from '@/components/IdCardArt';
import ThaiDobField from '@/components/ThaiDobField';
import {
  type DobErrors,
  emptyDob,
  hasErrors,
  toDopaString,
  validateDob,
} from '@/lib/thaiDate';

export default function Page() {
  const [dob, setDob] = React.useState(emptyDob);
  const [errors, setErrors] = React.useState<DobErrors>({});
  const [result, setResult] = React.useState<string | null>(null);

  const handleChange = (next: typeof dob) => {
    setDob(next);
    setResult(null);
    // Only refresh errors that are already on screen, so typing is not noisy.
    if (hasErrors(errors)) setErrors(validateDob(next));
  };

  const handleSubmit = () => {
    const next = validateDob(dob);
    setErrors(next);
    setResult(hasErrors(next) ? null : toDopaString(dob));
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#FFFFFF',
        maxWidth: 480,
        mx: 'auto',
        pb: 14,
        position: 'relative',
      }}
    >
      {/* LINE-style browser header */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', px: 2, py: 1.5, position: 'relative' }}
      >
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 19 }}>
            NgernHaiJai
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#8A8988' }}>
            ngernhaijai.com
          </Typography>
        </Box>
        <IconButton aria-label="ปิด" sx={{ position: 'absolute', right: 8 }}>
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Green hero */}
      <Box sx={{ bgcolor: brand.green, px: 3, pt: 4, pb: 6 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography
            component="h1"
            sx={{ color: '#FFF', fontWeight: 700, fontSize: 30, lineHeight: 1.25 }}
          >
            ข้อมูล
            <br />
            บัตรประชาชน
          </Typography>
          <IdCardArt width={150} />
        </Stack>
      </Box>

      {/* Stacked card edges */}
      <Box sx={{ position: 'relative', bgcolor: brand.green, height: 28 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: '0 22px auto 22px',
            height: 40,
            bgcolor: brand.greenTint,
            borderRadius: '24px 24px 0 0',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: '12px 0 auto 0',
            height: 40,
            bgcolor: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
          }}
        />
      </Box>

      <Box sx={{ px: 3, pt: 1 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
            เลขที่ใบสมัคร:{' '}
            <Box component="span" sx={{ color: brand.blue }}>
              0000188
            </Box>
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={64}
              thickness={3}
              sx={{ color: '#E6F2EA' }}
            />
            <CircularProgress
              variant="determinate"
              value={35}
              size={64}
              thickness={3}
              sx={{ color: brand.green, position: 'absolute', left: 0 }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <FavoriteIcon sx={{ color: brand.blue }} />
            </Box>
          </Box>
        </Stack>

        <Typography
          component="h2"
          sx={{ color: brand.blue, fontWeight: 700, fontSize: 22, mt: 2, mb: 2 }}
        >
          ข้อมูลส่วนตัว
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-end' }}>
            <MockField label="ชื่อ" defaultValue="วิชัย" />
            <MockField placeholder="ชื่อกลาง" />
          </Stack>

          <MockField label="นามสกุล" defaultValue="รักไทย" />

          <MockField
            label="เลขบัตรประชาชน"
            defaultValue="3-1005-00348-88-8"
            disabled
          />

          <ThaiDobField value={dob} onChange={handleChange} errors={errors} />

          <MockField
            placeholder="เลขเลเซอร์หลังบัตรประชาชน"
            endAdornment={
              <Box
                component="svg"
                viewBox="0 0 48 30"
                sx={{ width: 44, height: 28, mr: 0.5 }}
                aria-hidden="true"
              >
                <rect width="48" height="30" rx="4" fill="#CFE3F7" />
                <rect x="4" y="6" width="18" height="12" rx="2" fill="#F2C94C" />
                <rect x="26" y="8" width="18" height="3" rx="1.5" fill="#6B7A99" />
                <rect x="26" y="15" width="12" height="3" rx="1.5" fill="#6B7A99" />
              </Box>
            }
          />

          {result && (
            <Alert severity="success" data-testid="dob-result" sx={{ borderRadius: 3 }}>
              ค่าที่ส่งออก (DOPA): <strong>{result}</strong>
            </Alert>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}
        >
          <DeleteOutlineIcon sx={{ color: brand.red }} />
          <Typography sx={{ color: brand.red, fontWeight: 700, fontSize: 17 }}>
            ยกเลิกใบสมัคร
          </Typography>
        </Stack>
      </Box>

      {/* Sticky confirm bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 480,
          mx: 'auto',
          bgcolor: '#FFF',
          borderTop: '1px solid #EEE',
          px: 3,
          py: 2,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          data-testid="submit"
          sx={{ py: 1.5 }}
        >
          ยืนยัน
        </Button>
      </Box>
    </Box>
  );
}
