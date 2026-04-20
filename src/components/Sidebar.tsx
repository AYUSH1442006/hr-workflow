/**
 * components/Sidebar.tsx
 * Left panel — node palette for drag-and-drop onto the canvas.
 *
 * Architecture: Uses HTML5 drag events. On dragStart we embed the node kind
 * in dataTransfer so the Canvas can read it and call addNode at drop position.
 */

import React from 'react';
import {
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  FlagTriangleRight,
  GripVertical,
  Info,
} from 'lucide-react';
import type { NodeKind } from '../types';

interface PaletteItem {
  kind: NodeKind;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  textColor: string;
}

const PALETTE: PaletteItem[] = [
  {
    kind: 'start',
    label: 'Start',
    description: 'Entry point of the workflow',
    icon: <Play size={16} />,
    accent: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/40',
    textColor: 'text-emerald-400',
  },
  {
    kind: 'task',
    label: 'Task',
    description: 'Human-assigned work item',
    icon: <ClipboardList size={16} />,
    accent: 'from-blue-600/20 to-indigo-600/20 border-blue-500/40',
    textColor: 'text-blue-400',
  },
  {
    kind: 'approval',
    label: 'Approval',
    description: 'Review / approval gate',
    icon: <ShieldCheck size={16} />,
    accent: 'from-amber-500/20 to-orange-600/20 border-amber-500/40',
    textColor: 'text-amber-400',
  },
  {
    kind: 'automated',
    label: 'Automated Step',
    description: 'System-triggered action',
    icon: <Zap size={16} />,
    accent: 'from-violet-600/20 to-purple-700/20 border-violet-500/40',
    textColor: 'text-violet-400',
  },
  {
    kind: 'end',
    label: 'End',
    description: 'Terminal node',
    icon: <FlagTriangleRight size={16} />,
    accent: 'from-rose-600/20 to-red-700/20 border-rose-500/40',
    textColor: 'text-rose-400',
  },
];

const Sidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, kind: NodeKind) => {
    e.dataTransfer.setData('application/hr-node-kind', kind);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-slate-900 border-r border-slate-700/60 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-700/60">
        <h2 className="text-slate-200 font-semibold text-sm tracking-wide">Node Palette</h2>
        <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
          <Info size={10} /> Drag nodes onto the canvas
        </p>
      </div>

      {/* Palette items */}
      <div className="flex flex-col gap-2 p-3">
        {PALETTE.map((item) => (
          <div
            key={item.kind}
            draggable
            onDragStart={(e) => handleDragStart(e, item.kind)}
            className={`
              flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-br cursor-grab active:cursor-grabbing
              ${item.accent} transition-all duration-150
              hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30
              select-none
            `}
          >
            <GripVertical size={12} className="text-slate-500 shrink-0" />
            <span className={`${item.textColor} shrink-0`}>{item.icon}</span>
            <div className="min-w-0">
              <p className={`text-xs font-semibold ${item.textColor}`}>{item.label}</p>
              <p className="text-slate-500 text-[10px] leading-tight truncate">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-auto px-4 py-4 border-t border-slate-700/60">
        <p className="text-slate-600 text-[10px] leading-relaxed">
          Click a node on the canvas to edit its properties in the right panel.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
