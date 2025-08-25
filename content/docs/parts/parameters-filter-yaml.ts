export const parametersFilterYaml = `
# Report or Dashboard
parameters: 
# this filter can be listened by tiles or rows based on Malloy models
- filter: filter_name
  label: '...'
  description: '...' 
  result: filter_result
  suggest_model_dimension: field_path
  conditions:
  - 'filter expression'

# this filter can be listened by tiles or rows based on specified Store model
- filter: filter_name
  store_model: store_model_name
  store_result: store_result_name # filter can be mapped to fields that have specified result
  fractions:
  - logic: OR
    type: contains
    controls:
    - input: value_input
      value: a

# this filter can be listened by tiles or rows based on specified Store model
- filter: filter_name
  store_model: store_model_name
  store_filter: store_filter_name # filter can be mapped to specified store filter
  fractions:
  - controls:
    - selector: ga_property
      value: 123123123
    - date_picker: start_date
      value: $METRICS_DATE_FROM
    - date_picker: end_date
      value: $METRICS_DATE_TO`