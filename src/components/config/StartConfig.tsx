/**
 * components/config/StartConfig.tsx
 * Configuration form for Start nodes.
 * Supports: title text + dynamic key-value metadata pairs.
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { StartNodeData, MetaEntry } from '../../types';
import { FormField, FormLabel, Input, TextArea } from './FormPrimitives';

interface Props { nodeId: string; data: StartNodeData }

const StartConfig: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const update = (patch: Partial<StartNodeData>) =>
    updateNodeData(nodeId, patch as never);

  const addMeta = () =>
    update({ metadata: [...data.metadata, { key: '', value: '' }] });

  const updateMeta = (i: number, field: keyof MetaEntry, val: string) => {
    const next = data.metadata.map((m, idx) =>
      idx === i ? { ...m, [field]: val } : m
    );
    update({ metadata: next });
  };

  const removeMeta = (i: number) =>
    update({ metadata: data.metadata.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <FormField>
        <FormLabel>Title</FormLabel>
        <Input
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Workflow title…"
        />
      </FormField>

      {/* Metadata key-value pairs */}
      <FormField>
        <div className="flex items-center justify-between">
          <FormLabel>Metadata</FormLabel>
          <button
            onClick={addMeta}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add Field
          </button>
        </div>
        <div className="space-y-2 mt-1">
          {data.metadata.length === 0 && (
            <p className="text-slate-600 text-xs italic">No metadata yet.</p>
          )}
          {data.metadata.map((m, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={m.key}
                onChange={(e) => updateMeta(i, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1"
              />
              <Input
                value={m.value}
                onChange={(e) => updateMeta(i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <button
                onClick={() => removeMeta(i)}
                className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </FormField>
    </div>
  );
};

export default StartConfig;
