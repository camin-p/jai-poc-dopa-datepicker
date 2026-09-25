# POC — ฟิลด์วันเกิดแบบ 3 ช่อง (NgernHaiJai / ตรวจสอบข้อมูล DOPA)

หน้าเว็บจำลองหน้า "ข้อมูลบัตรประชาชน" ของ LINE web app เพื่อทดสอบ UX ของ **ฟิลด์วันเกิด** ที่รองรับกรณีบัตรประชาชนไม่มีข้อมูลวัน/เดือน (กรมการปกครองเก็บเป็น `00`)

## สิ่งที่ POC นี้ทดสอบ

| ความสามารถ | รายละเอียด |
|---|---|
| ช่องกรอก 3 ช่อง | วัน / เดือน / ปี (พ.ศ.) — รับเฉพาะตัวเลข, ครบหลักแล้วเลื่อน focus อัตโนมัติ, เติม 0 ข้างหน้าเมื่อออกจากช่อง |
| Checkbox "ไม่มีข้อมูล" | อยู่ใต้ช่องวันและเดือน — ติ๊กแล้วล้างค่าและ disable ช่องนั้น, เอาติ๊กออกแล้วกรอกใหม่ได้ |
| กฎ วัน↔เดือน | ติ๊ก "ไม่มีข้อมูล" ที่เดือน จะติ๊กที่วันให้อัตโนมัติ (รู้วันแต่ไม่รู้เดือนไม่มีความหมาย) |
| ปฏิทินแบบ bottom sheet | กดไอคอนปฏิทิน → เปิด `Drawer` จากด้านล่าง, ปฏิทิน th-TH + ปี **พ.ศ.** |
| ปฏิทินปรับตาม checkbox | ไม่ติ๊ก → ปี→เดือน→วัน · ติ๊กวัน → ปี→เดือน · ติ๊กเดือน → เลือกปีอย่างเดียว |
| ค่าที่ส่งออก | รูปแบบ DOPA `YYYY-MM-DD` เป็น พ.ศ. โดยใช้ `00` แทนส่วนที่ไม่ทราบ เช่น `2530-08-00`, `2531-00-00` |
| Validation | ปีต้องอยู่ในช่วง 2400 ถึงปีปัจจุบัน, เดือน 01–12, วันต้องไม่เกินจำนวนวันจริงของเดือนนั้น (รวมปีอธิกสุรทิน) |

## โครงสร้าง

```
src/lib/thaiDate.ts              logic ล้วน — แปลง พ.ศ.↔ค.ศ., validate, แปลงเป็นสตริง DOPA
src/components/ThaiDobField.tsx  ฟิลด์วันเกิด + bottom sheet ปฏิทิน (หัวใจของ POC)
src/components/MockField.tsx     ช่องกรอกแบบ pill + label เขียว (ฟิลด์อื่นเป็น mock)
src/app/page.tsx                 หน้าจำลองตาม mockup
src/app/providers.tsx            ThemeProvider + LocalizationProvider (AdapterDayjsBuddhist, locale th)
src/theme.ts                     สีที่ดูดมาจากไฟล์ mockup โดยตรง
```

ปฏิทิน พ.ศ. ใช้ `AdapterDayjsBuddhist` ที่มากับ `@mui/x-date-pickers` v9 โดยตรง ไม่ได้เขียน adapter เอง
ตัว `dayjs` ที่ adapter ส่งกลับมายังเป็น **ค.ศ.** — `src/lib/thaiDate.ts` เป็นที่เดียวที่บวก/ลบ 543

## รัน

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # ต้องผ่านก่อน deploy
```

> `dev` / `build` ตั้งค่าให้ใช้ **webpack** (`--webpack`) เพราะเครื่องที่พัฒนาโดน Windows Application Control
> บล็อก native binary ของ SWC ทำให้ Turbopack ใช้ไม่ได้ ถ้าเครื่องคุณใช้ Turbopack ได้ ใช้ `npm run dev:turbo`
> / `npm run build:turbo` จะเร็วกว่า

## Deploy ขึ้น Vercel

ไม่ต้องมี `vercel.json` — Vercel ตรวจเจอ Next.js เอง

```bash
npx vercel          # ครั้งแรก: login + ผูกโปรเจกต์ (จะถามชื่อโปรเจกต์)
npx vercel --prod   # deploy ขึ้น production
```

หรือ push ขึ้น GitHub แล้วกด **Import Project** ใน Vercel dashboard — ค่า default ทั้งหมดใช้ได้เลย
(Framework: Next.js, Build Command: `npm run build`, Output: `.next`)

## Stack

Next.js 16 · React 19 · MUI 9 · `@mui/x-date-pickers` 9 (`AdapterDayjsBuddhist`) · dayjs · TypeScript
