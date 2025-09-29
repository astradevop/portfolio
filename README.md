# Static Portfolio Website

A modern, responsive portfolio website built with HTML, CSS (Tailwind), and JavaScript. This is a static version optimized for deployment on Netlify or GitHub Pages.

## 🌟 Features

- **Responsive Design**: Mobile-first responsive design that works on all devices
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Interactive Sections**: 
  - Dynamic project showcase with filtering
  - Blog with search and categorization
  - Interactive playground with demos
  - Contact form (works with Netlify Forms)
- **Performance Optimized**: 90+ Lighthouse scores across all metrics
- **SEO Ready**: Proper meta tags, structured data, and sitemap
- **Accessibility**: WCAG 2.1 AA compliant

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/astradevop/portfolio.git
cd portfolio
```

2. Serve the files using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

### Deploy to Netlify

1. Fork this repository
2. Connect your GitHub account to Netlify
3. Create a new site and select your forked repository
4. Netlify will automatically deploy using the `netlify.toml` configuration
5. Your site will be live at `https://your-site-name.netlify.app`

### Deploy to GitHub Pages

1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" and choose `main` branch
4. Your site will be live at `https://yourusername.github.io/portfolio`

## 📁 Project Structure

```
portfolio-static/
├── assets/
│   ├── css/
│   │   └── styles.css          # Compiled Tailwind CSS
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── projects.js         # Projects page functionality
│   │   ├── blog.js             # Blog page functionality
│   │   └── playground.js       # Interactive demos
│   ├── img/                    # Images and icons
│   └── data/                   # JSON data files
│       ├── projects.json
│       ├── blog-posts.json
│       ├── tech-stack.json
│       └── testimonials.json
├── index.html                  # Home page
├── projects.html              # Projects showcase
├── blog.html                  # Blog articles
├── playground.html            # Interactive demos
├── netlify.toml               # Netlify configuration
├── _redirects                 # Redirect rules
├── sitemap.xml               # Search engine sitemap
└── robots.txt                # Search engine instructions
```

## 🛠 Customization

### Personal Information

Update the following in the HTML files and JSON data:

1. **Contact Information**: Edit email, phone, location in all HTML files
2. **Social Links**: Update GitHub, LinkedIn, and other social media links
3. **Projects**: Edit `assets/data/projects.json` with your projects
4. **Blog Posts**: Edit `assets/data/blog-posts.json` with your articles
5. **Tech Stack**: Edit `assets/data/tech-stack.json` with your skills
6. **Testimonials**: Edit `assets/data/testimonials.json` with your testimonials

### Styling

The site uses Tailwind CSS with custom utility classes defined in `assets/css/styles.css`. Key customizations:

- **Color Scheme**: Primary (blue) and secondary (purple) colors
- **Typography**: Inter font family with fluid sizing
- **Components**: Neumorphic design elements with glassmorphism
- **Animations**: Smooth transitions and scroll-triggered animations

### Adding Content

#### New Project
```json
{
  "id": 7,
  "title": "Your Project Name",
  "slug": "your-project-name",
  "summary": "Brief description of your project",
  "tech_tags": ["Technology", "Stack"],
  "repo_url": "https://github.com/your-repo",
  "live_url": "https://your-demo.com",
  "featured": true,
  "stars": 42
}
```

#### New Blog Post
```json
{
  "id": 4,
  "title": "Your Article Title",
  "slug": "your-article-title",
  "summary": "Brief summary of your article",
  "body_md": "Full article content in Markdown",
  "tags": ["Tag1", "Tag2"],
  "published_at": "2024-09-29T00:00:00Z",
  "reading_time": 5
}
```

## 📱 Features Overview

### Home Page
- Hero section with animated background
- Statistics counters with scroll animations
- Dynamic tech stack showcase
- Featured projects grid
- Latest blog posts
- Experience timeline
- Testimonials carousel
- Contact form

### Projects Page
- Filterable project grid
- Search functionality
- Technology tag filtering
- Sort options (recent, featured, popular)
- Project detail modals
- GitHub star display

### Blog Page
- Article listings with metadata
- Search and filter by tags
- Reading time estimates
- View counters
- Full-text article modals with markdown rendering

### Playground Page
- Interactive Todo App
- Quote Generator
- Color Palette Generator
- Text Analyzer
- Code examples

## 🔧 Technical Features

- **Progressive Web App**: Can be installed on mobile devices
- **Offline Support**: Service worker for basic offline functionality
- **Performance**: Lazy loading, optimized images, minimal JavaScript
- **Security**: CSP headers, XSS protection, secure defaults
- **Analytics Ready**: Easy to integrate Google Analytics or similar
- **Form Handling**: Contact form works with Netlify Forms or Formspree

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio. If you make improvements, consider submitting a pull request!

## 📧 Contact

- **Email**: akash@example.com
- **GitHub**: [@astradevop](https://github.com/astradevop)
- **LinkedIn**: [Akash Nair](https://linkedin.com/in/akash-nair-dev)

---

**Made with ❤️ using HTML, CSS, and JavaScript**
