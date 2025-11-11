export const modelStoreYaml = `store: ga
connection: c7_google
# preset: google_analytics
label: Google Analytics
description: 'Google Analytics Reporting'
access_roles: []
method: POST
request: |
  <createRequest.js content>
response: |
  <processRequest.js content>
date_range_includes_right_side: true
parameters:
- filter: top_config
  required: true
  max_fractions: 1
  fraction_controls:
  - selector: ga_property
    label: Property
    value: '123456789'
    options:
    - value: '123456789'
  - date_picker: start_date
    label: Start Date
    value: $METRICS_DATE_FROM
  - date_picker: end_date
    label: End Date
    value: $METRICS_DATE_TO

results:
- result: number
  fraction_types:
  - type: equal
    label: Equal
    meta: 
      operation: EQUAL
      filter_type: numericFilter
    controls: 
    - input: value_input

  - type: less_than
    meta: 
      operation: LESS_THAN
      filter_type: numericFilter
    controls: 
    - input: value_input

  - type: less_than_or_equal
    meta: 
      operation: LESS_THAN_OR_EQUAL
      filter_type: numericFilter
    controls: 
    - input: value_input

  - type: greater_than
    meta: 
      operation: GREATER_THAN
      filter_type: numericFilter
    controls: 
    - input: value_input

  - type: greater_than_or_equal
    meta: 
      operation: GREATER_THAN_OR_EQUAL
      filter_type: numericFilter
    controls: 
    - input: value_input

  - type: between
    meta: 
      operation: BETWEEN
      filter_type: betweenFilter
    controls:
    - input: value_from_input
    - input: value_to_input

- result: string
  fraction_types:
  - type: exact
    meta: 
      match_type: EXACT
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: begins_with
    meta: 
      match_type: BEGINS_WITH
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: ends_with
    meta: 
      match_type: ENDS_WITH
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: contains
    meta: 
      match_type: CONTAINS
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: full_regexp
    meta: 
      match_type: FULL_REGEXP
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: partial_regexp
    meta: 
      match_type: PARTIAL_REGEXP
      filter_type: stringFilter
    controls:
    - input: value_input

  - type: in_list
    meta: 
      match_type: IN_LIST
      filter_type: inListFilter
    controls:
    - list_input: values_input

field_groups:
  - group: "attribution"
    label: "Attribution"
  - group: "demographics"
    label: "Demographics"
  - group: "ecommerce"
    label: "Ecommerce"
  - group: "event"
    label: "Event"
  - group: "geography"
    label: "Geography"
  - group: "other"
    label: "Other"
  - group: "page_screen"
    label: "Page Screen"
  - group: "platform_device"
    label: "Platform Device"
  - group: "publisher"
    label: "Publisher"
  - group: "revenue"
    label: "Revenue"
  - group: "session"
    label: "Session"
  - group: "traffic_source"
    label: "Traffic Source"
  - group: "user"
    label: "User"
  - group: "user_lifetime"
    label: "User Lifetime"

field_time_groups:
- time: event_created_at
  group: event
  label: 'Event Created At'

build_metrics:
- time: event_created_at

fields: <Store Fields array>`