import fs from 'node:fs/promises';
import path from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';

const mcpSchemaPathName = '/mcp.json';
const shouldWarnMissingMcpSchema = Boolean(process.env.MCP_SCHEMA_URL);

type McpOpenAPIDocument = Record<string, unknown>;

async function loadMcpSchema(
  warnIfMissing: boolean
): Promise<McpOpenAPIDocument | null> {
  try {
    const cached = await fs.readFile(getMcpSchemaPath(), {
      encoding: 'utf8'
    });

    return JSON.parse(cached) as McpOpenAPIDocument;
  } catch (error) {
    if (warnIfMissing) {
      console.warn(
        `[mcp] MCP schema file is unavailable. Run \`pnpm run mcp:fetch\` to fetch it. ${formatErrorMessage(error)}`
      );
    }
    return null;
  }
}

function getMcpSchemaPath(): string {
  return path.join(process.cwd(), 'public', 'mcp.json');
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

async function createOptionalMcp(): Promise<ReturnType<
  typeof createOpenAPI
> | null> {
  const schema = await loadMcpSchema(shouldWarnMissingMcpSchema);

  if (!schema) {
    return null;
  }

  return createOpenAPI({
    input: async () => ({
      [mcpSchemaPathName]: schema
    })
  });
}

export const mcp = await createOptionalMcp();
export const mcpDocument = await loadMcpSchema(false);
