const ts = require('typescript');
const path = require('path');
const fs = require('fs');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { analyzeComplexity } = require('./complexityAnalyzer');

function parseLitFile(code, filePath, rootDir) {
    const sourceFile = ts.createSourceFile(
        filePath,
        code,
        ts.ScriptTarget.Latest,
        true
    );

    // Parse the file via Babel as well to re-use the AST complexity analyzer
    const isTs = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    let babelAst = null;
    try {
        babelAst = babelParser.parse(code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                ['decorators', { decoratorsBeforeExport: true }],
                ...(isTs ? ['typescript'] : [])
            ]
        });
    } catch (e) {
        console.warn(`Could not parse AST with Babel for complexity in ${filePath}`, e.message);
    }

    const imports = [];
    const definitions = [];
    const calls = [];
    const linesOfCode = code.split('\n').length;

    function visit(node) {
        if (ts.isImportDeclaration(node)) {
            if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                imports.push(node.moduleSpecifier.text);
            }
        }

        if (ts.isClassDeclaration(node)) {
            if (node.name) {
                let isLitElement = false;
                if (node.heritageClauses) {
                    for (const clause of node.heritageClauses) {
                        for (const type of clause.types) {
                            if (ts.isExpressionWithTypeArguments(type)) {
                                if (type.expression && ts.isIdentifier(type.expression) && type.expression.text === 'LitElement') {
                                    isLitElement = true;
                                }
                            }
                        }
                    }
                }

                // If class has @customElement decorator, it's also a Lit element
                if (node.modifiers) {
                    const hasDecorator = node.modifiers.some(m => ts.isDecorator(m) && ts.isCallExpression(m.expression) && ts.isIdentifier(m.expression.expression) && m.expression.expression.text === 'customElement');
                    if (hasDecorator) isLitElement = true;
                }

                let classComplexity = { cyclomatic: 1, cognitive: 0, bigO: 'O(1)' };
                if (babelAst) {
                    // Find the class in Babel AST
                    traverse(babelAst, {
                        ClassDeclaration(pathNode) {
                            if (pathNode.node.id && pathNode.node.id.name === node.name.text) {
                                classComplexity = analyzeComplexity(pathNode);
                            }
                        }
                    });
                }

                definitions.push({
                    name: node.name.text,
                    type: isLitElement ? 'component' : 'class',
                    complexity: classComplexity
                });
            }
        }

        if (ts.isCallExpression(node)) {
            if (ts.isIdentifier(node.expression)) {
                calls.push(node.expression.text);
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return { imports, definitions, calls, linesOfCode, fullPath: filePath };
}

module.exports = { parseLitFile };
