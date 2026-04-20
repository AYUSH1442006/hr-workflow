/**
 * components/SimulationPanel.tsx
 * Bottom drawer panel for running workflow simulations.
 * Shows: validation errors, step-by-step execution logs in a timeline format.
 *
 * Architecture: Calls useWorkflow hook which handles the API call + state.
 * Panel is collapsible to avoid blocking the canvas.
 */

import React, { useMemo } from 'react';
import {
  Play, ChevronUp, ChevronDown, CheckCircle2,
  AlertTriangle, XCircle, Clock, Loader2, Info,
} from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import type { SimLog } from '../types';

const STATUS_CONFIG = {
  success: {
    icon: <CheckCircle2 size={14} />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  error: {
    icon: <XCircle size={14} />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
};

const KIND_BADGE: Record<string, string> = {
  start: 'bg-emerald-500/20 text-emerald-300',
  task: 'bg-blue-500/20 text-blue-300',
  approval: 'bg-amber-500/20 text-amber-300',
  automated: 'bg-violet-500/20 text-violet-300',
  end: 'bg-rose-500/20 text-rose-300',
};

const LogRow: React.FC<{ log: SimLog }> = ({ log }) => {
  const cfg = STATUS_CONFIG[log.status];
  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${cfg.bg} transition-all`}>
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${cfg.color} bg-slate-800 border border-current`}>
          {log.step}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${KIND_BADGE[log.nodeKind] ?? 'bg-slate-700 text-slate-300'}`}>
            {log.nodeKind}
          </span>
          <span className="text-slate-200 text-xs font-medium truncate">{log.nodeTitle}</span>
          <span className={`ml-auto flex items-center gap-1 text-[10px] ${cfg.color}`}>
            {cfg.icon} {log.status}
          </span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">{log.message}</p>
        <p className="text-slate-600 text-[10px] mt-1 flex items-center gap-1">
          <Clock size={9} />
          {new Date(log.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

interface SimulationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ isOpen, onToggle }) => {
  const { validate, runSimulation, simulating, simResult, clearSimResult } = useWorkflow();

  // Memoize validation to avoid recalculating on every render
  const validation = useMemo(() => validate(), [validate]);

  const handleRun = async () => {
    const result = validate();
    if (!result.valid) {
      alert('Fix validation errors before simulating:\n\n' + result.messages.join('\n'));
      return;
    }
    if (!isOpen) onToggle();
    await runSimulation();
  };

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 z-50
        flex flex-col bg-slate-900/95 border-t border-slate-700/60
        transition-all duration-300 ease-in-out
        ${isOpen ? 'h-72' : 'h-12'}
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Toolbar bar */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={simulating}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
              text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {simulating
              ? <><Loader2 size={12} className="animate-spin" /> Simulating…</>
              : <><Play size={12} /> Run Simulation</>
            }
          </button>

          {!validation.valid && (
            <span className="flex items-center gap-1 text-amber-400 text-xs">
              <AlertTriangle size={12} />
              {validation.messages.length} issue{validation.messages.length > 1 ? 's' : ''}
            </span>
          )}
          {validation.valid && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <CheckCircle2 size={12} /> Workflow valid
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs font-medium">Simulation Log</span>
          {simResult && (
            <button onClick={clearSimResult} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
              Clear
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Log content */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!simResult && !simulating && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Info size={28} className="text-slate-700 mb-2" />
              <p className="text-slate-500 text-sm">No simulation run yet.</p>
              <p className="text-slate-600 text-xs mt-1">Build a workflow and click "Run Simulation".</p>
            </div>
          )}

          {simulating && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 size={28} className="text-indigo-400 animate-spin" />
              <p className="text-slate-400 text-sm">Executing workflow…</p>
            </div>
          )}

          {simResult && !simulating && (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${simResult.success
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                {simResult.success
                  ? <><CheckCircle2 size={15} /> Simulation completed successfully</>
                  : <><XCircle size={15} /> Simulation finished with errors</>
                }
              </div>

              {simResult.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/25">
                  <XCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-rose-300 text-xs">{err}</p>
                </div>
              ))}

              {simResult.logs.map((log) => (
                <LogRow key={`${log.step}-${log.nodeId}`} log={log} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
