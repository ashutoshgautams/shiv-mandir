import type { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

type P = SVGProps<SVGSVGElement>;

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>
);
export const DiyaIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 3c2 2.6 2.4 4.6 0 7-2.4-2.4-2-4.4 0-7z" /><path d="M3 13h18c-1 4-4.5 6-9 6s-8-2-9-6z" /></svg>
);
export const BookIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /><path d="M9 7h6M9 11h6" /></svg>
);
export const HandsIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const WhatsAppIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 1.8.8c-.3 1.2-1.3 1.9-2.5 1.7C11 15 9 13 8.5 10.4c-.2-1.2.5-2.2 1.7-2.5l.8 1.8z" /></svg>
);
export const BellIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /><path d="M12 3v2" /></svg>
);
export const FlowerIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5C10 7 10 4 12 3c2 1 2 4 0 6.5zM12 14.5c-2 2.5-2 5.5 0 6.5 2-1 2-4 0-6.5zM9.5 12C7 10 4 10 3 12c1 2 4 2 6.5 0zM14.5 12c2.5 2 5.5 2 6.5 0-1-2-4-2-6.5 0z" /></svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const SearchIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 12l5 5L20 7" /></svg>
);
export const CopyIcon = (p: P) => (
  <svg {...base} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
);

// The mandir's own silhouette: three white pyramidal shikhars with kalash finials, as seen from Road No. 24.
export const ShikharMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
    <path d="M8 30 L17 12 L26 30 Z" fill="#fff" stroke="#8e1b1b" strokeWidth="2" strokeLinejoin="round" />
    <path d="M38 30 L47 12 L56 30 Z" fill="#fff" stroke="#8e1b1b" strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 30 L32 4 L44 30 Z" fill="#fff" stroke="#8e1b1b" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="32" cy="3" r="2" fill="#e8850c" />
    <circle cx="17" cy="11" r="1.6" fill="#e8850c" />
    <circle cx="47" cy="11" r="1.6" fill="#e8850c" />
    <rect x="4" y="30" width="56" height="4" rx="1" fill="#8e1b1b" />
    <rect x="8" y="34" width="48" height="10" fill="#fff" stroke="#8e1b1b" strokeWidth="2" />
    <path d="M29 44v-6a3 3 0 0 1 6 0v6" fill="none" stroke="#8e1b1b" strokeWidth="2" />
  </svg>
);
