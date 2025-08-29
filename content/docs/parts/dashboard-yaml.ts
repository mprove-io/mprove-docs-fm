export const dashboardYaml = `dashboard: dashboard_name
title: ''
description: ''
access_roles:
- role
- role

parameters:
- filter: f1
  label: 'label'
  description: ''
  result: string
  suggest_model_dimension: model_name.field_path
  conditions:
  - f\`%a\`

tiles:
- title: 'tile title'
  description: ''
  model: model_name
  select:
  - field_path
  - field_path
  - field_path
  parameters:
  - apply_to: field_path
    listen: f1
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
      type: chart_type
  plate:
    plate_width: 8
    plate_height: 12
    plate_x: 0
    plate_y: 0`