export const storeConstantsQueryParametersJs = `const QUERY_PARAMETERS = [
  {
    fieldId: 'city',
    fractions: [
      {
        operator: 'Or',
        type: 'StoreFraction',
        storeResult: 'string',
        storeFractionSubType: 'exact',
        meta: {
          match_type: 'EXACT',
          filter_type: 'stringFilter',
        },
        logicGroup: 'AND_NOT',
        storeFractionSubTypeOptions: [
          { value: 'exact' },
          { value: 'begins_with' },
          { value: 'ends_with' },
          { value: 'contains' },
          { value: 'full_regexp' },
          { value: 'partial_regexp' },
          { value: 'in_list' }
        ],
        controls: [
          { name: 'value_input', controlClass: 'input', value: 'h' },
          {
            value: false,
            label: 'Case Sensitive',
            name: 'case_sensitive_switch',
            controlClass: 'switch'
          }
        ]
      }
    ],
    field: {
      id: 'city',
      hidden: false,
      label: 'City',
      fieldClass: 'dimension',
      result: 'string',
      sqlName: 'city',
      topId: 'geo',
      topLabel: 'geo',
      description: 'The city from which the user activity originated',
      type: 'custom'
    }
  },
  {
    fieldId: 'top_config',
    fractions: [
      {
        type: 'StoreFraction',
        controls: [
          {
            options: [
              { value: '474781769' },
              { value: '123123123' }
            ],
            value: '474781769',
            label: 'Property',
            name: 'ga_property',
            controlClass: 'selector'
          },
          {
            value: '2025-02-24',
            label: 'Start Date',
            name: 'start_date',
            controlClass: 'date_picker'
          },
          {
            value: '2025-02-24',
            label: 'End Date',
            name: 'end_date',
            controlClass: 'date_picker'
          }
        ]
      }
    ]
  },
];`