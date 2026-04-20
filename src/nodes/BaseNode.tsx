/**
 * nodes/BaseNode.tsx
 * Shared wrapper used by every custom node type.
 * Handles: selection indicator, delete button, validation glow, handle styling.
 */

import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

interface BaseNodeProps {
  id: string;
  selected: boolean;
  accentColor: string; // Tailwind gradient classes or hex
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  showTarget?: boolean;
  showSource?: boolean;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  selected,
  accentColor,
  icon,
  label,
  children,
  showTarget = true,
  showSource = true,
}) => {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      onClick={() => selectNode(id)}
      className={`
        relative rounded-xl border-2 min-w-[180px] max-w-[220px] overflow-visible
        transition-all duration-200 cursor-pointer select-none
        ${selected
          ? 'border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.35)] bg-slate-800'
          : 'border-slate-600/60 bg-slate-800/90 hover:border-slate-500 hover:shadow-lg'
        }
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Header strip */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl ${accentColor}`}>
        <span className="text-white">{icon}</span>
        <span className="text-white text-xs font-semibold truncate flex-1">{label}</span>
        <button
          onClick={handleDelete}
          className="text-white/70 hover:text-white hover:bg-white/20 rounded p-0.5 transition-colors"
          title="Delete node"
        >
          <X size={12} />
        </button>
      </div>

      {/* Body */}
      {children && (
        <div className="px-3 py-2 text-slate-300 text-xs space-y-1">{children}</div>
      )}

      {/* Handles */}
      {showTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-700"
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-700"
        />
      )}
    </div>
  );
};

export default BaseNode;
