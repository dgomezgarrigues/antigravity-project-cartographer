import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as d3 from 'd3-force';
import { CustomNode } from './CustomNode';
import { THEME } from '../theme';
import { useGraphFocus } from '../hooks/useGraphFocus';
import SearchBar from './SearchBar';
import HamburgerMenu from './HamburgerMenu';
import ComplexityDashboard from './ComplexityDashboard';

const nodeTypes = {
    custom: CustomNode,
};

export default function GraphDebugger() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isXRayMode, setIsXRayMode] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    const { focusedNodeId, focusNode } = useGraphFocus(nodes, edges, setNodes, setEdges);

    useEffect(() => {
        fetch('/graph-data.json')
            .then(res => res.json())
            .then(data => {
                // Prepare nodes for d3 simulation
                const simNodes = data.nodes.map(n => ({ ...n, radius: 50 }));

                // Prepare edges
                const simEdges = data.edges.map((e, i) => ({
                    ...e,
                    id: `e-${e.source}-${e.target}-${i}`,
                }));

                // Run D3 force simulation to calculate initial layout ("Big Bang")
                const simulation = d3.forceSimulation(simNodes)
                    .force('charge', d3.forceManyBody().strength(-800))
                    .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
                    .force('link', d3.forceLink(simEdges).id(d => d.id).distance(150))
                    .force('collide', d3.forceCollide().radius(80))
                    .stop();

                // Tick simulation statically
                for (let i = 0; i < 300; ++i) simulation.tick();

                // Format for React Flow
                const rfNodes = simNodes.map(n => ({
                    id: n.id,
                    type: 'custom',
                    position: { x: n.x, y: n.y },
                    data: {
                        label: n.id,
                        type: n.type,
                        level: n.level,
                        isCircular: n.isCircular,
                        opacity: 1,
                        complexity: n.complexity,
                        isXRayMode: false
                    },
                }));

                const rfEdges = simEdges.map(e => ({
                    id: e.id,
                    source: typeof e.source === 'object' ? e.source.id : e.source,
                    target: typeof e.target === 'object' ? e.target.id : e.target,
                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: e.isCircular ? THEME.colors.edgeCircular : THEME.colors.edgeDefault, strokeWidth: e.isCircular ? 2 : 1 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 20,
                        height: 20,
                        color: e.isCircular ? THEME.colors.edgeCircular : THEME.colors.edgeDefault,
                    },
                }));

                setNodes(rfNodes);
                setEdges(rfEdges);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load graph data. Make sure to run the parser first.", err);
                setIsLoading(false);
            });
    }, [setNodes, setEdges]);

    useEffect(() => {
        setNodes(nds => nds.map(node => ({
            ...node,
            data: { ...node.data, isXRayMode }
        })));
    }, [isXRayMode, setNodes]);

    const onNodeClick = useCallback((_, node) => {
        if (focusedNodeId === node.id) {
            focusNode(null);
        } else {
            focusNode(node.id);
            if (!isDashboardOpen) setIsDashboardOpen(true);
        }
    }, [focusedNodeId, focusNode, isDashboardOpen]);

    const onPaneClick = useCallback(() => {
        focusNode(null);
    }, [focusNode]);

    if (isLoading) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: THEME.colors.background, color: THEME.colors.text }}>
                <div className="loader">Analyzing Project Architecture...</div>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: THEME.colors.background }}>
            <SearchBar
                nodes={nodes}
                onFocus={(id) => { focusNode(id); if (!isDashboardOpen) setIsDashboardOpen(true); }}
                focusedNodeId={focusedNodeId}
            />
            <HamburgerMenu
                isXRayMode={isXRayMode}
                toggleXRay={() => setIsXRayMode(prev => !prev)}
                isDashboardOpen={isDashboardOpen}
                toggleDashboard={() => setIsDashboardOpen(prev => !prev)}
            />
            <ComplexityDashboard
                isOpen={isDashboardOpen}
                selectedNode={nodes.find(n => n.id === focusedNodeId)}
            />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={4}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#333" gap={16} />
                <Controls style={{ display: 'flex', flexDirection: 'column' }} showInteractive={false} />
            </ReactFlow>
        </div>
    );
}
