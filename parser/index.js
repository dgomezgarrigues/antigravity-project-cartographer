const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { parseReactFile } = require('./react-parser');
const { parseLitFile } = require('./lit-parser');
const { buildGraph } = require('./graph-builder');

const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Usage: node parser/index.js <target-directory>');
  process.exit(1);
}

const absoluteTargetDir = path.resolve(targetDir);

if (!fs.existsSync(absoluteTargetDir)) {
  console.error(`Directory not found: ${absoluteTargetDir}`);
  process.exit(1);
}

console.log(`Scanning directory: ${absoluteTargetDir}`);

// Find all relevant files
const files = globSync('**/*.{js,jsx,ts,tsx}', {
  cwd: absoluteTargetDir,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.d.ts'],
  absolute: true,
});

const modulesData = {};

files.forEach(file => {
  const ext = path.extname(file);
  const relativePath = path.relative(absoluteTargetDir, file).replace(/\\/g, '/');
  
  try {
    const code = fs.readFileSync(file, 'utf-8');
    let parsedData = null;

    if (code.includes('LitElement')) {
      parsedData = parseLitFile(code, file, absoluteTargetDir);
    } else {
      parsedData = parseReactFile(code, file, absoluteTargetDir);
    }

    if (parsedData) {
      modulesData[relativePath] = {
        ...parsedData,
        path: relativePath
      };
    }
  } catch (error) {
    console.warn(`Warning: Could not parse ${relativePath}`, error.message);
  }
});

const graph = buildGraph(modulesData);

const outputDir = path.join(__dirname, '../public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'graph-data.json');
fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2));

console.log(`Successfully generated graph data with ${graph.nodes.length} nodes and ${graph.edges.length} edges.`);
console.log(`Output saved to: ${outputPath}`);
