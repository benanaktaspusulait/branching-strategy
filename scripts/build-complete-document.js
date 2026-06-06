#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outputFile = path.join(root, 'COMPLETE-DOCUMENT.md');

const sources = [
  'README.md',
  'docs/system-state-problems-solutions.md',
  'docs/current-release-operating-model.md',
  'docs/deployment-and-release-findings.md',
  'docs/cicd-deployment-findings-and-actions.md',
  'docs/proposed-release-automation-flow.md',
  'docs/branching-options.md',
  'docs/automation-and-validation.md',
  'docs/hotfix-and-rollback.md',
  'docs/scope-ownership-approvals.md',
  'docs/rollout-decision-proposals.md',
  'docs/release-decision-register.md',
  'docs/transformation-programme.md',
  'docs/transformation-programme-delivery.md',
  'docs/squad-briefing-summary.md',
  'docs/release-engineering-best-practices.md',
  'docs/platform-engineering-strategy.md',
  'docs/platform-engineering-strategy-advanced.md',
  'docs/deployment-knowledge-graph-design.md',
  'docs/deployment-knowledge-graph-implementation.md',
  'docs/deployment-knowledge-graph-operations.md',
  'docs/deployment-knowledge-graph-business-case.md',
  'docs/reference/system-state-problems-solutions-detailed.md',
  'docs/reference/detailed-problems.md',
  'docs/reference/detailed-solutions.md',
  'docs/reference/rollout-decision-proposals-detailed.md',
];

function isExternal(href) {
  return /^(https?:|mailto:|tel:|data:)/.test(href);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function rewriteLinks(markdown, sourceFile) {
  const sourceDir = path.dirname(path.join(root, sourceFile));

  return markdown.replace(/(!?\[[^\]]+\]\()([^)]+)(\))/g, (full, prefix, rawHref, suffix) => {
    const href = rawHref.trim().replace(/^<|>$/g, '');
    if (!href || isExternal(href) || href.startsWith('#')) {
      return full;
    }

    const [filePart, fragment] = href.split('#');
    if (!filePart) {
      return full;
    }

    const target = path.resolve(sourceDir, decodeURIComponent(filePart));
    const repoRelative = toPosix(path.relative(root, target));
    const nextHref = fragment ? `${repoRelative}#${fragment}` : repoRelative;
    return `${prefix}${nextHref}${suffix}`;
  });
}

function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function stripFirstH1(markdown) {
  return markdown.replace(/^#\s+.+\r?\n+/, '');
}

function sourceMarker(source) {
  return `\n---\n\n> Source: \`${source}\`\n\n`;
}

const missing = sources.filter((source) => !fs.existsSync(path.join(root, source)));
if (missing.length > 0) {
  console.error(`Missing source files:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

const sourceData = sources.map((source) => {
  const raw = fs.readFileSync(path.join(root, source), 'utf8').trimEnd();
  return {
    source,
    title: firstHeading(raw, source),
    markdown: rewriteLinks(raw, source),
  };
});

const [readme, ...rest] = sourceData;

const output = [
  '# Cerberus Release Engineering Assessment',
  '',
  'This complete document is generated from the source files listed below. Edit the source files, then rebuild this file with `node scripts/build-complete-document.js`.',
  '',
  '## Complete Document Contents',
  '',
  '| # | Source | Section |',
  '| --- | --- | --- |',
  ...sourceData.map((entry, index) => `| ${index + 1} | \`${entry.source}\` | [${entry.title}](${entry.source}) |`),
  sourceMarker(readme.source),
  stripFirstH1(readme.markdown),
  ...rest.flatMap((entry) => [
    sourceMarker(entry.source),
    entry.markdown,
  ]),
  '',
].join('\n');

fs.writeFileSync(outputFile, output);
console.log(`Wrote ${path.relative(root, outputFile)} from ${sources.length} source files.`);
