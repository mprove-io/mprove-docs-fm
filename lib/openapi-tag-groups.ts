const DATA_TAGS = [
  'State',
  'Models',
  'Charts',
  'Dashboards',
  'Reports',
  'Mconfigs',
  'Queries',
  'SuggestFields',
  'QueryInfo',
  'Run'
] as const;

const FILES_TAGS = [
  'Repos',
  'Branches',
  'Catalogs',
  'Folders',
  'Files',
  'Structs'
] as const;

const SETUP_TAGS = [
  'Orgs',
  'OrgUsers',
  'Projects',
  'Members',
  'Connections',
  'Envs',
  'Users',
  'Avatars',
  'Nav'
] as const;

const CHAT_TAGS = ['Sessions'] as const;

const SKILLS_TAGS = ['Skills'] as const;

const INTERNAL_TAGS = ['Telemetry', 'Check', 'Special', 'TestRoutes'] as const;

export const OPENAPI_TAGS = [
  ...DATA_TAGS,
  ...FILES_TAGS,
  ...SETUP_TAGS,
  ...CHAT_TAGS,
  ...SKILLS_TAGS,
  ...INTERNAL_TAGS
] as const;

export type OpenAPITag = (typeof OPENAPI_TAGS)[number];

export const OPENAPI_TAG_GROUPS: ReadonlyArray<{
  name: string;
  tags: readonly OpenAPITag[];
}> = [
  {
    name: 'Data',
    tags: DATA_TAGS
  },
  {
    name: 'Files',
    tags: FILES_TAGS
  },
  {
    name: 'Setup',
    tags: SETUP_TAGS
  },
  {
    name: 'Chat',
    tags: CHAT_TAGS
  },
  {
    name: 'Skills',
    tags: SKILLS_TAGS
  },
  {
    name: 'Internal',
    tags: INTERNAL_TAGS
  }
];
