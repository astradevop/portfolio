# Database Setup Guide

This guide will help you set up the Neon PostgreSQL database for your portfolio website.

## 🚀 Quick Setup

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project called "Portfolio"
3. Copy your connection string - it should look like:
   ```
   postgresql://username:password@ep-something.neon.tech/dbname?sslmode=require
   ```

### 2. Set Up Environment Variables

In your Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables (they should already be set if you connected Neon):
   - `NETLIFY_DATABASE_URL`: Your pooled connection string
   - `NETLIFY_DATABASE_URL_UNPOOLED`: Your direct connection string

### 3. Create Database Schema

Run the following SQL commands in your Neon SQL Editor:

```sql
-- Copy and paste the contents of database/schema.sql
-- This creates all the necessary tables
```

### 4. Populate with Sample Data

Run the following SQL commands to add sample content:

```sql  
-- Copy and paste the contents of database/seed.sql
-- This adds sample projects, blog posts, testimonials, and tech stack
```

## 📊 Database Schema

### Tables Created:

1. **projects** - Portfolio projects
   - Fields: id, title, description, image, technologies[], github_url, demo_url, category, featured, is_published
   
2. **blog_posts** - Blog articles  
   - Fields: id, title, slug, content, excerpt, image, category, tags[], status, published_at, read_time
   
3. **tech_stack** - Technologies and skills
   - Fields: id, name, icon, category, description, proficiency, display_order, is_active
   
4. **testimonials** - Client testimonials
   - Fields: id, name, position, company, content, avatar, rating, is_featured, display_order, is_active
   
5. **contact_submissions** - Contact form submissions
   - Fields: id, name, email, subject, message, ip_address, user_agent, status, created_at

## 🛠 Customizing Your Data

### Adding Your Projects

```sql
INSERT INTO projects (title, description, image, technologies, github_url, demo_url, category, featured, is_published) 
VALUES (
    'Your Project Name',
    'Description of your project...',
    '/assets/img/projects/your-project.jpg',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    'https://github.com/yourusername/project',
    'https://yourproject.com',
    'web',
    true,
    true
);
```

### Adding Blog Posts

```sql
INSERT INTO blog_posts (title, slug, content, excerpt, image, category, tags, status, published_at, read_time)
VALUES (
    'Your Blog Post Title',
    'your-blog-post-slug',
    'Full content of your blog post...',
    'Short excerpt...',
    '/assets/img/blog/your-post.jpg',
    'Technology',
    ARRAY['React', 'JavaScript'],
    'published',
    NOW(),
    8
);
```

### Updating Tech Stack

```sql
INSERT INTO tech_stack (name, icon, category, description, proficiency, display_order, is_active)
VALUES (
    'Your Technology',
    'devicon-technology-plain',
    'frontend',
    'Description of your experience...',
    85,
    1,
    true
);
```

### Adding Testimonials

```sql
INSERT INTO testimonials (name, position, company, content, avatar, rating, is_featured, display_order, is_active)
VALUES (
    'Client Name',
    'Position',
    'Company Name', 
    'Testimonial content...',
    '/assets/img/testimonials/client.jpg',
    5,
    true,
    1,
    true
);
```

## 🔄 API Endpoints

Your Netlify Functions provide these API endpoints:

- `/.netlify/functions/projects` - Get projects (supports ?featured=true&limit=6)
- `/.netlify/functions/blog-posts` - Get blog posts (supports ?limit=4&category=Tech)
- `/.netlify/functions/tech-stack` - Get technologies (supports ?category=frontend)
- `/.netlify/functions/testimonials` - Get testimonials (supports ?featured=true)
- `/.netlify/functions/contact` - Handle contact form submissions (POST)

## 🔧 Local Development

To test locally with Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Start local development server
netlify dev
```

Your functions will be available at:
- `http://localhost:8888/.netlify/functions/projects`
- `http://localhost:8888/.netlify/functions/blog-posts`
- etc.

## 🚀 Deployment

1. Push your changes to GitHub
2. Netlify will automatically deploy
3. Environment variables for database are already configured
4. Functions will be automatically deployed

## 🐛 Troubleshooting

### Function Errors
- Check Netlify Function logs in your Netlify dashboard
- Ensure `NETLIFY_DATABASE_URL` is set correctly
- Verify database schema is created

### Database Connection Issues
- Check your Neon dashboard for connection limits
- Verify SSL mode in connection string
- Try using the unpooled connection string for debugging

### CORS Issues
- Functions include proper CORS headers
- If issues persist, check browser developer console

## 📝 Sample Queries

### View all projects:
```sql
SELECT * FROM projects WHERE is_published = true ORDER BY featured DESC, created_at DESC;
```

### View published blog posts:
```sql
SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC;
```

### View contact submissions:
```sql
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

## 🎯 Next Steps

1. Replace sample data with your real content
2. Add your actual project images to `/assets/img/projects/`
3. Update personal information in testimonials and tech stack
4. Test all functionality in production
5. Set up monitoring for contact form submissions

Your portfolio now has a fully dynamic backend with a PostgreSQL database! 🎉
