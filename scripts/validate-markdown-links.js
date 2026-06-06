#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function slugify(heading) {
  return heading
    .replace(/\s+#+$/, '')
    .replace(/`/g, '')
    .replace(/&/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function anchorsFor(file) {
  const text = fs.readFileSync(file, 'utf8');
  const counts = new Map();
  const anchors = new Set();

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;

    const base = slugify(match[2]);
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }

  return anchors;
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|data:)/.test(href);
}

function normaliseHref(rawHref) {
  return rawHref.trim().replace(/^<|>$/g, '');
}

const markdownFiles = walk(root);
const anchorCache = new Map();
const failures = [];
const linkPattern = /!?\[[^\]]+\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const relativeFile = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    let match;
    while ((match = linkPattern.exec(line)) !== null) {
      const href = normaliseHref(match[1]);
      if (!href || isExternal(href)) continue;

      const [filePart, fragment] = href.split('#');
      const targetFile = filePart
        ? path.resolve(path.dirname(file), decodeURIComponent(filePart))
        : file;

      if (filePart && !fs.existsSync(targetFile)) {
        failures.push(`${relativeFile}:${index + 1} missing file: ${href}`);
        continue;
      }

      if (fragment) {
        if (!anchorCache.has(targetFile)) {
          anchorCache.set(targetFile, anchorsFor(targetFile));
        }

        const expectedAnchor = decodeURIComponent(fragment).toLowerCase();
        if (!anchorCache.get(targetFile).has(expectedAnchor)) {
          failures.push(`${relativeFile}:${index + 1} missing anchor: ${href}`);
        }
      }
    }
  });
}

if (failures.length > 0) {
  console.error('Markdown link validation failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Markdown link validation passed (${markdownFiles.length} files).`);
