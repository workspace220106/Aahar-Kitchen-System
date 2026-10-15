import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NextStep, Page, PageHeader, ease } from '../components/Page';
import { People, Plus, X } from '../components/Icons';

type Activity = 'Light' | 'Moderate' | 'Active';
type Member = { id: number; name: string; age: number; activity: Activity };

const FOODS = [
  { key: 'roti', label: 'Roti', unit: 'pcs', base: 3, color: '#D9A86C' },
  { key: 'rice', label: 'Rice', unit: 'g', base: 150, color: '#F1EADA' },
  { key: 'dal', label: 'Dal', unit: 'ml', base: 200, color: '#E0A21B' },
  { key: 'sabzi', label: 'Sabzi', unit: 'g', base: 150, color: '#3F6B3A' },
] as const;

const ACT: Record<Activity, number> = { Light: 0.88, Moderate: 1, Active: 1.15 };

function factor(m: Member) {
  const ageF = m.age < 6 ? 0.45 : m.age < 12 ? 0.65 : m.age < 18 ? 0.95 : m.age < 60 ? 1 : 0.85;
  return ageF * ACT[m.activity];
}

const START: Member[] = [
  { id: 1, name: 'Papa', age: 52, activity: 'Active' },
  { id: 2, name: 'Mummy', age: 48, activity: 'Moderate' },
  { id: 3, name: 'Aarav', age: 15, activity: 'Active' },
  { id: 4, name: 'Dadi', age: 74, activity: 'Light' },
];

export default function Family() {
  const [members, setMembers] = useState<Member[]>(START);
  const [sel, setSel] = useState(1);

  const portions = useMemo(
    () =>
      members.map((m) => {
        const f = factor(m);
        return {
          m,
          f,
          food: FOODS.map((x) => ({ ...x, amount: x.unit === 'pcs' ? Math.max(1, Math.round(x.base * f)) : Math.round((x.base * f) / 10) * 10 })),
        };
      }),
    [members],
  );

  const update = (id: number, patch: Partial<Member>) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const add = () => {
    if (members.length >= 6) return;
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    setMembers([...members, { id, name: `Member ${id}`, age: 30, activity: 'Moderate' }]);
    setSel(id);
  };
  const remove = (id: number) => {
    if (members.length <= 1) return;
    const next = members.filter((m) => m.id !== id);
    setMembers(next);
    if (sel === id) setSel(next[0].id);
  };

  const cur = members.find((m) => m.id === sel) ?? members[0];
  const total = FOODS.map((x) => ({ ...x, sum: portions.reduce((s, p) => s + p.food.find((f) => f.key === x.key)!.amount, 0) }));

  return (
    <Page>
      <PageHeader
        step="05"
        kicker="Family portions"
        icon={<People />}
        title="One meal. Everyone's right portion."
        lead="Tell AHAAR who's eating. Portions of roti, rice, dal and sabzi adjust to each person's age and activity, and the totals tell you how much to cook."
      />

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
        {/* Members */}
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">At the table</h2>
            <button className="btn-ghost !min-h-[38px] !px-3 text-[0.85rem]" onClick={add} disabled={members.length >= 6}>
              <Plus width={16} /> Add
            </button>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {members.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setSel(m.id)}
                  className={`chip !py-2 !px-3.5 transition-colors ${m.id === cur.id ? 'bg-ink text-bg border-ink' : 'border-ink/15 hover:border-ink/40'}`}
                >
                  <span className="w-6 h-6 -ml-1 rounded-full bg-turmeric text-ink grid place-items-center text-[0.72rem] font-bold">{m.name[0]}</span>
                  {m.name}
                </button>
              </li>
            ))}
          </ul>

          <motion.div key={cur.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-[0.85rem] text-muted">Name</span>
              <input
                value={cur.name}
                onChange={(e) => update(cur.id, { name: e.target.value || ' ' })}
                className="mt-1 w-full h-11 px-4 rounded-xl border border-ink/15 bg-white focus:outline-none focus:border-leaf"
              />
            </label>
            <label className="block">
              <span className="flex justify-between text-[0.85rem]"><span className="text-muted">Age</span><span className="font-semibold tabular-nums">{cur.age}</span></span>
              <input
                type="range"
                min={2}
                max={90}
                value={cur.age}
                onChange={(e) => update(cur.id, { age: +e.target.value })}
                className="mt-2 w-full accent-leaf"
              />
            </label>
            <div>
              <span className="text-[0.85rem] text-muted">Activity</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(['Light', 'Moderate', 'Active'] as Activity[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => update(cur.id, { activity: a })}
                    className={`h-11 rounded-xl border text-[0.9rem] transition-colors ${cur.activity === a ? 'bg-leaf text-bg border-leaf' : 'border-ink/15 hover:bg-surface'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button className="text-[0.85rem] text-chilli flex items-center gap-1 disabled:opacity-30" onClick={() => remove(cur.id)} disabled={members.length <= 1}>
              <X width={14} /> Remove {cur.name}
            </button>
          </motion.div>
        </section>

        {/* Plates */}
        <section className="card p-5">
          <h2 className="font-display text-xl">Plates</h2>
          <ul className="mt-4 grid grid-cols-2 gap-4">
            {portions.map(({ m, f, food }) => (
              <li
                key={m.id}
                onClick={() => setSel(m.id)}
                className={`rounded-2xl p-3 cursor-pointer transition-colors ${m.id === cur.id ? 'bg-turmeric/10 ring-2 ring-turmeric' : 'bg-surface/60 hover:bg-surface'}`}
              >
                <Plate food={food} scale={f} />
                <p className="mt-2 text-center font-medium">{m.name}</p>
                <p className="text-center text-[0.78rem] text-muted">{m.age} y · {m.activity}</p>
                <ul className="mt-2 grid grid-cols-2 gap-x-2 text-[0.78rem]">
                  {food.map((x) => (
                    <li key={x.key} className="flex justify-between">
                      <span className="text-muted">{x.label}</span>
                      <motion.span key={x.amount} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tabular-nums">{x.amount}{x.unit === 'pcs' ? '' : ` ${x.unit}`}</motion.span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-ink text-bg p-6 md:p-8">
        <p className="text-[0.75rem] uppercase tracking-[0.18em] text-turmeric font-semibold">Cook this much</p>
        <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {total.map((t) => (
            <li key={t.key}>
              <p className="flex items-center gap-2 text-bg/70 text-[0.9rem]"><span className="w-3 h-3 rounded-full" style={{ background: t.color }} />{t.label}</p>
              <motion.p key={t.sum} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-[2rem] mt-1 tabular-nums">
                {t.sum}<span className="text-[1rem] text-bg/60 ml-1">{t.unit === 'pcs' ? 'roti' : t.unit}</span>
              </motion.p>
            </li>
          ))}
        </ul>
      </section>

      <NextStep to="/cook" label="Cook-along" hint="One step at a time, with a timer." />
    </Page>
  );
}

function Plate({ food, scale }: { food: { key: string; color: string }[]; scale: number }) {
  const s = Math.min(1.25, Math.max(0.45, scale));
  const spots = [
    [42, 42],
    [78, 42],
    [42, 78],
    [78, 78],
  ];
  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[150px] mx-auto block" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#D9CBB2" strokeWidth="2" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#EADCC4" strokeWidth="1.5" />
      {food.map((f, i) => (
        <motion.circle
          key={f.key}
          cx={spots[i][0]}
          cy={spots[i][1]}
          fill={f.color}
          stroke="rgba(43,36,32,0.12)"
          animate={{ r: 14 * s }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        />
      ))}
    </svg>
  );
}
