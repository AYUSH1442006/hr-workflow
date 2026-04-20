/**
 * components/ConfigPanel.tsx
 * Right-side panel shown when a node is selected.
 * Routes to the correct form component based on node kind (discriminated union).
 *
 * Architecture: ConfigPanel reads selectedNodeId from the Zustand store and
 * the corresponding node data, then delegates to the appropriate sub-form.
 */

import React from 'react';
import { X, Settings2 } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import StartConfig from './config/StartConfig';
import TaskConfig from './config/TaskConfig';
import ApprovalConfig from './config/ApprovalConfig';
import AutomatedConfig from './config/AutomatedConfig';
import EndConfig from './config/EndConfig';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedNodeData, EndNodeData,
} from '../types';

const KIND_LABELS: Record<string, string> = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end: 'End Node',
};

const KIND_COLORS: Record<string, string> = {
  start: 'text-emerald-400',
  task: 'text-blue-400',
  approval: 'text-amber-400',
  automated: 'text-violet-400',
  end: 'text-rose-400',
};

const ConfigPanel: React.FC = () => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-72 shrink-0 flex flex-col items-center justify-center bg-slate-900 border-l border-slate-700/60">
        <div className="text-center px-6">
          <Settings2 size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No node selected</p>
          <p className="text-slate-600 text-xs mt-1">Click a node on the canvas to configure it</p>
        </div>
      </aside>
    );
  }

  const { data } = selectedNode;
  const kind = data.kind;

  return (
    <aside className="w-72 shrink-0 flex flex-col bg-slate-900 border-l border-slate-700/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-700/60 shrink-0">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest ${KIND_COLORS[kind] ?? 'text-indigo-400'}`}>
            {KIND_LABELS[kind] ?? kind}
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5 font-mono truncate max-w-[180px]">
            id: {selectedNode.id.slice(0, 8)}…
          </p>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-700/60"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {kind === 'start' && (
          <StartConfig nodeId={selectedNode.id} data={data as StartNodeData} />
        )}
        {kind === 'task' && (
          <TaskConfig nodeId={selectedNode.id} data={data as TaskNodeData} />
        )}
        {kind === 'approval' && (
          <ApprovalConfig nodeId={selectedNode.id} data={data as ApprovalNodeData} />
        )}
        {kind === 'automated' && (
          <AutomatedConfig nodeId={selectedNode.id} data={data as AutomatedNodeData} />
        )}
        {kind === 'end' && (
          <EndConfig nodeId={selectedNode.id} data={data as EndNodeData} />
        )}
      </div>
    </aside>
  );
};

export default ConfigPanel;
