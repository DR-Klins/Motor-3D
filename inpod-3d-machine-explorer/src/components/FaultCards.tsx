import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { faults, type FaultId } from '../data/faults';

interface FaultCardsProps {
  activeFault: FaultId;
  onSelectFault: (fault: FaultId) => void;
}

export function FaultCards({ activeFault, onSelectFault }: FaultCardsProps) {
  return (
    <section className="border-t border-white/8 bg-[#0c1012] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Fault library
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              What INPOD helps reveal
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Each area maps to a machine component, an expected fault family, and the
            monitoring signals used to detect early changes in behaviour.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faults.map((fault, index) => {
            const Icon = fault.icon;
            const active = fault.id === activeFault;
            const issues = fault.detectedIssues ?? fault.capabilities ?? [];

            return (
              <motion.button
                key={fault.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.04, duration: 0.28 }}
                whileHover={{ y: -4 }}
                type="button"
                onClick={() => onSelectFault(fault.id)}
                className={`group rounded-lg border p-5 text-left transition ${
                  active
                    ? 'border-cyan-300/50 bg-cyan-300/10'
                    : 'border-white/10 bg-white/[0.045] hover:border-white/22 hover:bg-white/[0.07]'
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="rounded-md border border-white/10 bg-black/25 p-3 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-500 transition group-hover:text-cyan-200" />
                </div>
                <h3 className="text-lg font-semibold tracking-normal text-white">
                  {fault.cardTitle}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{fault.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {issues.slice(0, 3).map((issue) => (
                    <span
                      key={issue}
                      className="rounded-full border border-white/10 bg-black/22 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
