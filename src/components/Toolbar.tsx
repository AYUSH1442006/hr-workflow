/**
 * components/Toolbar.tsx
 * Top navigation bar with: logo, workflow actions (export, import, reset), undo/redo.
 * Architecture: import/export uses the useWorkflow hook. File input is hidden and
 * triggered programmatically for cleaner UX.
 */

import React, { useRef } from 'react';
import {
  Download, Upload, Trash2,
  GitBranch, Undo2, Redo2,
} from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useWorkflowStore } from '../store/workflowStore';

interface ToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const { downloadJSON, importJSON, resetWorkflow } = useWorkflow();
  const nodeCount = useWorkflowStore((s) => s.nodes.length);
  const edgeCount = useWorkflowStore((s) => s.edges.length);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        importJSON(ev.target.result);
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = '';
  };

  const handleReset = () => {
    if (nodeCount === 0 || confirm('Reset workflow? This will clear all nodes and edges.')) {
      resetWorkflow();
    }
  };

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5
      bg-slate-900/95 border-b border-slate-700/60 z-40"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <GitBranch size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-slate-100 text-sm font-bold tracking-tight">HR Workflow Designer</h1>
          <p className="text-slate-500 text-[10px]">
            {nodeCount} node{nodeCount !== 1 ? 's' : ''} · {edgeCount} edge{edgeCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 mr-2">
          <ActionBtn
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            icon={<Undo2 size={14} />}
          />
          <ActionBtn
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            icon={<Redo2 size={14} />}
          />
        </div>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Import */}
        <ActionBtn
          onClick={() => fileInputRef.current?.click()}
          title="Import workflow JSON"
          icon={<Upload size={14} />}
          label="Import"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileImport}
        />

        {/* Export */}
        <ActionBtn
          onClick={downloadJSON}
          disabled={nodeCount === 0}
          title="Export workflow JSON"
          icon={<Download size={14} />}
          label="Export"
        />

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Reset */}
        <ActionBtn
          onClick={handleReset}
          title="Reset canvas"
          icon={<Trash2 size={14} />}
          label="Reset"
          danger
        />
      </div>
    </header>
  );
};

interface ActionBtnProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  icon: React.ReactNode;
  label?: string;
  danger?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  onClick, disabled, title, icon, label, danger
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
      transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
      ${danger
        ? 'text-rose-400 hover:bg-rose-500/15 hover:text-rose-300'
        : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
      }
    `}
  >
    {icon}
    {label && <span>{label}</span>}
  </button>
);

export default Toolbar;
