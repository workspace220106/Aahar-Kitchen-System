import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextStep, Page, PageHeader, ease } from '../components/Page';
import { People, Plus, X, Droplet, Heart, Pulse, Stethoscope, Check } from '../components/Icons';

export type Activity = 'Light' | 'Moderate' | 'Active';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export type HealthCondition = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  riceMod?: number;
  dalMod?: number;
  sabziMod?: number;
  rotiMod?: number;
};

export const COMMON_CONDITIONS: HealthCondition[] = [
  { id: 'diabetes', name: 'Type 2 Diabetes', icon: '🩸', desc: 'Lower GI rice portion, boost vegetable fiber', riceMod: 0.7, sabziMod: 1.3 },
  { id: 'hypertension', name: 'Hypertension (High BP)', icon: '🩺', desc: 'Low sodium protocol, potassium-rich greens', sabziMod: 1.2 },
  { id: 'cholesterol', name: 'High Cholesterol', icon: '🧈', desc: 'Soluble fiber focus, minimal ghee', dalMod: 1.1, sabziMod: 1.2 },
  { id: 'thyroid', name: 'Thyroid Care', icon: '🦋', desc: 'Micronutrient-rich greens & steady energy' },
  { id: 'uric-acid', name: 'Uric Acid / Gout', icon: '🧬', desc: 'Low purine: moderate lentils, hydrating sabzi', dalMod: 0.75, sabziMod: 1.25 },
  { id: 'acidity', name: 'Acidity / GERD', icon: '🍋', desc: 'Gentle spices & easily digestible portions' },
  { id: 'pcos', name: 'PCOS / Insulin Support', icon: '🌸', desc: 'Anti-inflammatory low GI carbohydrates', riceMod: 0.8, sabziMod: 1.2 },
];

export const BLOOD_TYPES: BloodType[] = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

export type Member = {
  id: number;
  name: string;
  age: number;
  activity: Activity;
  bloodType: BloodType;
  bpSystolic: number;
  bpDiastolic: number;
  conditions: string[];
  customConditions: string[];
  dietaryNote?: string;
};

export type FormulaModalData = {
  foodLabel: string;
  amount: number;
  unit: string;
  memberName: string;
  color: string;
  isTotal?: boolean;
};

const FOODS = [
  { key: 'roti', label: 'Roti', unit: 'pcs', base: 3, color: '#D9A86C' },
  { key: 'rice', label: 'Rice', unit: 'g', base: 150, color: '#F1EADA' },
  { key: 'dal', label: 'Dal', unit: 'ml', base: 200, color: '#E0A21B' },
  { key: 'sabzi', label: 'Sabzi', unit: 'g', base: 150, color: '#3F6B3A' },
] as const;

const ACT: Record<Activity, number> = { Light: 0.88, Moderate: 1, Active: 1.15 };

export function categorizeBp(systolic: number, diastolic: number) {
  if (systolic < 90 || diastolic < 60) {
    return {
      category: 'low',
      label: 'Low Blood Pressure',
      shortLabel: 'Low BP',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
      advice: 'Ensure ample hydration and adequate electrolytes with meals.',
      color: '#0284C7',
    };
  }
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'optimal',
      label: 'Normal BP (<120 / <80 mmHg)',
      shortLabel: 'Normal BP',
      badgeClass: 'bg-leaf/10 text-leaf border-leaf/30',
      advice: 'Blood pressure is optimal. Maintain balanced whole-grain portions.',
      color: '#3F6B3A',
    };
  }
  if (systolic <= 129 && diastolic < 80) {
    return {
      category: 'elevated',
      label: 'Elevated BP (120–129 / <80 mmHg)',
      shortLabel: 'Elevated',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      advice: 'Mild elevation. Watch table salt & pickles; boost potassium with green sabzi.',
      color: '#D97706',
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'stage1',
      label: 'Stage 1 Hypertension (130–139 / 80–89 mmHg)',
      shortLabel: 'Stage 1 HTN',
      badgeClass: 'bg-orange-50 text-orange-800 border-orange-300',
      advice: 'DASH guidelines: Cap sodium in dal & sabzi, maximize potassium-rich greens.',
      color: '#EA580C',
    };
  }
  return {
    category: 'stage2',
    label: 'Stage 2 Hypertension (≥140 / ≥90 mmHg)',
    shortLabel: 'Stage 2 HTN',
    badgeClass: 'bg-chilli/10 text-chilli border-chilli/30',
    advice: 'Strict low sodium protocol: Cook without salted tadka, skip papad & pickles.',
    color: '#B8371F',
  };
}

function baseFactor(m: Member) {
  const ageF = m.age < 6 ? 0.45 : m.age < 12 ? 0.65 : m.age < 18 ? 0.95 : m.age < 60 ? 1 : 0.85;
  return ageF * ACT[m.activity];
}

