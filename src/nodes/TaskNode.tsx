/**
 * nodes/TaskNode.tsx
 * Represents a human-assigned task step.
 * Accent: blue gradient.
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { ClipboardList } from 'lucide-react';
import BaseNode from './BaseNode';
import type { TaskNodeData } from '../types';

const TaskNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const d = data as unknown as TaskNodeData;

  return (
    <BaseNode
      id={id}
      selected={!!selected}
      accentColor="bg-gradient-to-r from-blue-600 to-indigo-600"
      icon={<ClipboardList size={13} />}
      label={d.title || 'Task'}
    >
      {d.assignee && <p className="text-slate-400 truncate">👤 {d.assignee}</p>}
      {d.dueDate && <p className="text-slate-400">📅 {d.dueDate}</p>}
    </BaseNode>
  );
};

export default TaskNode;
