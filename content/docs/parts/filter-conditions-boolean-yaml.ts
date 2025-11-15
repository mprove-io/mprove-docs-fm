export const filterConditionsBooleanYaml = `apply_to: boolean_field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`=true\`          # AND field
- f\`=false\`         # AND NOT (field)
- f\`true\`           # AND COALESCE(field, false)
- f\`false\`          # AND NOT COALESCE(field, false)
- f\`null\`           # AND (field) IS NULL
- f\`not =true\`      # AND NOT (field)
- f\`not =false\`     # AND field
- f\`not true\`       # AND NOT COALESCE(field, false)
- f\`not false\`      # AND COALESCE(field, false)
- f\`not null\`       # AND (field) IS NOT NULL`