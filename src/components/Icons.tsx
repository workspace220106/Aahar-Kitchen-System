import { SVGProps } from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: 20,
  height: 20,
};

type P = SVGProps<SVGSVGElement>;

export const Camera = (p: P) => (
  <svg {...base} {...p}><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13.5" r="3.6" /></svg>
);
export const Upload = (p: P) => (
  <svg {...base} {...p}><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v4h14v-4" /></svg>
);
export const Box = (p: P) => (
  <svg {...base} {...p}><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" /><rect x="8" y="8" width="8" height="8" rx="1" /></svg>
);
export const Scale = (p: P) => (
  <svg {...base} {...p}><path d="M5 20h14M12 4v16M6 8h12M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z" /></svg>
);
export const Bowl = (p: P) => (
  <svg {...base} {...p}><path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-1.5 1-2 1-3M12 7c0-1.5 1-2 1-3M16 7c0-1.5 1-2 1-3" /></svg>
);
export const People = (p: P) => (
  <svg {...base} {...p}><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M2.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 7.5-1.8" /></svg>
);
export const Timer = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9.5 2.5h5" /></svg>
);
export const Pulse = (p: P) => (
  <svg {...base} {...p}><path d="M2 12h4l2.5-6 4 12 2.5-6H22" /></svg>
);
export const Arrow = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Back = (p: P) => (
  <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const X = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Plus = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
);
export const Sun = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></svg>
);
export const Hand = (p: P) => (
  <svg {...base} {...p}><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L3.5 14.8a1.5 1.5 0 0 1 2.2-2L8 15" /></svg>
);
export const Shelf = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M4 9h16M4 15h16" /></svg>
);
export const Lock = (p: P) => (
  <svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const Shield = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>
);
export const Leaf = (p: P) => (
  <svg {...base} {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l6-6" /></svg>
);
export const Play = (p: P) => (
  <svg {...base} {...p}><path d="M7 5v14l11-7z" /></svg>
);
export const Pause = (p: P) => (
  <svg {...base} {...p}><path d="M8 5v14M16 5v14" /></svg>
);
export const Reset = (p: P) => (
  <svg {...base} {...p}><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Flip = (p: P) => (
  <svg {...base} {...p}><path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M20 4v4h-4M4 20v-4h4" /></svg>
);
