-- Phase 18 Schema Expansion for DAS Receipt Generator

ALTER TABLE learning_materials 
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS material_type VARCHAR(50) DEFAULT 'link';

-- Update existing community posts table if needed
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS parent_id INT REFERENCES parents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS admin_id INT REFERENCES admins(id) ON DELETE SET NULL;
