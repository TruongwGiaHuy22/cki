-- Migration: Add is_locked column to users table
-- Purpose: Enable account locking functionality for admin moderation

-- Add is_locked column with default value 0 (not locked)
ALTER TABLE users ADD COLUMN is_locked TINYINT DEFAULT 0;

-- Verify the migration
SELECT user_id, username, email, is_locked, created_at FROM users LIMIT 5;
