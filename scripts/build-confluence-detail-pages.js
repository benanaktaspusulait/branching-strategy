#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const coveragePage = 'confluence/09-page-coverage-index.md';

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

const pageTitles = new Map([
  ['confluence/00-parent-release-engineering-assessment.md', 'Main Assessment And Reading Order'],
  ['confluence/01-cicd-findings-and-actions.md', 'CI/CD Findings And Actions'],
  ['confluence/02-current-release-operating-model.md', 'Current Release Operating Model'],
  ['confluence/03-proposed-release-automation-flow.md', 'Proposed Release Automation Flow'],
  ['confluence/04-rollout-decision-proposals.md', 'Rollout Decision Proposals'],
  ['confluence/05-hotfix-and-rollback.md', 'Hotfix And Rollback'],
  ['confluence/06-ownership-and-approvals.md', 'Ownership And Approvals'],
  ['confluence/07-transformation-programme.md', 'Improvement Path And Maturity Observations'],
  ['confluence/08-platform-and-knowledge-graph.md', 'Future Platform Topics'],
  [coveragePage, 'Page Coverage Index'],
]);

const relatedPages = new Map([
  [
    'confluence/00-parent-release-engineering-assessment.md',
    [
      'confluence/01-cicd-findings-and-actions.md',
      'confluence/02-current-release-operating-model.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/05-hotfix-and-rollback.md',
      'confluence/06-ownership-and-approvals.md',
      'confluence/07-transformation-programme.md',
      'confluence/08-platform-and-knowledge-graph.md',
      coveragePage,
    ],
  ],
  [
    'confluence/01-cicd-findings-and-actions.md',
    [
      'confluence/00-parent-release-engineering-assessment.md',
      'confluence/02-current-release-operating-model.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/05-hotfix-and-rollback.md',
      coveragePage,
    ],
  ],
  [
    'confluence/02-current-release-operating-model.md',
    [
      'confluence/00-parent-release-engineering-assessment.md',
      'confluence/01-cicd-findings-and-actions.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/06-ownership-and-approvals.md',
      coveragePage,
    ],
  ],
  [
    'confluence/03-proposed-release-automation-flow.md',
    [
      'confluence/01-cicd-findings-and-actions.md',
      'confluence/02-current-release-operating-model.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/05-hotfix-and-rollback.md',
      'confluence/06-ownership-and-approvals.md',
    ],
  ],
  [
    'confluence/04-rollout-decision-proposals.md',
    [
      'confluence/02-current-release-operating-model.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/05-hotfix-and-rollback.md',
      'confluence/06-ownership-and-approvals.md',
      coveragePage,
    ],
  ],
  [
    'confluence/05-hotfix-and-rollback.md',
    [
      'confluence/01-cicd-findings-and-actions.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/06-ownership-and-approvals.md',
    ],
  ],
  [
    'confluence/06-ownership-and-approvals.md',
    [
      'confluence/02-current-release-operating-model.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/05-hotfix-and-rollback.md',
      'confluence/07-transformation-programme.md',
    ],
  ],
  [
    'confluence/07-transformation-programme.md',
    [
      'confluence/00-parent-release-engineering-assessment.md',
      'confluence/02-current-release-operating-model.md',
      'confluence/06-ownership-and-approvals.md',
      'confluence/08-platform-and-knowledge-graph.md',
      coveragePage,
    ],
  ],
  [
    'confluence/08-platform-and-knowledge-graph.md',
    [
      'confluence/00-parent-release-engineering-assessment.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/07-transformation-programme.md',
      coveragePage,
    ],
  ],
  [
    coveragePage,
    [
      'confluence/00-parent-release-engineering-assessment.md',
      'confluence/01-cicd-findings-and-actions.md',
      'confluence/02-current-release-operating-model.md',
      'confluence/03-proposed-release-automation-flow.md',
      'confluence/04-rollout-decision-proposals.md',
      'confluence/05-hotfix-and-rollback.md',
      'confluence/06-ownership-and-approvals.md',
      'confluence/07-transformation-programme.md',
      'confluence/08-platform-and-knowledge-graph.md',
    ],
  ],
]);

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').trimEnd();
}

const sourceToPage = new Map(
  pageMappings.flatMap((mapping) => mapping.sources.map((source) => [source, mapping.page])),
);

const sourceTitleCache = new Map();

function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function cleanTitle(title) {
  return title
    .replace(/Source Document List/g, 'Material List')
    .replace(/Source Coverage Index/g, 'Page Coverage Index');
}

function sourceTitle(source) {
  if (!sourceTitleCache.has(source)) {
    sourceTitleCache.set(source, cleanTitle(firstHeading(read(source), source)));
  }

  return sourceTitleCache.get(source);
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

function pageForSourceReference(sourceReference) {
  const [filePart] = sourceReference.split('#');
  return sourceToPage.get(filePart);
}

function confluenceReference(sourceReference) {
  const page = pageForSourceReference(sourceReference);

  if (page) {
    return pageLink(page);
  }

  return sourceReference;
}

function rewriteLocalMarkdownLinks(markdown, source) {
  return markdown.replace(/(!?\[([^\]]*)\]\(([^)]+)\))/g, (full, _whole, label, rawHref) => {
    const href = rawHref.trim().replace(/^<|>$/g, '');
    if (!href || /^(https?:|mailto:|tel:|data:)/.test(href) || href.startsWith('#')) {
      return full;
    }

    const page = pageForSourceReference(normaliseLocalPath(source, href));
    return page ? `[${label}](${path.basename(page)})` : label;
  });
}

