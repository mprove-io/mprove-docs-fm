export const dashboardYaml = `dashboard: dashboard_name
title: ''
description: ''
parameters:
- filter: f1
  label: 'label'
  description: ''
  result: string
  suggest_model_dimension: model_name.join_alias.field_name
  conditions:
  - 'filter expression'

tiles:
- title: 'tile title'
  description: ''
  model: model_name
  select:
  - alias.field_name
  - alias.field_name
  parameters:
  - apply_to: alias.field_name
    listen: f1
  - apply_to: alias.field_name
    conditions:
    - 'filter expression'
  sorts: alias.field_name desc, alias.field_name, ...
  limit: 500
  type: chart_type
  data:
    x_field: alias.field_name
    y_fields:
    - alias.field_name
    - alias.field_name
    multi_field: alias.field_name
    size_field: alias.field_name
    hide_columns:
    - alias.field_name
    - alias.field_name
  options:
    x_axis:
      scale: false
    y_axis:
    - scale: false
    - scale: false
    series:
    - data_field: alias.field_name
      y_axis_index: 0
      type: chart_type
  plate:
    plate_width: 8
    plate_height: 12
    plate_x: 0
    plate_y: 0

access_roles:
- role
- role`