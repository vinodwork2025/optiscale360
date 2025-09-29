# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OptiScale 360 is a modern SEO consulting business website with an integrated AI-powered blog system, built for deployment on Cloudflare Pages. The project combines static HTML/CSS/JavaScript frontend with a sophisticated markdown-based blog generator and admin interface.

## Architecture

### Main Website
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Styling**: Custom CSS with CSS variables for theming
- **Layout**: Responsive design using CSS Grid and Flexbox
- **Components**: Modular HTML components in `/components/` directory

### Blog System
- **Content**: Markdown files with YAML frontmatter in `/blog/posts/`
- **Generation**: Node.js-based static site generator (`blog-generator.js`)
- **SEO**: Comprehensive JSON-LD structured data, multiple schema types
- **Admin**: Browser-based admin interface (`blog-admin.html`) with rich editor

### Deployment
- **Platform**: Cloudflare Pages
- **Build**: Automated via `_build.js` script
- **Configuration**: `wrangler.toml` for Cloudflare settings

## Development Commands

### Blog Development
```bash
# Build blog content from markdown files
npm run build:blog

# Development server with auto-rebuild
npm run dev

# Preview built site (opens in browser)
npm run preview

# Blog admin interface
npm run admin

# Blog publishing API server
npm run publish:api
```

### Static Site Serving
```bash
# Python development server
python -m http.server 8000

# Node.js http-server
npx http-server

# Open directly in browser
start index.html
```

## Key Files and Their Purpose

### Core Website Files
- `index.html` - Main landing page
- `styles.css` - Primary stylesheet with blog integration
- `script.js` - Main JavaScript functionality
- `components/` - Reusable HTML components (header, footer)

### Blog System
- `blog-generator.js` - Main blog build script with SEO optimization
- `_build.js` - Cloudflare Pages build script
- `blog-admin.html` - Visual blog editor interface
- `blog/posts/` - Markdown source files
- `blog/` - Generated blog HTML files

### Configuration
- `package.json` - Node.js dependencies and scripts
- `wrangler.toml` - Cloudflare Pages deployment configuration
- `vite.config.js` - Vite build configuration (React support)
- `tailwind.config.js` - Tailwind CSS configuration

## Blog Workflow

### Creating New Posts
1. Use admin interface: Open `blog-admin.html` in browser
2. Fill post details (title, description, tags, category)
3. Select content type (Article, How-To, Case Study, FAQ)
4. Write content in markdown editor with live preview
5. Generate and download markdown file
6. Place in `/blog/posts/` directory
7. Run `npm run build:blog` to generate HTML
8. Commit and deploy

### Content Types and Schema
- **Standard Articles**: Basic blog posts with Article schema
- **How-To Guides**: Step-by-step tutorials with HowTo schema
- **Case Studies**: Business case studies with Service schema
- **FAQ Posts**: Q&A format with FAQ schema

## Deployment Process

### Cloudflare Pages
1. Push changes to repository
2. Cloudflare automatically runs `node _build.js`
3. Dependencies installed via `npm install`
4. Blog generated via `npm run build:blog`
5. Navigation updated across site pages
6. Static files served with optimized caching

### Manual Deployment
```bash
# Build everything locally
npm run build:blog

# Test locally
npm run dev

# Deploy to Cloudflare (if CLI configured)
wrangler pages publish .
```

## SEO and Schema Features

The blog system includes comprehensive SEO optimization:
- **JSON-LD structured data** for all content types
- **Multiple schema types**: Article, HowTo, FAQ, Service, Organization
- **Meta tags** for social sharing (Open Graph, Twitter Card)
- **Clean URLs** with proper redirects
- **RSS feed** generation
- **Reading time estimation**
- **Mobile-first responsive design**

## Common Tasks

### Adding New Pages
1. Create HTML file in root directory
2. Include header/footer components from `/components/`
3. Update navigation in `_build.js` if needed
4. Follow existing styling patterns in `styles.css`

### Modifying Blog Styles
- Blog-specific styles start at `/* Blog Styles */` in `styles.css`
- Key classes: `.blog-main`, `.blog-post-card`, `.blog-post-content`
- Maintains consistency with main site design

### Updating Navigation
- Main site navigation managed by `_build.js`
- Blog navigation automatically integrated during build
- Manual updates in individual HTML files if needed

## Dependencies

### Runtime
- `marked` - Markdown parsing
- `gray-matter` - YAML frontmatter parsing
- `highlight.js` - Syntax highlighting
- `express` - Blog admin server

### Development
- `live-server` - Development server
- `nodemon` - Auto-restart for admin server

## Testing

Currently uses manual testing workflow:
1. Build locally with `npm run build:blog`
2. Test in browser with `npm run dev`
3. Verify blog functionality
4. Test responsive design
5. Validate SEO markup

## File Structure Patterns

```
optiscale360/
├── index.html              # Main pages
├── styles.css              # Global styles
├── script.js               # Main functionality
├── components/             # Reusable components
├── blog/                   # Generated blog content
│   ├── posts/             # Markdown source files
│   └── [post-slug]/       # Generated post pages
├── blog-generator.js       # Blog build system
├── blog-admin.html         # Admin interface
└── _build.js              # Deployment script
```

## Important Notes

- No server-side code in production (static files only)
- Blog admin interface runs entirely in browser
- All content generation happens at build time
- SEO-optimized with comprehensive structured data
- Mobile-first responsive design throughout
- Cloudflare Pages handles caching and CDN