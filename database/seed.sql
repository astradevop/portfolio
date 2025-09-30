-- Portfolio Database Sample Data
-- Run this after schema.sql to populate with sample data

-- Insert NEOBANKING project
INSERT INTO projects (title, description, image, technologies, github_url, demo_url, category, featured, is_published) VALUES
('NEOBANK', 'A secure, browser-first banking experience built with Django backend and React frontend. Features comprehensive onboarding with OTP verification, KYC compliance, modular account and card management, and a modern dashboard for transaction tracking and insights.', '/assets/img/projects/neobank.jpg', ARRAY['Django', 'Django REST Framework', 'React', 'PostgreSQL', 'Redis', 'Docker', 'TailwindCSS'], 'https://github.com/astradevop/NEOBANK', null, 'fintech', true, true);

-- Insert sample blog posts (clean minimal set)
INSERT INTO blog_posts (title, slug, content, excerpt, image, category, tags, status, published_at, read_time) VALUES
('Building Secure NeoBanking Solutions', 'building-secure-neobanking-solutions', 'Modern digital banking requires robust security, seamless user experience, and regulatory compliance. In this post, I share insights from building a comprehensive neobanking platform with Django and React, covering authentication, KYC implementation, and financial data handling...', 'Insights from building a full-stack neobanking platform with Django and React, focusing on security, compliance, and user experience.', '/assets/img/blog/neobanking.jpg', 'FinTech', ARRAY['Django', 'React', 'Banking', 'Security'], 'published', '2024-09-30 10:00:00', 12);

-- Insert core tech stack
INSERT INTO tech_stack (name, icon, category, description, proficiency, display_order, is_active) VALUES
('Python', 'devicon-python-plain', 'backend', 'Primary language for backend development and system architecture', 95, 1, true),
('Django', 'devicon-django-plain', 'backend', 'High-level Python web framework for rapid, secure development', 90, 2, true),
('React', 'devicon-react-original', 'frontend', 'Modern JavaScript library for building dynamic user interfaces', 88, 3, true),
('PostgreSQL', 'devicon-postgresql-plain', 'database', 'Advanced relational database for mission-critical applications', 85, 4, true),
('Docker', 'devicon-docker-plain', 'tools', 'Containerization for consistent deployment and development', 80, 5, true),
('Redis', 'devicon-redis-plain', 'database', 'In-memory data structure store for caching and sessions', 75, 6, true),
('TailwindCSS', 'devicon-tailwindcss-plain', 'frontend', 'Utility-first CSS framework for modern UI development', 85, 7, true),
('Git', 'devicon-git-plain', 'tools', 'Version control and collaborative development', 90, 8, true);

-- Insert testimonials
INSERT INTO testimonials (name, position, company, content, avatar, rating, is_featured, display_order, is_active) VALUES
('Sarah Johnson', 'Product Manager', 'FinTech Solutions', 'Akash delivered an exceptional banking platform with robust security features. His deep understanding of financial systems and attention to compliance made our project a success.', '/assets/img/testimonials/sarah.jpg', 5, true, 1, true),
('Michael Chen', 'CTO', 'Digital Banking Corp', 'Working with Akash on our neobanking solution was remarkable. His expertise in Django and scalable architecture helped us build a platform that handles thousands of transactions seamlessly.', '/assets/img/testimonials/michael.jpg', 5, true, 2, true),
('Emily Rodriguez', 'Lead Developer', 'Banking Innovation Labs', 'Akash\'s ability to implement complex financial workflows with clean, maintainable code is impressive. His React frontend work created an intuitive user experience for our customers.', '/assets/img/testimonials/emily.jpg', 5, true, 3, true);

-- Insert profile information
INSERT INTO profile_info (name, title, bio, email, phone, location, github_url, linkedin_url, avatar_url, website_title, website_description, is_active) VALUES
('Akash Nair', 'Full-Stack Python Web Developer', 'Passionate about creating digital experiences that make a difference. I specialize in building scalable web applications with modern technologies, focusing on performance, accessibility, and user experience.', 'aakash.s.nair@example.com', '+91 9876543210', 'Kochi, Kerala, India', 'https://github.com/astradevop/astradevop', 'https://www.linkedin.com/in/aakash-s-nair', '/assets/img/avatar.jpg', 'Akash Nair - Full-Stack Python Web Developer', 'Experienced full-stack developer specializing in Python, Django, JavaScript, and modern web technologies.', true);

