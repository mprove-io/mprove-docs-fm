export const modelStoreYaml = `store: ga
connection: c7_google
preset: google_analytics
label: Google Analytics
description: 'Google Analytics Reporting'
access_roles: []
date_range_includes_right_side: true
method: POST
request: |
  <createRequest.js>
response: |
  <processRequest.js>
parameters:
- filter: top_config
  required: true
  max_fractions: 1
  fraction_controls:
  - selector: ga_property
    label: Property
    value: 456456456
    options:
    - value: 456456456
    - value: 123123123
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
- group: geo
- group: events
- group: users
- group: sessions
- group: page_screens

field_time_groups:
- time: event_created_at
  group: events
  label: 'Event Created At'

build_metrics:
- time: event_created_at

fields:    
# Dimensions

- dimension: country
  result: string
  group: geo
  description: 'The country from which the user activity originated'
  meta:
    name: country

- dimension: city
  result: string
  group: geo
  description: 'The city from which the user activity originated'
  meta:
    name: city

# Time Dimensions

- dimension: year # "2025"
  label: 'Year'
  result: string
  time_group: event_created_at
  detail: years
  description: 'The four-digit year of the event. For example, 2020 or 2024'
  meta:
    name: year

- dimension: year_month # "202501"
  label: 'Month'
  result: string
  time_group: event_created_at
  detail: months
  description: 'The combined values of year and month. Example values include 202212 or 202301'
  meta:
    name: yearMonth

- dimension: iso_year_iso_week # "202504"
  label: 'Week Monday'
  result: string
  time_group: event_created_at
  detail: weeksMonday
  description: 'The combined values of isoWeek and isoYear. Example values include 201652 & 201701'
  meta:
    name: isoYearIsoWeek

- dimension: year_week # "202505"
  label: 'Week Sunday'
  result: string
  time_group: event_created_at
  detail: weeksSunday
  description: 'The combined values of year and week. Example values include 202253 or 202301'
  meta:
    name: yearWeek

- dimension: date # "20250127"
  result: string
  time_group: event_created_at
  detail: days
  description: 'The date of the event, formatted as YYYYMMDD'
  meta:
    name: date

- dimension: date_hour # "2025012722"
  label: 'Hour'
  result: string
  time_group: event_created_at
  detail: hours
  description: 'The combined values of date and hour formatted as YYYYMMDDHH'
  meta:
    name: dateHour

- dimension: date_hour_minute # "202501272212"
  label: 'Minute'
  result: string
  time_group: event_created_at
  detail: minutes
  description: 'The combined values of date, hour, and minute formatted as YYYYMMDDHHMM'
  meta:
    name: dateHourMinute

- dimension: hour # "4"
  result: string
  group: events
  description: "The two-digit hour of the day that the event was logged. This dimension ranges from 0-23 and is reported in your property's timezone"
  meta:
    name: hour

- dimension: minute # "40"
  result: string
  group: events
  description: "The two-digit minute of the hour that the event was logged. This dimension ranges from 0-59 and is reported in your property's timezone"
  meta:
    name: minute

- dimension: day # "26"
  result: string
  group: events
  description: 'The day of the month, a two-digit number from 01 to 31'
  meta:
    name: day

- dimension: day_of_week # "0"
  label: 'Day of week'
  result: string
  group: events
  description: 'The integer day of the week. It returns values in the range 0 to 6 with Sunday as the first day of the week'
  meta:
    name: dayOfWeek

- dimension: day_of_week_name # "Sunday"
  label: 'Day of week name'
  result: string
  group: events
  description: 'The day of the week in English. This dimension has values such as Sunday or Monday'
  meta:
    name: dayOfWeekName

- dimension: week # "05"
  label: 'Week'
  result: string
  group: events
  description: 'The week of the event, a two-digit number from 01 to 53. Each week starts on Sunday. January 1st is always in week 01. The first and last week of the year have fewer than 7 days in most years. Weeks other than the first and the last week of the year always have 7 days. For years where January 1st is a Sunday, the first week of that year and the last week of the prior year have 7 days'
  meta:
    name: week

- dimension: month # "01"
  result: string
  group: events
  description: 'The month of the event, a two digit integer from 01 to 12'
  meta:
    name: month

- dimension: iso_year # "2025"
  label: 'ISO year'
  result: string
  group: events
  description: 'The ISO year of the event. For details, see http://en.wikipedia.org/wiki/ISO_week_date. Example values include 2022 & 2023'
  meta:
    name: isoYear

- dimension: iso_week # "04"
  label: 'ISO week of the year'
  result: string
  group: events
  description: 'ISO week number, where each week starts on Monday. For details, see http://en.wikipedia.org/wiki/ISO_week_date. Example values include 01, 02, & 53'
  meta:
    name: isoWeek

- dimension: nth_year # "0000"
  label: 'Nth year'
  result: string
  description: 'The number of years since the start of the date range. The starting year is 0000'
  group: events
  meta:
    name: nthYear

- dimension: nth_month # "0000"
  label: 'Nth month'
  result: string
  group: events
  description: 'The number of months since the start of a date range. The starting month is 0000'
  meta:
    name: nthMonth

- dimension: nth_week # "0001"
  label: 'Nth week'
  result: string
  group: events
  description: 'A number representing the number of weeks since the start of a date range'
  meta:
    name: nthWeek

- dimension: nth_day # "0004"
  label: 'Nth day'
  result: string
  group: events
  description: 'The number of days since the start of the date range'
  meta:
    name: nthDay

- dimension: nth_hour # "0142"
  label: 'Nth hour'
  result: string
  group: events
  description: 'The number of hours since the start of the date range. The starting hour is 0000'
  meta:
    name: nthHour

- dimension: nth_minute # "8532"
  label: 'Nth minute'
  result: string
  group: events
  description: 'The number of minutes since the start of the date range. The starting minute is 0000'
  meta:
    name: nthMinute
    
# Measures

- measure: active_users
  result: number
  group: users
  description: 'The number of distinct users who visited your site or app'
  meta:
    name: activeUsers
    type: TYPE_INTEGER

- measure: sessions
  result: number
  group: sessions
  description: 'The number of sessions that began on your site or app (event triggered: session_start)'
  meta:
    name: sessions
    type: TYPE_INTEGER

- measure: screen_page_views
  result: number
  group: page_screens
  description: 'The number of app screens or web pages your users viewed. Repeated views of a single page or screen are counted. (screen_view + page_view events)'
  meta:
    name: screenPageViews
    type: TYPE_INTEGER`