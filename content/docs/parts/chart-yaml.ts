export const chartYaml = `chart: chart_name
access_roles:
- role
- role
tiles: # Chart must have exactly one tile
- title: 'tile title'
  description: ''
  model: model_name
  select:
  - field_path
  - field_path
  - field_path
  parameters:
  - apply_to: field_path
    conditions:
    - f\`> 100\`
  sorts: field_path desc, field_path, ...
  limit: 500
  type: chart_type
  data:
    x_field: field_path
    y_fields:
    - field_path
    - field_path
    multi_field: field_path
    size_field: field_path
  options:
    x_axis:
      scale: false
    y_axis:
    - scale: false
    - scale: false
    series:
    - data_field: field_path
      y_axis_index: 0
      type: chart_type`