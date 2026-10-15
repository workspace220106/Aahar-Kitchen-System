import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NextStep, Page, PageHeader, Reveal, ease } from '../components/Page';
import { Minus, Plus, Scale } from '../components/Icons';
import { RECIPES } from '../lib/data';
import { useKitchen } from '../lib/store';

function fmt(qty: number, unit: string) {
  if (unit === 'pcs') return `× ${qty}`;
  if (unit === 'L') return `${qty.toFixed(2).replace(/\.?0+$/, '')} L`;
  return `~ ${qty} g`;
}

const NUTRIENTS: Record<string, string[]> = {
  Protein: ['paneer', 'milk'],
  Iron: ['spinach'],
  'Vitamin C': ['tomato', 'chilli'],
  Calcium: ['paneer', 'milk'],
};

export default function Pantry() {
  const { items, setItems } = useKitchen();
  const [hover, setHover] = useState<string | null>(null);

  const bump = (id: string, dir: 1 | -1) =>
    setItems(items.map((i) => (i.id === id ? { ...i, qty: Math.max(0, +(i.qty + dir * i.step).toFixed(2)) } : i)));

  // Graph layout: ingredients left, dishes middle, nutrients right.
  const graph = useMemo(() => {
    const ids = items.map((i) => i.id);
    const dishes = RECIPES.filter((r) => r.uses.some((u) => ids.includes(u)));
    const nutrients = Object.keys(NUTRIENTS).filter((n) => NUTRIENTS[n].some((u) => ids.includes(u)));
    const H = 360;
    const y = (i: number, n: number) => (H / (n + 1)) * (i + 1);
    const ing = items.map((it, i) => ({ id: it.id, label: it.name, x: 90, y: y(i, items.length), color: it.color }));
    const dsh = dishes.map((d, i) => ({ id: d.id, label: d.name, x: 330, y: y(i, dishes.length), color: d.color }));
    const nut = nutrients.map((n, i) => ({ id: n, label: n, x: 560, y: y(i, nutrients.length), color: '#3F6B3A' }));
    const edges: { a: string; b: string; ax: number; ay: number; bx: number; by: number }[] = [];
    for (const d of dsh) {
      const r = RECIPES.find((x) => x.id === d.id)!;
      for (const u of r.uses) {
        const s = ing.find((n) => n.id === u);
        if (s) edges.push({ a: s.id, b: d.id, ax: s.x, ay: s.y, bx: d.x, by: d.y });
      }
    }
    for (const n of nut) {
      for (const u of NUTRIENTS[n.id]) {
        const s = ing.find((x) => x.id === u);
        if (s) edges.push({ a: s.id, b: n.id, ax: s.x, ay: s.y, bx: n.x, by: n.y });
      }
    }
    return { ing, dsh, nut, edges, H };
  }, [items]);

  const linked = useMemo(() => {
    if (!hover) return null;
    const s = new Set([hover]);
    graph.edges.forEach((e) => {
      if (e.a === hover) s.add(e.b);
      if (e.b === hover) s.add(e.a);
    });
    return s;
  }, [hover, graph.edges]);

  const node = (n: { id: string; label: string; x: number; y: number; color: string }, kind: 'ing' | 'dish' | 'nut', i: number) => {
    const lit = !linked || linked.has(n.id);
    const w = kind === 'dish' ? 132 : 108;
    return (
      <motion.g
        key={n.id}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: lit ? 1 : 0.25, scale: 1 }}
        transition={{ delay: hover ? 0 : 0.2 + i * 0.06, duration: 0.4, ease }}
        style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: 'pointer' }}
        onMouseEnter={() => setHover(n.id)}
        onMouseLeave={() => setHover(null)}
        tabIndex={0}
        onFocus={() => setHover(n.id)}
        onBlur={() => setHover(null)}
        role="button"
        aria-label={n.label}
      >
        <rect
          x={n.x - w / 2}
          y={n.y - 17}
          width={w}
          height={34}
          rx={17}
          fill={kind === 'dish' ? '#2B2420' : '#FFFFFF'}
          stroke={hover === n.id ? '#E0A21B' : kind === 'dish' ? '#2B2420' : 'rgba(43,36,32,0.15)'}
          strokeWidth={hover === n.id ? 2.5 : 1.2}
        />
        {kind !== 'dish' && <circle cx={n.x - w / 2 + 16} cy={n.y} r={6} fill={n.color} stroke="rgba(43,36,32,0.15)" />}
        <text
          x={kind === 'dish' ? n.x : n.x + 8}
          y={n.y + 4.5}
          textAnchor="middle"
          fontSize="13"
          fontFamily="Figtree"
          fontWeight={600}
          fill={kind === 'dish' ? '#FBF6EC' : '#2B2420'}
        >
          {n.label}
        </text>
      </motion.g>
    );
  };

  return (
    <Page>
      <PageHeader
        step="03"
        kicker="Pantry & quantities"
        icon={<Scale />}
        title="How much you have, and what it can become."
        lead="Quantities are estimated from the size of each item in the photo. They're approximate, so nudge any of them. Every ingredient is linked to the dishes it can make and what it gives you."
      />

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Your pantry</h2>
            <span className="chip border-turmeric/40 bg-turmeric/10 text-ink !text-[0.72rem]">Approximate</span>
          </div>
          {items.length === 0 ? (
            <p className="mt-4 text-muted">Nothing in the pantry yet. Run a detection first.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {items.map((it, i) => (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease }}
                  onMouseEnter={() => setHover(it.id)}
                  onMouseLeave={() => setHover(null)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 border transition-colors ${hover === it.id ? 'border-turmeric bg-turmeric/5' : 'border-ink/10 bg-white/60'}`}
                >
                  <span className="w-3 h-3 rounded-full border border-ink/15" style={{ background: it.color }} />
                  <span className="flex-1 font-medium">{it.name}</span>
                  <button onClick={() => bump(it.id, -1)} aria-label={`Less ${it.name}`} className="w-8 h-8 rounded-full border border-ink/15 grid place-items-center hover:bg-surface">
                    <Minus width={14} />
                  </button>
                  <motion.span key={it.qty} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-[74px] text-center tabular-nums text-[0.95rem]">
                    {fmt(it.qty, it.unit)}
                  </motion.span>
                  <button onClick={() => bump(it.id, 1)} aria-label={`More ${it.name}`} className="w-8 h-8 rounded-full border border-ink/15 grid place-items-center hover:bg-surface">
                    <Plus width={14} />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[0.82rem] text-muted">Approximate. You can correct it.</p>
        </section>

        <section className="card p-4 md:p-5 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl">Pantry graph</h2>
            <div className="flex gap-3 text-[0.78rem] text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-white border border-ink/20" /> Ingredient</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-ink" /> Dish</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-leaf" /> Nutrient</span>
            </div>
          </div>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox={`0 0 650 ${graph.H}`} className="min-w-[560px] w-full h-auto" role="img" aria-label="Graph linking ingredients to dishes and nutrients">
              {graph.edges.map((e, i) => {
                const lit = !hover || e.a === hover || e.b === hover;
                const mx = (e.ax + e.bx) / 2;
                return (
                  <motion.path
                    key={`${e.a}-${e.b}`}
                    d={`M${e.ax + 54} ${e.ay} C ${mx} ${e.ay}, ${mx} ${e.by}, ${e.bx - 66} ${e.by}`}
                    fill="none"
                    stroke={lit && hover ? '#E0A21B' : '#2B2420'}
                    strokeOpacity={lit ? (hover ? 0.9 : 0.18) : 0.05}
                    strokeWidth={lit && hover ? 2 : 1.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4 + i * 0.03, duration: 0.7, ease }}
                  />
                );
              })}
              {graph.ing.map((n, i) => node(n, 'ing', i))}
              {graph.dsh.map((n, i) => node(n, 'dish', i + graph.ing.length))}
              {graph.nut.map((n, i) => node(n, 'nut', i + graph.ing.length + graph.dsh.length))}
            </svg>
          </div>
          <p className="mt-2 text-[0.82rem] text-muted">Hover any ingredient, dish or nutrient to trace what it connects to.</p>
        </section>
      </div>

      <Reveal className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          ['Substitutes', 'Out of paneer? Tofu fills the same slot in Palak Paneer and Bhurji.'],
          ['Use first', 'Spinach wilts first. It is weighted higher in tonight\'s suggestions.'],
          ['Stored as a graph', 'Ingredients, dishes and nutrients live in Neo4j, so new links cost nothing.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-surface p-5">
            <p className="font-display text-lg">{t}</p>
            <p className="mt-1 text-[0.9rem] text-muted">{d}</p>
          </div>
        ))}
      </Reveal>

      <NextStep to="/recipes" label="Meal recommendations" hint="Dishes ranked for what you have tonight." />
    </Page>
  );
}
