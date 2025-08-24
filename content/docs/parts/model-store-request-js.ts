export const modelStoreRequestJs = `let storeFields = $STORE_FIELDS;
  let queryOrderBy = $QUERY_ORDER_BY;
  let selectedDimensions = $QUERY_SELECTED_DIMENSIONS;
  let selectedMeasures = $QUERY_SELECTED_MEASURES;
  let queryParameters = $QUERY_PARAMETERS;
  let queryLimit = $QUERY_LIMIT;
  
  let orderByElements = [];
  
  queryOrderBy.forEach(x => {
    let orderBy;
    
    if (selectedDimensions.map(field => field.name).indexOf(x.field.name) > -1) {
      orderBy = {
        dimension: { dimensionName: x.field.meta.name },
        desc: x.desc
      };
    } else if (
      selectedMeasures.map(field => field.name).indexOf(x.field.name) > -1
    ) {
      orderBy = {
        metric: { metricName: x.field.meta.name },
        desc: x.desc
      };
    }
    
    orderByElements.push(orderBy);
  });
  
  let dimOrExpressions = [];
  let dimAndNotExpressions = [];
  
  let mcOrExpressions = [];
  let mcAndNotExpressions = [];
  
  queryParameters.map(filter => {
    let field = storeFields.find(x => x.name === filter.fieldId);
    
    filter.fractions.forEach(fraction => {
      let apiFilter;
      let apiFilterType = fraction.meta?.filter_type;
      
      if (apiFilterType === 'stringFilter') {
        apiFilter = {
          fieldName: field.meta.name,
          stringFilter: {
            matchType: fraction.meta.match_type,
            value: fraction.controls.find(
              control => control['name'] === 'value_input'
            )?.value,
            caseSensitive: $PROJECT_CONFIG_CASE_SENSITIVE
          }
        };
      }
      
      if (apiFilterType === 'inListFilter') {
        apiFilter = {
          fieldName: field.meta.name,
          inListFilter: {
            values: fraction.controls.find(
              control => control['name'] === 'values_input'
            )?.values,
            caseSensitive: $PROJECT_CONFIG_CASE_SENSITIVE
          }
        };
      }
      
      if (apiFilterType === 'numericFilter') {
        apiFilter = {
          fieldName: field.meta.name,
          numericFilter: {
            operation: fraction.meta.operation,
            value: {
              doubleValue: Number(
                fraction.controls.find(
                  control => control['name'] === 'value_input'
                )?.value
              )
            }
          }
        };
      }
      
      if (apiFilterType === 'betweenFilter') {
        apiFilter = {
          fieldName: field.meta.name,
          betweenFilter: {
            fromValue: {
              doubleValue: Number(
                fraction.controls.find(
                  control => control['name'] === 'value_from_input'
                )?.value
              )
            },
            toValue: {
              doubleValue: Number(
                fraction.controls.find(
                  control => control['name'] === 'value_to_input'
                )?.value
              )
            }
          }
        };
      }
      
      if (field.fieldClass === 'dimension') {
        if (fraction.logicGroup === 'OR') {
          dimOrExpressions.push({ filter: apiFilter });
        }
        if (fraction.logicGroup === 'AND_NOT') {
          dimAndNotExpressions.push({
            notExpression: {
              filter: apiFilter
            }
          });
        }
      }
      
      if (field.fieldClass === 'measure') {
        if (fraction.logicGroup === 'OR') {
          mcOrExpressions.push({ filter: apiFilter });
        }
        if (fraction.logicGroup === 'AND_NOT') {
          mcAndNotExpressions.push({
            notExpression: {
              filter: apiFilter
            }
          });
        }
      }
    });
  });
  
  let dateRanges = [
    {
      startDate: queryParameters
        .find(x => x['fieldId'] === 'top_config')
        ?.fractions[0].controls.find(control => control.name === 'start_date')
        ?.value,
      endDate: queryParameters
        .find(x => x['fieldId'] === 'top_config')
        ?.fractions[0].controls.find(control => control.name === 'end_date')
        ?.value
    }
  ];
  
  let dimAndGroupExpressions = [];
  let mcAndGroupExpressions = [];
  
  if (dimOrExpressions.length > 0) {
    dimAndGroupExpressions.push({
      orGroup: { expressions: dimOrExpressions }
    });
  }
  
  if (dimAndNotExpressions.length > 0) {
    dimAndGroupExpressions = [...dimAndGroupExpressions, ...dimAndNotExpressions];
  }
  
  if (mcOrExpressions.length > 0) {
    mcAndGroupExpressions.push({
      orGroup: { expressions: mcOrExpressions }
    });
  }
  
  if (mcAndNotExpressions.length > 0) {
    mcAndGroupExpressions = [...mcAndGroupExpressions, ...mcAndNotExpressions];
  }
  
  let body = {
    dimensions: selectedDimensions.map(x => ({ name: x.meta['name'] })),
    metrics: selectedMeasures.map(x => ({ name: x.meta['name'] })),
    dateRanges: dateRanges,
    dimensionFilter:
      dimOrExpressions.length > 0 || dimAndNotExpressions.length > 0
        ? {
            andGroup: {
              expressions: dimAndGroupExpressions
            }
          }
        : undefined,
    metricFilter:
      mcOrExpressions.length > 0 || mcAndNotExpressions.length > 0
        ? {
            andGroup: {
              expressions: mcAndGroupExpressions
            }
          }
        : undefined,
    limit: queryLimit,
    orderBys: orderByElements,
    currencyCode: 'USD',
    keepEmptyRows: true,
    returnPropertyQuota: false,
    cohortSpec: undefined, // supported in ga_cohorts.store
    metricAggregations: undefined, // not supported
    comparisons: undefined, // not supported
    offset: undefined // not supported
  };
  
  let propertyId = queryParameters
    .find(x => x['fieldId'] === 'top_config')
    ?.fractions[0].controls.find(
      control => control.name === 'ga_property'
    )?.value;
  
  let urlPath = \`/v1beta/properties/\$\{propertyId\}:runReport\`;
  
  return { urlPath: urlPath, body: body };`