# Database Migrations

This folder contains SQL migration scripts for updating the database schema.

## How to Apply Migrations

1. Open your Supabase dashboard
2. Go to the SQL editor
3. Copy and paste the migration script
4. Execute the script

## Migration Files

### `add_address_component_type.sql`
- **Purpose**: Adds 'address' as a valid component type
- **Required**: Run this migration to enable address field components in the admin panel
- **What it does**:
  - Updates the database constraint to allow 'address' type
  - Updates existing address components to use the new type

## Current Database Schema

The database should have these component types allowed:
- `text` - Text input field
- `textarea` - Multi-line text area
- `date` - Date picker
- `number` - Number input
- `email` - Email input with validation
- `phone` - Phone number input
- `url` - URL input with validation
- `address` - Address field group (NEW)

## Troubleshooting

If you get a constraint violation error when creating address components:
1. Make sure you've run the migration script
2. Check that the constraint includes 'address' in the allowed types
3. Verify the migration completed successfully

## Verification

After running the migration, you can verify it worked by:
```sql
-- Check the constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'custom_components_type_check';

-- Test creating an address component
INSERT INTO custom_components (name, label, type, required) 
VALUES ('test_address', 'Test Address', 'address', false);
```
