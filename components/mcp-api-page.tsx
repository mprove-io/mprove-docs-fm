import { createAPIPage } from 'fumadocs-openapi/ui';
import { OpenAPIDefaultOpenResponse } from '@/components/openapi-default-open-response';
import { mcp } from '@/lib/mcp';

export const McpAPIPage = mcp
  ? createAPIPage(mcp, {
      generateTypeScriptDefinitions: false,
      content: {
        renderAPIExampleLayout: () => null,
        renderOperationLayout: (slots, _ctx, method) => (
          <div className='mcp-api-page min-w-0 flex-1'>
            {slots.description}
            <div className='openapi-request-body'>{slots.body}</div>
            {slots.responses}
            {method.responses?.['200'] ? <OpenAPIDefaultOpenResponse /> : null}
          </div>
        )
      },
      playground: {
        enabled: false
      }
    })
  : null;
