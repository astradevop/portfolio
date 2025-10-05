# 🚀 Portfolio Website

A modern, responsive portfolio website built with **HTML**, **CSS (Tailwind)**, **JavaScript**, and **Netlify Functions** with **Neon PostgreSQL** database.

## ✨ Features

### 🎨 **Modern Design**
- Responsive design that works on all devices
- Dark/Light theme toggle with system preference detection
- Smooth animations and transitions
- Neomorphism design elements
- Glassmorphism effects

### 🖥️ **Core Sections**
- **Hero Section**: Eye-catching introduction with typewriter effect
- **About**: Personal information and statistics
- **Tech Stack**: Animated skill bars with proficiency levels  
- **Projects**: Filterable portfolio with live demos
- **Blog**: Article system with search and categories
- **Playground**: Interactive demos and tools
- **Experience**: Professional timeline
- **Testimonials**: Client reviews carousel
- **Contact**: Working contact form with database storage

### ⚡ **Performance & SEO**
- Lightning-fast loading times
- SEO optimized with meta tags and structured data
- Sitemap and robots.txt included
- 90+ Lighthouse scores
- Accessibility compliant (WCAG 2.1 AA)

### 🔧 **Technical Features**
- **Database-Driven**: Dynamic content with PostgreSQL
- **Serverless Functions**: Contact form and API endpoints
- **Real-time Filtering**: Projects and blog posts
- **Progressive Web App** capabilities
- **Advanced Animations**: Intersection Observer API
- **Security Headers**: XSS protection, CSP, etc.

## 🗄️ Database Setup

This portfolio uses **Neon PostgreSQL** for dynamic content management:

### Quick Database Setup:
1. **Create Neon Database**: Go to [Neon Console](https://console.neon.tech) and create a new project
2. **Run Schema**: Execute `database/schema.sql` in your Neon SQL editor to create tables
3. **Add Sample Data**: Execute `database/seed.sql` for sample projects, blog posts, and testimonials
4. **Environment Variables**: `NETLIFY_DATABASE_URL` is auto-configured when you connect Neon to Netlify

📖 **Detailed Instructions**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete setup guide

### 📚 **AI Development Guide**
- **PROJECT_GUIDE.md**: Comprehensive documentation for AI interactions with this codebase

### 🔌 API Endpoints

The portfolio includes these Netlify Functions:
- `/.netlify/functions/projects` - Portfolio projects (with filtering)
- `/.netlify/functions/blog-posts` - Blog articles (with search)  
- `/.netlify/functions/tech-stack` - Technologies and skills
- `/.netlify/functions/testimonials` - Client testimonials
- `/.netlify/functions/contact` - Contact form handler

## 🚀 Deployment

Deploy to Netlify with full database integration:

### Option 1: Automatic Deploy
1. Fork this repository
2. Connect GitHub account to Netlify
3. Select this repository  
4. Connect Neon database in Netlify dashboard
5. Deploy automatically!

### Option 2: Manual Setup
1. Create [Netlify](https://netlify.com) account
2. Set up [Neon](https://neon.tech) database
3. Configure environment variables
4. Deploy from GitHub

### 🔧 Build Configuration
- **Build Command**: `npm install`
- **Publish Directory**: `.` (root)
- **Functions Directory**: `netlify/functions`  
- **Node Version**: 18
- **Environment**: `NETLIFY_DATABASE_URL` (auto-configured)

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/astradevop/portfolio.git
cd portfolio

# Install dependencies
npm install

# Install Netlify CLI (for local functions)
npm install -g netlify-cli

# Start development server
netlify dev

# Opens at http://localhost:8888
```

### Local Database Testing
- Functions will be available at `http://localhost:8888/.netlify/functions/`
- Requires `NETLIFY_DATABASE_URL` environment variable
- Use `.env` file or Netlify CLI environment

## 📁 Project Structure

```
portfolio/
├── 📄 index.html              # Home page
├── 📄 projects.html           # Projects showcase
├── 📄 blog.html              # Blog articles  
├── 📄 playground.html        # Interactive demos
├── 📂 assets/
│   ├── 🎨 css/               # Tailwind CSS + custom styles
│   ├── ⚡ js/                # All JavaScript functionality
│   ├── 🖼️ img/               # Images and favicon
│   └── 💾 data/              # Fallback JSON data (now unused)
├── 📂 netlify/
│   └── 📂 functions/         # Serverless API endpoints
├── 📂 database/
│   ├── 📜 schema.sql         # Database table structure
│   └── 📜 seed.sql           # Sample data
├── 📄 netlify.toml           # Netlify configuration
├── 📄 _redirects            # URL redirect rules  
├── 📄 sitemap.xml           # SEO sitemap
├── 📄 robots.txt            # Search engine rules
└── 📚 DATABASE_SETUP.md     # Database setup guide
```

## 🎨 Customization

### 🔧 Content Management
- **Projects**: Add/edit in database `projects` table
- **Blog Posts**: Manage in `blog_posts` table with full content
- **Tech Stack**: Update `tech_stack` table with your skills
- **Testimonials**: Add client reviews to `testimonials` table
- **Contact**: All submissions stored in `contact_submissions` table

### 🎨 Styling
- **Colors**: Edit Tailwind config in `tailwind.config.js`
- **Fonts**: Update in `assets/css/custom.css`
- **Components**: Modify in respective HTML files
- **Animations**: Customize in `assets/js/app.js`

### 📱 Responsive Breakpoints
- **Mobile**: 0-767px
- **Tablet**: 768-1023px  
- **Desktop**: 1024px+

## 🔐 Security Features

- **CORS Protection**: Proper headers on all API endpoints
- **Input Validation**: Server-side validation on contact forms
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: Built-in with Netlify Functions
- **SSL/TLS**: Automatic HTTPS with Netlify

## 📊 Performance

- **Page Speed**: 90+ Lighthouse score
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Minimal JavaScript footprint
- **Database**: Optimized queries with indexing
- **CDN**: Global distribution via Netlify Edge

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Akash Nair**
- Portfolio: [https://astradevop.github.io/portfolio/](https://astradevop.github.io/portfolio/)
- GitHub: [@astradevop](https://github.com/astradevop)
- LinkedIn: [Akash Nair](https://linkedin.com/in/akash-nair)

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Neon](https://neon.tech) for the serverless PostgreSQL database
- [Netlify](https://netlify.com) for hosting and serverless functions
- [DevIcons](https://devicon.dev/) for technology icons
- [Unsplash](https://unsplash.com) for stock photography

---

<div align="center">
  
**⭐ Star this repo if it helped you!**

</div>