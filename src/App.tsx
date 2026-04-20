/**
 * App.tsx
 * Root layout — assembles the full HR Workflow Designer:
 *  ┌──────────────────────────────────────────────────────┐
 *  │  Toolbar (top)                                       │
 *  ├────────┬─────────────────────────────────┬───────────┤
 *  │Sidebar │  WorkflowCanvas                 │ConfigPanel│
 *  │(left)  │                                 │ (right)   │
 *  │        │                                 │           │
 *  │        ├─────────────────────────────────┤           │
 *  │        │  SimulationPanel (bottom drawer)│           │
 *  └────────┴─────────────────────────────────┴───────────┘
 *
 * Architecture: App is purely a layout shell — no business logic here.
 * The ReactFlowProvider must wrap everything that uses React Flow hooks.
 */

import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import ConfigPanel from './components/ConfigPanel';
import SimulationPanel from './components/SimulationPanel';

const App: React.FC = () => {
  const [simPanelOpen, setSimPanelOpen] = useState(false);

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
        {/* Top toolbar — brand, import/export, reset */}
        <Toolbar />

        {/* Main content area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left sidebar — node palette */}
          <Sidebar />

          {/* Center — canvas + simulation panel stacked */}
          <div className="flex-1 relative min-w-0">
            <WorkflowCanvas />
            <SimulationPanel
              isOpen={simPanelOpen}
              onToggle={() => setSimPanelOpen((v) => !v)}
            />
          </div>

          {/* Right panel — node config forms */}
          <ConfigPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
