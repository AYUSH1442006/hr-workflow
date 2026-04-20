/**
 * nodes/index.ts
 * Centralised export of all custom node types.
 * React Flow requires a stable nodeTypes object (not re-created on every render).
 * Import this once at the top level and pass to <ReactFlow nodeTypes={nodeTypes} />.
 */

import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedNode from './AutomatedNode';
import EndNode from './EndNode';

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
} as const;
