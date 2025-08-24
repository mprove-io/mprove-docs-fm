export const modelStoreResponseJs = `let data = $RESPONSE_DATA;
  let storeFields = $STORE_FIELDS;
  
  let dimensionHeaders = data.dimensionHeaders?.map(header => header.name);
  let metricHeaders = data.metricHeaders?.map(header => header.name);
  
  newData = data.rows?.map(row => {
    let newRow = {};
    
    row.dimensionValues?.forEach((dimension, index) => {
      let dimensionName = dimensionHeaders[index];
      let value = dimension.value;
      let date;
      
      if (dimensionName === 'year') {
        date = new Date(\`\${value}-01-01T00:00:00Z\`);
        
      } else if (dimensionName === 'yearMonth') {
        date = new Date(\`\${value.slice(0, 4)}-\${value.slice(4, 6)}-01T00:00:00Z\`);
        
      } else if (dimensionName === 'isoYearIsoWeek') {
        // Parse ISO year and week (e.g., "202504" → year=2025, week=4)
        // Create a date in week 1 of the ISO year (January 4th is always in week 1)
        // Get the Monday of week 1
        // Add weeks to reach the target week
        let year = parseInt(value.slice(0, 4), 10);
        let week = parseInt(value.slice(4, 6), 10);
        
        date = new Date(Date.UTC(year, 0, 4));
        
        let day = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
        date.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
        
        date.setUTCDate(date.getUTCDate() + (week - 1) * 7);
        
      } else if (dimensionName === 'yearWeek') {
        // Parse year and week (e.g., "202505" → year=2025, week=5)
        // Find the first Sunday of the year
        // Add weeks to reach the target week
        let year = parseInt(value.slice(0, 4), 10);
        let week = parseInt(value.slice(4, 6), 10);
        
        let firstDay = new Date(Date.UTC(year, 0, 1));
        let day = firstDay.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
        let firstSunday = new Date(firstDay);
        firstSunday.setUTCDate(firstDay.getUTCDate() - day);
        
        date = new Date(firstSunday);
        date.setUTCDate(firstSunday.getUTCDate() + (week - 1) * 7);
        
      } else if (dimensionName === 'date') {
        date = new Date(
          \`\${value.slice(0, 4)}-\${value.slice(4, 6)}-\${value.slice(
            6,
            8
          )}T00:00:00Z\`
        );
        
      } else if (dimensionName === 'dateHour') {
        date = new Date(
          \`\${value.slice(0, 4)}-\${value.slice(4, 6)}-\${value.slice(
            6,
            8
          )}T\${value.slice(8, 10)}:00:00Z\`
        );
        
      } else if (dimensionName === 'dateHourMinute') {
        date = new Date(
          \`\${value.slice(0, 4)}-\${value.slice(4, 6)}-\${value.slice(
            6,
            8
          )}T\${value.slice(8, 10)}:\${value.slice(10, 12)}:00Z\`
        );
      }
      
      let storeField = storeFields.find(
        x => !!x.meta && x.meta['name'] === dimensionName
      );
      
      if (storeField) {
        let fieldId = storeField.name;
        newRow[fieldId] = date ? date.getTime() / 1000 : value;
      }
    });
    
    row.metricValues?.forEach((metric, index) => {
      let metricName = metricHeaders[index];
      let value = metric.value;
      let storeField = storeFields.find(
        x => !!x.meta && x.meta['name'] === metricName
      );
      if (storeField) {
        let fieldId = storeField.name;
        newRow[fieldId] = value;
      }
    });
    
    return newRow;
  });
  
  return newData || [];`