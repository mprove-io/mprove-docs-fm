export const filterConditionsNumberYaml = `apply_to: number_field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`1\`              # OR (CAST(field AS Numeric)) = 1
- f\`<= 2\`           # OR (CAST(field AS Numeric)) <= 2
- f\`>= 3\`           # OR (CAST(field AS Numeric)) >= 3
- f\`< 4\`            # OR (CAST(field AS Numeric)) < 4
- f\`> 5\`            # OR (CAST(field AS Numeric)) > 5
- f\`null\`           # OR (CAST(field AS Numeric)) IS NULL
- f\`(6 to 7)\`       # OR ((CAST(field AS Numeric)) > 6  AND  (CAST(field AS Numeric)) < 7)
- f\`(8 to 9]\`       # OR ((CAST(field AS Numeric)) > 8  AND  (CAST(field AS Numeric)) <= 9)
- f\`[10 to 11)\`     # OR ((CAST(field AS Numeric)) >= 10  AND  (CAST(field AS Numeric)) < 11)
- f\`[12 to 13]\`     # OR ((CAST(field AS Numeric)) >= 12  AND  (CAST(field AS Numeric)) <= 13)
- f\`14, 15\`         # OR (CAST(field AS Numeric)) IN (14, 15)
- f\`16 or 17, 18 or < 19\`  # OR ((CAST(field AS Numeric)) IN (16, 17, 18) OR (CAST(field AS Numeric)) < 19)

- f\`!= 20\`          # AND ((CAST(field AS Numeric)) != 20 OR (CAST(field AS Numeric)) IS NULL)
- f\`not (21, 22)\`   # AND NOT ((CAST(field AS Numeric)) IN (21, 22))
- f\`not null\`       # AND (CAST(field AS Numeric)) IS NOT NULL`

// - f\`= 14, 15\`         # OR ((CAST(field AS Numeric)) IN (14, 15))
// - f\`(21, 22)\`         # OR ((CAST(field AS Numeric)) NOT IN (14, 15) OR (CAST(field AS Numeric)) IS NULL)
// - f\`= 0\`              # OR ((CAST(field AS Numeric)) = 0)

// - f\`not 1\`            # AND ((CAST(field AS Numeric)) != 1 OR (CAST(field AS Numeric)) IS NULL)
// - f\`not <= 2\`         # AND (CAST(field AS Numeric)) <= 2
// - f\`not >= 3\`         # AND (CAST(field AS Numeric)) >= 3
// - f\`not < 4\`          # AND (CAST(field AS Numeric)) < 4)
// - f\`not > 5\`          # AND (CAST(field AS Numeric)) > 5)
// - f\`not (6 to 7)\`     # AND ((CAST(field AS Numeric)) <= 6  OR  (CAST(field AS Numeric)) >= 7)
// - f\`not (8 to 9]\`     # AND ((CAST(field AS Numeric)) <= 8  OR  (CAST(field AS Numeric)) > 9)
// - f\`not [10 to 11)\`   # AND ((CAST(field AS Numeric)) < 10  OR  (CAST(field AS Numeric)) >= 11)
// - f\`not [12 to 13]\`   # AND ((CAST(field AS Numeric)) < 12  OR  (CAST(field AS Numeric)) > 13)
// - f\`not 14, 15\`       # AND ((CAST(field AS Numeric)) NOT IN (14, 15) OR (CAST(field AS Numeric)) IS NULL)
// - f\`not 16 and not 17, 18 and not < 19\`     # AND ((CAST(field AS Numeric)) != 16 OR (CAST(field AS Numeric)) IS NULL AND (CAST(field AS Numeric)) NOT IN (17, 18) OR (CAST(field AS Numeric)) IS NULL AND (CAST(field AS Numeric)) < 19)
// - f\`not != 20\`        # AND ((CAST(field AS Numeric)) = 20)
// - f\`not (21, 22)\`     # AND (NOT ((CAST(field AS Numeric)) IN (21, 22)))