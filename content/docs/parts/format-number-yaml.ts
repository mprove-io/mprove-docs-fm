export const formatNumberYaml = `fields: # store's fields section
- dimension: price
  result: number
  format_number: "$,.2f" # 1057.1258 >> $1,057.13
  currency_prefix: $
  currency_suffix: ""

- measure: orders_count
  format_number: "," # 2143 >> 2,143`