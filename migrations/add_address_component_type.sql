-- Migration to add 'address' to the component type constraint
-- Run this in your Supabase SQL editor

-- Drop the existing constraint
ALTER TABLE custom_components DROP CONSTRAINT IF EXISTS custom_components_type_check;

-- Add the new constraint that includes 'address'
ALTER TABLE custom_components 
ADD CONSTRAINT custom_components_type_check 
CHECK (type IN ('text', 'textarea', 'date', 'number', 'email', 'phone', 'url', 'address'));

-- Update the built-in address component to use 'address' type if it exists
UPDATE custom_components 
SET type = 'address' 
WHERE name = 'address' AND type != 'address';
