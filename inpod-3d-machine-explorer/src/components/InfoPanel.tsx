import { AlertTriangle, CheckCircle2, Radio, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { type FaultInfo, type ViewMode } from '../data/faults';

interface InfoPanelProps {
  fault: FaultInfo;
  viewMode: ViewMode;
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-slate-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfoPanel({ fault, viewMode }: InfoPanelProps) {
  const Icon = fault.icon;

  return (
    <motion.aside
      key={fault.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="h-full rounded-lg border border-white/10 bg-[#10161a]/92 p-5 shadow-panel backdrop-blur-xl"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {viewMode === 'xray' ? 'X-Ray Insight' : viewMode === 'fault' ? 'Fault Detail' : 'Selected Area'}
          </p>
          <h3 className="text-2xl font-semibold tracking-normal text-white">{fault.title}</h3>
        </div>
        <div className="rounded-md border border-white/10 bg-white/8 p-3 text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-300">{fault.explanation}</p>

        <ListBlock title="INPOD Detects" items={fault.detectedIssues ?? fault.capabilities} />
        <ListBlock title="Measured By" items={fault.measuredBy} />

        {fault.alert && (
          <div className="rounded-lg border border-amber-300/25 bg-amber-300/8 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              Example early warning
            </div>
            <p className="text-sm leading-6 text-amber-50">{fault.alert}</p>
          </div>
        )}

        {fault.tagline && (
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/8 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <Radio className="h-4 w-4" />
              INPOD capability
            </div>
            <p className="text-lg font-semibold text-white">{fault.tagline}</p>
          </div>
        )}

        <div className="signal-chip rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Waves className="h-4 w-4 text-cyan-300" />
            Live signal path
          </div>
          <p className="text-sm leading-6 text-slate-300">
            The animated trace links this component to the INPOD device, showing how asset
            behaviour is converted into trend and alert data.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