-- Insert experience data
INSERT INTO experience (company, position, description, technologies, start_date, end_date, is_current, display_order, is_active) VALUES
('FinTech Solutions', 'Senior Full-Stack Developer', 'Led the development of a comprehensive neobanking platform serving thousands of users. Implemented secure authentication, KYC compliance, and real-time transaction processing.', ARRAY['Django', 'React', 'PostgreSQL', 'Redis', 'Docker'], '2023-01-01', NULL, true, 1, true),
('Digital Banking Corp', 'Python Developer', 'Developed backend APIs for digital banking services. Focused on security, scalability, and regulatory compliance for financial applications.', ARRAY['Python', 'Django', 'PostgreSQL', 'AWS'], '2022-06-01', '2022-12-31', false, 2, true),
('Tech Startup', 'Web Developer', 'Built responsive web applications and RESTful APIs. Collaborated with cross-functional teams to deliver high-quality software solutions.', ARRAY['Python', 'Django', 'JavaScript', 'HTML', 'CSS'], '2021-08-01', '2022-05-31', false, 3, true);

-- Insert education data
INSERT INTO education (institution, degree, field_of_study, description, start_date, end_date, achievements, display_order, is_active) VALUES
('University of Kerala', 'Bachelor of Technology', 'Computer Science and Engineering', 'Comprehensive study of computer science fundamentals, software engineering, and modern development practices.', '2018-08-01', '2022-06-30', ARRAY['First Class with Distinction', 'Best Final Year Project Award', 'Active member of Coding Club'], 1, true);

-- Insert services data
INSERT INTO services (name, description, icon, features, display_order, is_active) VALUES
('Web Development', 'Full-stack web application development with modern technologies', 'fas fa-code', ARRAY['Responsive Design', 'API Development', 'Database Design', 'Performance Optimization'], 1, true),
('API Development', 'RESTful API design and development for web and mobile applications', 'fas fa-server', ARRAY['RESTful APIs', 'Authentication', 'Documentation', 'Testing'], 2, true),
('Database Design', 'Efficient database architecture and optimization for scalable applications', 'fas fa-database', ARRAY['PostgreSQL', 'Data Modeling', 'Query Optimization', 'Migrations'], 3, true),
('UI/UX Design', 'User-centered design for web applications with focus on usability', 'fas fa-paint-brush', ARRAY['Wireframing', 'Prototyping', 'User Research', 'Responsive Design'], 4, true),
('Consulting', 'Technical consulting and code review services for development teams', 'fas fa-comments', ARRAY['Code Review', 'Architecture Planning', 'Best Practices', 'Team Training'], 5, true);

-- Insert site settings
INSERT INTO site_settings (key, value, type, description) VALUES
('site_title', 'Akash Nair - Full-Stack Python Web Developer', 'text', 'Main site title'),
('site_description', 'Experienced full-stack developer specializing in Python, Django, JavaScript, and modern web technologies.', 'text', 'Site meta description'),
('hero_title', 'Hi, I\'m Akash', 'text', 'Hero section main title'),
('hero_subtitle', 'Full-Stack Python Web Developer', 'text', 'Hero section subtitle'),
('typewriter_words', '["Full-Stack Python Web Developer", "AI Enthusiast", "Problem Solver"]', 'json', 'Typewriter animation words'),
('contact_form_enabled', 'true', 'boolean', 'Enable/disable contact form'),
('projects_per_page', '6', 'number', 'Number of projects to show per page'),
('blog_posts_per_page', '4', 'number', 'Number of blog posts to show per page');

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admin_users (username, email, password_hash, is_active) VALUES
('admin', 'admin@example.com', '$2b$10$rOaHNP8WuHVBcqgk/DKiKeqkxmj.EKLMWgNvwjRlGm3GQ8IzHWG5W', true);
