'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { catalogHref } from '@/lib/data/navigation';

const PEPTIDE_PRESETS_MG = [2, 3, 5, 10, 15] as const;
const DILUENT_PRESETS_ML = [1, 2, 3, 5] as const;
const SYRINGE_PRESETS_ML = [0.3, 0.5, 1.0] as const;

const DOSE_PRESETS: { label: string; mg: number }[] = [
  { label: '50 mcg', mg: 0.05 },
  { label: '100 mcg', mg: 0.1 },
  { label: '250 mcg', mg: 0.25 },
  { label: '500 mcg', mg: 0.5 },
  { label: '1 mg', mg: 1 },
  { label: '2.5 mg', mg: 2.5 },
  { label: '5 mg', mg: 5 },
  { label: '10 mg', mg: 10 },
];

function clampPositive(n: number, fallback: number) {
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

function presetButtonClass(active: boolean) {
  return active
    ? 'border-lab-primary/60 bg-lab-primary/20 text-white'
    : 'border-white/10 bg-lab-base/60 text-slate-300 hover:border-lab-primary/30 hover:text-white';
}

export function PeptideCalculatorClient() {
  const [peptidePreset, setPeptidePreset] = useState<number | 'custom'>(5);
  const [peptideCustomMg, setPeptideCustomMg] = useState('5');
  const [diluentPreset, setDiluentPreset] = useState<number | 'custom'>(2);
  const [diluentCustomMl, setDiluentCustomMl] = useState('2');
  const [doseMode, setDoseMode] = useState<'preset' | 'custom'>('preset');
  const [dosePresetMg, setDosePresetMg] = useState(0.1);
  const [doseCustomMg, setDoseCustomMg] = useState('0.1');
  const [syringeMl, setSyringeMl] = useState(1.0);

  const peptideMg = useMemo(() => {
    if (peptidePreset === 'custom') return clampPositive(parseFloat(peptideCustomMg), 5);
    return peptidePreset;
  }, [peptidePreset, peptideCustomMg]);

  const diluentMl = useMemo(() => {
    if (diluentPreset === 'custom') return clampPositive(parseFloat(diluentCustomMl), 2);
    return diluentPreset;
  }, [diluentPreset, diluentCustomMl]);

  const targetDoseMg = useMemo(() => {
    if (doseMode === 'custom') return clampPositive(parseFloat(doseCustomMg), 0.1);
    return dosePresetMg;
  }, [doseMode, dosePresetMg, doseCustomMg]);

  const concentrationMgPerMl = peptideMg / diluentMl;
  const volumeMl = (targetDoseMg * diluentMl) / peptideMg;
  const insulinUnits = volumeMl * 100;
  const exceedsSyringe = volumeMl > syringeMl + 1e-9;

  const inputClass =
    'mt-1 w-full max-w-xs rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-sm text-white outline-none focus:border-lab-primary/50';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-lab-elevated/40 shadow-glow">
        <div className="border-b border-white/10 bg-gradient-to-br from-lab-primary/15 to-transparent px-6 py-5">
          <h2 className="font-display text-lg text-white">Measurement inputs</h2>
          <p className="mt-1 text-sm text-slate-400">
            Enter experiment variables for lyophilised peptide stocks (research planning only).
          </p>
        </div>

        <div className="space-y-8 p-6">
          <fieldset>
            <legend className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Peptide mass (vial size)
            </legend>
            <div className="flex flex-wrap gap-2">
              {PEPTIDE_PRESETS_MG.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => {
                    setPeptidePreset(mg);
                    setPeptideCustomMg(String(mg));
                  }}
                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(peptidePreset === mg)}`}
                >
                  {mg} mg
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPeptidePreset('custom')}
                className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(peptidePreset === 'custom')}`}
              >
                Custom
              </button>
            </div>
            {peptidePreset === 'custom' ? (
              <label className="mt-3 block text-xs text-slate-500">
                Custom amount (mg)
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={peptideCustomMg}
                  onChange={(e) => setPeptideCustomMg(e.target.value)}
                  className={inputClass}
                />
              </label>
            ) : null}
          </fieldset>

          <fieldset>
            <legend className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Diluent volume (bacteriostatic water)
            </legend>
            <div className="flex flex-wrap gap-2">
              {DILUENT_PRESETS_ML.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => {
                    setDiluentPreset(ml);
                    setDiluentCustomMl(String(ml));
                  }}
                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(diluentPreset === ml)}`}
                >
                  {ml} mL
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDiluentPreset('custom')}
                className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(diluentPreset === 'custom')}`}
              >
                Custom
              </button>
            </div>
            {diluentPreset === 'custom' ? (
              <label className="mt-3 block text-xs text-slate-500">
                Custom volume (mL)
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={diluentCustomMl}
                  onChange={(e) => setDiluentCustomMl(e.target.value)}
                  className={inputClass}
                />
              </label>
            ) : null}
          </fieldset>

          <fieldset>
            <legend className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Target dose (per administration)
            </legend>
            <div className="flex flex-wrap gap-2">
              {DOSE_PRESETS.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => {
                    setDoseMode('preset');
                    setDosePresetMg(d.mg);
                    setDoseCustomMg(String(d.mg));
                  }}
                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(
                    doseMode === 'preset' && dosePresetMg === d.mg,
                  )}`}
                >
                  {d.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDoseMode('custom')}
                className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(doseMode === 'custom')}`}
              >
                Custom
              </button>
            </div>
            {doseMode === 'custom' ? (
              <label className="mt-3 block text-xs text-slate-500">
                Custom dose (mg) — use 0.05 for 50 mcg
                <input
                  type="number"
                  min="0.000001"
                  step="any"
                  value={doseCustomMg}
                  onChange={(e) => setDoseCustomMg(e.target.value)}
                  className={inputClass}
                />
              </label>
            ) : null}
          </fieldset>

          <fieldset>
            <legend className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Syringe size
            </legend>
            <div className="flex flex-wrap gap-2">
              {SYRINGE_PRESETS_ML.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => setSyringeMl(ml)}
                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${presetButtonClass(syringeMl === ml)}`}
                >
                  {ml} mL ({ml === 0.3 ? '30' : ml === 0.5 ? '50' : '100'} units)
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="border-t border-white/10 bg-lab-base/60 px-6 py-6">
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Required volume</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-lab-surface/80 p-4">
              <div className="font-display text-3xl tabular-nums text-spectrum">
                {volumeMl.toFixed(3)}
                <span className="ml-1 text-base font-normal text-slate-500">mL</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Concentration after reconstitution:{' '}
                <span className="font-mono text-lab-mint">{concentrationMgPerMl.toFixed(4)} mg/mL</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-lab-surface/80 p-4">
              <div className="font-display text-3xl tabular-nums text-white">
                {insulinUnits.toFixed(1)}
                <span className="ml-1 text-base font-normal text-slate-500">units</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">U-100 scale: 100 units = 1 mL (barrel mark reference).</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Draw <strong className="text-lab-primary">{volumeMl.toFixed(3)} mL</strong> into a{' '}
            <strong>{syringeMl} mL</strong> syringe for the selected target dose.
          </p>
          {exceedsSyringe ? (
            <p className="mt-3 rounded-xl border border-lab-energy/30 bg-lab-energy/10 px-3 py-2 text-sm text-lab-energy">
              Volume exceeds syringe capacity ({syringeMl} mL). Use a larger syringe, adjust diluent, or revise per
              institutional SOPs.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-lab-surface/50 p-6 text-sm leading-relaxed text-slate-400">
        <h3 className="font-display text-white">Catalog cross-reference</h3>
        <p className="mt-2">
          Lyophilised peptides ship with batch-specific COAs so labelled mass can be reconciled with diluent volume.
          Always verify solubility and buffers per compound. Browse the{' '}
          <Link href={catalogHref('/products')} className="text-lab-primary hover:text-white">
            analytical catalog
          </Link>{' '}
          or{' '}
          <Link href={catalogHref('/coa')} className="text-lab-primary hover:text-white">
            COA library
          </Link>{' '}
          for SKU documentation.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-lab-energy/20 bg-lab-energy/5 p-5 text-xs text-slate-400">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-lab-energy">Research use only</p>
        <p>
          Educational and laboratory planning tool only. Products are sold strictly for research use (RUO); not for human
          or veterinary diagnosis, treatment, or consumption. Independently verify calculations and follow institutional
          chemical hygiene policies.
        </p>
      </div>
    </div>
  );
}
