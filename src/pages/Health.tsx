import { useState } from 'react';
import { motion } from 'framer-motion';
import { NextStep, Page, PageHeader, ease } from '../components/Page';
import { Bowl, Check, Heart, Pulse, Stethoscope } from '../components/Icons';

type MemberProgress = {
  id: number;
  name: string;
  relation: string;
  initialDisease: string;
  currentDisease: string;
  initialBp: string;
  currentBp: string;
  bpDelta: string;
  initialHr: number;
  currentHr: number;
  hrDelta: number;
  initialScore: number;
  currentScore: number;
  scoreGain: string;
  keyWin: string;
  weeksData: number[];
};

const FAMILY_PROGRESS: MemberProgress[] = [
  {
    id: 1,
    name: 'Papa',
    relation: 'Head of Family',
    initialDisease: 'Stage 1 Hypertension',
    currentDisease: 'Normal & Controlled BP',
    initialBp: '148/92',
    currentBp: '124/80',
    bpDelta: '-24 / -12 mmHg',
    initialHr: 84,
    currentHr: 72,
    hrDelta: -12,
    initialScore: 58,
    currentScore: 90,
    scoreGain: '+55%',
    keyWin: 'Systolic BP dropped 24 points; high sodium spikes eliminated by potassium-rich palak & dal balance.',
    weeksData: [58, 64, 71, 79, 85, 90],
  },
  {
    id: 2,
    name: 'Mummy',
    relation: 'Mother',
    initialDisease: 'Pre-Diabetes & Chronic Fatigue',
    currentDisease: 'Reversed Pre-Diabetes / Normal HbA1c',
    initialBp: '134/86',
    currentBp: '118/76',
    bpDelta: '-16 / -10 mmHg',
    initialHr: 79,
    currentHr: 70,
    hrDelta: -9,
    initialScore: 64,
    currentScore: 93,
    scoreGain: '+45%',
    keyWin: 'Post-lunch drowsiness and sugar spikes eliminated by fiber-first 100g bowl portions.',
    weeksData: [64, 70, 78, 84, 89, 93],
  },
  {
    id: 3,
    name: 'Aarav',
    relation: 'Teen Son',
    initialDisease: 'Low Stamina & Recovery Lag',
    currentDisease: 'Peak Aerobic Stamina',
    initialBp: '118/74',
    currentBp: '112/70',
    bpDelta: '-6 / -4 mmHg',
    initialHr: 76,
    currentHr: 64,
    hrDelta: -12,
    initialScore: 76,
    currentScore: 96,
    scoreGain: '+26%',
    keyWin: 'Calibrated protein portions accelerated muscle recovery after daily football training.',
    weeksData: [76, 80, 85, 89, 93, 96],
  },
  {
    id: 4,
    name: 'Dadi',
    relation: 'Grandmother',
    initialDisease: 'Joint Inflammation & Fluctuating BP',
    currentDisease: 'Joint Mobility & BP Stabilized',
    initialBp: '152/90',
    currentBp: '128/82',
    bpDelta: '-24 / -8 mmHg',
    initialHr: 82,
    currentHr: 74,
    hrDelta: -8,
    initialScore: 50,
    currentScore: 86,
    scoreGain: '+72%',
    keyWin: 'Reduced water retention and swelling through gentle turmeric-infused 100ml cup portions.',
    weeksData: [50, 56, 64, 72, 80, 86],
  },
];

const TIMELINE = [
  {
    week: 'Week 1',
    score: 62,
    title: 'Adopting 100g Bowl Standard',
    desc: 'Switched from unmeasured heavy serving spoons to standardized 100g bowl portions. Immediate stop to post-dinner bloating.',
  },
  {
    week: 'Week 2',
    score: 69,
    title: 'Potassium & Sodium Balancing',
    desc: 'Leafy greens and dal minerals offset salt retention. Morning BP readings stabilized across Papa & Dadi.',
  },
  {
    week: 'Week 4',
    score: 78,
    title: 'Cardiovascular Recovery',
    desc: 'Resting heart rate dropped an average of 5 bpm across the household. Afternoon fatigue vanished.',
  },
  {
    week: 'Week 6',
    score: 86,
    title: 'Metabolic & Acid Reflux Relief',
    desc: 'Zero acid reflux complaints; glycemic response flattened without sharp post-meal insulin spikes.',
  },
  {
    week: 'Week 8',
    score: 91,
    title: 'Sustained Clinical Health Gain',
    desc: 'Routine medical checks confirmed normal BP for Papa, normalized HbA1c for Mummy, and high stamina for Aarav.',
  },
];

