/**
 * components/config/AutomatedConfig.tsx
 * Form for Automated nodes.
 * Loads actions from the API, then renders dynamic params based on selected action.
 * Architecture: uses a local useEffect for API fetch, stores result in component state.
 */

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { getAutomations } from '../../services/api';
import type { AutomatedNodeData, AutomationAction } from '../../types';
import { FormField, FormLabel, Input, Select } from './FormPrimitives';

interface Props { nodeId: string; data: AutomatedNodeData }

const AutomatedConfig: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const update = (patch: Partial<AutomatedNodeData>) => updateNodeData(nodeId, patch as never);

  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch automation actions once on mount
  useEffect(() => {
    getAutomations().then((a) => {
      setActions(a);
      setLoading(false);
    });
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (id: string) => {
    // Reset params when action changes
    update({ actionId: id, params: {} });
  };

  const handleParamChange = (name: string, value: string) => {
    update({ params: { ...data.params, [name]: value } });
  };

  return (
    <div className="space-y-4">
      <FormField>
        <FormLabel>Title</FormLabel>
        <Input
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Step name…"
        />
      </FormField>

      <FormField>
        <FormLabel>Action</FormLabel>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
            <Loader2 size={13} className="animate-spin" /> Loading actions…
          </div>
        ) : (
          <Select
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">— Select an action —</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </Select>
        )}
      </FormField>

      {/* Action description */}
      {selectedAction && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
          <p className="text-violet-300/80 text-[11px] leading-relaxed">
            {selectedAction.description}
          </p>
        </div>
      )}

      {/* Dynamic parameters */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3">
          <FormLabel>Parameters</FormLabel>
          {selectedAction.params.map((param) => (
            <FormField key={param.name}>
              <FormLabel>{param.label}</FormLabel>
              {param.type === 'select' && param.options ? (
                <Select
                  value={data.params[param.name] ?? ''}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                >
                  <option value="">— Choose —</option>
                  {param.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={param.type === 'number' ? 'number' : 'text'}
                  value={data.params[param.name] ?? ''}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                  placeholder={`Enter ${param.label.toLowerCase()}…`}
                />
              )}
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomatedConfig;
