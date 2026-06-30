import { Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crosshair,
  Eye,
  Maximize2,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import MachineScene from './components/MachineScene';
import { FaultCards } from './components/FaultCards';
import { InfoPanel } from './components/InfoPanel';
import { defaultFault, getFault, type FaultId, type ViewMode } from './data/faults';

const controls: Array<{ mode: ViewMode; label: string; icon: typeof Eye }> = [
  { mode: 'normal', label: 'Normal View', icon: Eye },
  { mode: 'xray', label: 'X-Ray View', icon: Sparkles },
  { mode: 'fault', label: 'Fault View', icon: Crosshair },
];

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [activeFault, setActiveFault] = useState<FaultId>(defaultFault.id);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const activeInfo = useMemo(() => getFault(activeFault), [activeFault]);

  const scrollToExplorer = () => {
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectFault = (fault: FaultId) => {
    setActiveFault(fault);
    if (viewMode === 'normal') setViewMode('fault');
  };

  return (
    <main className="min-h-screen overflow-hidden text-slate-100">
      <section className="relative min-h-screen px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/8 px-3 py-1.5 text-sm font-semibold text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Condition Monitoring
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
              See what INPOD detects before failure happens
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore mechanical and electrical faults across a motor-driven asset using an
              interactive X-ray machine view.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToExplorer}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-200"
              >
                <Radar className="h-4 w-4" />
                Explore faults
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('xray');
                  scrollToExplorer();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/28 hover:bg-white/12"
              >
                <Sparkles className="h-4 w-4" />
                Switch to X-Ray
              </button>
            </div>
            <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
              {['Vibration', 'Temperature', 'Electrical'].map((metric) => (
                <div key={metric} className="rounded-lg border border-white/8 bg-white/[0.045] p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{metric}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">Continuous trend</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="relative h-[460px] overflow-hidden rounded-lg border border-white/10 bg-[#0c1114] shadow-panel viewer-grid lg:h-[620px]"
          >
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur">
              INPOD Machine Insight Explorer
            </div>
            <Suspense fallback={<div className="grid h-full place-items-center text-slate-400">Loading 3D view</div>}>
              <MachineScene
                activeFault={activeFault}
                viewMode={viewMode}
                onSelectFault={selectFault}
                cameraResetKey={cameraResetKey}
              />
            </Suspense>
            {viewMode === 'xray' && <div className="scanline" />}
          </motion.div>
        </div>
      </section>

      <section id="explorer" className="relative bg-[#080b0d] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                INPOD Machine Insight Explorer
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Rotate, isolate, and inspect the asset
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {controls.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold transition ${
                    viewMode === mode
                      ? 'border-cyan-300/60 bg-cyan-300/12 text-cyan-100'
                      : 'border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/24 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCameraResetKey((key) => key + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/24 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Camera
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="relative h-[520px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1215] shadow-panel viewer-grid sm:h-[640px]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 backdrop-blur">
                  {viewMode === 'normal' ? 'Solid materials' : viewMode === 'xray' ? 'Transparent casing' : 'Active fault pulse'}
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur">
                  Live signal trace
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCameraResetKey((key) => key + 1)}
                className="absolute right-4 top-4 z-10 rounded-md border border-white/10 bg-black/35 p-2 text-slate-200 backdrop-blur transition hover:border-white/28"
                aria-label="Reset camera"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <Suspense fallback={<div className="grid h-full place-items-center text-slate-400">Loading 3D view</div>}>
                <MachineScene
                  activeFault={activeFault}
                  viewMode={viewMode}
                  onSelectFault={selectFault}
                  cameraResetKey={cameraResetKey}
                />
              </Suspense>
              {viewMode === 'xray' && <div className="scanline" />}
            </div>

            <InfoPanel fault={activeInfo} viewMode={viewMode} />
          </div>
        </div>
      </section>

      <FaultCards activeFault={activeFault} onSelectFault={selectFault} />
    </main>
  );
}

export default App;
