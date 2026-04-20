/**
 * services/api.ts
 * Mock API service layer simulating backend endpoints.
 * In production: replace fetch calls with real HTTP requests.
 *
 * Architecture note: All async logic lives here so components stay pure.
 */

import { v4 as uuid } from 'uuid';
import type {
  AutomationAction,
  SimulatePayload,
  SimulateResponse,
  SimLog,
  HRNode,
} from '../types';

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ACTIONS: AutomationAction[] = [
  {
    id: 'send-email',
    label: 'Send Email',
    description: 'Sends an automated email notification to one or more recipients.',
    params: [
      { name: 'to', label: 'Recipient Email', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text' },
      { name: 'template', label: 'Template', type: 'select', options: ['Welcome', 'Reminder', 'Rejection', 'Offer'] },
    ],
  },
  {
    id: 'update-hris',
    label: 'Update HRIS Record',
    description: 'Updates employee record in the HR Information System.',
    params: [
      { name: 'field', label: 'Field to Update', type: 'select', options: ['Department', 'Manager', 'Title', 'Start Date'] },
      { name: 'value', label: 'New Value', type: 'text' },
    ],
  },
  {
    id: 'slack-notify',
    label: 'Slack Notification',
    description: 'Posts a message to a Slack channel.',
    params: [
      { name: 'channel', label: 'Channel', type: 'text' },
      { name: 'message', label: 'Message', type: 'text' },
    ],
  },
  {
    id: 'schedule-interview',
    label: 'Schedule Interview',
    description: 'Creates a calendar event for an interview session.',
    params: [
      { name: 'interviewer', label: 'Interviewer Email', type: 'text' },
      { name: 'duration', label: 'Duration (minutes)', type: 'number' },
      { name: 'type', label: 'Interview Type', type: 'select', options: ['Phone Screen', 'Technical', 'Culture Fit', 'Final'] },
    ],
  },
  {
    id: 'generate-offer',
    label: 'Generate Offer Letter',
    description: 'Generates a formatted offer letter PDF.',
    params: [
      { name: 'template', label: 'Offer Template', type: 'select', options: ['Standard', 'Executive', 'Contractor'] },
      { name: 'salary', label: 'Base Salary', type: 'number' },
    ],
  },
  {
    id: 'background-check',
    label: 'Trigger Background Check',
    description: 'Initiates a background screening via integrated provider.',
    params: [
      { name: 'level', label: 'Check Level', type: 'select', options: ['Basic', 'Enhanced', 'Full'] },
    ],
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── API functions ─────────────────────────────────────────────────────────────

/**
 * GET /automations
 * Returns all available automation actions.
 */
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return MOCK_ACTIONS;
}

/**
 * POST /simulate
 * Executes a dry-run of the workflow and returns step-by-step logs.
 */
export async function simulateWorkflow(payload: SimulatePayload): Promise<SimulateResponse> {
  await delay(800);

  const logs: SimLog[] = [];
  const errors: string[] = [];

  // Topological walk: find start node, follow edges
  const nodeMap = new Map<string, HRNode>(payload.nodes.map((n) => [n.id, n]));
  const edgeMap = new Map<string, string[]>(); // source → [targets]

  for (const edge of payload.edges) {
    if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
    edgeMap.get(edge.source)!.push(edge.target);
  }

  const startNodes = payload.nodes.filter((n) => n.data.kind === 'start');

  if (startNodes.length === 0) {
    errors.push('No Start node found. Workflow cannot execute.');
    return { success: false, logs, errors };
  }

  // Simple BFS traversal for simulation log
  const visited = new Set<string>();
  const queue: string[] = [startNodes[0].id];
  let step = 1;

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) {
      errors.push(`Cycle detected at node: ${nodeId}`);
      break;
    }
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const data = node.data;
    const status: SimLog['status'] =
      data.kind === 'end' ? 'success' :
      data.kind === 'approval' ? 'warning' : 'success';

    const message = buildLogMessage(node);

    logs.push({
      step: step++,
      nodeId: node.id,
      nodeKind: data.kind,
      nodeTitle: 'title' in data ? data.title : (data.endMessage || 'End'),
      status,
      message,
      timestamp: new Date(Date.now() + step * 1200).toISOString(),
    });

    const next = edgeMap.get(nodeId) ?? [];
    queue.push(...next);
  }

  // Check for unreachable nodes
  const unreachable = payload.nodes.filter((n) => !visited.has(n.id));
  if (unreachable.length > 0) {
    errors.push(
      `Unreachable node(s): ${unreachable.map((n) => `"${'title' in n.data ? n.data.title : n.id}"`).join(', ')}`
    );
  }

  return {
    success: errors.length === 0,
    logs,
    errors,
  };
}

function buildLogMessage(node: HRNode): string {
  const d = node.data;
  switch (d.kind) {
    case 'start':
      return `Workflow initiated: "${d.title}". Metadata entries: ${d.metadata.length}.`;
    case 'task':
      return `Task "${d.title}" assigned to ${d.assignee || 'Unassigned'}${d.dueDate ? `, due ${d.dueDate}` : ''}.`;
    case 'approval':
      return `Approval requested from role: ${d.approverRole || 'Any'}. Auto-approve at ${d.autoApproveThreshold}%.`;
    case 'automated':
      return `Automated action "${d.actionId || 'none'}" triggered with ${Object.keys(d.params).length} param(s).`;
    case 'end':
      return `Workflow completed. ${d.showSummary ? 'Summary report generated.' : ''}`;
    default:
      return 'Executed.';
  }
}
