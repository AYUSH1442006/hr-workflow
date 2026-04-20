/**
 * components/config/EndConfig.tsx
 * Form for End nodes: final message, summary toggle.
 */

import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { EndNodeData } from '../../types';
import { FormField, FormLabel, Input, Toggle } from './FormPrimitives';

interface Props { nodeId: string; data: EndNodeData }

const EndConfig: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const update = (patch: Partial<EndNodeData>) => updateNodeData(nodeId, patch as never);

  return (
    <div className="space-y-4">
      <FormField>
        <FormLabel>End Message</FormLabel>
        <Input
          value={data.endMessage}
          onChange={(e) => update({ endMessage: e.target.value })}
          placeholder="e.g. Workflow Complete"
        />
      </FormField>

      <Toggle
        label="Generate Summary Report"
        checked={data.showSummary}
        onChange={(v) => update({ showSummary: v })}
      />

      {data.showSummary && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
          <p className="text-rose-300/80 text-[11px] leading-relaxed">
            A summary PDF will be generated automatically when the workflow reaches this node.
          </p>
        </div>
      )}
    </div>
  );
};

export default EndConfig;
