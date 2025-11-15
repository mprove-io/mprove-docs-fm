export const filterConditionsNumberYaml = `apply_to: number_field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`1\`              # OR field = 1
- f\`<= 2\`           # OR field <= 2
- f\`>= 3\`           # OR field >= 3
- f\`< 4\`            # OR field < 4
- f\`> 5\`            # OR field > 5
- f\`null\`           # OR field IS NULL
- f\`(6 to 7)\`       # OR (field > 6  AND  field < 7)
- f\`(8 to 9]\`       # OR (field > 8  AND  field <= 9)
- f\`[10 to 11)\`     # OR (field >= 10  AND  field < 11)
- f\`[12 to 13]\`     # OR (field >= 12  AND  field <= 13)
- f\`14, 15\`         # OR field IN (14, 15)
- f\`16 or 17, 18 or < 19\`  # OR (field IN (16, 17, 18) OR field < 19)

- f\`!= 20\`          # AND (field != 20 OR field IS NULL)
- f\`not (21, 22)\`   # AND NOT (field IN (21, 22))
- f\`not null\`       # AND field IS NOT NULL`

// - f\`= 14, 15\`         # OR (field IN (14, 15))
// - f\`(21, 22)\`         # OR (field NOT IN (14, 15) OR field IS NULL)
// - f\`= 0\`              # OR (field = 0)

// - f\`not 1\`            # AND (field != 1 OR field IS NULL)
// - f\`not <= 2\`         # AND field <= 2
// - f\`not >= 3\`         # AND field >= 3
// - f\`not < 4\`          # AND field < 4)
// - f\`not > 5\`          # AND field > 5)
// - f\`not (6 to 7)\`     # AND (field <= 6  OR  field >= 7)
// - f\`not (8 to 9]\`     # AND (field <= 8  OR  field > 9)
// - f\`not [10 to 11)\`   # AND (field < 10  OR  field >= 11)
// - f\`not [12 to 13]\`   # AND (field < 12  OR  field > 13)
// - f\`not 14, 15\`       # AND (field NOT IN (14, 15) OR field IS NULL)
// - f\`not 16 and not 17, 18 and not < 19\`     # AND (field != 16 OR field IS NULL AND field NOT IN (17, 18) OR field IS NULL AND field < 19)
// - f\`not != 20\`        # AND (field = 20)
// - f\`not (21, 22)\`     # AND (NOT (field IN (21, 22)))