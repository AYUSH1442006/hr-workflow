/**
 * components/WorkflowCanvas.tsx
 * The central React Flow canvas — handles:
 * - Drag-and-drop from sidebar (HTML5 drop events)
 * - Node/edge rendering with custom types
 * - Click-to-deselect on pane
 * - Keyboard delete for selected elements
 * - Minimap, Controls, Background
 *
 * Architecture: Canvas only reads from and writes to the Zustand store.
 * React Flow's internal state is kept in sync via onNodesChange/onEdgesChange.
 */

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  SelectionMode,
  MarkerType,
} from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import { nodeTypes } from '../nodes';
import type { NodeKind } from '../types';

const WorkflowCanvas: React.FC = () => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('application/hr-node-kind') as NodeKind;
      if (!kind || !rfInstanceRef.current) return;

      // Guard: only one Start node
      if (kind === 'start') {
        const store = useWorkflowStore.getState();
        const hasStart = store.nodes.some((n) => n.data.kind === 'start');
        if (hasStart) {
          alert('Only one Start node is allowed per workflow.');
          return;
        }
      }

      // Convert browser coordinates → React Flow canvas coordinates
      const position = rfInstanceRef.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      addNode(kind, position);
    },
    [addNode]
  );

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance: ReactFlowInstance) => { rfInstanceRef.current = instance; }}
        onPaneClick={() => selectNode(null)}
        onNodeClick={(_: React.MouseEvent, node: { id: string }) => selectNode(node.id)}
        deleteKeyCode={['Delete', 'Backspace']}
        selectionMode={SelectionMode.Partial}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        }}
        className="bg-transparent"
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#334155"
        />

        {/* Navigation controls */}
        <Controls />

        {/* Minimap */}
        <MiniMap
          nodeColor={(node: { data?: { kind?: string } }) => {
            const kind = node.data?.kind;
            switch (kind) {
              case 'start': return '#10b981';
              case 'task': return '#3b82f6';
              case 'approval': return '#f59e0b';
              case 'automated': return '#8b5cf6';
              case 'end': return '#f43f5e';
              default: return '#6366f1';
            }
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-900 !border !border-slate-700/60 !rounded-xl overflow-hidden"
          style={{ bottom: 60 }}
        />
      </ReactFlow>

      {/* Empty state hint */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-slate-600 text-4xl mb-3">⬡</p>
            <p className="text-slate-500 text-sm font-medium">Canvas is empty</p>
            <p className="text-slate-600 text-xs mt-1">
              Drag nodes from the left sidebar to start building your workflow
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;
