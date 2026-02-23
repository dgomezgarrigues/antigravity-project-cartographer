const ts = require('typescript');
const path = require('path');
const fs = require('fs');

function parseLitFile(code, filePath, rootDir) {
    const sourceFile = ts.createSourceFile(
        filePath,
        code,
        ts.ScriptTarget.Latest,
        true
    );

    const imports = [];
    const definitions = [];
    const calls = [];

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

                definitions.push({
                    name: node.name.text,
                    type: isLitElement ? 'component' : 'class'
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

    return { imports, definitions, calls };
}

module.exports = { parseLitFile };
