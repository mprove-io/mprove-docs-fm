export const filterConditionsTimestampYaml = `apply_to: time_field_path
conditions:         ### PostgreSQL ###
- f\`\`               # true // the same as no filter

- f\`null\`           # OR field IS NULL

- f\`now\`            # OR (field = LOCALTIMESTAMP)
- f\`today\`          # OR (field >= DATE_TRUNC('day', LOCALTIMESTAMP) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))
- f\`yesterday\`      # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(1)::integer) AND field < DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`tomorrow\`       # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(2)::integer))

- f\`2025\`                   # OR (field >= TIMESTAMP '2025-01-01 00:00:00' AND field < TIMESTAMP '2026-01-01 00:00:00')
- f\`2025-Q1\`                # OR (field >= TIMESTAMP '2025-01-01 00:00:00' AND field < TIMESTAMP '2025-04-01 00:00:00')
- f\`2025-01\`                # OR (field >= TIMESTAMP '2025-01-01 00:00:00' AND field < TIMESTAMP '2025-02-01 00:00:00')
- f\`2025-02-03-WK\`          # OR (field >= TIMESTAMP '2025-02-02 00:00:00' AND field < TIMESTAMP '2025-02-09 00:00:00')
- f\`2025-02-03\`             # OR (field >= TIMESTAMP '2025-02-03 00:00:00' AND field < TIMESTAMP '2025-02-04 00:00:00')
- f\`2025-02-03 04\`          # OR (field >= TIMESTAMP '2025-02-03 04:00:00' AND field < TIMESTAMP '2025-02-03 05:00:00')
- f\`2025-02-03 04:05\`       # OR (field >= TIMESTAMP '2025-02-03 04:05:00' AND field < TIMESTAMP '2025-02-03 04:06:00')
- f\`2025-02-03 04:05:06\`    # OR (field = TIMESTAMP '2025-02-03 04:05:06')
- f\`2025-02-03 04:05:06.7\`  # OR (field = TIMESTAMP '2025-02-03 04:05:06.7')

- f\`this year\`        # OR (field < DATE_TRUNC('year', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(1)::integer))
- f\`this quarter\`     # OR (field < DATE_TRUNC('quarter', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(1*3)::integer))
- f\`this month\`       # OR (field < DATE_TRUNC('month', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(1)::integer))
- f\`this week\`        # OR (field < (DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY) OR field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(1*7)::integer))
- f\`this day\`         # OR (field < DATE_TRUNC('day', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))
- f\`this hour\`        # OR (field < DATE_TRUNC('hour', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(1)::integer))
- f\`this minute\`      # OR (field < DATE_TRUNC('minute', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(1)::integer))

- f\`last year\`        # OR (field < (DATE_TRUNC('year', LOCALTIMESTAMP))-make_interval(years=>(1)::integer) OR field >= DATE_TRUNC('year', LOCALTIMESTAMP))
- f\`last quarter\`     # OR (field < (DATE_TRUNC('quarter', LOCALTIMESTAMP))-make_interval(months=>(1*3)::integer) OR field >= DATE_TRUNC('quarter', LOCALTIMESTAMP))
- f\`last month\`       # OR (field < (DATE_TRUNC('month', LOCALTIMESTAMP))-make_interval(months=>(1)::integer) OR field >= DATE_TRUNC('month', LOCALTIMESTAMP))
- f\`last week\`        # OR (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(1*7)::integer) OR field >= (DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))
- f\`last day\`         # OR (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(1)::integer) OR field >= DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`last hour\`        # OR (field < (DATE_TRUNC('hour', LOCALTIMESTAMP))-make_interval(hours=>(1)::integer) OR field >= DATE_TRUNC('hour', LOCALTIMESTAMP))
- f\`last minute\`      # OR (field < (DATE_TRUNC('minute', LOCALTIMESTAMP))-make_interval(mins=>(1)::integer) OR field >= DATE_TRUNC('minute', LOCALTIMESTAMP))

- f\`next year\`        # OR (field < (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(1)::integer) OR field >= (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(2)::integer))
- f\`next quarter\`     # OR (field < (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(1*3)::integer) OR field >= (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(2*3)::integer))
- f\`next month\`       # OR (field < (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(1)::integer) OR field >= (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(2)::integer))
- f\`next week\`        # OR (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(1*7)::integer) OR field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(2*7)::integer))
- f\`next day\`         # OR (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(2)::integer))
- f\`next hour\`        # OR (field < (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(1)::integer) OR field >= (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(2)::integer))
- f\`next minute\`      # OR (field < (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(1)::integer) OR field >= (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(2)::integer))

- f\`monday\`           # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7)::integer))
- f\`last monday\`      # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7)::integer))
- f\`next monday\`      # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((1-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((1-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+2)::integer))

- f\`3 days ago to now\`    # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(3)::integer) AND field < LOCALTIMESTAMP)
- f\`3 weeks ago to now\`   # OR (field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(3*7)::integer) AND field < LOCALTIMESTAMP)
- f\`5 days ago\`           # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(4)::integer))
- f\`5 days from now\`      # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(6)::integer))

- f\`5 days ago for 2 days\`        # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) AND field < ((DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer))+make_interval(days=>(2)::integer))
- f\`5 days from now for 2 days\`   # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer) AND field < ((DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer))+make_interval(days=>(2)::integer))

- f\`5 weeks ago for 2 months\`         # OR (field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(5*7)::integer) AND field < (((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(5*7)::integer))+make_interval(months=>(2)::integer))
- f\`5 weeks from now for 2 months\`    # OR (field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(5*7)::integer) AND field < (((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(5*7)::integer))+make_interval(months=>(2)::integer))

- f\`last 5 days\`    # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) AND field < DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`next 5 days\`    # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(6)::integer))
- f\`5 days\`         # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(4)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))

- f\`before 2025-Q2\`                 # OR (field < TIMESTAMP '2025-03-01 00:00:00')
- f\`before 2025-02-03-WK\`           # OR (field < TIMESTAMP '2025-02-02 00:00:00')
- f\`before 2025-02-03 04:05:06.7\`   # OR (field < TIMESTAMP '2025-02-03 04:05:06.7')
- f\`after 2025-Q2\`                  # OR (field >= TIMESTAMP '2025-06-01 00:00:00')
- f\`after 2025-02-03-WK\`            # OR (field >= TIMESTAMP '2025-02-09 00:00:00')
- f\`after 2025-02-03 04:05:06.7\`    # OR (field >= TIMESTAMP '2025-02-03 04:05:06.7')

- f\`before tuesday\`     # OR (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7+1)::integer))
- f\`after tuesday\`      # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7)::integer))
- f\`starting tuesday\`   # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7+1)::integer))
- f\`through tuesday\`    # OR (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7)::integer))

- f\`last monday to next friday\`                   # OR (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((5-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+1)::integer))
- f\`2025-01-02 03:04:05 to 2026-07-08 04:05:06\`   # OR (field >= TIMESTAMP '2025-01-02 03:04:05' AND field < TIMESTAMP '2026-07-08 04:05:06')

- f\`today or tomorrow\`   # OR (field >= DATE_TRUNC('day', LOCALTIMESTAMP) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) AND field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(2)::integer))

-- negation

- f\`not null\`         # AND (field IS NOT NULL)
- f\`not now\`          # AND ((field != LOCALTIMESTAMP OR field IS NULL))
- f\`not today\`        # AND (field < DATE_TRUNC('day', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))
- f\`not yesterday\`    # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(1)::integer) OR field >= DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`not tomorrow\`     # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(2)::integer))

- f\`not 2025\`                     # AND (field < TIMESTAMP '2025-01-01 00:00:00' OR field >= TIMESTAMP '2026-01-01 00:00:00')
- f\`not 2025-Q1\`                  # AND (field < TIMESTAMP '2025-01-01 00:00:00' OR field >= TIMESTAMP '2025-04-01 00:00:00')
- f\`not 2025-01\`                  # AND (field < TIMESTAMP '2025-01-01 00:00:00' OR field >= TIMESTAMP '2025-02-01 00:00:00')
- f\`not 2025-02-03-WK\`            # AND (field < TIMESTAMP '2025-02-02 00:00:00' OR field >= TIMESTAMP '2025-02-09 00:00:00')
- f\`not 2025-02-03\`               # AND (field < TIMESTAMP '2025-02-03 00:00:00' OR field >= TIMESTAMP '2025-02-04 00:00:00')
- f\`not 2025-02-03 04\`            # AND (field < TIMESTAMP '2025-02-03 04:00:00' OR field >= TIMESTAMP '2025-02-03 05:00:00')
- f\`not 2025-02-03 04:05\`         # AND (field < TIMESTAMP '2025-02-03 04:05:00' OR field >= TIMESTAMP '2025-02-03 04:06:00')
- f\`not 2025-02-03 04:05:06\`      # AND ((field != TIMESTAMP '2025-02-03 04:05:06' OR field IS NULL))
- f\`not 2025-02-03 04:05:06.7\`    # AND ((field != TIMESTAMP '2025-02-03 04:05:06.7' OR field IS NULL))

- f\`not this year\`        # AND (field < DATE_TRUNC('year', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(1)::integer))
- f\`not this quarter\`     # AND (field < DATE_TRUNC('quarter', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(1*3)::integer))
- f\`not this month\`       # AND (field < DATE_TRUNC('month', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(1)::integer))
- f\`not this week\`        # AND (field < (DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY) OR field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(1*7)::integer))
- f\`not this day\`         # AND (field < DATE_TRUNC('day', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))
- f\`not this hour\`        # AND (field < DATE_TRUNC('hour', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(1)::integer))
- f\`not this minute\`      # AND (field < DATE_TRUNC('minute', LOCALTIMESTAMP) OR field >= (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(1)::integer))

- f\`not last year\`        # AND (field < (DATE_TRUNC('year', LOCALTIMESTAMP))-make_interval(years=>(1)::integer) OR field >= DATE_TRUNC('year', LOCALTIMESTAMP))
- f\`not last quarter\`     # AND (field < (DATE_TRUNC('quarter', LOCALTIMESTAMP))-make_interval(months=>(1*3)::integer) OR field >= DATE_TRUNC('quarter', LOCALTIMESTAMP))
- f\`not last month\`       # AND (field < (DATE_TRUNC('month', LOCALTIMESTAMP))-make_interval(months=>(1)::integer) OR field >= DATE_TRUNC('month', LOCALTIMESTAMP))
- f\`not last week\`        # AND (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(1*7)::integer) OR field >= (DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))
- f\`not last day\`         # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(1)::integer) OR field >= DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`not last hour\`        # AND (field < (DATE_TRUNC('hour', LOCALTIMESTAMP))-make_interval(hours=>(1)::integer) OR field >= DATE_TRUNC('hour', LOCALTIMESTAMP))
- f\`not last minute\`      # AND (field < (DATE_TRUNC('minute', LOCALTIMESTAMP))-make_interval(mins=>(1)::integer) OR field >= DATE_TRUNC('minute', LOCALTIMESTAMP))

- f\`not next year\`        # AND (field < (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(1)::integer) OR field >= (DATE_TRUNC('year', LOCALTIMESTAMP))+make_interval(years=>(2)::integer))
- f\`not next quarter\`     # AND (field < (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(1*3)::integer) OR field >= (DATE_TRUNC('quarter', LOCALTIMESTAMP))+make_interval(months=>(2*3)::integer))
- f\`not next month\`       # AND (field < (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(1)::integer) OR field >= (DATE_TRUNC('month', LOCALTIMESTAMP))+make_interval(months=>(2)::integer))
- f\`not next week\`        # AND (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(1*7)::integer) OR field >= ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(2*7)::integer))
- f\`not next day\`         # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(2)::integer))
- f\`not next hour\`        # AND (field < (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(1)::integer) OR field >= (DATE_TRUNC('hour', LOCALTIMESTAMP))+make_interval(hours=>(2)::integer))
- f\`not next minute\`      # AND (field < (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(1)::integer) OR field >= (DATE_TRUNC('minute', LOCALTIMESTAMP))+make_interval(mins=>(2)::integer))

- f\`not monday\`           # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7)::integer))
- f\`not last monday\`      # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7)::integer))
- f\`not next monday\`      # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((1-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((1-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+2)::integer))

- f\`not 3 days ago to now\`    # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(3)::integer) OR field >= LOCALTIMESTAMP)
- f\`not 3 weeks ago to now\`   # AND (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(3*7)::integer) OR field >= LOCALTIMESTAMP)

- f\`not 5 days ago\`           # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(4)::integer))
- f\`not 5 days from now\`      # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(6)::integer))

- f\`not 5 days ago for 2 days\`        # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) OR field >= ((DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer))+make_interval(days=>(2)::integer))
- f\`not 5 days from now for 2 days\`   # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer) OR field >= ((DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(5)::integer))+make_interval(days=>(2)::integer))

- f\`not 5 weeks ago for 2 months\`         # AND (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(5*7)::integer) OR field >= (((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))-make_interval(days=>(5*7)::integer))+make_interval(months=>(2)::integer))
- f\`not 5 weeks from now for 2 months\`    # AND (field < ((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(5*7)::integer) OR field >= (((DATE_TRUNC('week', LOCALTIMESTAMP + INTERVAL '1' DAY) - INTERVAL '1' DAY))+make_interval(days=>(5*7)::integer))+make_interval(months=>(2)::integer))

- f\`not last 5 days\`    # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(5)::integer) OR field >= DATE_TRUNC('day', LOCALTIMESTAMP))
- f\`not next 5 days\`    # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(6)::integer))
- f\`not 5 days\`         # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>(4)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>(1)::integer))

- f\`not before 2025-Q2\`                 # AND (field >= TIMESTAMP '2025-03-01 00:00:00')
- f\`not before 2025-02-03-WK\`           # AND (field >= TIMESTAMP '2025-02-02 00:00:00')
- f\`not before 2025-02-03 04:05:06.7\`   # AND (field >= TIMESTAMP '2025-02-03 04:05:06.7')

- f\`not after 2025-Q2\`                  # AND (field < TIMESTAMP '2025-06-01 00:00:00')
- f\`not after 2025-02-03-WK\`            # AND (field < TIMESTAMP '2025-02-09 00:00:00')
- f\`not after 2025-02-03 04:05:06.7\`    # AND (field < TIMESTAMP '2025-02-03 04:05:06.7')

- f\`not before tuesday\`     # AND (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7+1)::integer))
- f\`not after tuesday\`      # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7)::integer))
- f\`not starting tuesday\`   # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7+1)::integer))
- f\`not through tuesday\`    # AND (field >= (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-2+6)%7)::integer))

- f\`not last monday to next friday\`                   # AND (field < (DATE_TRUNC('day', LOCALTIMESTAMP))-make_interval(days=>((((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)-1+6)%7+1)::integer) OR field >= (DATE_TRUNC('day', LOCALTIMESTAMP))+make_interval(days=>((5-((EXTRACT(dow FROM LOCALTIMESTAMP)::integer+1)-1)+6)%7+1)::integer))
- f\`not 2025-01-02 03:04:05 to 2026-07-08 04:05:06\`   # AND (field < TIMESTAMP '2025-01-02 03:04:05' OR field >= TIMESTAMP '2026-07-08 04:05:06')`

