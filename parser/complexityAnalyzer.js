// complexityAnalyzer.js
const traverse = require('@babel/traverse').default;

const CYCLOMATIC_NODES = [
    'IfStatement',
    'WhileStatement',
    'DoWhileStatement',
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'CatchClause',
    'ConditionalExpression',
    'LogicalExpression',
    'SwitchCase'
];

function calculateCyclomatic(astPath) {
    let complexity = 1; // Base complexity

    astPath.traverse({
        enter(nodePath) {
            if (CYCLOMATIC_NODES.includes(nodePath.node.type)) {
                if (nodePath.node.type === 'LogicalExpression' && (nodePath.node.operator === '&&' || nodePath.node.operator === '||')) {
                    complexity += 1;
                } else if (nodePath.node.type === 'SwitchCase' && nodePath.node.test !== null) {
                    complexity += 1; // Don't count default
                } else if (nodePath.node.type !== 'LogicalExpression' && nodePath.node.type !== 'SwitchCase') {
                    complexity += 1;
                }
            }
        }
    });

    return complexity;
}

function calculateCognitive(astPath) {
    let complexity = 0;

    astPath.traverse({
        enter(nodePath) {
            if (CYCLOMATIC_NODES.includes(nodePath.node.type) && nodePath.node.type !== 'CatchClause') {
                if (nodePath.node.type === 'LogicalExpression' && (nodePath.node.operator === '&&' || nodePath.node.operator === '||')) {
                    complexity += 1;
                    return;
                }

                let nestingDepth = 0;
                let parent = nodePath.parentPath;
                while (parent && parent.node.type !== 'FunctionDeclaration' && parent.node.type !== 'ArrowFunctionExpression' && parent.node.type !== 'ClassMethod' && parent.node.type !== 'ObjectMethod') {
                    if (CYCLOMATIC_NODES.includes(parent.node.type) || parent.node.type === 'Program') {
                        nestingDepth += 1;
                    }
                    parent = parent.parentPath;
                }

                complexity += (1 + nestingDepth);
            }
        }
    });

    return complexity;
}

function estimateBigO(astPath) {
    let maxNesting = 0;
    let hasLoops = false;

    const LOOP_NODES = [
        'WhileStatement',
        'DoWhileStatement',
        'ForStatement',
        'ForInStatement',
        'ForOfStatement'
    ];

    astPath.traverse({
        enter(nodePath) {
            let isLoopNode = LOOP_NODES.includes(nodePath.node.type);

            // Also count Array higher order functions as loops
            if (nodePath.node.type === 'CallExpression' && nodePath.node.callee.type === 'MemberExpression') {
                const propName = nodePath.node.callee.property.name;
                if (['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex'].includes(propName)) {
                    isLoopNode = true;
                }
            }

            if (isLoopNode) {
                hasLoops = true;
                let currentDepth = 1;
                let parent = nodePath.parentPath;
                while (parent) {
                    let parentIsLoop = LOOP_NODES.includes(parent.node.type);
                    if (parent.node.type === 'CallExpression' && parent.node.callee.type === 'MemberExpression') {
                        const propName = parent.node.callee.property.name;
                        if (['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex'].includes(propName)) {
                            parentIsLoop = true;
                        }
                    }

                    if (parentIsLoop) {
                        currentDepth += 1;
                    }
                    parent = parent.parentPath;
                }

                if (currentDepth > maxNesting) {
                    maxNesting = currentDepth;
                }
            }
        }
    });

    if (!hasLoops) return 'O(1)';
    if (maxNesting === 1) return 'O(n)';
    return 'O(n^2)';
}

function analyzeComplexity(astPath) {
    return {
        cyclomatic: calculateCyclomatic(astPath),
        cognitive: calculateCognitive(astPath),
        bigO: estimateBigO(astPath)
    };
}

module.exports = { analyzeComplexity };
