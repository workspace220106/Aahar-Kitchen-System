import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from './Icons';
import { TEAM } from '../lib/data';

const LINKS = [
  { to: '/scan', label: 'Scan' },
  { to: '/detect', label: 'Detect' },
  { to: '/pantry', label: 'Pantry' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/family', label: 'Family' },
  { to: '/cook', label: 'Cook' },
  { to: '/health', label: 'Health' },
  { to: '/about', label: 'About' },
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-40 bg-bg/90 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_rgba(43,36,32,0.08)]' : ''}`}
      >
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="AHAAR home">
            <span className="w-8 h-8 rounded-lg bg-leaf grid place-items-center">
              <span className="w-3.5 h-4 rounded-[3px] border-[1.6px] border-bg relative">
                <span className="absolute left-0 right-0 top-[5px] h-[1.6px] bg-bg" />
              </span>
            </span>
            <span className="font-display text-[1.35rem] font-semibold tracking-[0.06em]">AHAAR</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-full text-[0.9rem] transition-colors duration-300 ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-surface"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/scan" className="btn-primary hidden sm:inline-flex !min-h-[40px] !px-4 text-[0.88rem]">
              Scan fridge
            </Link>
            <button
              className="lg:hidden w-11 h-11 grid place-items-center rounded-full hover:bg-surface"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-ink/10 bg-bg"
            >
              <ul className="px-5 py-3 grid grid-cols-2 gap-1">
                {LINKS.map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-[0.95rem] ${isActive ? 'bg-surface text-ink font-medium' : 'text-muted'}`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink/10 mt-20">
        <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr] text-[0.9rem]">
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.06em]">AHAAR</p>
            <p className="mt-2 text-muted max-w-sm">Open the fridge. Know what's for dinner.</p>
            <p className="mt-4 text-[0.8rem] text-muted">Guidance, not medical advice.</p>
          </div>
          <div>
            <p className="kicker mb-2">{TEAM.group}</p>
            <ul className="text-muted">
              {TEAM.members.map((m) => <li key={m}>{m}</li>)}
            </ul>
            <p className="mt-3 text-muted">Guide: {TEAM.guide}</p>
            <p className="text-muted">{TEAM.year}</p>
          </div>
          <div>
            <p className="kicker mb-2">Features</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted hover:text-ink transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
