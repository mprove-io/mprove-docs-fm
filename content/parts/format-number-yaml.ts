export const formatNumberYaml = `fields: #begin of fields section (inside View or Model)
- dimension: price
  format_number: "$,.2f" # 1057.1258 >> $1 057.13
  currency_prefix: $
  currency_suffix: ""
  sql: product_price`