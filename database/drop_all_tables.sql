-- DROP ALL TABLES SCRIPT
-- Run this in your Neon SQL console BEFORE running schema.sql

-- Option 1: Drop specific tables with CASCADE (handles foreign keys)
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS profile_info CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS tech_stack CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS stats CASCADE;

-- Option 2: Dynamic drop all tables (alternative approach)
-- Uncomment the lines below if you prefer this method instead of Option 1

/*
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Get all table names in the current schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
*/

-- Verify all tables are dropped
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
