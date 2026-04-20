/**
 * hooks/useWorkflow.ts
 * Custom hook providing workflow-level operations:
 * - validation, export/import, simulation trigger
 *
 * Architecture: Uses individual Zustand selectors (not object destructuring)
 * to prevent infinite re-render loops from reference equality checks.
 */

import { useCallback, useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { simulateWorkflow } from '../services/api';
import type { ValidationResult, SimulateResponse } from '../types';

export function useWorkflow() {
  // Individual selectors — stable references, no infinite loops
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const resetWorkflow = useWorkflowStore((s) => s.resetWorkflow);

  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);

  /** Validates the workflow graph before simulation or export */
  const validate = useCallback((): ValidationResult => {
    const messages: string[] = [];
    const startNodes = nodes.filter((n) => n.data.kind === 'start');
    const endNodes = nodes.filter((n) => n.data.kind === 'end');

    if (nodes.length === 0) messages.push('Workflow is empty. Add at least a Start and End node.');
    if (startNodes.length === 0) messages.push('Missing Start node.');
    if (startNodes.length > 1) messages.push('Only one Start node is allowed.');
    if (endNodes.length === 0) messages.push('Missing End node.');

    // Every non-start node must have at least one incoming edge
    const targets = new Set(edges.map((e) => e.target));
    const sources = new Set(edges.map((e) => e.source));

    nodes.forEach((n) => {
      if (n.data.kind !== 'start' && !targets.has(n.id)) {
        const title = (n.data as { title?: string }).title ?? n.id;
        messages.push(`Node "${title}" has no incoming connection.`);
      }
      if (n.data.kind !== 'end' && !sources.has(n.id)) {
        const title = (n.data as { title?: string }).title ?? n.id;
        messages.push(`Node "${title}" has no outgoing connection.`);
      }
    });

    return { valid: messages.length === 0, messages };
  }, [nodes, edges]);

  /** Exports the current workflow as a JSON string */
  const exportJSON = useCallback((): string => {
    return JSON.stringify({ nodes, edges }, null, 2);
  }, [nodes, edges]);

  /** Triggers download of the workflow JSON file */
  const downloadJSON = useCallback(() => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr-workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJSON]);

  /** Imports workflow from a parsed JSON object */
  const importJSON = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.nodes && parsed.edges) {
          loadWorkflow(parsed.nodes, parsed.edges);
        }
      } catch {
        alert('Invalid workflow JSON file.');
      }
    },
    [loadWorkflow]
  );

  /** Sends workflow to the mock simulation API */
  const runSimulation = useCallback(async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const result = await simulateWorkflow({ nodes, edges });
      setSimResult(result);
    } finally {
      setSimulating(false);
    }
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    validate,
    exportJSON,
    downloadJSON,
    importJSON,
    resetWorkflow,
    runSimulation,
    simulating,
    simResult,
    clearSimResult: () => setSimResult(null),
  };
}
