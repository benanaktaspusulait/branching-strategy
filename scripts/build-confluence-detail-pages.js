#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const pageMappings = [
  {
    page: 'confluence/00-parent-release-engineering-assessment.md',
    sources: ['README.md'],
  },
  {
    page: 'confluence/01-cicd-findings-and-actions.md',
    sources: [
      'docs/cicd-deployment-findings-and-actions.md',
      'docs/deployment-and-release-findings.md',
    ],
  },
  {
    page: 'confluence/02-current-release-operating-model.md',
    sources: [
      'docs/current-release-operating-model.md',
      'docs/branching-options.md',
      'docs/squad-briefing-summary.md',
    ],
  },
  {
    page: 'confluence/03-proposed-release-automation-flow.md',
    sources: [
      'docs/proposed-release-automation-flow.md',
      'docs/automation-and-validation.md',
    ],
  },
  {
    page: 'confluence/04-rollout-decision-proposals.md',
    sources: [
      'docs/rollout-decision-proposals.md',
      'docs/release-decision-register.md',
      'docs/reference/rollout-decision-proposals-detailed.md',
    ],
  },
  {
    page: 'confluence/05-hotfix-and-rollback.md',
    sources: ['docs/hotfix-and-rollback.md'],
  },
  {
    page: 'confluence/06-ownership-and-approvals.md',
    sources: [
      'docs/scope-ownership-approvals.md',
      'docs/architecture-review/operating-model-raci.md',
    ],
  },
  {
    page: 'confluence/07-transformation-programme.md',
    sources: [
      'docs/system-state-problems-solutions.md',
      'docs/reference/system-state-problems-solutions-detailed.md',
      'docs/reference/detailed-problems.md',
      'docs/reference/detailed-solutions.md',
      'docs/transformation-programme.md',
      'docs/transformation-programme-delivery.md',
      'docs/release-engineering-best-practices.md',
    ],
  },
  {
    page: 'confluence/08-platform-and-knowledge-graph.md',
    sources: [
      'docs/platform-engineering-strategy.md',
      'docs/platform-engineering-strategy-advanced.md',
      'docs/advanced-architecture-sections.md',
      'docs/deployment-knowledge-graph-design.md',
      'docs/deployment-knowledge-graph-implementation.md',
      'docs/deployment-knowledge-graph-operations.md',
      'docs/deployment-knowledge-graph-business-case.md',
      'docs/architecture-review/index.md',
      'docs/architecture-review/alignment-and-enterprise-architecture-review.md',
      'docs/architecture-review/review-criteria.md',
      'docs/architecture-review/recommendation-inventory.md',
      'docs/architecture-review/source-document-list.md',
      'docs/architecture-review/executive-and-quality-review.md',
      'docs/architecture-review/arb-package.md',
      'docs/architecture-review/business-case-and-roadmap.md',
      'docs/architecture-review/architecture-diagrams.md',
      'docs/architecture-review/criticality-challenge-review.md',
      'docs/architecture-review/missing-enterprise-concerns.md',
      'docs/architecture-review/final-scorecard-and-verdict.md',
    ],
  },
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').trimEnd();
}

function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function stripFirstH1(markdown) {
  return markdown.replace(/^#\s+.+\r?\n+/, '');
}

function shiftHeadings(markdown) {
  return markdown.replace(/^(#{1,5})\s+/gm, (match, hashes) => `${hashes}# `);
}

function sourceDir(source) {
  return path.dirname(source);
}

function normaliseLocalPath(source, href) {
  const [filePart, fragment] = href.split('#');
  if (!filePart) {
    return href;
  }
  const resolved = path.normalize(path.join(sourceDir(source), filePart));
  const posix = resolved.split(path.sep).join('/');
  return fragment ? `${posix}#${fragment}` : posix;
}

function rewriteLocalMarkdownLinks(markdown, source) {
  return markdown.replace(/(!?\[([^\]]*)\]\(([^)]+)\))/g, (full, _whole, label, rawHref) => {
    const href = rawHref.trim().replace(/^<|>$/g, '');
    if (!href || /^(https?:|mailto:|tel:|data:)/.test(href) || href.startsWith('#')) {
      return full;
    }

    return `${label} (\`${normaliseLocalPath(source, href)}\`)`;
  });
}

function softenLegacyHeadings(markdown) {
  return markdown
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Executive Summary$/gm, '$1 Summary')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Detailed Executive Summary$/gm, '$1 Detailed Current Understanding Summary')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Final Executive Position$/gm, '$1 Summary Position')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Success Metrics$/gm, '$1 Potential Metrics To Baseline')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Top 10 Recommendations$/gm, '$1 Top 10 Improvement Areas For Discussion')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Target State Architecture$/gm, '$1 Possible Target Architecture')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Target State \(Current vs Target\)$/gm, '$1 Possible Target Shape')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Transformation Roadmap$/gm, '$1 Possible Phased Improvement Path')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Recommended Roadmap$/gm, '$1 Possible Roadmap')
    .replace(/^(#{2,6}) (?:\d+\.\s+)?Final Recommendation$/gm, '$1 Suggested Next Steps');
}

function detailedSourceSection(sources) {
  const sections = sources.map((source) => {
    const markdown = read(source);
    const title = firstHeading(markdown, source);
    const body = softenLegacyHeadings(
      shiftHeadings(rewriteLocalMarkdownLinks(stripFirstH1(markdown), source)),
    ).trim();

    return [
      `### Source: ${title}`,
      '',
      `Source file: \`${source}\``,
      '',
      body,
    ].join('\n');
  });

  return [
    '---',
    '',
    '## Detailed Source Material',
    '',
    'This section preserves the detailed repository content used during the Confluence conversion. It is intentionally longer than the summary above so technical detail is not lost.',
    '',
    ...sections,
  ].join('\n\n');
}

function stripExistingDetail(pageMarkdown) {
  return pageMarkdown.replace(/\n+---\n\n## Detailed Source Material\n[\s\S]*$/m, '').trimEnd();
}

function updatePage(mapping) {
  const pagePath = path.join(root, mapping.page);
  const pageMarkdown = fs.readFileSync(pagePath, 'utf8');
  const next = `${stripExistingDetail(pageMarkdown)}\n\n${detailedSourceSection(mapping.sources)}\n`;
  fs.writeFileSync(pagePath, next);
}

function writeCoverageIndex() {
  const rows = pageMappings.flatMap((mapping) =>
    mapping.sources.map((source) => `| \`${source}\` | ${path.basename(mapping.page, '.md')} |`),
  );

  const content = [
    '# Confluence Source Coverage Index',
    '',
    '| Field | Value |',
    '| --- | --- |',
    '| Owner | Benan Aktas |',
    '| Status | In Review |',
    '| Created | 2026-06-09 |',
    '| Last updated | 2026-06-09 |',
    '| Labels | confluence, source-coverage, release-engineering, cerberus |',
    '',
    '---',
    '',
    '## Summary',
    '',
    'This page shows which repository source files are preserved in each Confluence conversion page. The overview pages remain readable, while their detailed source material sections retain the original technical content.',
    '',
    '---',
    '',
    '## Coverage Mapping',
    '',
    '| Source File | Confluence Page |',
    '| --- | --- |',
    ...rows,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(root, 'confluence/09-source-coverage-index.md'), content);
}

const missing = pageMappings.flatMap((mapping) => [mapping.page, ...mapping.sources])
  .filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error(`Missing files:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

pageMappings.forEach(updatePage);
writeCoverageIndex();

console.log(`Updated ${pageMappings.length} Confluence pages and wrote confluence/09-source-coverage-index.md.`);
