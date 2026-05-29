-- Migration: Add role column to users table with auto-promotion logic
-- Purpose: Enable automatic role promotion when users create novels

-- Step 1: Add role column if it doesn't exist
ALTER TABLE users ADD COLUMN role ENUM('docgia', 'tacgia', 'nhanvien', 'admin') DEFAULT 'docgia' AFTER password_hash;

-- Step 2: Auto-promote existing authors (users who have created novels)
UPDATE users u
SET u.role = 'tacgia'
WHERE u.role = 'docgia' 
  AND EXISTS (
    SELECT 1 FROM QLTT q WHERE q.created_by = u.user_id LIMIT 1
  );

-- Step 3: Verify the migration
SELECT user_id, username, role, 
  (SELECT COUNT(*) FROM QLTT q WHERE q.created_by = users.user_id) as novel_count
FROM users
WHERE role = 'tacgia'
ORDER BY user_id;
