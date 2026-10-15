import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Page, PageHeader, Reveal, ease } from '../components/Page';
import { Camera, Leaf, Lock, Shield } from '../components/Icons';
import { TEAM } from '../lib/data';

const PIPELINE = ['Photo', 'FastAPI', 'Vision', 'Pantry graph', 'Recommender', 'Family plate', 'Flutter app', 'Cook-along'];
const STACK = ['Flutter', 'FastAPI', 'PostgreSQL', 'Neo4j', 'PyTorch', 'YOLOv8', 'CLIP', 'OpenCV', 'scikit-learn', 'XGBoost', 'SHAP'];
const FUTURE = ['CGM integration', 'Reinforcement learning'];

export default function About() {
  return (
    <Page>
      <PageHeader
        kicker="Under the hood"
        title="A straight line from photo to plate."
        lead="A Flutter app talks to a FastAPI backend. Vision models read the photo, a graph database holds the pantry, and a ranking model picks the meals."
      />

      <section className="card p-6 md:p-8 overflow-x-auto">
        <ol className="flex items-center min-w-[760px]">
          {PIPELINE.map((p, i) => (
            <li key={p} className="flex items-center flex-1 last:flex-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease }}
                className="flex flex-col items-center text-center w-[84px]"
              >
                <motion.span
                  initial={{ backgroundColor: '#F3EADB' }}
                  whileInView={{ backgroundColor: i === 0 ? '#3F6B3A' : '#E0A21B' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                  className="w-11 h-11 rounded-full grid place-items-center text-[0.85rem] font-bold text-ink border border-ink/10"
                >
                  {i === 0 ? <Camera width={18} className="text-bg" /> : i}
                </motion.span>
                <span className="mt-2 text-[0.8rem] font-medium leading-tight">{p}</span>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <motion.span
                  className="h-[2px] flex-1 bg-ink/15 origin-left -mt-6"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <Reveal className="mt-8">
        <p className="kicker">Stack</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {STACK.map((s) => <li key={s} className="chip border-ink/15 bg-white !py-1.5 !px-3.5">{s}</li>)}
          {FUTURE.map((s) => <li key={s} className="chip border-dashed border-ink/30 text-muted !py-1.5 !px-3.5">{s} · planned</li>)}
        </ul>
      </Reveal>

      <section className="mt-14">
        <Reveal>
          <p className="kicker">Trust and privacy</p>
          <h2 className="h-display text-[clamp(1.7rem,3.5vw,2.4rem)] mt-2">Your kitchen data stays yours.</h2>
        </Reveal>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            [Lock, 'Secure login', 'JWT sessions, passwords hashed with bcrypt.'],
            [Shield, 'Encrypted in transit', 'Every request over HTTPS.'],
            [Leaf, 'Your health data', 'Stored for you. Not sold, not shared.'],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof Lock;
            return (
              <Reveal key={t as string} i={i} className="card p-6">
                <span className="w-11 h-11 rounded-xl bg-leaf text-bg grid place-items-center"><I /></span>
                <p className="font-display text-lg mt-4">{t as string}</p>
                <p className="mt-1 text-[0.92rem] text-muted">{d as string}</p>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-4 text-[0.85rem] text-muted">Guidance, not medical advice.</p>
      </section>

      <Reveal className="mt-14 rounded-3xl bg-ink text-bg p-8 md:p-12 grid md:grid-cols-[1.3fr_1fr] gap-8">
        <div>
          <p className="text-[0.75rem] uppercase tracking-[0.18em] text-turmeric font-semibold">{TEAM.group} · {TEAM.year}</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] mt-3">Thank you. Questions welcome.</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/scan" className="btn-accent">Try the scan</Link>
            <a href="#" className="btn !border !border-bg/30 text-bg hover:bg-bg/10">Literature survey</a>
          </div>
        </div>
        <div className="text-bg/80">
          <p className="text-bg/50 text-[0.8rem] uppercase tracking-wider">Team</p>
          <ul className="mt-2 space-y-1 text-[1.05rem]">
            {TEAM.members.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <p className="text-bg/50 text-[0.8rem] uppercase tracking-wider mt-5">Guide</p>
          <p className="mt-1 text-[1.05rem]">{TEAM.guide}</p>
        </div>
      </Reveal>
    </Page>
  );
}
