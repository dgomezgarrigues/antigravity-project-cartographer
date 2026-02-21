import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import GraphDebugger from './components/GraphDebugger';
import './index.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <ReactFlowProvider>
        <GraphDebugger />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
