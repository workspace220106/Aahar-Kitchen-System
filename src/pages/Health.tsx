import { useState } from 'react';
import { motion } from 'framer-motion';
import { NextStep, Page, PageHeader, Reveal, ease } from '../components/Page';
import { Pulse } from '../components/Icons';

const MEALS = {
  'White rice + dal': {
    path: 'M10 150 C 60 150, 80 40, 130 45 S 200 120, 250 135 S 330 150, 390 148',
    peak: 168,
    note: 'Sharp rise, slow return.',
  },
  'Brown rice + dal + sabzi': {
    path: 'M10 150 C 60 150, 90 95, 140 92 S 220 130, 270 140 S 340 150, 390 150',
    peak: 138,
    note: 'Fibre from sabzi flattens the curve.',
  },
  'Palak paneer + 1 roti': {
    path: 'M10 150 C 60 150, 100 115, 150 112 S 230 140, 280 146 S 340 150, 390 150',
    peak: 124,
    note: 'Protein and fat slow absorption.',
  },
} as const;

type Meal = keyof typeof MEALS;

export default function Health() {
  const [meal, setMeal] = useState<Meal>('White rice + dal');
  const m = MEALS[meal];

  return (
    <Page>
      <PageHeader
        step="07"
        kicker="Metabolic insights"
        icon={<Pulse />}
        title="Portions that know how you respond."
        lead="Planned: pair AHAAR with a continuous glucose monitor. Over time it learns which meals spike your sugar and nudges portions and pairings for you."
      >
        <span className="chip border-turmeric/50 bg-turmeric/15 text-ink !py-2 !px-4 font-semibold">
          Coming soon
        </span>
      </PageHeader>

      <section className="card p-5 md:p-8">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MEALS) as Meal[]).map((k) => (
            <button
              key={k}
              onClick={() => setMeal(k)}
              className={`chip !py-2 !px-4 transition-colors ${
                k === meal ? 'bg-ink text-bg border-ink' : 'border-ink/15 hover:border-ink/40'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-[1fr_220px] gap-6 items-center">
          <svg
            viewBox="0 0 400 180"
            className="w-full h-auto"
            role="img"
            aria-label={`Illustrative glucose curve for ${meal}`}
          >
            <rect x="10" y="70" width="380" height="60" fill="#3F6B3A" opacity="0.07" />
            <text x="16" y="84" fontSize="10" fill="#3F6B3A" fontFamily="Figtree">
              Target range
            </text>
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="10" x2="390" y1={y} y2={y} stroke="#2B2420" strokeOpacity="0.06" />
            ))}
            {['0', '30', '60', '90', '120 min'].map((t, i) => (
              <text key={t} x={10 + i * 95} y="176" fontSize="10" fill="#6F6152" fontFamily="Figtree">
                {t}
              </text>
            ))}
            <motion.path
              key={meal}
              d={m.path}
              fill="none"
              stroke="#C8693E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease }}
            />
          </svg>
          <motion.div
            key={meal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-[0.8rem] text-muted">Peak (illustrative)</p>
            <p className="font-display text-[2.6rem] leading-none mt-1">
              {m.peak}
              <span className="text-base text-muted ml-1">mg/dL</span>
            </p>
            <p className="mt-3 text-[0.95rem]">{m.note}</p>
          </motion.div>
        </div>
        <p className="mt-4 text-[0.8rem] text-muted">Curves are illustrative, not measured data.</p>
      </section>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {[
          ['Connect a CGM', 'Read glucose from a sensor you already wear.'],
          ['Learn your response', 'Match each cooked meal to the curve that followed it.'],
          ['Adjust gently', 'Smaller rice, more sabzi — small swaps, not diets.'],
        ].map(([t, d], i) => (
          <Reveal key={t} i={i} className="rounded-2xl bg-surface p-5">
            <span className="text-[0.78rem] font-semibold text-clay">0{i + 1}</span>
            <p className="font-display text-lg mt-1">{t}</p>
            <p className="mt-1 text-[0.92rem] text-muted">{d}</p>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-[0.85rem] text-muted">
        Guidance, not medical advice. Talk to your doctor before changing a diet for a medical condition.
      </p>

      <NextStep to="/family" label="Family portions" hint="Calibrate portions for everyone at the table." />
    </Page>
  );
}
