import { motion } from 'framer-motion';
import { ease } from './Page';

// Flat 2D illustration of an open fridge with ingredients; doubles as the demo "photo".
export function FridgeArt({ animate = true, scanning = false }: { animate?: boolean; scanning?: boolean }) {
  const pop = (i: number) =>
    animate
      ? { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.5 + i * 0.09, duration: 0.5, ease } }
      : {};

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto block" role="img" aria-label="Open fridge with tomatoes, paneer, milk, spinach, onions and green chillies">
      <rect width="400" height="300" fill="#F3EADB" />
      <rect x="20" y="16" width="360" height="268" rx="14" fill="#FFFDF8" stroke="#D9CBB2" strokeWidth="2" />
      <rect x="20" y="16" width="360" height="268" rx="14" fill="url(#glow)" />
      <defs>
        <radialGradient id="glow" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#FFE9B8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE9B8" stopOpacity="0" />
        </radialGradient>
        <clipPath id="frame"><rect x="20" y="16" width="360" height="268" rx="14" /></clipPath>
      </defs>
      <rect x="20" y="148" width="360" height="5" fill="#E2D5BE" />

      {/* Top shelf */}
      <motion.g {...pop(0)} style={{ transformOrigin: '80px 120px' }}>
        <circle cx="62" cy="112" r="24" fill="#C8432A" />
        <circle cx="104" cy="116" r="21" fill="#D24F33" />
        <path d="M56 90q6-6 12 0M98 96q6-6 12 0" stroke="#3F6B3A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="54" cy="104" r="5" fill="#fff" opacity="0.25" />
      </motion.g>
      <motion.g {...pop(1)} style={{ transformOrigin: '200px 120px' }}>
        <rect x="160" y="96" width="92" height="46" rx="6" fill="#EFE6D2" stroke="#D3C6AA" strokeWidth="2" />
        <rect x="168" y="104" width="20" height="14" rx="2" fill="#F8F2E4" />
      </motion.g>
      <motion.g {...pop(2)} style={{ transformOrigin: '320px 100px' }}>
        <path d="M288 50h56l6 14v80h-68V64z" fill="#FBFAF5" stroke="#CFC6B6" strokeWidth="2" />
        <rect x="282" y="86" width="68" height="28" fill="#4E7BA6" opacity="0.85" />
        <text x="316" y="105" textAnchor="middle" fontSize="13" fontFamily="Figtree" fontWeight="700" fill="#fff">MILK</text>
      </motion.g>

      {/* Bottom shelf */}
      <motion.g {...pop(3)} style={{ transformOrigin: '90px 240px' }}>
        <ellipse cx="92" cy="246" rx="62" ry="26" fill="#3F6B3A" />
        <ellipse cx="70" cy="236" rx="26" ry="16" fill="#4F8040" />
        <ellipse cx="112" cy="234" rx="24" ry="14" fill="#5A8D48" />
        <path d="M70 236l10-6M112 234l-8-6" stroke="#2F5229" strokeWidth="2" />
      </motion.g>
      <motion.g {...pop(4)} style={{ transformOrigin: '210px 240px' }}>
        <ellipse cx="190" cy="246" rx="26" ry="24" fill="#B9674A" />
        <ellipse cx="236" cy="250" rx="22" ry="20" fill="#C77655" />
        <path d="M190 222q2-8 0-12M236 230q2-8 0-12" stroke="#8E4E35" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      <motion.g {...pop(5)} style={{ transformOrigin: '320px 248px' }}>
        <path d="M286 254q30-22 66-14" stroke="#5C8A3A" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M290 266q30-18 62-10" stroke="#4E7B31" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M296 240q28-20 56-14" stroke="#6A9A44" strokeWidth="8" fill="none" strokeLinecap="round" />
      </motion.g>

      {scanning && (
        <g clipPath="url(#frame)">
          <motion.rect
            x="20"
            width="360"
            height="46"
            fill="url(#scan)"
            initial={{ y: -40 }}
            animate={{ y: 290 }}
            transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
          />
          <defs>
            <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E0A21B" stopOpacity="0" />
              <stop offset="100%" stopColor="#E0A21B" stopOpacity="0.45" />
            </linearGradient>
          </defs>
        </g>
      )}
    </svg>
  );
}
