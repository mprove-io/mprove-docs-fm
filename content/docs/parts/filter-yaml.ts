export const filterYaml = `
# Report, Dashboard
parameters: 
- filter: filter_name
  label: '...'
  description: '...' 
  result: filter_result
  suggest_model_dimension: field_path
  conditions:
  - 'filter expression'

- filter: filter_name
  store_model: store_model_name
  store_result: store_result_name
  fractions:
  - logic: OR
    type: contains
    controls:
    - input: value_input
      value: a

- filter: filter_name
  store_model: store_model_name
  store_filter: store_filter_name
  fractions:
  - controls:
    - selector: ga_property
      value: 123123123
    - date_picker: start_date
      value: $METRICS_DATE_FROM
    - date_picker: end_date
      value: $METRICS_DATE_TO`