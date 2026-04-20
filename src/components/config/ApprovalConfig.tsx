/**
 * components/config/ApprovalConfig.tsx
 * Form for Approval nodes: title, approver role, auto-approve threshold slider.
 */

import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { ApprovalNodeData } from '../../types';
import { FormField, FormLabel, Input, RangeField } from './FormPrimitives';

interface Props { nodeId: string; data: ApprovalNodeData }

const APPROVER_ROLES = [
  '', 'HR Manager', 'Department Head', 'VP of HR',
  'CEO', 'Finance Lead', 'L&D Manager', 'Recruiter',
];

const ApprovalConfig: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const update = (patch: Partial<ApprovalNodeData>) => updateNodeData(nodeId, patch as never);

  return (
    <div className="space-y-4">
      <FormField>
        <FormLabel>Title</FormLabel>
        <Input
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Approval step name…"
        />
      </FormField>

      <FormField>
        <FormLabel>Approver Role</FormLabel>
        {/* Combobox: select from list OR type custom */}
        <Input
          list="approver-roles"
          value={data.approverRole}
          onChange={(e) => update({ approverRole: e.target.value })}
          placeholder="Select or type a role…"
        />
        <datalist id="approver-roles">
          {APPROVER_ROLES.filter(Boolean).map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </FormField>

      <RangeField
        label="Auto-approve Threshold"
        value={data.autoApproveThreshold}
        min={0}
        max={100}
        onChange={(v) => update({ autoApproveThreshold: v })}
      />

      {/* Contextual tip */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <p className="text-amber-400/80 text-[11px] leading-relaxed">
          If approval score ≥ <strong>{data.autoApproveThreshold}%</strong>, task auto-approves
          without waiting for manual review.
        </p>
      </div>
    </div>
  );
};

export default ApprovalConfig;
