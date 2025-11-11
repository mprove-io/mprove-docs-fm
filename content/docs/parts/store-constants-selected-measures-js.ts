export const storeConstantsSelectedMeasuresJs = `const QUERY_SELECTED_MEASURES = [
  {
    result: 'number',
    group: 'users',
    description: 'The number of distinct users who visited your site or app',
    meta: {
      apiName: 'activeUsers',
      uiName: 'Active users',
      type: 'TYPE_INTEGER',
    },
    name: 'active_users',
    fieldClass: 'measure',
    label: 'Active Users',
    format_number: ',.0f',
    currency_prefix: '$',
    currency_suffix: '',
  }
];`