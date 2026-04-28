import fs from 'node:fs/promises';
import path from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';

const openapiSchemaUrl = process.env.OPENAPI_SCHEMA_URL ?? '/openapi.json';
const openapiServerUrl = resolveConfiguredUrl(process.env.OPENAPI_SERVER_URL);
const openapiServerOrigin = resolveConfiguredOrigin(process.env.DOCS_ORIGIN);
const shouldWarnMissingOpenAPISchema = Boolean(process.env.OPENAPI_SCHEMA_URL);

type OpenAPIDocument = Record<string, unknown>;

async function loadOpenAPISchema(
  warnIfMissing: boolean
): Promise<OpenAPIDocument | null> {
  try {
    const cached = await fs.readFile(getOpenAPISchemaPath(), {
      encoding: 'utf8'
    });

    return JSON.parse(cached) as OpenAPIDocument;
  } catch (error) {
    if (warnIfMissing) {
      console.warn(
        `[openapi] OpenAPI schema file is unavailable. Run \`pnpm run openapi:fetch\` to fetch it. ${formatErrorMessage(error)}`
      );
    }
    return null;
  }
}

function getOpenAPISchemaPath(): string {
  return path.join(process.cwd(), 'public', 'openapi.json');
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

async function createOptionalOpenAPI(
  schemaUrl: string
): Promise<ReturnType<typeof createOpenAPI> | null> {
  const schema = await loadOpenAPISchema(shouldWarnMissingOpenAPISchema);

  if (!schema) {
    return null;
  }

  return createOpenAPI({
    input: async () => ({
      [schemaUrl]: schema
    })
  });
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

export const openapi = openapiSchemaUrl
  ? await createOptionalOpenAPI(openapiSchemaUrl)
  : null;
export const openapiDocument = await loadOpenAPISchema(false);

export { openapiSchemaUrl, openapiServerOrigin, openapiServerUrl };
