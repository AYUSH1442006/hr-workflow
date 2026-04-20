/**
 * components/config/TaskConfig.tsx
 * Dynamic form for Task nodes.
 * Fields: title (required), description, assignee, dueDate, customFields (key-value).
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { TaskNodeData, MetaEntry } from '../../types';
import { FormField, FormLabel, Input, TextArea } from './FormPrimitives';

interface Props { nodeId: string; data: TaskNodeData }

const TaskConfig: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const update = (patch: Partial<TaskNodeData>) => updateNodeData(nodeId, patch as never);

  const addField = () =>
    update({ customFields: [...data.customFields, { key: '', value: '' }] });

  const updateField = (i: number, field: keyof MetaEntry, val: string) => {
    const next = data.customFields.map((f, idx) =>
      idx === i ? { ...f, [field]: val } : f
    );
    update({ customFields: next });
  };

  const removeField = (i: number) =>
    update({ customFields: data.customFields.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <FormField>
        <FormLabel>Title <span className="text-rose-400">*</span></FormLabel>
        <Input
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Task name…"
        />
        {!data.title.trim() && (
          <p className="text-rose-400 text-[10px]">Title is required</p>
        )}
      </FormField>

      <FormField>
        <FormLabel>Description</FormLabel>
        <TextArea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="What needs to be done…"
        />
      </FormField>

      <FormField>
        <FormLabel>Assignee</FormLabel>
        <Input
          value={data.assignee}
          onChange={(e) => update({ assignee: e.target.value })}
          placeholder="name@company.com or role"
        />
      </FormField>

      <FormField>
        <FormLabel>Due Date</FormLabel>
        <Input
          type="date"
          value={data.dueDate}
          onChange={(e) => update({ dueDate: e.target.value })}
        />
      </FormField>

      {/* Custom fields */}
      <FormField>
        <div className="flex items-center justify-between">
          <FormLabel>Custom Fields</FormLabel>
          <button
            onClick={addField}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2 mt-1">
          {data.customFields.length === 0 && (
            <p className="text-slate-600 text-xs italic">No custom fields.</p>
          )}
          {data.customFields.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={f.key}
                onChange={(e) => updateField(i, 'key', e.target.value)}
                placeholder="Field name"
                className="flex-1"
              />
              <Input
                value={f.value}
                onChange={(e) => updateField(i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <button
                onClick={() => removeField(i)}
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

export default TaskConfig;
