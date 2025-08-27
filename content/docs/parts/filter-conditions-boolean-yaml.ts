export const filterConditionsBooleanYaml = `apply_to: field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`true\`           # AND (field)
- f\`=false\`         # AND field = false
- f\`false\`          # AND field IS NULL OR field = false
- f\`null\`           # AND field IS NULL
- f\`not null\`       # AND field IS NOT NULL`

