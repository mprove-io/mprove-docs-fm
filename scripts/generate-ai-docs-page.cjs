const fs = require('node:fs/promises');
const path = require('node:path');

const docsDir = path.join(process.cwd(), 'content', 'docs');
const cliDir = path.join(process.cwd(), 'content', 'cli');
const outputPath = path.join(docsDir, 'docs-for-ai.mdx');
const outputRelativePath = toPosix(path.relative(process.cwd(), outputPath));

async function main() {
  const docsPages = await collectMdxPagesInDir(docsDir);
  if (!docsPages.includes(outputRelativePath)) {
    docsPages.push(outputRelativePath);
  }

  const cliPages = await collectMdxPagesInDir(cliDir);
  const docsList = formatList(docsPages.sort());
  const cliList = formatList(cliPages.sort());

  const content = `---
title: Docs for AI
description: Markdown entry points for AI and LLM tools.
---

# Docs for AI

These documentation pages are available as \`.mdx\` files for AI and LLM tools. 

## Docs

Full LLM text file for Docs section (without CLI and OpenAPI) is available at <a href="/llms-full.txt" target="_blank" rel="noopener noreferrer">/llms-full.txt</a>.

${docsList}

## CLI

${cliList}

## OpenAPI

<ul>
  <li><a href="/content/openapi/openapi-by-path.mdx" target="_blank" rel="noopener noreferrer">content/openapi/openapi-by-path.mdx</a></li>
</ul>
`;

  await fs.writeFile(outputPath, content);
  console.log(
    `Generated ${outputRelativePath} with ${
      docsPages.length + cliPages.length
    } pages.`
  );
}

function formatList(pages) {
  return [
    '<ul>',
    ...pages.map(
      page =>
        `  <li><a href="/${page}" target="_blank" rel="noopener noreferrer">${page}</a></li>`
    ),
    '</ul>'
  ].join('\n');
}

async function collectMdxPagesInDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...(await collectMdxPagesInDir(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      pages.push(toPosix(path.relative(process.cwd(), fullPath)));
    }
  }

  return pages;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
