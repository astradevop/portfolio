-- Portfolio Database Sample Data
-- Run this after schema.sql to populate with sample data

-- Insert sample projects
INSERT INTO projects (title, description, image, technologies, github_url, demo_url, category, featured, is_published) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with React, Node.js, and PostgreSQL featuring user authentication, payment integration, and admin dashboard.', '/assets/img/projects/ecommerce.jpg', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redux'], 'https://github.com/astradevop/ecommerce-platform', 'https://ecommerce-demo.astradev.com', 'web', true, true),
('Task Management App', 'A collaborative task management application built with Vue.js and Firebase, featuring real-time updates, team collaboration, and progress tracking.', '/assets/img/projects/task-manager.jpg', ARRAY['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS'], 'https://github.com/astradevop/task-manager', 'https://tasks.astradev.com', 'web', true, true),
('Weather Dashboard', 'A responsive weather dashboard that provides real-time weather data, forecasts, and weather maps using OpenWeather API.', '/assets/img/projects/weather.jpg', ARRAY['JavaScript', 'HTML5', 'CSS3', 'Chart.js', 'OpenWeather API'], 'https://github.com/astradevop/weather-dashboard', 'https://weather.astradev.com', 'web', true, true),
('Mobile Fitness App', 'A React Native fitness tracking app with workout plans, progress monitoring, and social features for fitness enthusiasts.', '/assets/img/projects/fitness-app.jpg', ARRAY['React Native', 'Redux', 'Node.js', 'MongoDB'], 'https://github.com/astradevop/fitness-app', null, 'mobile', true, true),
('Portfolio Website', 'A modern, responsive portfolio website built with Django and React, featuring a blog, project showcase, and contact form.', '/assets/img/projects/portfolio.jpg', ARRAY['Django', 'React', 'PostgreSQL', 'Tailwind CSS'], 'https://github.com/astradevop/portfolio', 'https://astradev.com', 'web', true, true),
('Data Visualization Tool', 'An interactive data visualization tool built with D3.js and Python Flask for analyzing and presenting complex datasets.', '/assets/img/projects/dataviz.jpg', ARRAY['D3.js', 'Python', 'Flask', 'Pandas', 'SQLite'], 'https://github.com/astradevop/data-viz', 'https://dataviz.astradev.com', 'data', false, true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, image, category, tags, status, published_at, read_time) VALUES
('Getting Started with React Hooks', 'getting-started-with-react-hooks', 'React Hooks have revolutionized how we write React components. In this comprehensive guide, we''ll explore the most commonly used hooks and how they can make your code more readable and maintainable...', 'Learn how to use React Hooks to write better, more maintainable React components with practical examples and best practices.', '/assets/img/blog/react-hooks.jpg', 'Frontend', ARRAY['React', 'JavaScript', 'Hooks'], 'published', '2024-07-20 10:00:00', 8),
('Building RESTful APIs with Node.js', 'building-restful-apis-with-nodejs', 'Creating robust and scalable RESTful APIs is crucial for modern web development. This tutorial covers everything from setting up Express.js to implementing authentication and error handling...', 'A complete guide to building RESTful APIs with Node.js, Express, and best practices for API design and security.', '/assets/img/blog/nodejs-api.jpg', 'Backend', ARRAY['Node.js', 'Express', 'API'], 'published', '2024-07-15 14:30:00', 12),
('CSS Grid vs Flexbox: When to Use Which', 'css-grid-vs-flexbox', 'Both CSS Grid and Flexbox are powerful layout systems, but knowing when to use each can be confusing. This article breaks down the differences and provides practical examples...', 'Understand the differences between CSS Grid and Flexbox, and learn when to use each layout system for optimal results.', '/assets/img/blog/css-layout.jpg', 'Frontend', ARRAY['CSS', 'Grid', 'Flexbox'], 'published', '2024-07-10 09:15:00', 6),
('Database Design Best Practices', 'database-design-best-practices', 'Good database design is the foundation of any successful application. Learn about normalization, indexing, and other crucial concepts for designing efficient databases...', 'Master the fundamentals of database design with practical tips on normalization, indexing, and performance optimization.', '/assets/img/blog/database.jpg', 'Backend', ARRAY['Database', 'SQL', 'PostgreSQL'], 'published', '2024-07-05 11:00:00', 10);

-- Insert sample tech stack
INSERT INTO tech_stack (name, icon, category, description, proficiency, display_order, is_active) VALUES
('JavaScript', 'devicon-javascript-plain', 'frontend', 'Modern JavaScript (ES6+) for dynamic web applications', 95, 1, true),
('React', 'devicon-react-original', 'frontend', 'Building interactive user interfaces with React', 90, 2, true),
('Node.js', 'devicon-nodejs-plain', 'backend', 'Server-side JavaScript runtime for scalable applications', 85, 3, true),
('Python', 'devicon-python-plain', 'backend', 'Versatile programming language for web development and data analysis', 88, 4, true),
('PostgreSQL', 'devicon-postgresql-plain', 'database', 'Advanced open-source relational database system', 80, 5, true),
('Django', 'devicon-django-plain', 'backend', 'High-level Python web framework for rapid development', 85, 6, true),
('Vue.js', 'devicon-vuejs-plain', 'frontend', 'Progressive framework for building user interfaces', 75, 7, true),
('Docker', 'devicon-docker-plain', 'tools', 'Containerization platform for consistent deployments', 80, 8, true),
('Git', 'devicon-git-plain', 'tools', 'Version control system for tracking code changes', 90, 9, true),
('AWS', 'devicon-amazonwebservices-original', 'tools', 'Cloud computing services for scalable applications', 75, 10, true),
('MongoDB', 'devicon-mongodb-plain', 'database', 'NoSQL document database for flexible data storage', 70, 11, true),
('Tailwind CSS', 'devicon-tailwindcss-plain', 'frontend', 'Utility-first CSS framework for rapid UI development', 85, 12, true);

-- Insert sample testimonials
INSERT INTO testimonials (name, position, company, content, avatar, rating, is_featured, display_order, is_active) VALUES
('Sarah Johnson', 'Product Manager', 'TechCorp Inc.', 'Akash delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise made our project a huge success.', '/assets/img/testimonials/sarah.jpg', 5, true, 1, true),
('Michael Chen', 'CTO', 'StartupXYZ', 'Working with Akash was a game-changer for our startup. He built a scalable backend system that handled our rapid growth seamlessly. Highly recommended!', '/assets/img/testimonials/michael.jpg', 5, true, 2, true),
('Emily Rodriguez', 'UI/UX Designer', 'Design Studio', 'Akash perfectly translated our designs into a responsive, performant web application. His collaboration and communication skills are outstanding.', '/assets/img/testimonials/emily.jpg', 5, true, 3, true),
('David Thompson', 'Founder', 'InnovateLab', 'The mobile app Akash developed for us has received fantastic user feedback. His expertise in React Native and attention to user experience really shows.', '/assets/img/testimonials/david.jpg', 5, false, 4, true);