export function toBowlQuantity(amount: number, unit: string) {
  if (unit === 'pcs') {
    return {
      display: `${amount}`,
      unitLabel: 'rotis',
      bowls: null,
      raw: `${amount} pcs`,
    };
  }
  const bowls = (amount / 100).toFixed(1).replace(/\.0$/, '');
  const unitLabel = unit === 'ml' ? 'cups' : 'bowls';
  return {
    display: `${bowls}`,
    unitLabel,
    bowls: Number((amount / 100).toFixed(2)),
    raw: `${amount} ${unit}`,
  };
}

const START: Member[] = [
  {
    id: 1,
    name: 'Papa',
    age: 52,
    activity: 'Active',
    bloodType: 'B+',
    bpSystolic: 134,
    bpDiastolic: 86,
    conditions: ['diabetes', 'hypertension'],
    customConditions: [],
    dietaryNote: 'Low GI & low salt. Monitor white rice portion.',
  },
  {
    id: 2,
    name: 'Mummy',
    age: 48,
    activity: 'Moderate',
    bloodType: 'O+',
    bpSystolic: 118,
    bpDiastolic: 76,
    conditions: ['thyroid'],
    customConditions: [],
    dietaryNote: 'Selenium & fiber rich vegetables, balanced portions.',
  },
  {
    id: 3,
    name: 'Aarav',
    age: 15,
    activity: 'Active',
    bloodType: 'B+',
    bpSystolic: 110,
    bpDiastolic: 72,
    conditions: [],
    customConditions: [],
    dietaryNote: 'Growing teenager — high energy and active protein.',
  },
  {
    id: 4,
    name: 'Dadi',
    age: 74,
    activity: 'Light',
    bloodType: 'O+',
    bpSystolic: 138,
    bpDiastolic: 84,
    conditions: ['hypertension', 'acidity'],
    customConditions: [],
    dietaryNote: 'Soft phulkas, mild seasoning, low sodium dal.',
  },
];

