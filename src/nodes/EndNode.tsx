/**
 * nodes/EndNode.tsx
 * Terminal node — marks workflow completion.
 * Accent: rose/red gradient. No outgoing handle.
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { FlagTriangleRight } from 'lucide-react';
import BaseNode from './BaseNode';
import type { EndNodeData } from '../types';

const EndNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const d = data as unknown as EndNodeData;

  return (
    <BaseNode
      id={id}
      selected={!!selected}
      accentColor="bg-gradient-to-r from-rose-600 to-red-700"
      icon={<FlagTriangleRight size={13} />}
      label={d.endMessage || 'End'}
      showSource={false}
    >
      {d.showSummary && (
        <p className="text-slate-400">📋 Summary enabled</p>
      )}
    </BaseNode>
  );
};

export default EndNode;