function rewriteKnownSourcePaths(markdown) {
  return markdown
    .replace(/`(README\.md|docs\/[^`]+?\.md(?:#[^`]+)?)`/g, (_match, sourceReference) =>
      confluenceReference(sourceReference),
    )
    .replace(/\b(README\.md|docs\/[A-Za-z0-9_./-]+\.md(?:#[A-Za-z0-9_-]+)?)\b/g, (_match, sourceReference) =>
      confluenceReference(sourceReference),
    );
}

function removeRepositoryOnlyReferences(markdown) {
  return markdown
    .replace(/^\| Source \| branching-strategy repository \(GitLab\) \|\r?\n/gm, '')
    .replace(/^- Source repository:.*(?:\r?\n)?/gm, '')
    .replace(/repository conversion/gi, 'Confluence page set')
    .replace(
      /The review scope is based on the document set below\. `COMPLETE-DOCUMENT\.md` is the focused reader copy for release-management stabilisation\. Appendix and future-vision files remain available for traceability, but they are not part of the immediate discussion scope\./g,
      'The review scope is based on the Confluence page set below. The main assessment page is the focused reader copy for release-management stabilisation. Appendix and future-vision topics remain available for traceability, but they are not part of the immediate discussion scope.',
    )
    .replace(/\bdocument set below\b/gi, 'Confluence page set below')
    .replace(/\bThese files form\b/g, 'These pages form')
    .replace(/\bthese files form\b/g, 'these pages form')
    .replace(/\bAppendix and future-vision files\b/g, 'Appendix and future-vision topics')
    .replace(/\| File \| Role In Review \| Review Focus \|/g, '| Page / Topic | Role In Review | Review Focus |')
    .replace(/\bsource files\b/gi, 'Confluence pages')
    .replace(/\bsource file\b/gi, 'Confluence page')
    .replace(/\bsource material\b/gi, 'detailed material')
    .replace(/\bsource document list\b/gi, 'material list')
    .replace(/\bsource documents\b/gi, 'Confluence pages');
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
    const title = sourceTitle(source);
    const body = removeRepositoryOnlyReferences(rewriteKnownSourcePaths(softenLegacyHeadings(
      shiftHeadings(rewriteLocalMarkdownLinks(stripFirstH1(markdown), source)),
    ))).trim();

    return [
      `### ${title}`,
      '',
      body,
    ].join('\n');
  });

  return [
    '---',
    '',
    '## Detailed Supporting Material',
    '',
    'This section keeps the detailed supporting content for readers who need more than the summary above.',
    '',
    sections.join('\n\n'),
  ].join('\n');
}

function pageLink(page) {
  return `[${pageTitles.get(page) ?? path.basename(page, '.md')}](${path.basename(page)})`;
}

function relatedPagesSection(page) {
  const links = relatedPages.get(page) ?? [];

  return [
    '---',
    '',
    '## Related Pages',
    '',
    ...links.map((relatedPage) => `- ${pageLink(relatedPage)}`),
  ].join('\n');
}

function stripExistingDetail(pageMarkdown) {
  return pageMarkdown.replace(/\n+---\n+(?:[ \t]*\n+)*## Detailed (?:Source|Supporting) Material\b[\s\S]*$/m, '').trimEnd();
}

function stripExistingRelatedPages(pageMarkdown) {
  return pageMarkdown.replace(/\n+---\n+(?:[ \t]*\n+)*## Related Pages\b[\s\S]*$/m, '').trimEnd();
}

function updatePage(mapping) {
  const pagePath = path.join(root, mapping.page);
  const pageMarkdown = fs.readFileSync(pagePath, 'utf8');
  const base = removeRepositoryOnlyReferences(rewriteKnownSourcePaths(stripExistingRelatedPages(stripExistingDetail(pageMarkdown))));
  const next = `${base}\n\n${relatedPagesSection(mapping.page)}\n\n${detailedSourceSection(mapping.sources)}\n`;
  fs.writeFileSync(pagePath, next);
}

function writeCoverageIndex() {
  const rows = pageMappings.flatMap((mapping) =>
    mapping.sources.map((source) => `| ${sourceTitle(source)} | ${pageLink(mapping.page)} |`),
  );

  const content = [
    '# Confluence Page Coverage Index',
    '',
    '| Field | Value |',
    '| --- | --- |',
    '| Owner | Benan Aktas |',
    '| Status | In Review |',
    '| Created | 2026-06-09 |',
    '| Last updated | 2026-06-09 |',
    '| Labels | confluence, page-coverage, release-engineering, cerberus |',
    '',
    '---',
    '',
    '## Summary',
    '',
    'This page shows how detailed content areas are grouped across the Confluence page set.',
    '',
    relatedPagesSection(coveragePage),
    '',
    '---',
    '',
    '## Coverage Mapping',
    '',
    '| Content Area | Confluence Page |',
    '| --- | --- |',
    ...rows,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(root, coveragePage), content);
}

const missing = pageMappings.flatMap((mapping) => [mapping.page, ...mapping.sources])
  .filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error(`Missing files:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

pageMappings.forEach(updatePage);
writeCoverageIndex();

console.log(`Updated ${pageMappings.length} Confluence pages and wrote ${coveragePage}.`);
