const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');

loadDotEnv();

const mcpSchemaUrl = process.env.MCP_SCHEMA_URL;
const mcpSchemaTimeoutMs = resolveTimeout(process.env.MCP_SCHEMA_TIMEOUT_MS);
const outputPath = path.join(process.cwd(), 'public', 'mcp.json');

async function main() {
  if (!mcpSchemaUrl) {
    console.log('[mcp] MCP_SCHEMA_URL is not set, skipping fetch.');
    return;
  }

  const document = await fetchMcpDocument(mcpSchemaUrl);
  const openapi = convertMcpToOpenAPI(document);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(openapi, null, 2)}\n`,
    'utf8'
  );

  console.log(`[mcp] Wrote ${path.relative(process.cwd(), outputPath)}.`);
}

async function fetchMcpDocument(schemaUrl) {
  const response = await fetch(schemaUrl, {
    signal: AbortSignal.timeout(mcpSchemaTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch MCP schema: ${schemaUrl}`);
  }

  return response.json();
}

function convertMcpToOpenAPI(document) {
  const tools = Array.isArray(document?.tools) ? document.tools : [];
  const defs =
    document?.$defs && typeof document.$defs === 'object' ? document.$defs : {};

  const schemas = {};
  for (const [name, value] of Object.entries(defs)) {
    schemas[name] = rewriteRefs(value);
  }

  const paths = {};
  const tags = [];
  const seenTags = new Set();

  for (const tool of tools) {
    if (!tool || typeof tool.name !== 'string') continue;

    const tagName = tool.name;
    if (!seenTags.has(tagName)) {
      seenTags.add(tagName);
      tags.push({ name: tagName, description: tool.description ?? '' });
    }

    const inputRef = rewriteRefs(tool.input);
    const outputRef = rewriteRefs(tool.output);

    paths[`/mcp/${tool.name}`] = {
      post: {
        operationId: tool.name,
        summary: tool.name,
        description: tool.description ?? '',
        tags: [tagName],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: inputRef
            }
          }
        },
        responses: {
          200: {
            description: 'Output',
            content: {
              'application/json': {
                schema: outputRef
              }
            }
          }
        }
      }
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'MCP Tools',
      version: '1.0.0'
    },
    servers: [{ url: '/' }],
    tags,
    paths,
    components: {
      schemas
    }
  };
}

function rewriteRefs(value) {
  if (Array.isArray(value)) {
    return value.map(rewriteRefs);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const next = {};
  for (const [key, child] of Object.entries(value)) {
    if (
      key === '$ref' &&
      typeof child === 'string' &&
      child.startsWith('#/$defs/')
    ) {
      next[key] = `#/components/schemas/${child.slice('#/$defs/'.length)}`;
      continue;
    }
    next[key] = rewriteRefs(child);
  }
  return next;
}

function resolveTimeout(value) {
  const fallback = 5000;
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

main().catch(error => {
  console.warn(
    `[mcp] Failed to fetch MCP schema. Continuing without the MCP reference. ${formatErrorMessage(error)}`
  );
});

function formatErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env');

  if (!fsSync.existsSync(envPath)) return;

  const env = fsSync.readFileSync(envPath, 'utf8');

  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) continue;

    process.env[key] = unquoteEnvValue(value);
  }
}

function unquoteEnvValue(value) {
  const quote = value[0];
  if (
    (quote === '"' || quote === "'") &&
    value.length > 1 &&
    value[value.length - 1] === quote
  ) {
    return value.slice(1, -1);
  }

  return value;
}
