const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');

loadDotEnv();

const openapiSchemaUrl = process.env.OPENAPI_SCHEMA_URL;
const openapiServerUrl = resolveConfiguredUrl(process.env.OPENAPI_SERVER_URL);
const openapiServerOrigin = resolveConfiguredOrigin(process.env.DOCS_ORIGIN);
const openapiSchemaTimeoutMs = resolveTimeout(
  process.env.OPENAPI_SCHEMA_TIMEOUT_MS
);
const outputPath = path.join(process.cwd(), 'public', 'openapi.json');
const splitOutputDir = path.join(process.cwd(), 'public', 'openapi-paths');
const legacySplitOutputDir = path.join(process.cwd(), 'public', 'paths');
const operationMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
]);

async function main() {
  if (!openapiSchemaUrl) {
    console.log('[openapi] OPENAPI_SCHEMA_URL is not set, skipping fetch.');
    return;
  }

  const schema = await fetchOpenAPISchema(openapiSchemaUrl);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(schema, null, 2)}\n`,
    'utf8'
  );

  console.log(`[openapi] Wrote ${path.relative(process.cwd(), outputPath)}.`);

  const splitFiles = await writeOperationSchemas(schema);
  console.log(`[openapi] Wrote ${splitFiles.length} operation schema files.`);
}

async function fetchOpenAPISchema(schemaUrl) {
  const response = await fetch(schemaUrl, {
    signal: AbortSignal.timeout(openapiSchemaTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI schema: ${schemaUrl}`);
  }

  return normalizeOpenAPISchema(await response.json(), schemaUrl);
}

function normalizeOpenAPISchema(document, schemaUrl) {
  const baseUrl = getServerBaseUrl(schemaUrl);

  return ensureDeclaredTags(
    ensureDefaultServer(normalizeServers(document, baseUrl), baseUrl)
  );
}

async function writeOperationSchemas(document) {
  await fs.rm(splitOutputDir, { recursive: true, force: true });
  await fs.rm(legacySplitOutputDir, { recursive: true, force: true });

  const files = [];
  const usedOutputPaths = new Set();

  for (const [pathName, pathItem] of Object.entries(document.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    const sharedPathFields = Object.fromEntries(
      Object.entries(pathItem).filter(([key]) => !operationMethods.has(key))
    );

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!operationMethods.has(method)) continue;
      if (!operation || typeof operation !== 'object') continue;

      const operationDocument = createOperationDocument(
        document,
        pathName,
        method,
        sharedPathFields,
        operation
      );
      const outputFilePath = resolveOperationOutputPath(
        pathName,
        method,
        usedOutputPaths
      );

      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
      await fs.writeFile(
        outputFilePath,
        `${JSON.stringify(operationDocument, null, 2)}\n`,
        'utf8'
      );

      files.push(outputFilePath);
    }
  }

  return files;
}

function createOperationDocument(
  document,
  pathName,
  method,
  sharedPathFields,
  operation
) {
  const pathItem = copyDefinedProperties({
    parameters: sharedPathFields.parameters,
    [method]: copyDefinedProperties({
      operationId: operation.operationId,
      parameters: operation.parameters,
      requestBody: operation.requestBody,
      responses: operation.responses,
      security:
        operation.security ??
        (document.security && document.security.length > 0
          ? document.security
          : undefined)
    })
  });

  const operationDocument = copyDefinedProperties({
    openapi: document.openapi,
    info: document.info,
    paths: {
      [pathName]: pathItem
    }
  });

  const components = collectReferencedComponents(operationDocument, document);
  if (Object.keys(components).length > 0) {
    operationDocument.components = components;
  }

  return operationDocument;
}

function collectReferencedComponents(operationDocument, sourceDocument) {
  const components = {};
  const visitedRefs = new Set();
  const pendingRefs = collectLocalComponentRefs(operationDocument);
  collectSecuritySchemeRefs(operationDocument, pendingRefs);

  for (let index = 0; index < pendingRefs.length; index += 1) {
    const ref = pendingRefs[index];
    if (visitedRefs.has(ref)) continue;
    visitedRefs.add(ref);

    const refPath = parseComponentRef(ref);
    if (!refPath) continue;

    const value = getValueByPath(sourceDocument, refPath);
    if (value === undefined) continue;

    setValueByPath(components, refPath.slice(1), value);
    pendingRefs.push(...collectLocalComponentRefs(value));
  }

  return components;
}

function collectLocalComponentRefs(value) {
  const refs = [];

  function visit(child) {
    if (Array.isArray(child)) {
      for (const item of child) visit(item);
      return;
    }

    if (!child || typeof child !== 'object') return;

    if (
      typeof child.$ref === 'string' &&
      child.$ref.startsWith('#/components/')
    ) {
      refs.push(child.$ref);
    }

    for (const item of Object.values(child)) {
      visit(item);
    }
  }

  visit(value);
  return refs;
}

