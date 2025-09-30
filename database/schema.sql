-- Portfolio Database Schema with Admin System
-- Run this on your Neon database to set up all tables

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    technologies TEXT[], -- Array of technology names
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'web',
    featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[], -- Array of tags
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_time INTEGER DEFAULT 5
);

-- Tech stack table
CREATE TABLE IF NOT EXISTS tech_stack (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(200),
    category VARCHAR(50) NOT NULL, -- frontend, backend, database, tools
    description TEXT,
    proficiency INTEGER DEFAULT 80, -- 1-100 scale
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(150),
    company VARCHAR(100),
    content TEXT NOT NULL,
    avatar VARCHAR(500),
    rating INTEGER DEFAULT 5, -- 1-5 stars
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'new', -- new, read, replied
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile/Personal Information table
CREATE TABLE IF NOT EXISTS profile_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(100),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    avatar_url VARCHAR(500),
    resume_url VARCHAR(500),
    website_title VARCHAR(100),
    website_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    description TEXT,
    technologies TEXT[], -- Array of technologies used
    start_date DATE,
    end_date DATE, -- NULL for current position
    is_current BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    description TEXT,
    start_date DATE,
    end_date DATE,
    gpa VARCHAR(10),
    achievements TEXT[],
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- CSS class or icon identifier
    price VARCHAR(50),
    features TEXT[],
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'text', -- text, number, boolean, json
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_tech_stack_category ON tech_stack(category, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
