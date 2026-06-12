#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const confDir = path.join(__dirname, '..');
const outDir = __dirname;

const files = fs.readdirSync(confDir).filter(f => f.endsWith('.md'));
let index = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(confDir, file), 'utf8');
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  let diagramNum = 1;

  while ((match = regex.exec(content)) !== null) {
    const pageNum = file.replace('.md', '').replace(/-.*/, '');
    const name = `${pageNum}-diagram-${diagramNum}`;
    const mmdContent = match[1].trim();
    
    fs.writeFileSync(path.join(outDir, `${name}.mmd`), mmdContent + '\n');
    
    // Find context (line number and nearby heading)
    const beforeMatch = content.substring(0, match.index);
    const lineNum = beforeMatch.split('\n').length;
    const headings = beforeMatch.match(/^##+ .+$/gm);
    const nearestHeading = headings ? headings[headings.length - 1].replace(/^#+\s*/, '') : 'Top of page';
    
    index.push({ name, file, lineNum, heading: nearestHeading });
    diagramNum++;
  }
}

// Write index
let indexMd = '# Diagram Index\n\nThese `.mmd` files can be rendered to PNG using [mermaid.live](https://mermaid.live) or `npx @mermaid-js/mermaid-cli -i file.mmd -o file.png`.\n\n';
indexMd += '| # | File | Source Page | Line | Section |\n';
indexMd += '| --- | --- | --- | --- | --- |\n';
index.forEach((d, i) => {
  indexMd += `| ${i + 1} | ${d.name}.mmd | ${d.file} | ${d.lineNum} | ${d.heading} |\n`;
});
indexMd += '\n## How to Convert\n\n```bash\n# Option 1: mermaid.live (browser)\n# Paste .mmd content into https://mermaid.live and export as PNG\n\n# Option 2: CLI (requires Node.js)\nnpx @mermaid-js/mermaid-cli -i 07.3-diagram-1.mmd -o 07.3-diagram-1.png\n\n# Option 3: Batch convert all\nfor f in *.mmd; do npx @mermaid-js/mermaid-cli -i "$f" -o "${f%.mmd}.png"; done\n```\n';

fs.writeFileSync(path.join(outDir, 'INDEX.md'), indexMd);
console.log(`Extracted ${index.length} diagrams.`);
