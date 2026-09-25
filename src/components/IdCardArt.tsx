'use client';

/** Simplified stand-in for the ID-card illustration in the mockup. */
export default function IdCardArt({ width = 150 }: { width?: number }) {
  return (
    <svg
      width={width}
      viewBox="0 0 160 110"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect x="2" y="6" width="156" height="100" rx="12" fill="#3658B7" />
      <circle cx="30" cy="32" r="11" fill="#E7ECFA" />
      <rect x="18" y="56" width="62" height="7" rx="3.5" fill="#E7ECFA" />
      <rect x="18" y="70" width="46" height="7" rx="3.5" fill="#E7ECFA" />
      <rect x="92" y="22" width="52" height="66" rx="8" fill="#FFFFFF" />
      <circle cx="118" cy="46" r="12" fill="#2F3E57" />
      <path
        d="M100 82c0-10 8-16 18-16s18 6 18 16z"
        fill="#5B7BD4"
      />
      <circle cx="118" cy="49" r="9" fill="#F3C9A3" />
    </svg>
  );
}
