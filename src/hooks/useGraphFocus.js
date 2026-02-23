import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useGraphFocus(nodes, edges, setNodes, setEdges) {
    const { fitView } = useReactFlow();
    const [focusedNodeId, setFocusedNodeId] = useState(null);

    const focusNode = useCallback((nodeId) => {
        setFocusedNodeId(nodeId);

        if (!nodeId) {
            // Reset
            setNodes((nds) => nds.map((node) => ({ ...node, data: { ...node.data, opacity: 1, isFocused: false } })));
            setEdges((eds) => eds.map((edge) => ({ ...edge, animated: false, style: { opacity: 1, stroke: edge.isCircular ? '#FF3B30' : '#444' } })));
            setTimeout(() => fitView({ duration: 800 }), 50);
            return;
        }

        // BFS to find connected set
        const connectedNodeIds = new Set([nodeId]);
        const connectedEdgeIds = new Set();
        const queue = [nodeId];

        while (queue.length > 0) {
            const current = queue.shift();

            edges.forEach((edge) => {
                if (edge.source === current && !connectedNodeIds.has(edge.target)) {
                    connectedNodeIds.add(edge.target);
                    connectedEdgeIds.add(edge.id);
                    queue.push(edge.target);
                } else if (edge.target === current && !connectedNodeIds.has(edge.source)) {
                    // Also look backwards? The requirement says "hacia arriba y hacia abajo" (up and down)
                    connectedNodeIds.add(edge.source);
                    connectedEdgeIds.add(edge.id);
                    queue.push(edge.source);
                } else if (edge.source === current || edge.target === current) {
                    connectedEdgeIds.add(edge.id);
                }
            });
        }

        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    opacity: connectedNodeIds.has(node.id) ? 1 : 0.1,
                    isFocused: node.id === nodeId
                },
            }))
        );

        setEdges((eds) =>
            eds.map((edge) => ({
                ...edge,
                animated: connectedEdgeIds.has(edge.id),
                style: {
                    opacity: connectedEdgeIds.has(edge.id) ? 1 : 0.05,
                    stroke: edge.isCircular ? '#FF3B30' : (connectedEdgeIds.has(edge.id) ? '#fff' : '#444'),
                    strokeWidth: connectedEdgeIds.has(edge.id) ? 2 : 1,
                },
            }))
        );

        setTimeout(() => {
            fitView({
                nodes: nodes.filter(n => connectedNodeIds.has(n.id)),
                duration: 800,
                padding: 0.2
            });
        }, 50);

    }, [nodes, edges, setNodes, setEdges, fitView]);

    return { focusedNodeId, focusNode };
}
