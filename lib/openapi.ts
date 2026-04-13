import { createOpenAPI } from 'fumadocs-openapi/server';

const openapiSchemaUrl = process.env.OPENAPI_SCHEMA_URL;
const openapiServerUrl = resolveConfiguredUrl(process.env.OPENAPI_SERVER_URL);
const openapiServerOrigin = resolveConfiguredOrigin(process.env.DOCS_ORIGIN);
const openapiSchemaTimeoutMs = resolveTimeout(
  process.env.OPENAPI_SCHEMA_TIMEOUT_MS
);

type OpenAPIDocument = Record<string, unknown>;

async function loadOpenAPISchema(schemaUrl: string): Promise<OpenAPIDocument> {
  const response = await fetch(schemaUrl, {
    signal: AbortSignal.timeout(openapiSchemaTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI schema: ${schemaUrl}`);
  }

  const document = (await response.json()) as OpenAPIDocument;
  const baseUrl = getServerBaseUrl(schemaUrl);

  return ensureDefaultServer(normalizeServers(document, baseUrl), baseUrl);
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