export default function Family() {
  const [members, setMembers] = useState<Member[]>(START);
  const [sel, setSel] = useState(1);
  const [customInput, setCustomInput] = useState('');
  const [unitMode, setUnitMode] = useState<'bowls' | 'metric'>('bowls');
  const [formulaModal, setFormulaModal] = useState<FormulaModalData | null>(null);

  const portions = useMemo(
    () =>
      members.map((m) => {
        const bFactor = baseFactor(m);
        let riceMod = 1;
        let dalMod = 1;
        let sabziMod = 1;
        let rotiMod = 1;

        // Health modifier: BP elevation boosts potassium-rich sabzi
        if (m.bpSystolic >= 130 || m.bpDiastolic >= 80) {
          sabziMod = Math.max(sabziMod, 1.2);
        }

        // Apply health condition modifiers
        m.conditions.forEach((cId) => {
          const c = COMMON_CONDITIONS.find((x) => x.id === cId);
          if (c) {
            if (c.riceMod) riceMod *= c.riceMod;
            if (c.dalMod) dalMod *= c.dalMod;
            if (c.sabziMod) sabziMod *= c.sabziMod;
            if (c.rotiMod) rotiMod *= c.rotiMod;
          }
        });

        const food = FOODS.map((x) => {
          let mod = 1;
          let adjustTag: string | undefined;

          if (x.key === 'rice') {
            mod = riceMod;
            if (riceMod < 0.95) adjustTag = 'Low GI';
          } else if (x.key === 'sabzi') {
            mod = sabziMod;
            if (sabziMod > 1.05) adjustTag = '+Fiber/K+';
          } else if (x.key === 'dal') {
            mod = dalMod;
            if (dalMod < 0.95) adjustTag = 'Purine safe';
          } else if (x.key === 'roti') {
            mod = rotiMod;
          }

          const f = bFactor * mod;
          const amount =
            x.unit === 'pcs'
              ? Math.max(1, Math.round(x.base * f))
              : Math.round((x.base * f) / 10) * 10;

          const bowlData = toBowlQuantity(amount, x.unit);

          return { ...x, amount, mod, f, adjustTag, bowlData };
        });

        const bpInfo = categorizeBp(m.bpSystolic, m.bpDiastolic);

        return {
          m,
          bFactor,
          food,
          bpInfo,
        };
      }),
    [members],
  );

  const update = (id: number, patch: Partial<Member>) =>
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const toggleCondition = (m: Member, conditionId: string) => {
    const exists = m.conditions.includes(conditionId);
    const next = exists ? m.conditions.filter((c) => c !== conditionId) : [...m.conditions, conditionId];
    update(m.id, { conditions: next });
  };

  const addCustomCondition = (m: Member) => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!m.customConditions?.includes(trimmed)) {
      update(m.id, { customConditions: [...(m.customConditions || []), trimmed] });
    }
    setCustomInput('');
  };

  const removeCustomCondition = (m: Member, cName: string) => {
    update(m.id, { customConditions: (m.customConditions || []).filter((c) => c !== cName) });
  };

  const add = () => {
    if (members.length >= 6) return;
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    setMembers([
      ...members,
      {
        id,
        name: `Member ${id}`,
        age: 30,
        activity: 'Moderate',
        bloodType: 'B+',
        bpSystolic: 120,
        bpDiastolic: 80,
        conditions: [],
        customConditions: [],
        dietaryNote: '',
      },
    ]);
    setSel(id);
  };

  const remove = (id: number) => {
    if (members.length <= 1) return;
    const next = members.filter((m) => m.id !== id);
    setMembers(next);
    if (sel === id) setSel(next[0].id);
  };

  const cur = members.find((m) => m.id === sel) ?? members[0];
  const curPortion = portions.find((p) => p.m.id === cur.id) ?? portions[0];
  const total = FOODS.map((x) => {
    const sum = portions.reduce((s, p) => s + p.food.find((f) => f.key === x.key)!.amount, 0);
    const bowlData = toBowlQuantity(sum, x.unit);
    return {
      ...x,
      sum,
      bowlData,
    };
  });

  const membersWithHypertension = members.filter((m) => m.bpSystolic >= 130 || m.bpDiastolic >= 80);
  const membersWithDiabetes = members.filter((m) => m.conditions.includes('diabetes'));

  return (
    <Page>
      <PageHeader
        step="05"
        kicker="Family portions & health"
        icon={<People />}
        title="One meal. Calibrated for every body."
        lead="Tell AHAAR who's at the table. Portions of roti, rice, dal and sabzi adapt dynamically to each person's age, activity, blood pressure, blood type, and medical conditions."
      />

      <div className="grid lg:grid-cols-[1.1fr_1.15fr] gap-6 items-start">
        {/* Members Column */}
        <section className="card p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-ink">At the table</h2>
              <p className="text-[0.8rem] text-muted mt-0.5">Select a member to personalize health vitals</p>
            </div>
            <button
              className="btn-ghost !min-h-[38px] !px-3 text-[0.85rem]"
              onClick={add}
              disabled={members.length >= 6}
            >
              <Plus width={16} /> Add member
            </button>
          </div>

          {/* Member Tabs */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {members.map((m) => {
              const isSelected = m.id === cur.id;
              const hasHealthNotice = m.bpSystolic >= 130 || m.conditions.length > 0;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => setSel(m.id)}
                    className={`chip !py-2 !px-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'bg-ink text-bg border-ink shadow-sm scale-[1.02]'
                        : 'border-ink/15 hover:border-ink/40 bg-white/50'
                    }`}
                  >
                    <span className="w-6 h-6 -ml-1 rounded-full bg-turmeric text-ink grid place-items-center text-[0.72rem] font-bold">
                      {m.name[0] || 'M'}
                    </span>
                    <span className="font-medium">{m.name}</span>
                    <span
                      className={`text-[0.68rem] px-1.5 py-0.2 rounded font-semibold ${
                        isSelected ? 'bg-bg/20 text-bg' : 'bg-surface text-muted'
                      }`}
                    >
                      {m.bloodType}
                    </span>
                    {hasHealthNotice && (
                      <span
                        className="w-2 h-2 rounded-full bg-clay shrink-0"
                        title="Active health profile"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Selected Member Form */}
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease }}
            className="mt-6 space-y-6 divide-y divide-ink/10"
          >
            {/* Section A: Basic Attributes */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-[0.82rem] font-medium text-muted">Name</span>
                <input
                  value={cur.name}
                  onChange={(e) => update(cur.id, { name: e.target.value })}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-ink/15 bg-white focus:outline-none focus:border-leaf font-medium text-ink transition-colors"
                  placeholder="e.g. Papa, Mummy, Aarav..."
                />
              </label>

              <label className="block">
                <div className="flex justify-between text-[0.82rem]">
                  <span className="font-medium text-muted">Age</span>
                  <span className="font-bold tabular-nums text-ink text-[0.95rem]">{cur.age} years</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={95}
                  value={cur.age}
                  onChange={(e) => update(cur.id, { age: +e.target.value })}
                  className="mt-2 w-full accent-leaf cursor-pointer"
                />
              </label>

              <div>
                <span className="text-[0.82rem] font-medium text-muted">Daily Activity Level</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['Light', 'Moderate', 'Active'] as Activity[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => update(cur.id, { activity: a })}
                      className={`h-11 rounded-xl border text-[0.88rem] font-medium transition-colors ${
                        cur.activity === a
                          ? 'bg-leaf text-bg border-leaf shadow-sm'
                          : 'border-ink/15 bg-white/60 hover:bg-surface text-ink'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section B: Clinical Vitals & Blood Type */}
            <div className="pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-chilli/10 text-chilli grid place-items-center">
                    <Pulse width={16} height={16} />
                  </span>
                  <h3 className="font-display text-lg text-ink">Clinical Vitals & Blood Group</h3>
                </div>
                <span className="text-[0.75rem] font-semibold text-leaf bg-leaf/10 border border-leaf/20 px-2 py-0.5 rounded-full">
                  Portion Aware
                </span>
              </div>

              {/* Blood Type Selector */}
              <div>
                <label className="flex items-center justify-between text-[0.82rem] mb-2">
                  <span className="font-medium text-muted flex items-center gap-1.5">
                    <Droplet width={14} height={14} className="text-chilli" /> Blood Type
                  </span>
                  <span className="text-[0.78rem] font-bold text-chilli bg-chilli/10 px-2 py-0.5 rounded-full">
                    {cur.bloodType}
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {BLOOD_TYPES.map((bt) => {
                    const isSelected = cur.bloodType === bt;
                    return (
                      <button
                        key={bt}
                        type="button"
                        onClick={() => update(cur.id, { bloodType: bt })}
                        className={`h-9 rounded-lg border text-[0.82rem] font-bold transition-all ${
                          isSelected
                            ? 'bg-chilli text-white border-chilli shadow-sm scale-105'
                            : 'border-ink/15 bg-white hover:bg-chilli/10 hover:border-chilli/40 text-ink'
                        }`}
                      >
                        {bt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blood Pressure (BP) */}
              <div className="rounded-xl border border-ink/10 bg-white/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[0.82rem] font-medium text-muted flex items-center gap-1.5">
                    <Heart width={15} height={15} className="text-chilli" /> Blood Pressure (BP)
                  </label>
                  <span className={`chip text-[0.72rem] font-semibold ${curPortion.bpInfo.badgeClass}`}>
                    {curPortion.bpInfo.shortLabel} ({cur.bpSystolic}/{cur.bpDiastolic})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[0.72rem] text-muted block mb-1">Systolic (top / mmHg)</span>
                    <input
                      type="number"
                      min={70}
                      max={220}
                      value={cur.bpSystolic}
                      onChange={(e) => update(cur.id, { bpSystolic: +e.target.value || 120 })}
                      className="w-full h-10 px-3 rounded-lg border border-ink/15 bg-white font-mono font-bold text-ink focus:border-leaf focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[0.72rem] text-muted block mb-1">Diastolic (bottom / mmHg)</span>
                    <input
                      type="number"
                      min={40}
                      max={140}
                      value={cur.bpDiastolic}
                      onChange={(e) => update(cur.id, { bpDiastolic: +e.target.value || 80 })}
                      className="w-full h-10 px-3 rounded-lg border border-ink/15 bg-white font-mono font-bold text-ink focus:border-leaf focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Presets for BP */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[0.72rem] text-muted mr-1">Presets:</span>
                  {[
                    { label: 'Normal', s: 118, d: 76 },
                    { label: 'Elevated', s: 126, d: 78 },
                    { label: 'Stage 1', s: 134, d: 86 },
                    { label: 'Stage 2', s: 145, d: 92 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => update(cur.id, { bpSystolic: preset.s, bpDiastolic: preset.d })}
                      className="text-[0.72rem] px-2 py-0.5 rounded border border-ink/15 bg-surface/70 hover:bg-surface text-ink font-medium transition-colors"
                    >
                      {preset.label} ({preset.s}/{preset.d})
                    </button>
                  ))}
                </div>

                {/* Contextual BP dietary note */}
                <div className="text-[0.78rem] p-2.5 rounded-lg bg-surface/80 text-muted border border-ink/10 leading-relaxed flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-clay">💡</span>
                  <span>{curPortion.bpInfo.advice}</span>
                </div>
              </div>
            </div>

            {/* Section C: Health Conditions & Diseases */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-turmeric/15 text-turmeric grid place-items-center">
                    <Stethoscope width={16} height={16} />
                  </span>
                  <h3 className="font-display text-lg text-ink">Conditions & Dietary Needs</h3>
                </div>
                <span className="text-[0.75rem] text-muted">
                  {cur.conditions.length + (cur.customConditions?.length || 0)} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {COMMON_CONDITIONS.map((cond) => {
                  const on = cur.conditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => toggleCondition(cur, cond.id)}
                      className={`chip !py-1.5 !px-3 text-[0.82rem] transition-all ${
                        on
                          ? 'bg-leaf text-bg border-leaf font-semibold shadow-xs'
                          : 'border-ink/15 bg-white hover:border-ink/40 text-ink'
                      }`}
                    >
                      <span className="mr-1">{cond.icon}</span>
                      <span>{cond.name}</span>
                      {on && <Check width={13} height={13} className="ml-1 text-bg" />}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => update(cur.id, { conditions: [], customConditions: [] })}
                  className={`chip !py-1.5 !px-3 text-[0.82rem] transition-all ${
                    cur.conditions.length === 0 && (!cur.customConditions || cur.customConditions.length === 0)
                      ? 'bg-ink text-bg border-ink font-semibold'
                      : 'border-ink/15 bg-white hover:border-ink/40 text-muted'
                  }`}
                >
                  ✨ None / Healthy
                </button>
              </div>

              {/* Custom conditions tag cloud & input */}
              {cur.customConditions && cur.customConditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cur.customConditions.map((custom) => (
                    <span
                      key={custom}
                      className="chip !py-1 !px-2.5 bg-clay/10 text-clay border-clay/30 text-[0.78rem] font-medium"
                    >
                      {custom}
                      <button
                        type="button"
                        onClick={() => removeCustomCondition(cur, custom)}
                        className="ml-1 hover:text-chilli"
                        title="Remove condition"
                      >
                        <X width={12} height={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add other disease/allergy (e.g. Celiac, Fatty Liver)..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition(cur))}
                  className="flex-1 h-9 px-3 rounded-lg border border-ink/15 bg-white text-[0.82rem] focus:outline-none focus:border-leaf"
                />
                <button
                  type="button"
                  onClick={() => addCustomCondition(cur)}
                  className="btn-ghost !min-h-[36px] !px-3 text-[0.8rem]"
                >
                  Add
                </button>
              </div>

              {/* Personal Kitchen Dietary Note */}
              <label className="block pt-1">
                <span className="text-[0.78rem] text-muted font-medium">Personal Kitchen Note</span>
                <input
                  type="text"
                  value={cur.dietaryNote || ''}
                  onChange={(e) => update(cur.id, { dietaryNote: e.target.value })}
                  placeholder="e.g. Phulkas without ghee, light spice, extra lemon..."
                  className="mt-1 w-full h-9 px-3 rounded-lg border border-ink/15 bg-white text-[0.82rem] focus:outline-none focus:border-leaf"
                />
              </label>

              {/* Intelligent Calibration Summary */}
              <div className="rounded-xl bg-turmeric/10 border border-turmeric/30 p-3.5 text-[0.8rem] space-y-1">
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <span>🎯</span> Calibration for {cur.name}
                </p>
                <p className="text-muted leading-relaxed">
                  {cur.conditions.includes('diabetes') && '• Rice portion reduced by 30% to moderate glycemic spike; sabzi increased by 30% for soluble fiber. '}
                  {(cur.bpSystolic >= 130 || cur.bpDiastolic >= 80 || cur.conditions.includes('hypertension')) && '• Low sodium protocol active. Boosted potassium-rich vegetable allotment. '}
                  {cur.conditions.includes('uric-acid') && '• Dal moderated to lower dietary purines; hydration prioritized. '}
                  {cur.conditions.includes('cholesterol') && '• Soluble fiber boosted with generous dal and green sabzi portions. '}
                  {cur.conditions.length === 0 && (cur.bpSystolic < 120 && cur.bpDiastolic < 80) && '• Standard balanced macro profile calibrated for age and activity level.'}
                </p>
              </div>
            </div>

            {/* Remove Member */}
            <div className="pt-4 flex items-center justify-between">
              <button
                className="text-[0.85rem] text-chilli hover:text-chilli/80 font-medium flex items-center gap-1.5 disabled:opacity-30 transition-opacity"
                onClick={() => remove(cur.id)}
                disabled={members.length <= 1}
              >
                <X width={15} /> Remove {cur.name}
              </button>
              <span className="text-[0.75rem] text-muted">
                {members.length} / 6 family members
              </span>
            </div>
          </motion.div>
        </section>

        {/* Plates Column */}
        <section className="card p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-ink">Plates</h2>
              <p className="text-[0.8rem] text-muted mt-0.5">Custom thali portions with health calibration</p>
            </div>
            
            {/* Unit mode switch */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-ink/10 text-[0.78rem]">
              <button
                type="button"
                onClick={() => setUnitMode('bowls')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  unitMode === 'bowls'
                    ? 'bg-leaf text-bg shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                🥣 Bowls / Cups
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('metric')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  unitMode === 'metric'
                    ? 'bg-leaf text-bg shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                ⚖️ Grams / mL
              </button>
            </div>
          </div>

          {/* Formula Callout Banner */}
          <div
            onClick={() =>
              setFormulaModal({
                foodLabel: 'Rice / Dal / Sabzi',
                amount: 150,
                unit: 'g',
                memberName: 'Standard Reference',
                color: '#E0A21B',
              })
            }
            className="mt-4 p-3 rounded-xl bg-turmeric/15 border border-turmeric/35 flex items-center justify-between gap-3 cursor-pointer hover:bg-turmeric/25 transition-colors group shadow-2xs"
            title="Click to view the conversion formula breakdown"
          >
            <div className="flex items-center gap-2.5 text-[0.82rem] text-ink">
              <span className="text-xl shrink-0">🥣</span>
              <div>
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <span>Standard Formula:</span>
                  <span className="font-mono text-leaf bg-leaf/10 border border-leaf/25 px-1.5 py-0.2 rounded font-bold">
                    100g / 100ml = 1 bowl / cup
                  </span>
                </p>
                <p className="text-[0.74rem] text-muted mt-0.5">
                  Click any food portion below to inspect the step-by-step formula and bowl calculation.
                </p>
              </div>
            </div>
            <span className="text-[0.72rem] font-bold text-ink group-hover:text-leaf underline underline-offset-2 shrink-0">
              View formula ➔
            </span>
          </div>

          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {portions.map(({ m, food, bpInfo }) => {
              const isSelected = m.id === cur.id;
              const condLabels = [
                ...m.conditions.map((cId) => COMMON_CONDITIONS.find((x) => x.id === cId)?.name || cId),
                ...(m.customConditions || []),
              ];

              return (
                <li
                  key={m.id}
                  onClick={() => setSel(m.id)}
                  className={`rounded-2xl p-4 cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-turmeric/10 border-turmeric shadow-md ring-2 ring-turmeric/60 scale-[1.01]'
                      : 'bg-white/60 hover:bg-white border-ink/10 hover:border-ink/25 shadow-xs'
                  }`}
                >
                  {/* Card Header: Vitals Badges */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="chip !py-0.5 !px-2 text-[0.7rem] font-bold bg-chilli/10 text-chilli border-chilli/20">
                      🩸 {m.bloodType}
                    </span>
                    <span className={`chip !py-0.5 !px-2 text-[0.7rem] font-semibold ${bpInfo.badgeClass}`}>
                      🩺 {m.bpSystolic}/{m.bpDiastolic}
                    </span>
                  </div>

                  {/* Visual Plate SVG */}
                  <Plate food={food} />

                  {/* Member Name & Meta */}
                  <div className="text-center mt-3">
                    <p className="font-display text-lg font-semibold text-ink leading-tight">{m.name}</p>
                    <p className="text-[0.78rem] text-muted mt-0.5">
                      {m.age} y · {m.activity} activity
                    </p>
                  </div>

                  {/* Conditions Chips */}
                  <div className="mt-2 min-h-[24px] flex flex-wrap justify-center gap-1">
                    {condLabels.length > 0 ? (
                      condLabels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="chip !py-0.5 !px-2 text-[0.68rem] bg-sand/60 text-ink border-ink/15 font-medium"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="text-[0.7rem] text-muted italic">Optimal Health</span>
                    )}
                    {condLabels.length > 2 && (
                      <span className="text-[0.68rem] text-muted self-center">
                        +{condLabels.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Food Portions Grid: Clickable for formula */}
                  <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-[0.78rem] pt-3 border-t border-ink/10">
                    {food.map((x) => {
                      const isRoti = x.unit === 'pcs';
                      const primaryValue = unitMode === 'bowls' || isRoti ? x.bowlData.display : `${x.amount}`;
                      const primaryUnit = unitMode === 'bowls' || isRoti ? x.bowlData.unitLabel : x.unit;

                      return (
                        <li
                          key={x.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormulaModal({
                              foodLabel: x.label,
                              amount: x.amount,
                              unit: x.unit,
                              memberName: m.name,
                              color: x.color,
                            });
                          }}
                          className="flex flex-col bg-surface/60 hover:bg-turmeric/20 border border-ink/10 hover:border-turmeric/60 rounded-xl p-2 cursor-pointer transition-all shadow-2xs hover:shadow-xs group relative"
                          title="Click to view conversion formula: 100g/ml = 1 bowl"
                        >
                          <span className="text-[0.7rem] text-muted flex items-center justify-between">
                            <span className="font-semibold text-ink group-hover:text-leaf transition-colors">
                              {x.label}
                            </span>
                            {x.adjustTag && (
                              <span className="text-[0.62rem] text-leaf font-bold">
                                {x.adjustTag}
                              </span>
                            )}
                          </span>

                          <div className="flex items-baseline justify-between mt-1">
                            <motion.span
                              key={`${x.amount}-${unitMode}`}
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="font-bold text-ink tabular-nums text-[0.98rem] flex items-baseline gap-1"
                            >
                              <span>{primaryValue}</span>
                              <span className="text-[0.72rem] font-semibold text-leaf">
                                {primaryUnit}
                              </span>
                            </motion.span>

                            {!isRoti && (
                              <span className="text-[0.65rem] text-muted font-mono bg-white/80 px-1 py-0.2 rounded border border-ink/5">
                                {unitMode === 'bowls' ? `${x.amount} ${x.unit}` : `${x.bowlData.display} bwl`}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[0.63rem] text-clay/80 group-hover:text-clay font-medium pt-0.5 border-t border-ink/5">
                            <span className="flex items-center gap-1">
                              <span>📐</span> 100{x.unit} = 1 bowl
                            </span>
                            <span className="underline underline-offset-1 opacity-80 group-hover:opacity-100">
                              Formula
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Dietary Note */}
                  {m.dietaryNote && (
                    <p className="mt-2.5 text-[0.72rem] text-muted italic truncate text-center">
                      "{m.dietaryNote}"
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Cooking Totals & Health Insights Section */}
      <section className="mt-6 rounded-2xl bg-ink text-bg p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.18em] text-turmeric font-semibold">
              Cook this much for tonight's dinner
            </p>
            <p className="text-[0.85rem] text-bg/70 mt-1">
              Aggregated portions across all {members.length} family members (Click any card to inspect the 100g/ml = 1 bowl formula)
            </p>
          </div>
          <div className="chip bg-bg/10 text-turmeric border-turmeric/30 text-[0.75rem] font-semibold">
            Formula: 100g/ml = 1 Bowl/Cup
          </div>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {total.map((t) => {
            const isRoti = t.unit === 'pcs';
            return (
              <li
                key={t.key}
                onClick={() =>
                  setFormulaModal({
                    foodLabel: t.label,
                    amount: t.sum,
                    unit: t.unit,
                    memberName: 'Whole Family',
                    color: t.color,
                    isTotal: true,
                  })
                }
                className="border-l-2 border-turmeric/40 pl-4 cursor-pointer hover:bg-white/5 p-2 rounded-r-xl transition-all group"
                title="Click to view conversion formula: 100g/ml = 1 bowl"
              >
                <div className="flex items-center justify-between text-bg/70 text-[0.9rem]">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                    <span className="font-medium text-bg group-hover:text-turmeric transition-colors">
                      {t.label}
                    </span>
                  </span>
                  <span className="text-[0.68rem] text-turmeric font-semibold group-hover:underline">
                    Formula 📐
                  </span>
                </div>

                <div className="mt-1">
                  {isRoti ? (
                    <motion.p
                      key={t.sum}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-[2.2rem] mt-1 tabular-nums font-semibold leading-tight"
                    >
                      {t.sum}
                      <span className="text-[1rem] text-bg/60 font-sans font-normal ml-1.5">rotis</span>
                    </motion.p>
                  ) : (
                    <>
                      <motion.p
                        key={`${t.sum}-${unitMode}`}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="font-display text-[2.2rem] mt-1 tabular-nums font-semibold text-turmeric leading-tight"
                      >
                        {t.bowlData.display}
                        <span className="text-[1rem] text-bg/70 font-sans font-normal ml-1.5">
                          {t.bowlData.unitLabel}
                        </span>
                      </motion.p>
                      <p className="text-[0.78rem] text-bg/60 font-mono mt-0.5">
                        ({t.sum} {t.unit} · click for formula)
                      </p>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Kitchen Health Guidance Notes */}
        <div className="pt-4 border-t border-bg/15 grid md:grid-cols-3 gap-4 text-[0.82rem]">
          <div className="bg-bg/10 rounded-xl p-3.5 space-y-1">
            <p className="font-semibold text-turmeric flex items-center gap-1.5">
              <span>🩺</span> Blood Pressure Guidance
            </p>
            <p className="text-bg/80 leading-relaxed">
              {membersWithHypertension.length > 0 ? (
                <>
                  {membersWithHypertension.map((m) => m.name).join(' & ')}{' '}
                  {membersWithHypertension.length === 1 ? 'has' : 'have'} elevated BP. Keep tadka
                  light on salt and serve lemon wedges and roasted jeera at the table.
                </>
              ) : (
                'All family members currently have optimal blood pressure vitals.'
              )}
            </p>
          </div>

          <div className="bg-bg/10 rounded-xl p-3.5 space-y-1">
            <p className="font-semibold text-turmeric flex items-center gap-1.5">
              <span>🩸</span> Glycemic Calibration
            </p>
            <p className="text-bg/80 leading-relaxed">
              {membersWithDiabetes.length > 0 ? (
                <>
                  {membersWithDiabetes.map((m) => m.name).join(' & ')} managing diabetes: white rice
                  portion scaled down and compensated with extra leafy sabzi fiber.
                </>
              ) : (
                'Balanced carbohydrate portions suited to energetic requirements.'
              )}
            </p>
          </div>

          <div className="bg-bg/10 rounded-xl p-3.5 space-y-1">
            <p className="font-semibold text-turmeric flex items-center gap-1.5">
              <span>🧬</span> Family Blood Profile
            </p>
            <p className="text-bg/80 leading-relaxed">
              Family blood groups: {members.map((m) => `${m.name} (${m.bloodType})`).join(', ')}.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Formula Modal Dialog */}
      <AnimatePresence>
        {formulaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setFormulaModal(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-ink/15 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl bg-turmeric/20 text-turmeric text-2xl grid place-items-center">
                    🥣
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink leading-tight">
                      Portion Conversion Formula
                    </h3>
                    <p className="text-[0.82rem] text-muted">
                      {formulaModal.foodLabel} · {formulaModal.memberName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFormulaModal(null)}
                  className="w-8 h-8 rounded-full border border-ink/15 hover:bg-surface grid place-items-center text-muted hover:text-ink transition-colors"
                >
                  <X width={16} height={16} />
                </button>
              </div>

              {/* The Master Formula Rule */}
              <div className="p-4 rounded-xl bg-leaf/10 border-2 border-leaf/30 space-y-1.5 text-center">
                <p className="text-[0.72rem] uppercase tracking-wider font-bold text-leaf">
                  The Golden Kitchen Formula
                </p>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-ink">
                  100 g / 100 ml = 1 bowl / cup
                </p>
                <p className="text-[0.78rem] text-muted">
                  Standard household katori (medium bowl) = 100g cooked grain/veg or 100ml liquid dal
                </p>
              </div>

              {/* Step-by-Step Calculation */}
              <div className="rounded-xl border border-ink/10 bg-white/70 p-4 space-y-3">
                <p className="text-[0.82rem] font-semibold text-ink flex items-center justify-between">
                  <span>Step-by-step Calculation:</span>
                  <span className="font-mono text-clay font-bold">
                    Bowls = Quantity ÷ 100
                  </span>
                </p>

                {formulaModal.unit === 'pcs' ? (
                  <div className="space-y-2 text-[0.85rem]">
                    <p className="text-muted">
                      Rotis are counted directly in <strong className="text-ink">pieces</strong>:
                    </p>
                    <div className="p-3 bg-surface rounded-lg font-mono text-base font-bold text-ink">
                      {formulaModal.amount} rotis = {formulaModal.amount} medium phulkas
                    </div>
                    <p className="text-[0.75rem] text-muted">
                      (Approx. ~35g whole wheat flour dough per roti)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-[0.85rem]">
                    <div className="p-3.5 bg-surface rounded-xl font-mono space-y-1.5">
                      <div className="flex justify-between text-muted text-[0.8rem]">
                        <span>Measured Quantity:</span>
                        <span className="font-bold text-ink">{formulaModal.amount} {formulaModal.unit}</span>
                      </div>
                      <div className="flex justify-between text-muted text-[0.8rem]">
                        <span>Conversion Rate:</span>
                        <span className="font-bold text-ink">÷ 100 {formulaModal.unit} / bowl</span>
                      </div>
                      <div className="border-t border-ink/15 pt-1.5 flex justify-between text-base font-extrabold text-leaf">
                        <span>Calculated Result:</span>
                        <span>
                          {(formulaModal.amount / 100).toFixed(1)} {formulaModal.unit === 'ml' ? 'cups / bowls' : 'bowls'}
                        </span>
                      </div>
                    </div>

                    {/* Plain Language Explanation */}
                    <p className="text-[0.82rem] text-ink leading-relaxed">
                      👉 To serve: scoop out{' '}
                      <strong className="text-leaf font-bold">
                        {Math.floor(formulaModal.amount / 100)}{' '}
                        {Math.floor(formulaModal.amount / 100) === 1 ? 'full bowl' : 'full bowls'}
                      </strong>
                      {formulaModal.amount % 100 > 0 && (
                        <>
                          {' '}plus{' '}
                          <strong className="text-clay font-bold">
                            {formulaModal.amount % 100} {formulaModal.unit} (~
                            {Math.round(((formulaModal.amount % 100) / 100) * 4)} heaping tablespoons)
                          </strong>
                        </>
                      )}{' '}
                      for {formulaModal.memberName}.
                    </p>
                  </div>
                )}
              </div>

              {/* Visual Bowl Representation */}
              {formulaModal.unit !== 'pcs' && (
                <div className="space-y-1.5">
                  <p className="text-[0.75rem] font-semibold text-muted text-center">
                    Visual Serving Quantity (1 bowl = 100{formulaModal.unit}):
                  </p>
                  <BowlVisual count={formulaModal.amount / 100} color={formulaModal.color} />
                </div>
              )}

              {/* Quick Conversion Chart */}
              <div className="p-3 rounded-xl bg-surface/70 border border-ink/10 text-[0.76rem] space-y-1.5">
                <p className="font-semibold text-ink">⚡ Quick Reference:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-white p-1.5 rounded border border-ink/10">50g = 0.5 bowl</div>
                  <div className="bg-white p-1.5 rounded border border-ink/10">100g = 1.0 bowl</div>
                  <div className="bg-white p-1.5 rounded border border-ink/10">150g = 1.5 bowls</div>
                  <div className="bg-white p-1.5 rounded border border-ink/10">200g = 2.0 bowls</div>
                </div>
              </div>

              {/* Modal Footer */}
              <button
                type="button"
                onClick={() => setFormulaModal(null)}
                className="btn-primary w-full !py-2.5 text-[0.9rem]"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NextStep to="/cook" label="Cook-along" hint="One step at a time, with a timer." />
    </Page>
  );
}

function BowlVisual({ count, color }: { count: number; color: string }) {
  const fullBowls = Math.floor(count);
  const remainder = count - fullBowls;
  const totalSlots = Math.min(6, Math.max(1, Math.ceil(count)));

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center py-2">
      {Array.from({ length: totalSlots }).map((_, i) => {
        const fillPercent = i < fullBowls ? 100 : Math.round(remainder * 100);
        return (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-8 rounded-b-full border-2 border-ink/40 relative overflow-hidden bg-sand/30 shadow-2xs">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                style={{
                  height: `${fillPercent}%`,
                  background: color,
                  opacity: 0.88,
                }}
              />
            </div>
            <span className="text-[0.68rem] text-muted font-mono mt-1">
              {i < fullBowls ? '1 bowl' : `${remainder.toFixed(1)} bowl`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Plate({
  food,
}: {
  food: { key: string; color: string; f: number }[];
}) {
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
      {food.map((f, i) => {
        // Individual spot radius adapts to individual item scale
        const itemScale = Math.min(1.35, Math.max(0.45, f.f));
        return (
          <motion.circle
            key={f.key}
            cx={spots[i][0]}
            cy={spots[i][1]}
            fill={f.color}
            stroke="rgba(43,36,32,0.12)"
            animate={{ r: 14 * itemScale }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          />
        );
      })}
    </svg>
  );
}
