const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { analyzeComplexity } = require('./complexityAnalyzer');

function parseReactFile(code, filePath, rootDir) {
    const isTs = filePath.endsWith('.ts') || filePath.endsWith('.tsx');

    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx',
            ...(isTs ? ['typescript'] : [])
        ]
    });

    const imports = [];
    const definitions = [];
    const calls = [];

    traverse(ast, {
        ImportDeclaration(pathNode) {
            imports.push(pathNode.node.source.value);
        },
        FunctionDeclaration(pathNode) {
            if (pathNode.node.id) {
                definitions.push({
                    name: pathNode.node.id.name,
                    type: 'function',
                    complexity: analyzeComplexity(pathNode)
                });
            }
        },
        VariableDeclarator(pathNode) {
            if (
                pathNode.node.id.type === 'Identifier' &&
                (pathNode.node.init?.type === 'ArrowFunctionExpression' ||
                    pathNode.node.init?.type === 'FunctionExpression')
            ) {
                // Naive check for React component (starts with uppercase)
                const name = pathNode.node.id.name;
                // We must traverse the init path specifically 
                const initPath = pathNode.get('init');
                definitions.push({
                    name,
                    type: /^[A-Z]/.test(name) ? 'component' : 'function',
                    complexity: initPath ? analyzeComplexity(initPath) : { cyclomatic: 1, cognitive: 0, bigO: 'O(1)' }
                });
            }
        },
        ClassDeclaration(pathNode) {
            if (pathNode.node.id) {
                const name = pathNode.node.id.name;
                definitions.push({
                    name,
                    type: /^[A-Z]/.test(name) ? 'component' : 'class',
                    complexity: analyzeComplexity(pathNode)
                });
            }
        },
        CallExpression(pathNode) {
            if (pathNode.node.callee.type === 'Identifier') {
                calls.push(pathNode.node.callee.name);
            }
        },
        JSXElement(pathNode) {
            const openingElement = pathNode.node.openingElement;
            if (openingElement.name.type === 'JSXIdentifier') {
                calls.push(openingElement.name.name);
            }
        }
    });

    return { imports, definitions, calls };
}

module.exports = { parseReactFile };
