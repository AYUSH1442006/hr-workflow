/**
 * nodes/AutomatedNode.tsx
 * Represents an automated system action (email, HRIS update, etc.)
 * Accent: purple gradient.
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import BaseNode from './BaseNode';
import type { AutomatedNodeData } from '../types';

const AutomatedNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const d = data as unknown as AutomatedNodeData;

  return (
    <BaseNode
      id={id}
      selected={!!selected}
      accentColor="bg-gradient-to-r from-violet-600 to-purple-700"
      icon={<Zap size={13} />}
      label={d.title || 'Automated Step'}
    >
      {d.actionId
        ? <p className="text-slate-400 truncate">⚡ {d.actionId}</p>
        : <p className="text-slate-500 italic">No action selected</p>
      }
      {Object.keys(d.params).length > 0 && (
        <p className="text-slate-400">{Object.keys(d.params).length} param(s)</p>
      )}
    </BaseNode>
  );
};

export default AutomatedNode;
