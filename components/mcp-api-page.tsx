import { createAPIPage } from 'fumadocs-openapi/ui';
import { OpenAPIDefaultOpenResponse } from '@/components/openapi-default-open-response';
import { mcp } from '@/lib/mcp';

function sampleSchema(schema: unknown, seen = new WeakSet<object>()): unknown {
  if (!schema || typeof schema !== 'object') return undefined;
  const s = schema as Record<string, unknown>;
  if (seen.has(s)) return undefined;
  seen.add(s);

  if (s.example !== undefined) return s.example;
  if (s.default !== undefined) return s.default;
  if (Array.isArray(s.enum) && s.enum.length > 0) return s.enum[0];

  if (Array.isArray(s.oneOf) && s.oneOf.length > 0)
    return sampleSchema(s.oneOf[0], seen);
  if (Array.isArray(s.anyOf) && s.anyOf.length > 0)
    return sampleSchema(s.anyOf[0], seen);
  if (Array.isArray(s.allOf) && s.allOf.length > 0) {
    const merged: Record<string, unknown> = {};
    for (const part of s.allOf as Record<string, unknown>[]) {
      if (part && typeof part === 'object') Object.assign(merged, part);
    }
    return sampleSchema(merged, seen);
  }

  const rawType = Array.isArray(s.type) ? s.type[0] : s.type;
  const type =
    typeof rawType === 'string'
      ? rawType
      : s.properties
        ? 'object'
        : s.items
          ? 'array'
          : undefined;

  switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return true;
    case 'null':
      return null;
    case 'array':
      return [sampleSchema(s.items, seen)];
    case 'object':
    default: {
      const out: Record<string, unknown> = {};
      const props = (s.properties ?? {}) as Record<string, unknown>;
      for (const [key, value] of Object.entries(props)) {
        out[key] = sampleSchema(value, seen);
      }
      return out;
    }
  }
}

function pickJsonSchema(
  content: Record<string, { schema?: unknown; example?: unknown }> | undefined
): { schema?: unknown; example?: unknown } | undefined {
  if (!content) return undefined;
  const jsonKey = Object.keys(content).find(
    key => key === 'application/json' || key.endsWith('+json')
  );
  return jsonKey ? content[jsonKey] : undefined;
}

function buildSampleJson(
  content: Record<string, { schema?: unknown; example?: unknown }> | undefined
): string | null {
  const item = pickJsonSchema(content);
  if (!item) return null;
  const value = item.example !== undefined ? item.example : sampleSchema(item.schema);
  if (value === undefined) return null;
  return JSON.stringify(value, null, 2);
}

export const McpAPIPage = mcp
  ? createAPIPage(mcp, {
      generateTypeScriptDefinitions: false,
      content: {
        renderAPIExampleLayout: () => null,
        renderOperationLayout: (slots, ctx, method) => {
          const inputJson = buildSampleJson(
            method.requestBody?.content as Record<
              string,
              { schema?: unknown; example?: unknown }
            > | undefined
          );

          const responses = method.responses ?? {};
          const responseEntry =
            responses['200'] ??
            Object.entries(responses).find(([code]) =>
              code.startsWith('2')
            )?.[1];
          const outputJson = buildSampleJson(
            (responseEntry as { content?: Record<string, { schema?: unknown; example?: unknown }> } | undefined)?.content
          );

          return (
            <div className='flex flex-col gap-x-6 gap-y-4 @4xl:flex-row @4xl:items-start'>
              <div className='mcp-api-page min-w-0 flex-1'>
                {slots.description}
                <div className='openapi-request-body'>{slots.body}</div>
                {slots.responses}
                {method.responses?.['200'] ? <OpenAPIDefaultOpenResponse /> : null}
              </div>
              <div className='openapi-example-panel @4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+1rem)] @4xl:w-[400px]'>
                <div className='prose-no-margin flex flex-col gap-4'>
                  {inputJson !== null ? (
                    <div className='openapi-input-section mb-4'>
                      <h3 className='mb-[20px] text-lg'>Input</h3>
                      {ctx.renderCodeBlock('json', inputJson)}
                    </div>
                  ) : null}
                  {outputJson !== null ? (
                    <div className='openapi-output-section mt-4 mb-4'>
                      <h3 className='mb-[20px] text-lg'>Output</h3>
                      {ctx.renderCodeBlock('json', outputJson)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        }
      },
      playground: {
        enabled: false
      }
    })
  : null;
