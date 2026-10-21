import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Page, Reveal, ease, rise } from '../components/Page';
import { FridgeArt } from '../components/FridgeArt';
import { FEATURES } from '../lib/data';
import { Arrow, Bowl, Box, Camera, People, Pulse, Scale, Timer } from '../components/Icons';

const ICONS = [Camera, Box, Scale, Bowl, People, Timer, Pulse];
const TINTS = ['bg-leaf text-bg', 'bg-turmeric text-ink', 'bg-clay text-bg', 'bg-leaf text-bg', 'bg-turmeric text-ink', 'bg-clay text-bg', 'bg-surface text-muted'];

export default function Home() {
  return (
    <Page>
      {/* Hero */}
      <section className="pt-10 md:pt-16 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <motion.span variants={rise} initial="hidden" animate="show" custom={0} className="chip border-leaf/30 text-leaf bg-leaf/5">
            <span className="w-1.5 h-1.5 rounded-full bg-leaf" /> Household food assistant for Indian kitchens
          </motion.span>
          <motion.h1 variants={rise} initial="hidden" animate="show" custom={1} className="h-display text-[clamp(2.5rem,6.4vw,4.6rem)] mt-5">
            Open the fridge.
            <br />
            <span className="text-leaf">Know what's for dinner.</span>
          </motion.h1>
          <motion.p variants={rise} initial="hidden" animate="show" custom={2} className="mt-5 text-[1.12rem] text-muted max-w-[46ch]">
            Photograph your fridge or pantry. AHAAR names the ingredients, estimates how much you have, suggests meals that fit your
            family, and walks you through cooking them.
          </motion.p>
          <motion.div variants={rise} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap gap-3">
            <Link to="/scan" className="btn-primary">
              <Camera /> Scan your fridge
            </Link>
            <a href="#features" className="btn-ghost">See every feature</a>
          </motion.div>
          <motion.dl variants={rise} initial="hidden" animate="show" custom={4} className="mt-10 grid grid-cols-3 max-w-md gap-4">
            {[
              ['6+', 'ingredients per shot'],
              ['4', 'family portions'],
              ['1', 'step on screen'],
            ].map(([n, l]) => (
              <div key={l} className="border-l-2 border-turmeric pl-3">
                <dt className="font-display text-2xl">{n}</dt>
                <dd className="text-[0.8rem] text-muted leading-snug">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden border border-ink/10 shadow-[0_30px_60px_-30px_rgba(43,36,32,0.35)]">
            <FridgeArt scanning />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6, ease }}
            className="absolute -left-3 md:-left-8 bottom-8 card !bg-white px-4 py-3 shadow-lg"
          >
            <p className="text-[0.72rem] uppercase tracking-wider text-muted">Detected</p>
            <p className="font-medium">Tomato × 4 · Paneer 250 g</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease }}
            className="absolute -right-2 md:-right-6 top-8 rounded-2xl bg-leaf text-bg px-4 py-3 shadow-lg"
          >
            <p className="text-[0.72rem] uppercase tracking-wider text-bg/70">Tonight</p>
            <p className="font-medium">Palak Paneer · 94% match</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="pt-24 md:pt-32 scroll-mt-20">
        <Reveal>
          <p className="kicker">How it works</p>
          <h2 className="h-display text-[clamp(1.9rem,4vw,2.9rem)] mt-3 max-w-[20ch]">Seven features. Each one gets its own page.</h2>
        </Reveal>

        <ol className="mt-10 grid md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[i];
            const soon = 'soon' in f && Boolean((f as { soon?: boolean }).soon);
            return (
              <Reveal key={f.to} i={i % 2} className={i === 0 ? 'md:col-span-2' : ''}>
                <Link
                  to={f.to}
                  className={`group h-full flex gap-5 rounded-2xl border border-ink/10 bg-white/60 p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(43,36,32,0.35)] ${i === 0 ? 'md:items-center md:p-9' : ''}`}
                >
                  <span className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${TINTS[i]}`}>
                    <Icon width={22} height={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[0.78rem] font-semibold text-muted">{f.n}</span>
                      {soon && <span className="chip border-ink/15 text-muted !py-0.5 !text-[0.7rem]">Coming soon</span>}
                    </div>
                    <h3 className={`font-display mt-1 ${i === 0 ? 'text-[1.9rem]' : 'text-[1.4rem]'}`}>{f.title}</h3>
                    <p className="mt-1.5 text-muted text-[0.95rem]">{f.line}</p>
                  </div>
                  <span className="self-center w-10 h-10 rounded-full border border-ink/15 grid place-items-center shrink-0 transition-all duration-300 group-hover:bg-turmeric group-hover:border-turmeric">
                    <Arrow width={18} height={18} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* Flow strip */}
      <section className="pt-24">
        <Reveal className="rounded-3xl bg-surface px-6 md:px-12 py-12 md:py-14">
          <p className="kicker">From photo to plate</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 text-[1rem] md:text-[1.15rem] font-display">
            {['Photo', 'Ingredients', 'Quantities', 'Meal ideas', 'Portions', 'Cooking'].map((s, i, a) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease }}
                className="flex items-center gap-3"
              >
                <span className="px-4 py-2 rounded-full bg-bg border border-ink/10">{s}</span>
                {i < a.length - 1 && <span className="text-turmeric">→</span>}
              </motion.span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/scan" className="btn-primary"><Camera /> Start with a scan</Link>
            <Link to="/health" className="btn-ghost">Metabolic insights</Link>
          </div>
        </Reveal>
      </section>
    </Page>
  );
}
