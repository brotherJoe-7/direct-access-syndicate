-- Phase 19: Teacher Role Separation

ALTER TABLE admins
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';

-- Make sure the existing admin user stays as admin
UPDATE admins SET role = 'admin' WHERE username = 'admin';
