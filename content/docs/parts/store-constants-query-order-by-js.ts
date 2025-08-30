export const storeConstantsQueryOrderByJs = `const QUERY_ORDER_BY = [
    {
      fieldId: 'city',
      field: {
        result: 'string',
        group: 'geo',
        description: 'The city from which the user activity originated',
        meta: { name: 'city' },
        name: 'city',
        fieldClass: 'dimension',
        label: 'City',
        type: 'custom',
      },
      desc: false
    }
  ];`