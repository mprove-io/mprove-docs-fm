import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';

const openapiSchemaUrl = process.env.OPENAPI_SCHEMA_URL;
const openapiServerUrl = resolveConfiguredUrl(process.env.OPENAPI_SERVER_URL);
const openapiServerOrigin = resolveConfiguredOrigin(process.env.DOCS_ORIGIN);
const openapiSchemaTimeoutMs = resolveTimeout(
  process.env.OPENAPI_SCHEMA_TIMEOUT_MS
);

type OpenAPIDocument = Record<string, unknown>;
type OpenAPISchemaCache = Map<string, Promise<OpenAPIDocument>>;

const openapiSchemaCacheKey = Symbol.for('mprove-docs.openapi-schema-cache');
const openapiSchemaCache = getOpenAPISchemaCache();

async function loadOpenAPISchema(schemaUrl: string): Promise<OpenAPIDocument> {
  const cachedSchema = openapiSchemaCache.get(schemaUrl);

  if (cachedSchema) {
    return cachedSchema;
  }

  const schemaPromise = loadUncachedOpenAPISchema(schemaUrl);
  openapiSchemaCache.set(schemaUrl, schemaPromise);

  try {
    return await schemaPromise;
  } catch (error) {
    openapiSchemaCache.delete(schemaUrl);
    throw error;
  }
}

async function loadUncachedOpenAPISchema(
  schemaUrl: string
): Promise<OpenAPIDocument> {
  const persistedSchema = await readOpenAPISchemaCache(schemaUrl);

  if (persistedSchema) {
    return persistedSchema;
  }

  const schema = await fetchOpenAPISchema(schemaUrl);
  await writeOpenAPISchemaCache(schemaUrl, schema);

  return schema;
}

async function fetchOpenAPISchema(schemaUrl: string): Promise<OpenAPIDocument> {
  const response = await fetch(schemaUrl, {
    signal: AbortSignal.timeout(openapiSchemaTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI schema: ${schemaUrl}`);
  }
  const document = (await response.json()) as OpenAPIDocument;

  return normalizeOpenAPISchema(document, schemaUrl);
}

async function writeOpenAPISchemaCache(
  schemaUrl: string,
  schema: OpenAPIDocument
): Promise<void> {
  try {
    const cachePath = getOpenAPISchemaCachePath(schemaUrl);

    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(schema), 'utf8');
  } catch (error) {
    console.warn('[openapi] Failed to write OpenAPI schema cache.', error);
  }
}

async function readOpenAPISchemaCache(
  schemaUrl: string
): Promise<OpenAPIDocument | null> {
  try {
    const cached = await fs.readFile(getOpenAPISchemaCachePath(schemaUrl), {
      encoding: 'utf8'
    });

    return JSON.parse(cached) as OpenAPIDocument;
  } catch {
    return null;
  }
}

function getOpenAPISchemaCachePath(schemaUrl: string): string {
  const key = createHash('sha256').update(schemaUrl).digest('hex').slice(0, 16);

  return path.join(getOpenAPISchemaCacheDir(), `${key}.json`);
}

function getOpenAPISchemaCacheDir(): string {
  return path.join(getOpenAPISchemaCacheRoot(), 'schemas');
}

function getOpenAPISchemaCacheRoot(): string {
  return path.join(process.cwd(), '.openapi-cache');
}

function getOpenAPISchemaCache(): OpenAPISchemaCache {
  const globalObject = globalThis as typeof globalThis & {
    [openapiSchemaCacheKey]?: OpenAPISchemaCache;
  };

  if (!globalObject[openapiSchemaCacheKey]) {
    globalObject[openapiSchemaCacheKey] = new Map();
  }

  return globalObject[openapiSchemaCacheKey];
}

function normalizeOpenAPISchema(
  document: OpenAPIDocument,
  schemaUrl: string
): OpenAPIDocument {
  const baseUrl = getServerBaseUrl(schemaUrl);

  return ensureDeclaredTags(
    ensureDefaultServer(normalizeServers(document, baseUrl), baseUrl)
  );
}

async function createOptionalOpenAPI(
  schemaUrl: string
): Promise<ReturnType<typeof createOpenAPI> | null> {
  try {
    const schema = await loadOpenAPISchema(schemaUrl);

    return createOpenAPI({
      input: async () => ({
        [schemaUrl]: schema
      })
    });
  } catch (error) {
    console.warn(
      `[openapi] OpenAPI schema is unavailable, disabling OpenAPI docs. URL: ${schemaUrl}`,
      error
    );

    return null;
  }
}

function getServerBaseUrl(schemaUrl: string): string {
  return openapiServerUrl ?? openapiServerOrigin ?? new URL(schemaUrl).origin;
}

function normalizeServers(
  document: OpenAPIDocument,
  baseUrl: string
): OpenAPIDocument {
  function visit(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(visit);
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    const next = Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, visit(child)])
    ) as Record<string, unknown>;

    if (Array.isArray(next.servers)) {
      next.servers = next.servers.map(server => {
        if (!server || typeof server !== 'object') return server;

        const serverRecord = { ...server } as Record<string, unknown>;
        if (typeof serverRecord.url === 'string') {
          serverRecord.url = normalizeServerUrl(serverRecord.url, baseUrl);
        }

        return serverRecord;
      });
    }

    return next;
  }

  return visit(document) as OpenAPIDocument;
}

function normalizeServerUrl(url: string, baseUrl: string): string {
  if (!url.startsWith('/')) return url;

  return new URL(url, baseUrl).toString();
}

function ensureDefaultServer(
  document: OpenAPIDocument,
  baseUrl: string
): OpenAPIDocument {
  if (Array.isArray(document.servers) && document.servers.length > 0) {
    return document;
  }

  return {
    ...document,
    servers: [{ url: baseUrl }]
  };
}

function ensureDeclaredTags(document: OpenAPIDocument): OpenAPIDocument {
  const declaredTags = new Set<string>();
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

function collectOperationTags(document: OpenAPIDocument): Set<string> {
  const tags = new Set<string>();
  collectTagsFromRecord(document.paths, tags);
  collectTagsFromRecord(document.webhooks, tags);

  return tags;
}

function collectTagsFromRecord(value: unknown, tags: Set<string>) {
  if (!value || typeof value !== 'object') return;

  for (const item of Object.values(value)) {
    if (!item || typeof item !== 'object') continue;

    for (const operation of Object.values(item)) {
      if (!operation || typeof operation !== 'object') continue;
      const operationRecord = operation as Record<string, unknown>;
      if (
        !Array.isArray(operationRecord.tags) ||
        operationRecord.tags.length === 0
      ) {
        tags.add('unknown');
        continue;
      }

      for (const tag of operationRecord.tags) {
        if (typeof tag === 'string' && tag.length > 0) {
          tags.add(tag);
        }
      }
    }
  }
}

function resolveConfiguredUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value).toString();
  } catch {
    return undefined;
  }
}

function resolveConfiguredOrigin(
  value: string | undefined
): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function resolveTimeout(value: string | undefined): number {
  const fallback = 5000;
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const openapi = openapiSchemaUrl
  ? await createOptionalOpenAPI(openapiSchemaUrl)
  : null;

export { openapiSchemaUrl, openapiServerOrigin, openapiServerUrl };
