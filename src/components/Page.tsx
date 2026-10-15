import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Arrow } from './Icons';

export const ease = [0.22, 1, 0.36, 1] as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.07 } }),
};

export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      className="mx-auto max-w-6xl px-5"
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({
  step,
  kicker,
  title,
  lead,
  icon,
  children,
}: {
  step?: string;
  kicker: string;
  title: string;
  lead: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pt-12 md:pt-16 pb-8 md:pb-10 grid md:grid-cols-[1fr_auto] gap-6 items-end">
      <div>
        <motion.div variants={rise} initial="hidden" animate="show" custom={0} className="flex items-center gap-3">
          {icon && <span className="w-10 h-10 rounded-xl bg-surface text-leaf grid place-items-center">{icon}</span>}
          <span className="kicker">{step ? `${step} · ` : ''}{kicker}</span>
        </motion.div>
        <motion.h1 variants={rise} initial="hidden" animate="show" custom={1} className="h-display text-[clamp(2rem,5vw,3.4rem)] mt-4 max-w-[18ch]">
          {title}
        </motion.h1>
        <motion.p variants={rise} initial="hidden" animate="show" custom={2} className="mt-4 text-[1.05rem] text-muted max-w-copy">
          {lead}
        </motion.p>
      </div>
      {children && (
        <motion.div variants={rise} initial="hidden" animate="show" custom={3}>
          {children}
        </motion.div>
      )}
    </header>
  );
}

export function NextStep({ to, label, hint }: { to: string; label: string; hint: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease }}
      className="mt-16"
    >
      <Link
        to={to}
        className="group flex items-center justify-between gap-6 rounded-2xl bg-ink text-bg px-6 md:px-8 py-6 hover:bg-[#3a302a] transition-colors"
      >
        <div>
          <p className="text-[0.75rem] uppercase tracking-[0.18em] text-turmeric font-semibold">Next</p>
          <p className="font-display text-[1.5rem] md:text-[1.8rem] mt-1">{label}</p>
          <p className="text-bg/60 text-[0.9rem] mt-1">{hint}</p>
        </div>
        <span className="w-12 h-12 rounded-full bg-turmeric text-ink grid place-items-center shrink-0 transition-transform duration-300 group-hover:translate-x-1">
          <Arrow />
        </span>
      </Link>
    </motion.div>
  );
}

export function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease, delay: i * 0.07 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
