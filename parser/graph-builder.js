const path = require('path');

function buildGraph(modulesData) {
    const nodes = [];
    const edges = [];
    const nodeIds = new Set();
    const nodeLevels = new Map();
    const fileToNodeId = new Map();

    // Create Nodes
    for (const [filePath, data] of Object.entries(modulesData)) {
        // Determine type (component, function, class) based on definitions
        let primaryDefinition = 'file';
        let type = 'file';
        let complexity = { cyclomatic: 1, cognitive: 0, bigO: 'O(1)' };
        if (data.definitions && data.definitions.length > 0) {
            const def = data.definitions[0];
            primaryDefinition = def.name;
            type = def.type;
            if (def.complexity) {
                complexity = def.complexity;
            }
        }

        let nodeId = path.basename(filePath, path.extname(filePath));
        if ((nodeId.toLowerCase() === 'index' || nodeId.toLowerCase() === 'warp') && primaryDefinition !== 'file') {
            nodeId = `${nodeId}_${primaryDefinition}`;
        }

        // Handle possible exactly duplicate IDs even after suffixing
        let counter = 1;
        let finalNodeId = nodeId;
        while (nodeIds.has(finalNodeId)) {
            finalNodeId = `${nodeId}_${counter}`;
            counter++;
        }
        nodeId = finalNodeId;

        // Register primary node
        nodes.push({
            id: nodeId,
            label: primaryDefinition,
            type: type,
            level: 2,
            complexity: complexity,
            linesOfCode: data.linesOfCode || 0,
            hooks: data.hooks || [],
            fullPath: data.fullPath || filePath
        });
        nodeIds.add(nodeId);
        nodeLevels.set(nodeId, 2);
        fileToNodeId.set(filePath, nodeId);
    }

    // Helper to resolve import paths to local Node IDs
    const resolveTargetNode = (importPath, sourceFile) => {
        const sourceDir = path.dirname(sourceFile);
        const resolvedPathBase = path.join(sourceDir, importPath).replace(/\\/g, '/');

        // Path resolution checking exact match, index.js or warp.js variations
        for (const filePath of fileToNodeId.keys()) {
            const filePathWithoutExt = filePath.replace(/\.[^/.]+$/, "");
            if (filePathWithoutExt === resolvedPathBase || filePathWithoutExt === `${resolvedPathBase}/index` || filePathWithoutExt === `${resolvedPathBase}/warp`) {
                return fileToNodeId.get(filePath);
            }
        }

        // Simplistic fallback for unknown local imports
        const baseTargetName = importPath.split('/').pop().replace(/\.(js|jsx|ts|tsx)$/, '');
        for (const nodeId of nodeIds) {
            if (nodeId.toLowerCase() === baseTargetName.toLowerCase()) {
                return nodeId;
            }
        }
        return null;
    };

    // Create Edges
    for (const [filePath, data] of Object.entries(modulesData)) {
        const sourceNodeId = fileToNodeId.get(filePath);

        if (data.imports) {
            data.imports.forEach(importPath => {
                // Skip external modules (node_modules usually don't start with ./)
                if (!importPath.startsWith('.')) return;

                const targetNodeId = resolveTargetNode(importPath, filePath);

                if (targetNodeId && sourceNodeId !== targetNodeId) {
                    edges.push({ source: sourceNodeId, target: targetNodeId });
                    // Mark target as non-root
                    const currentLevel = nodeLevels.get(targetNodeId);
                    if (currentLevel !== undefined && sourceNodeId !== targetNodeId) {
                        nodeLevels.set(targetNodeId, currentLevel + 1); // rough approximation
                    }
                }
            });
        }
    }

    // Detect circular dependencies
    const visited = new Set();
    const recursionStack = new Set();

    function detectCycle(nodeId) {
        if (recursionStack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        recursionStack.add(nodeId);

        const outEdges = edges.filter(e => e.source === nodeId);
        for (const edge of outEdges) {
            if (detectCycle(edge.target)) {
                edge.isCircular = true;
                const targetNode = nodes.find(n => n.id === edge.target);
                if (targetNode) targetNode.isCircular = true;
                return true;
            }
        }

        recursionStack.delete(nodeId);
        return false;
    }

    // Run cycle detection for all nodes
    for (const nodeId of nodeIds) {
        detectCycle(nodeId);
    }

    // Calculate precise node depths using BFS from roots
    const inDegreeMap = new Map();
    nodes.forEach(n => {
        n.level = Infinity;
        inDegreeMap.set(n.id, 0);
    });

    edges.forEach(e => {
        const count = inDegreeMap.get(e.target) || 0;
        inDegreeMap.set(e.target, count + 1);
    });

    const queue = [];
    nodes.forEach(n => {
        if (inDegreeMap.get(n.id) === 0) {
            n.level = 0;
            queue.push(n.id);
        }
    });

    if (queue.length === 0 && nodes.length > 0) {
        nodes[0].level = 0;
        queue.push(nodes[0].id);
    }

    while (queue.length > 0) {
        const currentId = queue.shift();
        const currentNode = nodes.find(n => n.id === currentId);
        const currentLevel = currentNode ? currentNode.level : 0;

        const outEdges = edges.filter(e => e.source === currentId);
        for (const edge of outEdges) {
            const targetNode = nodes.find(n => n.id === edge.target);
            if (targetNode && targetNode.level > currentLevel + 1) {
                targetNode.level = currentLevel + 1;
                queue.push(edge.target);
            }
        }
    }

    nodes.forEach(n => {
        if (n.level === Infinity) n.level = 4;

        // Calculate Fan-in and Fan-out
        n.fanOut = edges.filter(e => e.source === n.id).length;
        n.fanIn = edges.filter(e => e.target === n.id).length;

        // Calculate Alert Flags
        const isFragile = n.fanIn > 15;
        const isGiant = n.linesOfCode > 300 && n.fanOut > 8;
        const isComplex = n.complexity && n.complexity.cognitive > 20;
        const isSlow = n.complexity && ['O(n^2)', 'O(n^3)', 'O(n!)', 'O(2^n)'].includes(n.complexity.bigO);

        n.flags = {
            isFragile,
            isGiant,
            isComplex,
            isSlow
        };
    });

    return { nodes, edges };
}

module.exports = { buildGraph };
