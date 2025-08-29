export const reportYaml = `report: report_name
title: ''
access_roles:
- role
- role
parameters:
- filter: f1
  label: ''
  description: ''
  result: string
  suggest_model_dimension: model_name.field_path
  conditions:
  - f\`%a\`

- filter: f2
  store_model: ga
  store_result: string
  fractions:
  - logic: OR
    type: contains
    controls:
    - input: value_input
      value: a

- filter: f3
  store_model: ga
  store_filter: top_config
  fractions:
  - controls:
    - selector: ga_property
      value: 123123123
    - date_picker: start_date
      value: $METRICS_DATE_FROM
    - date_picker: end_date
      value: $METRICS_DATE_TO

rows:
- row_id: A
  type: empty

- row_id: B
  type: header
  name: 'name in UI'

- row_id: C
  type: metric
  metric: metric_id
  show_chart: true
  format_number: '$,.0f'
  currency_prefix: $
  currency_suffix: ''
  parameters: 
  - apply_to: field_path
    listen: f1

- row_id: D
  type: metric
  metric: metric_id
  parameters: 
  - apply_to: field_path
    conditions:
    - f\`> 100\`

- row_id: E
  type: metric
  metric: ga.screen_page_views.by.event_created_at
  parameters: 
  - apply_to: city
    listen: f2
  - apply_to: top_config
    listen: f3

- row_id: F
  type: metric
  metric: ga.screen_page_views.by.event_created_at
  parameters: 
  - apply_to: city
    fractions:
    - logic: OR
      type: contains
      controls:
      - input: value_input
        value: a
  - apply_to: top_config
    fractions:
    - controls:
      - selector: ga_property
        value: 123123123
      - date_picker: start_date
        value: $METRICS_DATE_FROM
      - date_picker: end_date
        value: $METRICS_DATE_TO

- row_id: G
  type: formula
  formula: ($C + $E) / 2
  name: 'name in UI'

options:
  series: 
  - data_row_id: C
    y_axis_index: 0
    type: 'line'`