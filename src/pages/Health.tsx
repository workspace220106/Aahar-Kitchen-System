import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextStep, Page, PageHeader, ease } from '../components/Page';
import { Pulse, Heart, Stethoscope, Droplet, Check } from '../components/Icons';

type MemberProgress = {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodType: string;
  startingConditions: string[];
  currentStatus: string;
  avatarColor: string;
  avatarLetter: string;
  keyMetricName: string;
  keyMetricUnit: string;
  keyMetricBefore: number;
  keyMetricAfter: number;
  keyMetricTarget: string;
  bpBefore: string;
  bpAfter: string;
  energyBefore: number; // 0 - 100
  energyAfter: number; // 0 - 100
  quote: string;
  story: string;
  beforeHabits: string[];
  afterHabits: string[];
  chartData: { week: string; primaryMetric: number; bpSystolic: number; energy: number }[];
};

const FAMILY_GROWTH: MemberProgress[] = [
  {
    id: 'papa',
    name: 'Papa',
    relation: 'Head of household',
    age: 52,
    bloodType: 'B+',
    startingConditions: ['Type 2 Diabetes (Pre-diabetic)', 'Stage 1 Hypertension'],
    currentStatus: 'Prediabetes in Remission · Normal BP',
    avatarColor: '#B9674A',
    avatarLetter: 'P',
    keyMetricName: 'Fasting Blood Glucose',
    keyMetricUnit: 'mg/dL',
    keyMetricBefore: 128,
    keyMetricAfter: 99,
    keyMetricTarget: '<100 mg/dL (Normal)',
    bpBefore: '138 / 88 mmHg',
    bpAfter: '122 / 80 mmHg',
    energyBefore: 42,
    energyAfter: 88,
    quote: 'The 100g bowl rule made rice portioning second nature. No separate cooking, no afternoon lethargy, and my doctor reduced my medication.',
    story:
      'Papa used to experience steep post-lunch blood sugar spikes from unrestrained white rice portions, followed by severe 3 PM fatigue. By following AHAAR’s 1.2-bowl glycemic cap and 3.2-bowl fiber-rich sabzi allocation, his blood glucose stabilized and his blood pressure normalized.',
    beforeHabits: [
      '350g+ white rice per meal without measuring',
      'Heavy table salt & salted papads with tadka',
      'Severe post-lunch energy crashes & brain fog',
      'Fasting glucose consistently elevated at 128 mg/dL',
    ],
    afterHabits: [
      'Calibrated 1.2 bowls rice (120g) + 3.2 bowls fiber sabzi',
      'Salt reduced by 40% with fresh lemon & roasted jeera',
      'Steady 8-hour sustained workday focus',
      'Fasting glucose down to 99 mg/dL (remission range)',
    ],
    chartData: [
      { week: 'W0 (Baseline)', primaryMetric: 128, bpSystolic: 138, energy: 42 },
      { week: 'W2', primaryMetric: 121, bpSystolic: 134, energy: 54 },
      { week: 'W4', primaryMetric: 112, bpSystolic: 128, energy: 68 },
      { week: 'W6', primaryMetric: 104, bpSystolic: 124, energy: 80 },
      { week: 'W8 (Now)', primaryMetric: 99, bpSystolic: 122, energy: 88 },
    ],
  },
  {
    id: 'mummy',
    name: 'Mummy',
    relation: 'Home anchor',
    age: 48,
    bloodType: 'O+',
    startingConditions: ['Hypothyroidism', 'Metabolic Sluggishness'],
    currentStatus: 'TSH Hormone Stabilized · High Vitality',
    avatarColor: '#E0A21B',
    avatarLetter: 'M',
    keyMetricName: 'Thyroid Stimulating Hormone (TSH)',
    keyMetricUnit: 'μIU/mL',
    keyMetricBefore: 5.4,
    keyMetricAfter: 2.5,
    keyMetricTarget: '0.5 – 4.0 μIU/mL (Optimal)',
    bpBefore: '122 / 80 mmHg',
    bpAfter: '116 / 76 mmHg',
    energyBefore: 38,
    energyAfter: 85,
    quote: 'Cooking for 4 different needs used to be exhausting. Now AHAAR calculates the single pot totals and tells me how many bowls each person takes.',
    story:
      'Mummy struggled with chronic fatigue, erratic meal timings, and sluggish metabolism linked to thyroid fluctuation. With AHAAR, she prioritized micronutrient-dense leafy greens and balanced portions, restoring her thyroid markers and sleep quality.',
    beforeHabits: [
      'Skipping lunch or eating cold leftovers at 3:30 PM',
      'Low selenium & zinc micronutrient density in diet',
      'Fragmented 5-hour sleep and persistent morning exhaustion',
      'TSH elevated at 5.4 μIU/mL with frequent joint stiffness',
    ],
    afterHabits: [
      'Fixed meal schedule with calibrated 1.5 bowls cooked greens',
      'High antioxidant vegetable diversity in every sabzi',
      '7.5 hours uninterrupted restful sleep',
      'TSH balanced at 2.5 μIU/mL with zero midday fatigue',
    ],
    chartData: [
      { week: 'W0 (Baseline)', primaryMetric: 5.4, bpSystolic: 122, energy: 38 },
      { week: 'W2', primaryMetric: 4.8, bpSystolic: 120, energy: 50 },
      { week: 'W4', primaryMetric: 3.9, bpSystolic: 118, energy: 65 },
      { week: 'W6', primaryMetric: 3.1, bpSystolic: 116, energy: 78 },
      { week: 'W8 (Now)', primaryMetric: 2.5, bpSystolic: 116, energy: 85 },
    ],
  },
  {
    id: 'aarav',
    name: 'Aarav',
    relation: 'High school student & runner',
    age: 15,
    bloodType: 'B+',
    startingConditions: ['Under-fueled Student Athlete', 'Processed Snacking'],
    currentStatus: 'Peak Athletic Endurance · Clean Fueling',
    avatarColor: '#3F6B3A',
    avatarLetter: 'A',
    keyMetricName: 'Daily Clean Protein Intake',
    keyMetricUnit: 'g/day',
    keyMetricBefore: 42,
    keyMetricAfter: 72,
    keyMetricTarget: '>68 g/day (High Protein)',
    bpBefore: '114 / 74 mmHg',
    bpAfter: '110 / 72 mmHg',
    energyBefore: 55,
    energyAfter: 94,
    quote: 'I used to crash during 400m track practice. Now having 2.2 cups of dal and 3 phulkas gives me clean stamina, and I set a personal best this term!',
    story:
      'As a growing teen athlete, Aarav was chronically under-fueled with fast-digesting packaged snacks, leading to poor afternoon study focus. AHAAR boosted his clean lentil protein and whole-grain complex carbs, accelerating athletic recovery and focus.',
    beforeHabits: [
      'Refined carb snacking after school (chips, biscuits)',
      'Low dal intake (<1 cup/day), inadequate clean protein',
      'Struggling with fatigue in the final 100m sprint',
      'Restless study sessions with scattered focus',
    ],
    afterHabits: [
      '2.2 cups high-protein dal + 3 wholesome rotis per meal',
      'Whole food meal satiety eliminated afternoon cravings',
      'Personal record in 400m sprint (sub-60 seconds)',
      'Sustained mental concentration through evening homework',
    ],
    chartData: [
      { week: 'W0 (Baseline)', primaryMetric: 42, bpSystolic: 114, energy: 55 },
      { week: 'W2', primaryMetric: 50, bpSystolic: 112, energy: 66 },
      { week: 'W4', primaryMetric: 60, bpSystolic: 110, energy: 78 },
      { week: 'W6', primaryMetric: 68, bpSystolic: 110, energy: 88 },
      { week: 'W8 (Now)', primaryMetric: 72, bpSystolic: 110, energy: 94 },
    ],
  },
  {
    id: 'dadi',
    name: 'Dadi',
    relation: 'Elder matriarch',
    age: 74,
    bloodType: 'O+',
    startingConditions: ['Hypertension (Stage 2)', 'Chronic Acidity & Nocturnal GERD'],
    currentStatus: 'Zero Acid Reflux in 21 Days · BP Normalized',
    avatarColor: '#C8693E',
    avatarLetter: 'D',
    keyMetricName: 'Weekly Acid Reflux Episodes',
    keyMetricUnit: 'episodes/wk',
    keyMetricBefore: 5,
    keyMetricAfter: 0,
    keyMetricTarget: '0 episodes (Symptom Free)',
    bpBefore: '142 / 90 mmHg',
    bpAfter: '124 / 78 mmHg',
    energyBefore: 30,
    energyAfter: 78,
    quote: 'For three years I could not sleep without antacid syrups. AHAAR’s mild spices and soft portioning healed my stomach. I now walk 30 minutes in the park every morning!',
    story:
      'Dadi suffered from frequent nocturnal acid reflux and hypertensive spikes caused by heavy chillies, excess salt, and dense dinners. AHAAR adjusted her plate to soft, easily digestible rotis and mild comforting dal, completely eliminating her heartburn.',
    beforeHabits: [
      'Pungent, oily evening gravies causing night acid reflux',
      'Blood pressure spiking to 142/90 mmHg',
      'Dependent on daily antacid tablets before bed',
      'Limited mobility due to digestive heaviness',
    ],
    afterHabits: [
      'Mild cumin & coriander seasoning with gentle phulkas',
      'Blood pressure stabilized safely at 124/78 mmHg',
      'Completely free of nocturnal antacid medication',
      'Walks 30+ minutes daily with lightness and comfort',
    ],
    chartData: [
      { week: 'W0 (Baseline)', primaryMetric: 5, bpSystolic: 142, energy: 30 },
      { week: 'W2', primaryMetric: 3, bpSystolic: 136, energy: 44 },
      { week: 'W4', primaryMetric: 1, bpSystolic: 130, energy: 58 },
      { week: 'W6', primaryMetric: 0, bpSystolic: 126, energy: 70 },
      { week: 'W8 (Now)', primaryMetric: 0, bpSystolic: 124, energy: 78 },
    ],
  },
];

