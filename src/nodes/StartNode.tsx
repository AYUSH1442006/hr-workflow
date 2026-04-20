/**
 * nodes/StartNode.tsx
 * The entry point of every workflow. Only one allowed.
 * Accent: green gradient.
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import BaseNode from './BaseNode';
import type { StartNodeData } from '../types';

const StartNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const d = data as unknown as StartNodeData;

  return (
    <BaseNode
      id={id}
      selected={!!selected}
      accentColor="bg-gradient-to-r from-emerald-600 to-teal-600"
      icon={<Play size={13} />}
      label={d.title || 'Start'}
      showTarget={false}
    >
      {d.metadata.length > 0 && (
        <p className="text-slate-400 truncate">{d.metadata.length} metadata field(s)</p>
      )}
    </BaseNode>
  );
};

export default StartNode;
