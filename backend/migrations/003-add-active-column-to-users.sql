-- Migration: Add active column to users table
-- Purpose: Enable account locking functionality

-- Add active column with default value 1 (active)
ALTER TABLE users ADD COLUMN active TINYINT DEFAULT 1;

-- Verify the migration
SELECT user_id, username, email, active FROM users LIMIT 5;