export default function Health() {
  const [selectedId, setSelectedId] = useState<string>('papa');
  const [selectedWeek, setSelectedWeek] = useState<number>(4); // index in chartData (0=W0, 4=W8)

  const cur = FAMILY_GROWTH.find((m) => m.id === selectedId) ?? FAMILY_GROWTH[0];
  const currentWeekPoint = cur.chartData[selectedWeek];

  return (
    <Page>
      <PageHeader
        step="07"
        kicker="Lifestyle & Vitals Growth"
        icon={<Pulse />}
        title="Real lifestyle growth. Built one meal at a time."
        lead="See how 8 weeks of intelligent portion calibration, glycemic balance, and sodium awareness transformed the daily energy, biomarker health, and habits of every family member."
      />

      {/* Household Milestone Highlights Banner */}
      <section className="card p-6 md:p-8 bg-gradient-to-br from-white/90 via-surface/40 to-turmeric/10 border-turmeric/20 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="kicker text-leaf font-bold">8-Week Family Progress Report</span>
            <h2 className="font-display text-2xl text-ink mt-0.5">Family Health Transformation</h2>
          </div>
          <span className="chip bg-leaf/15 text-leaf border-leaf/30 font-bold !py-1 !px-3 text-[0.8rem]">
            ✓ 100% Shared Pot Cooking
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 rounded-2xl p-4 border border-ink/10 shadow-2xs">
            <div className="flex items-center gap-2 text-muted text-[0.78rem]">
              <Heart width={15} className="text-chilli" /> Blood Pressure
            </div>
            <p className="font-display text-[1.85rem] font-bold text-ink mt-1">
              -14 <span className="text-[0.95rem] font-sans font-medium text-muted">mmHg</span>
            </p>
            <p className="text-[0.74rem] text-leaf font-semibold mt-0.5">
              Avg household systolic drop
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-ink/10 shadow-2xs">
            <div className="flex items-center gap-2 text-muted text-[0.78rem]">
              <Droplet width={15} className="text-leaf" /> Glucose Stability
            </div>
            <p className="font-display text-[1.85rem] font-bold text-leaf mt-1">
              99 <span className="text-[0.95rem] font-sans font-medium text-muted">mg/dL</span>
            </p>
            <p className="text-[0.74rem] text-muted font-medium mt-0.5">
              Papa's fasting glucose normalized
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-ink/10 shadow-2xs">
            <div className="flex items-center gap-2 text-muted text-[0.78rem]">
              <Pulse width={15} className="text-turmeric" /> Energy Score
            </div>
            <p className="font-display text-[1.85rem] font-bold text-ink mt-1">
              +44% <span className="text-[0.95rem] font-sans font-medium text-muted">vitality</span>
            </p>
            <p className="text-[0.74rem] text-leaf font-semibold mt-0.5">
              Zero afternoon energy crashes
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-ink/10 shadow-2xs">
            <div className="flex items-center gap-2 text-muted text-[0.78rem]">
              <Stethoscope width={15} className="text-clay" /> Acidity & Digestion
            </div>
            <p className="font-display text-[1.85rem] font-bold text-clay mt-1">
              0 <span className="text-[0.95rem] font-sans font-medium text-muted">episodes</span>
            </p>
            <p className="text-[0.74rem] text-leaf font-semibold mt-0.5">
              Dadi free of acid reflux pills
            </p>
          </div>
        </div>
      </section>

      {/* Member Selection Tabs */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">
            Select Family Member
          </p>
          <span className="text-[0.78rem] text-muted">Click to view personalized lifestyle timeline</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FAMILY_GROWTH.map((m) => {
            const isSelected = m.id === cur.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedId(m.id);
                  setSelectedWeek(4);
                }}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-ink text-bg border-ink shadow-md scale-[1.02]'
                    : 'bg-white/70 hover:bg-white border-ink/10 text-ink shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-8 h-8 rounded-full grid place-items-center text-[0.82rem] font-bold"
                    style={{
                      background: isSelected ? '#E0A21B' : m.avatarColor,
                      color: isSelected ? '#2B2420' : '#FFFFFF',
                    }}
                  >
                    {m.avatarLetter}
                  </span>
                  <span
                    className={`text-[0.7rem] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-bg/20 text-bg' : 'bg-surface text-chilli'
                    }`}
                  >
                    🩸 {m.bloodType}
                  </span>
                </div>

                <p className="font-display text-lg font-bold leading-tight">{m.name}</p>
                <p className={`text-[0.74rem] mt-0.5 ${isSelected ? 'text-bg/70' : 'text-muted'}`}>
                  {m.age} y · {m.relation}
                </p>
                <p
                  className={`text-[0.72rem] font-semibold mt-2.5 line-clamp-1 ${
                    isSelected ? 'text-turmeric' : 'text-leaf'
                  }`}
                >
                  ✓ {m.currentStatus}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Member Detailed Growth Dashboard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cur.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease }}
          className="mt-6 space-y-6"
        >
          {/* Member Profile Summary Card */}
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-9 h-9 rounded-full grid place-items-center text-sm font-bold text-white shadow-xs"
                    style={{ background: cur.avatarColor }}
                  >
                    {cur.avatarLetter}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">
                      {cur.name}'s Lifestyle Growth
                    </h3>
                    <p className="text-[0.82rem] text-muted">
                      {cur.relation} · Age {cur.age} · Blood Group {cur.bloodType}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cur.startingConditions.map((cond) => (
                    <span
                      key={cond}
                      className="chip text-[0.72rem] bg-chilli/10 text-chilli border-chilli/20 font-semibold"
                    >
                      Baseline: {cond}
                    </span>
                  ))}
                  <span className="chip text-[0.72rem] bg-leaf/15 text-leaf border-leaf/30 font-bold">
                    Now: {cur.currentStatus}
                  </span>
                </div>
              </div>

              {/* Personal Quote */}
              <div className="max-w-md bg-surface/70 border border-ink/10 rounded-2xl p-4 text-[0.85rem] text-ink italic leading-relaxed shadow-2xs">
                "{cur.quote}"
              </div>
            </div>

            {/* Before vs After Key Metrics Comparison Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Metric 1: Clinical Primary Biomarker */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-3 shadow-2xs">
                <span className="text-[0.75rem] font-bold text-muted uppercase tracking-wider block">
                  {cur.keyMetricName}
                </span>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[0.7rem] text-muted block">Day 0 (Before)</span>
                    <span className="text-xl font-bold text-chilli line-through">
                      {cur.keyMetricBefore}
                    </span>
                  </div>
                  <span className="text-leaf text-xl font-bold">➔</span>
                  <div>
                    <span className="text-[0.7rem] text-leaf font-bold block">Week 8 (Current)</span>
                    <span className="text-2xl font-display font-extrabold text-leaf">
                      {cur.keyMetricAfter}{' '}
                      <span className="text-[0.8rem] font-sans font-normal text-muted">
                        {cur.keyMetricUnit}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[0.74rem]">
                  <span className="text-muted">Target Range:</span>
                  <span className="font-semibold text-leaf">{cur.keyMetricTarget}</span>
                </div>
              </div>

              {/* Metric 2: Blood Pressure */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-3 shadow-2xs">
                <span className="text-[0.75rem] font-bold text-muted uppercase tracking-wider block">
                  Blood Pressure (BP)
                </span>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[0.7rem] text-muted block">Day 0 (Before)</span>
                    <span className="text-lg font-bold text-chilli line-through">
                      {cur.bpBefore}
                    </span>
                  </div>
                  <span className="text-leaf text-xl font-bold">➔</span>
                  <div>
                    <span className="text-[0.7rem] text-leaf font-bold block">Week 8 (Current)</span>
                    <span className="text-2xl font-display font-extrabold text-leaf">
                      {cur.bpAfter}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[0.74rem]">
                  <span className="text-muted">Clinical Status:</span>
                  <span className="font-semibold text-leaf">Normal Optimal Range</span>
                </div>
              </div>

              {/* Metric 3: Daily Energy & Vitality Score */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-3 shadow-2xs">
                <span className="text-[0.75rem] font-bold text-muted uppercase tracking-wider block">
                  Daily Vitality & Satiety
                </span>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[0.7rem] text-muted block">Day 0 (Before)</span>
                    <span className="text-xl font-bold text-muted line-through">
                      {cur.energyBefore} / 100
                    </span>
                  </div>
                  <span className="text-leaf text-xl font-bold">➔</span>
                  <div>
                    <span className="text-[0.7rem] text-leaf font-bold block">Week 8 (Current)</span>
                    <span className="text-2xl font-display font-extrabold text-turmeric">
                      {cur.energyAfter}{' '}
                      <span className="text-[0.8rem] font-sans font-normal text-muted">/ 100</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[0.74rem]">
                  <span className="text-muted">Midday Slump:</span>
                  <span className="font-semibold text-leaf">Eliminated</span>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Stepper & Chart */}
            <div className="rounded-2xl bg-surface/50 border border-ink/10 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    8-Week Progress Trajectory
                  </p>
                  <p className="text-[0.78rem] text-muted">
                    Tap a timeline milestone to inspect values along the 8 weeks of using AHAAR
                  </p>
                </div>

                {/* Timeline Buttons */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-ink/10 text-[0.76rem]">
                  {cur.chartData.map((d, idx) => (
                    <button
                      key={d.week}
                      type="button"
                      onClick={() => setSelectedWeek(idx)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        selectedWeek === idx
                          ? 'bg-ink text-bg shadow-2xs'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {d.week}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Milestones Bar Card */}
              <div className="bg-white rounded-xl p-4 border border-ink/10 grid sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-0.5">
                  <span className="text-[0.72rem] text-muted uppercase font-bold">
                    Active Milestone
                  </span>
                  <p className="text-base font-bold text-ink">{currentWeekPoint.week}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[0.72rem] text-muted uppercase font-bold">
                    {cur.keyMetricName}
                  </span>
                  <p className="text-xl font-mono font-bold text-leaf">
                    {currentWeekPoint.primaryMetric} {cur.keyMetricUnit}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[0.72rem] text-muted uppercase font-bold">
                    Systolic Blood Pressure
                  </span>
                  <p className="text-xl font-mono font-bold text-chilli">
                    {currentWeekPoint.bpSystolic} mmHg
                  </p>
                </div>
              </div>

              {/* Graphical Visual Curve */}
              <div className="bg-white rounded-xl p-4 border border-ink/10">
                <p className="text-[0.75rem] font-bold text-muted mb-2 flex items-center justify-between">
                  <span>Biomarker Improvement Curve (Lower is Healthier)</span>
                  <span className="text-leaf font-semibold">Normalized at Week 8</span>
                </p>
                <svg viewBox="0 0 500 120" className="w-full h-auto overflow-visible" role="img">
                  <line x1="20" y1="20" x2="480" y2="20" stroke="#2B2420" strokeOpacity="0.08" />
                  <line x1="20" y1="60" x2="480" y2="60" stroke="#2B2420" strokeOpacity="0.08" />
                  <line x1="20" y1="100" x2="480" y2="100" stroke="#2B2420" strokeOpacity="0.08" />

                  {/* Polyline progress */}
                  <polyline
                    fill="none"
                    stroke="#3F6B3A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="40,25 140,42 240,65 340,82 440,95"
                  />

                  {/* Marker points */}
                  {[
                    { cx: 40, cy: 25, label: cur.chartData[0].primaryMetric },
                    { cx: 140, cy: 42, label: cur.chartData[1].primaryMetric },
                    { cx: 240, cy: 65, label: cur.chartData[2].primaryMetric },
                    { cx: 340, cy: 82, label: cur.chartData[3].primaryMetric },
                    { cx: 440, cy: 95, label: cur.chartData[4].primaryMetric },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r={selectedWeek === i ? 7 : 5}
                        fill={selectedWeek === i ? '#E0A21B' : '#3F6B3A'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onClick={() => setSelectedWeek(i)}
                      />
                      <text
                        x={pt.cx}
                        y={pt.cy - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#2B2420"
                        fontFamily="monospace"
                      >
                        {pt.label}
                      </text>
                      <text
                        x={pt.cx}
                        y="115"
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="#6F6152"
                        fontFamily="Figtree"
                      >
                        {cur.chartData[i].week.split(' ')[0]}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Before vs After Lifestyle & Habit Shift */}
            <div className="grid md:grid-cols-2 gap-5 pt-2">
              <div className="bg-chilli/5 border border-chilli/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-chilli text-white text-xs font-bold grid place-items-center">
                    ✕
                  </span>
                  <h4 className="font-display text-lg text-chilli font-bold">
                    Before Following AHAAR
                  </h4>
                </div>
                <ul className="space-y-2 text-[0.82rem] text-muted">
                  {cur.beforeHabits.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-chilli mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-leaf/10 border border-leaf/25 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-leaf text-white text-xs font-bold grid place-items-center">
                    <Check width={14} height={14} />
                  </span>
                  <h4 className="font-display text-lg text-leaf font-bold">
                    After 8 Weeks on AHAAR
                  </h4>
                </div>
                <ul className="space-y-2 text-[0.82rem] text-ink font-medium">
                  {cur.afterHabits.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-leaf font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <NextStep
        to="/family"
        label="Family portions & table"
        hint="Inspect tonight's calibrated portions, medical profiles, and bowl conversion formulas."
      />
    </Page>
  );
}
