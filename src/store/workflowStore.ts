/**
 * store/workflowStore.ts
 * Zustand global store for the entire workflow designer state.
 *
 * Architecture: Single flat store with action creators co-located.
 * React Flow's applyNodeChanges / applyEdgeChanges handle position changes,
 * while we handle add/delete and data mutations separately for clarity.
 */

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  addEdge,
} from '@xyflow/react';
import { v4 as uuid } from 'uuid';
import type { HRNode, HREdge, HRNodeData, NodeKind } from '../types';

// Default data factories per node kind
function defaultData(kind: NodeKind): HRNodeData {
  switch (kind) {
    case 'start':
      return { kind: 'start', title: 'Start', metadata: [] };
    case 'task':
      return { kind: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { kind: 'approval', title: 'Approval', approverRole: '', autoApproveThreshold: 80 };
    case 'automated':
      return { kind: 'automated', title: 'Automated Step', actionId: '', params: {} };
    case 'end':
      return { kind: 'end', endMessage: 'Workflow Complete', showSummary: false };
  }
}

interface WorkflowState {
  nodes: HRNode[];
  edges: HREdge[];
  selectedNodeId: string | null;

  // React Flow handlers
  onNodesChange: (changes: NodeChange<HRNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<HREdge>[]) => void;
  onConnect: (connection: Connection) => void;

  // Node CRUD
  addNode: (kind: NodeKind, position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, patch: Partial<HRNodeData>) => void;

  // Selection
  selectNode: (id: string | null) => void;

  // Edge delete
  deleteEdge: (id: string) => void;

  // Import / export
  loadWorkflow: (nodes: HRNode[], edges: HREdge[]) => void;

  // Reset
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  (set) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,

    onNodesChange: (changes) =>
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes) as HRNode[],
      })),

    onEdgesChange: (changes) =>
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges) as HREdge[],
      })),

    onConnect: (connection) =>
      set((state) => ({
        edges: addEdge(
          {
            ...connection,
            id: uuid(),
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          state.edges
        ),
      })),

    addNode: (kind, position) => {
      const id = uuid();
      const node: HRNode = {
        id,
        type: kind,
        position,
        data: defaultData(kind),
      };
      set((state) => ({ nodes: [...state.nodes, node] }));
    },

    deleteNode: (id) =>
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      })),

    updateNodeData: (id, patch) =>
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } as HRNodeData } : n
        ),
      })),

    selectNode: (id) => set({ selectedNodeId: id }),

    deleteEdge: (id) =>
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== id),
      })),

    loadWorkflow: (nodes, edges) => set({ nodes, edges, selectedNodeId: null }),

    resetWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),
  })
);
