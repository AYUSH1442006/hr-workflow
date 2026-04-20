/**
 * nodes/ApprovalNode.tsx
 * Represents a human review/approval gate.
 * Accent: amber/orange gradient.
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { ShieldCheck } from 'lucide-react';
import BaseNode from './BaseNode';
import type { ApprovalNodeData } from '../types';

const ApprovalNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const d = data as unknown as ApprovalNodeData;

  return (
    <BaseNode
      id={id}
      selected={!!selected}
      accentColor="bg-gradient-to-r from-amber-500 to-orange-600"
      icon={<ShieldCheck size={13} />}
      label={d.title || 'Approval'}
    >
      {d.approverRole && <p className="text-slate-400 truncate">🏷️ {d.approverRole}</p>}
      <p className="text-slate-400">Auto ≥ {d.autoApproveThreshold}%</p>
    </BaseNode>
  );
};

export default ApprovalNode;
