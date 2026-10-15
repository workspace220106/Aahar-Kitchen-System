import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NextStep, Page, PageHeader, ease } from '../components/Page';
import { FridgeArt } from '../components/FridgeArt';
import { Box, Camera, Check, Reset, X } from '../components/Icons';
import { DEMO_ITEMS } from '../lib/data';
import { useKitchen } from '../lib/store';

type Phase = 'ready' | 'scanning' | 'done';

export default function Detect() {
  const { shots, setItems, setDetected, detected } = useKitchen();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>(detected ? 'done' : 'ready');
  const [kept, setKept] = useState<Record<string, boolean>>(() => Object.fromEntries(DEMO_ITEMS.map((i) => [i.id, true])));
  const [hover, setHover] = useState<string | null>(null);

  const shot = shots[active];

  useEffect(() => {
    if (phase !== 'scanning') return;
    const t = window.setTimeout(() => {
      setPhase('done');
      setDetected(true);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [phase, setDetected]);

  const confirm = () => {
    setItems(DEMO_ITEMS.filter((i) => kept[i.id]));
    navigate('/pantry');
  };

  const keptCount = Object.values(kept).filter(Boolean).length;

  return (
    <Page>
      <PageHeader
        step="02"
        kicker="Ingredient detection"
        icon={<Box />}
        title="Every item, named and boxed."
        lead="A detector finds each ingredient and a second model names it. Each box carries a confidence score, and anything it got wrong you can switch off before it reaches your pantry."
      >
        <span className="chip border-ink/15 bg-surface text-muted">YOLOv8 + CLIP</span>
      </PageHeader>

      <div className="grid lg:grid-cols-[1.45fr_1fr] gap-6">
        <section className="card p-3 md:p-4">
          <div className="relative rounded-2xl overflow-hidden bg-surface">
            {shot ? (
              <img src={shot.src} alt="Your fridge shot" className="w-full aspect-[4/3] object-cover block" />
            ) : (
              <div className="aspect-[4/3] grid place-items-center"><FridgeArt animate={false} /></div>
            )}

            {/* Scan sweep */}
            <AnimatePresence>
              {phase === 'scanning' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-ink/20" />
                  <motion.div
                    className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent to-turmeric/40 border-b-2 border-turmeric"
                    initial={{ top: '-25%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 0.9, repeat: 1, ease: 'linear' }}
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 chip border-0 bg-ink text-bg !px-4 !py-2">
                    Looking for ingredients…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boxes */}
            {phase === 'done' &&
              DEMO_ITEMS.map((it, i) => {
                const [x, y, w, h] = it.box;
                const on = kept[it.id];
                const dim = hover && hover !== it.id;
                return (
                  <motion.button
                    key={it.id}
                    onMouseEnter={() => setHover(it.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(it.id)}
                    onBlur={() => setHover(null)}
                    onClick={() => setKept((k) => ({ ...k, [it.id]: !k[it.id] }))}
                    aria-label={`${it.name}, ${it.conf}% confidence. ${on ? 'Kept' : 'Removed'}. Click to toggle.`}
                    className="absolute rounded-lg text-left"
                    style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                    transition={{ delay: hover ? 0 : i * 0.12, duration: 0.45, ease }}
                  >
                    <span
                      className={`absolute inset-0 rounded-lg border-[2.5px] transition-colors ${on ? 'border-turmeric bg-turmeric/10' : 'border-dashed border-ink/40 bg-ink/10'}`}
                    />
                    <span
                      className={`absolute -top-3 left-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.72rem] font-semibold shadow-sm ${on ? 'bg-turmeric text-ink' : 'bg-ink/60 text-bg line-through'}`}
                    >
                      {it.name} {it.conf}%
                    </span>
                  </motion.button>
                );
              })}
          </div>

          {shots.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {shots.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  aria-label={`Show shot ${i + 1}`}
                  className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === active ? 'border-leaf' : 'border-transparent opacity-70'}`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <p className="text-[0.85rem] text-muted max-w-md">
              {shot ? 'Prototype preview: the boxes come from a demo result, not live inference on your photo.' : 'No shots yet — showing a sample shelf.'}{' '}
              {!shot && <Link to="/scan" className="text-leaf underline underline-offset-2">Take a photo</Link>}
            </p>
            {phase === 'done' ? (
              <button className="btn-ghost" onClick={() => setPhase('scanning')}><Reset width={18} /> Run again</button>
            ) : (
              <button className="btn-accent" disabled={phase === 'scanning'} onClick={() => setPhase('scanning')}>
                <Box width={18} /> {phase === 'scanning' ? 'Detecting…' : 'Run detection'}
              </button>
            )}
          </div>
        </section>

        <aside className="card p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Found</h2>
            {phase === 'done' && <span className="text-[0.85rem] text-muted">{keptCount} of {DEMO_ITEMS.length} kept</span>}
          </div>

          {phase !== 'done' ? (
            <div className="flex-1 grid place-items-center text-center py-10">
              <div>
                <span className="mx-auto w-14 h-14 rounded-2xl bg-surface text-muted grid place-items-center"><Camera /></span>
                <p className="mt-3 text-muted text-[0.92rem]">{phase === 'scanning' ? 'Reading the shelf…' : 'Run detection to see what is in the shot.'}</p>
              </div>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {DEMO_ITEMS.map((it, i) => {
                const on = kept[it.id];
                return (
                  <motion.li
                    key={it.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease }}
                    onMouseEnter={() => setHover(it.id)}
                    onMouseLeave={() => setHover(null)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors ${hover === it.id ? 'border-turmeric bg-turmeric/5' : 'border-ink/10'} ${on ? '' : 'opacity-50'}`}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0 border border-ink/15" style={{ background: it.color }} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${on ? '' : 'line-through'}`}>{it.name}</p>
                      <div className="mt-1 h-1 rounded-full bg-ink/10 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${it.conf >= 90 ? 'bg-leaf' : 'bg-turmeric'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${it.conf}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease }}
                        />
                      </div>
                    </div>
                    <span className="text-[0.85rem] tabular-nums text-muted w-10 text-right">{it.conf}%</span>
                    <button
                      onClick={() => setKept((k) => ({ ...k, [it.id]: !k[it.id] }))}
                      aria-label={on ? `Remove ${it.name}` : `Keep ${it.name}`}
                      className={`w-8 h-8 rounded-full grid place-items-center border transition-colors ${on ? 'border-ink/15 hover:border-chilli hover:text-chilli' : 'border-leaf text-leaf'}`}
                    >
                      {on ? <X width={14} /> : <Check width={14} />}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          )}

          <button className="btn-primary w-full mt-auto pt-0 !mt-6" disabled={phase !== 'done' || keptCount === 0} onClick={confirm}>
            <Check /> Add {keptCount} to pantry
          </button>
        </aside>
      </div>

      <NextStep to="/pantry" label="Pantry & quantities" hint="See how much you have and what it can become." />
    </Page>
  );
}
