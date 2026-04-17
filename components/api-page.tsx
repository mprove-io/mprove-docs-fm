import { openapi } from '@/lib/openapi';
import { OpenAPIDefaultOpenResponse } from '@/components/openapi-default-open-response';
import { createAPIPage } from 'fumadocs-openapi/ui';
import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import type { CodeUsageGenerator } from 'fumadocs-openapi/requests/generators';

const openapiCodeUsages = createCodeUsageGeneratorRegistry();

function unwrapRequestData(data: Parameters<CodeUsageGenerator['generate']>[1]) {
  const query = Object.fromEntries(
    Object.entries(data.query).map(([key, value]) => [key, value.values]),
  );
  const path = Object.fromEntries(
    Object.entries(data.path).map(([key, value]) => [key, value.value]),
  );
  const header = Object.fromEntries(
    Object.entries(data.header).map(([key, value]) => [key, value.value]),
  );
  const cookie = Object.fromEntries(
    Object.entries(data.cookie).map(([key, value]) => [key, value.value]),
  );

  return {
    method: data.method,
    path,
    query,
    header,
    cookie,
    body: data.body,
    bodyMediaType: data.bodyMediaType,
  };
}

const jsonExample: CodeUsageGenerator = {
  label: 'JSON',
  lang: 'json',
  generate(_url, data) {
    const payload = data.body ?? unwrapRequestData(data);
    return JSON.stringify(payload, null, 2);
  },
};

openapiCodeUsages.add('curl', jsonExample);

export const APIPage = openapi
  ? createAPIPage(openapi, {
      codeUsages: openapiCodeUsages,
      generateTypeScriptDefinitions: false,
      content: {
        renderAPIExampleLayout: slots => (
          <div className='prose-no-margin'>
            {slots.selector}
            {slots.usageTabs}
            <div className='openapi-response-examples'>{slots.responseTabs}</div>
          </div>
        ),
        renderOperationLayout: (slots, _ctx, method) => (
          <div className='flex flex-col gap-x-6 gap-y-4 @4xl:flex-row @4xl:items-start'>
            <div className='min-w-0 flex-1'>
              {slots.header}
              {slots.apiPlayground ? (
                <div className='mb-4'>{slots.apiPlayground}</div>
              ) : null}
              {slots.description}
              {slots.authSchemes}
              {slots.parameters}
              <div className='openapi-request-body'>{slots.body}</div>
              {slots.responses}
              {method.responses?.['200'] ? <OpenAPIDefaultOpenResponse /> : null}
              {slots.callbacks}
            </div>
            <div className='openapi-example-panel @4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+1rem)] @4xl:w-[400px]'>
              {slots.apiExample}
            </div>
          </div>
        )
      },
      playground: {
        enabled: false,
      },
    })
  : null;