export default function Health() {
  const [selectedMemberId, setSelectedMemberId] = useState<number | 'all'>('all');
  const [activeWeek, setActiveWeek] = useState(4); // Week 8

  const displayedMembers =
    selectedMemberId === 'all'
      ? FAMILY_PROGRESS
      : FAMILY_PROGRESS.filter((m) => m.id === selectedMemberId);

  return (
    <Page>
      <PageHeader
        step="07"
        kicker="Family Health Growth"
        icon={<Pulse />}
        title="How family health increased with AHAAR."
        lead="Every meal cooked with AHAAR directly improved blood pressure, resting heart rate, and chronic condition management across all 4 family members over 8 weeks of usage."
      >
        <span className="chip border-leaf/40 bg-leaf/10 text-leaf !py-2 !px-4 font-semibold flex items-center gap-2">
          <Check width={16} /> 8 Weeks of Measured Health Increase
        </span>
      </PageHeader>

      {/* Aggregate Household Health Growth Highlights */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-leaf/30 bg-leaf/5">
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] uppercase tracking-wider text-leaf font-bold">
              Family Vitality Index
            </span>
            <span className="w-8 h-8 rounded-full bg-leaf/15 text-leaf grid place-items-center">
              <Heart width={16} />
            </span>
          </div>
          <p className="font-display text-[2.6rem] font-bold text-ink mt-2 leading-none">
            91<span className="text-lg text-muted font-normal font-sans">/100</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-leaf text-bg text-[0.72rem] font-bold">
              +47% Increase
            </span>
            <span className="text-[0.75rem] text-muted">Up from 62 initial</span>
          </div>
        </div>

        <div className="card p-5 border-clay/30 bg-clay/5">
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] uppercase tracking-wider text-clay font-bold">
              Avg Blood Pressure
            </span>
            <span className="w-8 h-8 rounded-full bg-clay/15 text-clay grid place-items-center">
              <Pulse width={16} />
            </span>
          </div>
          <p className="font-display text-[2.6rem] font-bold text-ink mt-2 leading-none">
            -18<span className="text-lg text-muted font-normal font-sans"> mmHg</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-clay text-bg text-[0.72rem] font-bold">
              Optimal Range
            </span>
            <span className="text-[0.75rem] text-muted">Hypertension stabilized</span>
          </div>
        </div>

        <div className="card p-5 border-chilli/30 bg-chilli/5">
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] uppercase tracking-wider text-chilli font-bold">
              Resting Heart Rate
            </span>
            <span className="w-8 h-8 rounded-full bg-chilli/15 text-chilli grid place-items-center">
              <Pulse width={16} />
            </span>
          </div>
          <p className="font-display text-[2.6rem] font-bold text-ink mt-2 leading-none">
            -9<span className="text-lg text-muted font-normal font-sans"> bpm</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-chilli text-bg text-[0.72rem] font-bold">
              Cardio Efficiency
            </span>
            <span className="text-[0.75rem] text-muted">Calmer heart rhythm</span>
          </div>
        </div>

        <div className="card p-5 border-turmeric/40 bg-turmeric/10">
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] uppercase tracking-wider text-amber-900 font-bold">
              Disease Symptom Relief
            </span>
            <span className="w-8 h-8 rounded-full bg-turmeric/30 text-ink grid place-items-center">
              <Stethoscope width={16} />
            </span>
          </div>
          <p className="font-display text-[2.6rem] font-bold text-ink mt-2 leading-none">
            -82<span className="text-lg text-muted font-normal font-sans">%</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-800 text-bg text-[0.72rem] font-bold">
              Zero Flare-ups
            </span>
            <span className="text-[0.75rem] text-muted">No sugar crashes / reflux</span>
          </div>
        </div>
      </section>

      {/* Trajectory: Weekly Health Growth Timeline Chart */}
      <section className="card p-5 md:p-8 mt-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.16em] text-leaf font-bold">
              8-Week Health Trajectory
            </p>
            <h2 className="font-display text-2xl text-ink font-semibold mt-1">
              Continuous Family Health Growth Over Usage
            </h2>
            <p className="text-[0.85rem] text-muted mt-0.5">
              Click any milestone to inspect how AHAAR portioning increased health week by week
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip bg-white border-ink/15 text-[0.8rem] font-medium">
              Baseline: 62% &rarr; Current: 91%
            </span>
          </div>
        </div>

        {/* Visual Line Curve */}
        <div className="mt-8 relative">
          <svg viewBox="0 0 500 130" className="w-full h-auto overflow-visible" role="img">
            {/* Grid Lines */}
            {[20, 50, 80, 110].map((y) => (
              <line
                key={y}
                x1="20"
                x2="480"
                y1={y}
                y2={y}
                stroke="#2B2420"
                strokeOpacity="0.06"
                strokeDasharray="4 4"
              />
            ))}

            {/* Target Vitality Band */}
            <rect x="20" y="15" width="460" height="35" fill="#3F6B3A" opacity="0.08" rx="6" />
            <text x="26" y="32" fontSize="9" fill="#3F6B3A" fontWeight="bold">
              Optimal Health Zone (85-100%)
            </text>

            {/* Growth Curve */}
            <motion.path
              d="M 40 105 C 100 95, 140 85, 210 65 S 320 40, 460 25"
              fill="none"
              stroke="#3F6B3A"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease }}
            />

            {/* Milestones on curve */}
            {TIMELINE.map((item, idx) => {
              const xPos = 40 + idx * 105;
              const yPos = 105 - (item.score - 62) * 2.8;
              const isSelected = activeWeek === idx;

              return (
                <g key={item.week} className="cursor-pointer" onClick={() => setActiveWeek(idx)}>
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isSelected ? 9 : 6}
                    fill={isSelected ? '#3F6B3A' : '#FFFFFF'}
                    stroke="#3F6B3A"
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={xPos}
                    y={yPos - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={isSelected ? '#3F6B3A' : '#6F6152'}
                  >
                    {item.score}%
                  </text>
                  <text
                    x={xPos}
                    y="126"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6F6152"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {item.week}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Milestone Detail Box */}
        <motion.div
          key={activeWeek}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-surface border border-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-leaf text-bg grid place-items-center font-display text-lg font-bold shrink-0">
              {TIMELINE[activeWeek].week.split(' ')[1]}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display text-lg font-semibold text-ink">
                  {TIMELINE[activeWeek].title}
                </h4>
                <span className="chip !py-0.5 !px-2 bg-leaf/10 border-leaf/30 text-leaf text-[0.72rem] font-bold">
                  Health Index: {TIMELINE[activeWeek].score}%
                </span>
              </div>
              <p className="text-[0.88rem] text-muted mt-1 max-w-3xl">
                {TIMELINE[activeWeek].desc}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex gap-1">
            {TIMELINE.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveWeek(i)}
                className={`w-7 h-7 rounded-lg text-[0.75rem] font-bold transition-colors ${
                  activeWeek === i
                    ? 'bg-ink text-bg'
                    : 'bg-white border border-ink/10 text-muted hover:text-ink'
                }`}
              >
                W{i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Member by Member Improvements */}
      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.16em] text-clay font-bold">
              Individual Outcomes
            </p>
            <h2 className="font-display text-2xl text-ink font-semibold mt-0.5">
              Family Member Health Improvements
            </h2>
            <p className="text-[0.85rem] text-muted">
              Before AHAAR vs After 8 Weeks of calibrated portions
            </p>
          </div>

          {/* Member Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedMemberId('all')}
              className={`chip !py-1.5 !px-3 text-[0.8rem] transition-colors ${
                selectedMemberId === 'all'
                  ? 'bg-ink text-bg border-ink'
                  : 'border-ink/15 hover:border-ink/30 bg-white/70'
              }`}
            >
              All Family (4)
            </button>
            {FAMILY_PROGRESS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`chip !py-1.5 !px-3 text-[0.8rem] transition-colors ${
                  selectedMemberId === m.id
                    ? 'bg-ink text-bg border-ink'
                    : 'border-ink/15 hover:border-ink/30 bg-white/70'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {displayedMembers.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="card p-5 md:p-6 shadow-sm border border-ink/10 hover:border-ink/25 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-turmeric text-ink grid place-items-center text-base font-bold shadow-xs">
                    {m.name[0]}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-[0.78rem] text-muted">{m.relation}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="chip bg-leaf/10 border-leaf/30 text-leaf text-[0.75rem] font-bold">
                    Vitality {m.currentScore}%
                  </span>
                  <p className="text-[0.72rem] text-leaf font-bold mt-1">{m.scoreGain} Overall Gain</p>
                </div>
              </div>

              {/* Disease Condition Improvement */}
              <div className="mt-4 p-3 rounded-xl bg-surface/70 border border-ink/10">
                <span className="text-[0.72rem] uppercase tracking-wider text-muted font-bold block mb-1">
                  Disease Status Improvement
                </span>
                <div className="flex items-center gap-2 text-[0.85rem]">
                  <span className="line-through text-muted">{m.initialDisease}</span>
                  <span className="text-leaf font-bold">&rarr;</span>
                  <span className="font-bold text-leaf">{m.currentDisease}</span>
                </div>
              </div>

              {/* BP & Heart Rate Improvement Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* BP Box */}
                <div className="p-3.5 rounded-xl bg-clay/5 border border-clay/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.75rem] font-bold text-clay flex items-center gap-1">
                      <Pulse width={14} /> Blood Pressure
                    </span>
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded bg-clay text-bg font-bold">
                      {m.bpDelta}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[0.7rem] text-muted block">Before</span>
                      <span className="font-bold text-ink text-[0.92rem]">{m.initialBp}</span>
                    </div>
                    <span className="text-muted text-[0.8rem]">&rarr;</span>
                    <div className="text-right">
                      <span className="text-[0.7rem] text-leaf font-bold block">Current</span>
                      <span className="font-bold text-leaf text-[1.05rem]">{m.currentBp}</span>
                    </div>
                  </div>
                </div>

                {/* Heart Rate Box */}
                <div className="p-3.5 rounded-xl bg-chilli/5 border border-chilli/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.75rem] font-bold text-chilli flex items-center gap-1">
                      <Heart width={14} /> Heart Rate
                    </span>
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded bg-chilli text-bg font-bold">
                      {m.hrDelta} bpm
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[0.7rem] text-muted block">Before</span>
                      <span className="font-bold text-ink text-[0.92rem]">{m.initialHr} bpm</span>
                    </div>
                    <span className="text-muted text-[0.8rem]">&rarr;</span>
                    <div className="text-right">
                      <span className="text-[0.7rem] text-leaf font-bold block">Current</span>
                      <span className="font-bold text-leaf text-[1.05rem]">{m.currentHr} bpm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Win Note */}
              <p className="mt-4 text-[0.82rem] text-ink/80 bg-white/70 p-3 rounded-xl border border-ink/10 flex items-start gap-2">
                <span className="text-leaf text-base shrink-0 leading-none">✔</span>
                <span>{m.keyWin}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Family Health Increased During Usage */}
      <section className="mt-8 rounded-2xl bg-ink text-bg p-6 md:p-8">
        <p className="text-[0.75rem] uppercase tracking-[0.18em] text-turmeric font-semibold">
          How AHAAR Drove This Health Increase
        </p>
        <h3 className="font-display text-2xl mt-1 text-bg font-semibold">
          Three pillars of household health transformation
        </h3>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="w-9 h-9 rounded-lg bg-turmeric text-ink grid place-items-center mb-3">
              <Bowl width={18} height={18} />
            </span>
            <h4 className="font-display text-lg font-bold text-bg">1. The 100g Bowl Standard</h4>
            <p className="text-[0.85rem] text-bg/70 mt-2 leading-relaxed">
              Serving exactly 1.5 bowls of rice and 2 cups of dal eliminated post-meal carb overloads, preventing the severe insulin &amp; glucose spikes that cause fatigue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="w-9 h-9 rounded-lg bg-leaf text-bg grid place-items-center mb-3">
              <Pulse width={18} height={18} />
            </span>
            <h4 className="font-display text-lg font-bold text-bg">2. Potassium vs Sodium Balance</h4>
            <p className="text-[0.85rem] text-bg/70 mt-2 leading-relaxed">
              Higher palak and tomato volumes naturally countered culinary sodium, dropping family systolic BP by an average of 18 mmHg without bland food.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="w-9 h-9 rounded-lg bg-clay text-bg grid place-items-center mb-3">
              <Heart width={18} height={18} />
            </span>
            <h4 className="font-display text-lg font-bold text-bg">3. Circadian Digestive Rhythm</h4>
            <p className="text-[0.85rem] text-bg/70 mt-2 leading-relaxed">
              Step-by-step timed cooking made dinners predictable and earlier, allowing family resting heart rates to settle into deep restful sleep.
            </p>
          </div>
        </div>
      </section>

      <NextStep
        to="/family"
        label="Family portions & details"
        hint="Calibrate disease, BP, and heart rate for everyone at the table."
      />
    </Page>
  );
}
