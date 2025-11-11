export const storeConstantsStoreFieldsJs = `const STORE_FIELDS = [
  // list of store parameters and store fields definitions in a single array
  {
    required: 'true',
    max_fractions: '1',
    fraction_controls: [
      {
        label: 'Property',
        value: '123123123',
        options: [
          { value: '123123123' }
        ],
        name: 'ga_property',
        controlClass: 'selector'
      },
      {
        label: 'Start Date',
        value: '2025-02-24',
        name: 'start_date',
        controlClass: 'date_picker'
      },
      {
        label: 'End Date',
        value: '2025-02-24',
        name: 'end_date',
        controlClass: 'date_picker'
      }
    ],
    name: 'top_config',
    fieldClass: 'filter',
    label: 'Top Config',
    group: 'mf'
  },
  {
    result: 'string',
    group: 'geo',
    description: 'The country from which the user activity originated',
    meta: { name: 'country' },
    name: 'country',
    fieldClass: 'dimension',
    label: 'Country',
    type: 'custom',
  },
  {
    result: 'number',
    group: 'users',
    description: 'The number of distinct users who visited your site or app',
    meta: {
      name: 'activeUsers',
      type: 'TYPE_INTEGER',
    },
    name: 'active_users',
    fieldClass: 'measure',
    label: 'Active Users',
    format_number: ',.0f',
    currency_prefix: '$',
    currency_suffix: '',
  },
  // ... other store parameters definitions
  // ... other store fields definitions
];`