function collectSecuritySchemeRefs(operationDocument, refs) {
  for (const pathItem of Object.values(operationDocument.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const operation of Object.values(pathItem)) {
      if (!operation || typeof operation !== 'object') continue;
      if (!Array.isArray(operation.security)) continue;

      for (const requirement of operation.security) {
        if (!requirement || typeof requirement !== 'object') continue;

        for (const name of Object.keys(requirement)) {
          refs.push(`#/components/securitySchemes/${escapeJsonPointer(name)}`);
        }
      }
    }
  }
}

function parseComponentRef(ref) {
  if (!ref.startsWith('#/components/')) return undefined;

  return ref
    .slice(2)
    .split('/')
    .map(segment => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function getValueByPath(value, segments) {
  return segments.reduce((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return current[segment];
  }, value);
}

function setValueByPath(target, segments, value) {
  let current = target;

  for (const segment of segments.slice(0, -1)) {
    current[segment] ??= {};
    current = current[segment];
  }

  current[segments.at(-1)] = value;
}

function escapeJsonPointer(value) {
  return value.replace(/~/g, '~0').replace(/\//g, '~1');
}

function copyDefinedProperties(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined)
  );
}

function resolveOperationOutputPath(pathName, method, usedOutputPaths) {
  const segments = pathName
    .split('/')
    .filter(Boolean)
    .map(segment => slugifyPathSegment(segment));
  const baseDir = path.join(splitOutputDir, ...segments);
  const baseName = method.toLowerCase();
  let outputFilePath = path.join(baseDir, `${baseName}.json`);
  let counter = 2;

  while (usedOutputPaths.has(outputFilePath)) {
    outputFilePath = path.join(baseDir, `${baseName}-${counter}.json`);
    counter += 1;
  }

  usedOutputPaths.add(outputFilePath);
  return outputFilePath;
}

function slugifyPathSegment(segment) {
  const normalized = segment
    .replace(/^\{(.+)\}$/, 'by-$1')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || '_';
}

function getServerBaseUrl(schemaUrl) {
  return openapiServerUrl ?? openapiServerOrigin ?? new URL(schemaUrl).origin;
}

function normalizeServers(document, baseUrl) {
  function visit(value) {
    if (Array.isArray(value)) {
      return value.map(visit);
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    const next = Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, visit(child)])
    );

    if (Array.isArray(next.servers)) {
      next.servers = next.servers.map(server => {
        if (!server || typeof server !== 'object') return server;

        const serverRecord = { ...server };
        if (typeof serverRecord.url === 'string') {
          serverRecord.url = normalizeServerUrl(serverRecord.url, baseUrl);
        }

        return serverRecord;
      });
    }

    return next;
  }

  return visit(document);
}

function normalizeServerUrl(url, baseUrl) {
  if (!url.startsWith('/')) return url;

  return new URL(url, baseUrl).toString();
}

function ensureDefaultServer(document, baseUrl) {
  if (Array.isArray(document.servers) && document.servers.length > 0) {
    return document;
  }

  return {
    ...document,
    servers: [{ url: baseUrl }]
  };
}

function ensureDeclaredTags(document) {
  const declaredTags = new Set();
  const nextTags = Array.isArray(document.tags) ? [...document.tags] : [];

  for (const tag of nextTags) {
    if (tag && typeof tag === 'object' && typeof tag.name === 'string') {
      declaredTags.add(tag.name);
    }
  }

  for (const tag of collectOperationTags(document)) {
    if (declaredTags.has(tag)) continue;

    declaredTags.add(tag);
    nextTags.push({ name: tag });
  }

  return {
    ...document,
    tags: nextTags
  };
}

function collectOperationTags(document) {
  const tags = new Set();
  collectTagsFromRecord(document.paths, tags);
  collectTagsFromRecord(document.webhooks, tags);

  return tags;
}

function collectTagsFromRecord(value, tags) {
  if (!value || typeof value !== 'object') return;

  for (const item of Object.values(value)) {
    if (!item || typeof item !== 'object') continue;

    for (const operation of Object.values(item)) {
      if (!operation || typeof operation !== 'object') continue;
      if (!Array.isArray(operation.tags) || operation.tags.length === 0) {
        tags.add('unknown');
        continue;
      }

      for (const tag of operation.tags) {
        if (typeof tag === 'string' && tag.length > 0) {
          tags.add(tag);
        }
      }
    }
  }
}

function resolveConfiguredUrl(value) {
  if (!value) return undefined;

  try {
    return new URL(value).toString();
  } catch {
    return undefined;
  }
}

function resolveConfiguredOrigin(value) {
  if (!value) return undefined;

  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function resolveTimeout(value) {
  const fallback = 5000;
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

main().catch(error => {
  console.warn(
    `[openapi] Failed to fetch OpenAPI schema. Continuing without the API reference. ${formatErrorMessage(error)}`
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
