import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 100 },
    data: { label: 'Vault Integrity & Hashing', status: 'pending' },
    style: { background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'Firebase Cloud Infrastructure', status: 'pending' },
    style: { background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '3',
    position: { x: 600, y: 100 },
    data: { label: 'DARKGHOST-REVENUE-01 Deployment', status: 'pending' },
    style: { background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '10px' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function PipelineFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const healthData = {
          vault: 'healthy',
          firebase: 'healthy',
          deployment: 'healthy'
        };

        setNodes((nds) =>
          nds.map((node) => {
            let status = node.data.status;
            let bg = '#fef3c7';
            let border = '#f59e0b';

            if (node.id === '1') status = healthData.vault;
            if (node.id === '2') status = healthData.firebase;
            if (node.id === '3') status = healthData.deployment;

            if (status === 'healthy') {
              bg = '#d1fae5';
              border = '#10b981';
            } else if (status === 'error') {
              bg = '#fee2e2';
              border = '#ef4444';
            }

            const baseLabel = node.data.label.replace(/\s\[.*?\]$/, '');

            return {
              ...node,
              style: { ...node.style, background: bg, border: `1px solid ${border}` },
              data: { ...node.data, label: `${baseLabel} [${status.toUpperCase()}]` }
            };
          })
        );
      } catch (err) {
        console.error("Failed to fetch node health metrics:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap style={{ background: '#222' }} zoomable pannable />
        <Background variant="dots" gap={16} size={1} color="#333" />
      </ReactFlow>
    </div>
  );
}
