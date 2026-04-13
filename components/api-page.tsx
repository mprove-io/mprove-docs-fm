import { openapi } from '@/lib/openapi';
import { createAPIPage } from 'fumadocs-openapi/ui';
import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import { curl } from 'fumadocs-openapi/requests/generators/curl';

const openapiCodeUsages = createCodeUsageGeneratorRegistry();

openapiCodeUsages.add('curl', curl);

export const APIPage = openapi
  ? createAPIPage(openapi, {
      codeUsages: openapiCodeUsages,
      generateTypeScriptDefinitions: false,
      playground: {
        enabled: false,
      },
    })
  : null;
