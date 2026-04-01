export const extraSchemaYaml = `schema: c1_postgres.fleet
description: 'Fleet management system tracking vehicles, drivers, trips, and maintenance records'
tables:
  - table: trips
    description: 'Individual vehicle trips with route, distance, and assigned driver'
    columns:
      - column: trip_id
        description: 'Unique identifier for each trip'
        example: '80234'
      - column: vehicle_id
        description: 'The vehicle used for this trip'
        example: '152'
        relationships:
          - to: vehicles.vehicle_id
            type: many_to_one
      - column: driver_id
        description: 'The driver who operated the vehicle on this trip'
        example: '38'
        relationships:
          - to: drivers.driver_id
            type: many_to_one
      - column: customer_id
        description: 'The customer who requested this trip'
        example: '4501'
        relationships:
          - to: customers.customer_id
            to_schema: c1_postgres.billing
            type: many_to_one
      - column: status
        description: 'Trip completion status'
        example: 'completed'

  - table: vehicles
    description: 'Fleet vehicles with make, model, and current operational status'
    columns:
      - column: vehicle_id
        description: 'Unique identifier for each vehicle'
        example: '152'
      - column: license_plate
        description: 'Vehicle registration plate number'
        example: 'AB-1234-CD'

  - table: drivers
    description: 'Drivers certified to operate fleet vehicles'
    columns:
      - column: driver_id
        description: 'Unique identifier for each driver'
        example: '38'
      - column: name
        description: 'Full name of the driver'
        example: 'Carlos Rivera'

  - table: maintenance_records
    description: 'Scheduled and unscheduled vehicle maintenance events'
    columns:
      - column: record_id
        description: 'Unique identifier for each maintenance record'
        example: '6010'
      - column: vehicle_id
        description: 'The vehicle that was serviced'
        example: '152'
        relationships:
          - to: vehicles.vehicle_id
            type: many_to_one
      - column: service_type
        description: 'Type of maintenance performed'
        example: 'oil change'`;
