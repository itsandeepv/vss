import type { IconName } from "@/content/site";

/** Inline stroke icons (24×24 grid, currentColor). Decorative: hidden from assistive tech. */
const paths: Record<
  | IconName
  | "mail"
  | "pin"
  | "whatsapp"
  | "menu"
  | "close"
  | "chevron-left"
  | "chevron-right"
  | "pause"
  | "play"
  | "check"
  | "arrow-right"
  | "download"
  | "plus"
  | "chevron-down",
  React.ReactNode
> = {
  shield: <path d="M12 3l8 3v6c0 4.5-3.3 8.3-8 9-4.7-.7-8-4.5-8-9V6l8-3zm-3.5 9l2.5 2.5 4.5-5" />,
  badge: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L7.5 21l4.5-2.5 4.5 2.5-1.5-6.5M9.8 9l1.6 1.6 3-3.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c2 .7 3.2 2.4 3.5 5.2" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  report: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6M10 9h2" />
    </>
  ),
  rupee: <path d="M7 4h11M7 9h11M11.5 4c3 0 4.5 1.7 4.5 3.8S14.5 12 11.5 12H8l8 8" />,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1-4.5-4.3 6.1-.8z" />,
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-8h10v8M7 17h10" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V11l5 3V11l5 3V11l5 3V4h3v17z" />
      <path d="M7 18h2M12 18h2M17 18h1" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h10v17M15 9h4v12M3 21h18" />
      <path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v11h14V10M10 21v-6h4v6" />
    </>
  ),
  school: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6" />
    </>
  ),
  hospital: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 7v6M9 10h6M10 21v-4h4v4" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.5 11h10.5l2-8H6.2" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  hotel: (
    <>
      <path d="M3 20V8M3 14h18v6M21 14v-2a3 3 0 00-3-3h-7v5" />
      <circle cx="7" cy="11" r="2" />
    </>
  ),
  event: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M12 13l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" />
    </>
  ),
  guard: (
    <>
      <path d="M6 8c0-1.5 2.7-3 6-3s6 1.5 6 3H6z" />
      <path d="M8 8v1a4 4 0 008 0V8M4.5 21c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6" />
      <path d="M12 15l-1.5 3 1.5 1.5 1.5-1.5z" />
    </>
  ),
  supervisor: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c.7-4 3.5-6.5 7-6.5s6.3 2.5 7 6.5" />
      <path d="M15.5 17.5l1.3 1.3 2.7-2.8" />
    </>
  ),
  bouncer: (
    <>
      <circle cx="12" cy="6.5" r="3" />
      <path d="M4 21v-4c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5v4M9 6h6" />
      <path d="M9 16v5M15 16v5" />
    </>
  ),
  pso: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c.7-4 3.5-6.5 7-6.5s6.3 2.5 7 6.5" />
      <path d="M9 6.5h6M15.5 10.5c1.5.5 2.5 1.5 2.5 3" />
    </>
  ),
  gun: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.3 8.3-8 9-4.7-.7-8-4.5-8-9V6l8-3z" />
      <circle cx="12" cy="11.5" r="3" />
      <path d="M12 7v1.5M12 14.5V16M7.5 11.5H9M15 11.5h1.5" />
    </>
  ),
  manpower: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M2.5 18c.4-3 2.2-4.8 4.5-4.8M21.5 18c-.4-3-2.2-4.8-4.5-4.8M7 21c.5-3.2 2.4-5 5-5s4.5 1.8 5 5" />
    </>
  ),
  broom: (
    <>
      <path d="M15 3l-4 8" />
      <path d="M8 11h7l3 10H5z" />
      <path d="M9 21l1-5M13 21v-5M16 21l-1-5" />
    </>
  ),
  wrench: <path d="M14.5 6.5a4 4 0 015.2-2.2l-2.6 2.6.5 2.5 2.5.5 2.6-2.6a4 4 0 01-5.2 5.2L9.5 20.5a2.1 2.1 0 01-3-3l7-7a4 4 0 011-4z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.1-1.1z" />
      <path d="M9 8.5c0 3.4 3.1 6.5 6.5 6.5l1-1.6-2-1-1 1c-1-.4-2.1-1.5-2.5-2.5l1-1-1-2z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  "chevron-left": <path d="M15 5l-7 7 7 7" />,
  "chevron-right": <path d="M9 5l7 7-7 7" />,
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="M7 4.5v15L19 12z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
};

export type AnyIcon = keyof typeof paths;

export function Icon({ name, size = 24, className }: { name: AnyIcon; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
