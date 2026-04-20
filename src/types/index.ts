/**
 * types/index.ts
 * Centralized TypeScript type definitions for the HR Workflow Designer.
 * 
 * React Flow v12 requires node data to satisfy Record<string, unknown>.
 * We add index signatures to each data interface so they're compatible
 * with React Flow's generic constraints while still giving us strong typing.
 */

import type { Node, Edge } from '@xyflow/react';

// ─── Node kinds ────────────────────────────────────────────────────────────────

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ─── Per-node data payloads ────────────────────────────────────────────────────

/** Key-value metadata entry used on Start node */
export interface MetaEntry {
  key: string;
  value: string;
}

export interface StartNodeData {
  [key: string]: unknown; // index sig for React Flow compat
  kind: 'start';
  title: string;
  metadata: MetaEntry[];
}

export interface TaskNodeData {
  [key: string]: unknown;
  kind: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: MetaEntry[];
}

export interface ApprovalNodeData {
  [key: string]: unknown;
  kind: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  [key: string]: unknown;
  kind: 'automated';
  title: string;
  actionId: string;
  /** Dynamic params keyed by param name → value string */
  params: Record<string, string>;
}

export interface EndNodeData {
  [key: string]: unknown;
  kind: 'end';
  endMessage: string;
  showSummary: boolean;
}

/** Discriminated union of all node data shapes */
export type HRNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

/** Typed React Flow node */
export type HRNode = Node<HRNodeData>;

/** Typed React Flow edge (no extra data needed yet) */
export type HREdge = Edge;

// ─── API types ─────────────────────────────────────────────────────────────────

/** A single parameter descriptor for an automation action */
export interface ActionParam {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

/** An automation action returned by GET /automations */
export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  params: ActionParam[];
}

/** Payload sent to POST /simulate */
export interface SimulatePayload {
  nodes: HRNode[];
  edges: HREdge[];
}

/** A single log line returned by POST /simulate */
export interface SimLog {
  step: number;
  nodeId: string;
  nodeKind: NodeKind;
  nodeTitle: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

/** Response from POST /simulate */
export interface SimulateResponse {
  success: boolean;
  logs: SimLog[];
  errors: string[];
}

// ─── Validation ─────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  messages: string[];
}
