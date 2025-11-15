export const filterConditionsStringYaml = `apply_to: string_field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`a%z\`            # OR field LIKE 'a%z'
- f\`-FOO-\`          # OR field = 'FOO'
- f\`%FOO%\`          # OR field LIKE '%FOO%'
- f\`FOO%\`           # OR field LIKE 'FOO%'
- f\`%FOO\`           # OR field LIKE '%FOO'
- f\`null\`           # OR field IS NULL
- f\`blank\`          # OR COALESCE(field,'') = ''

- f\`OH, NY\`         # OR field IN ('OH', 'NY')
- f\`UT, MT%\`        # OR (field = 'UT' OR field LIKE 'MT%')
- f\`\\\\%%\`           # OR field LIKE '\\\\%%'

- f\`-a%z\`           # AND (field NOT LIKE 'a%z' OR field IS NULL)
- f\`-FOO\`           # AND (field != 'FOO' OR field IS NULL)
- f\`-%FOO%\`         # AND (field NOT LIKE '%FOO%' OR field IS NULL)
- f\`-FOO%\`          # AND (field NOT LIKE 'FOO%' OR field IS NULL)
- f\`-%FOO\`          # AND (field NOT LIKE '%FOO' OR field IS NULL)
- f\`-null\`          # AND field IS NOT NULL
- f\`-blank\`         # AND COALESCE(field,'') != ''

- f\`-NC, -ND\`       # AND (field NOT IN ('NC', 'ND') OR field IS NULL)`

