# Gwern-Style Blog

A static blog generator inspired by [gwern.net](https://gwern.net/), featuring clean academic typography, configurable color themes, and easy content management.

## Features

### Design & Aesthetics
- **Clean, academic typography** with serif fonts and optimal line spacing
- **Responsive design** that works on all devices
- **Dark mode** with automatic system preference detection
- **Reader mode** for distraction-free reading
- **Minimalist UI** that puts content first

### Content Management
- **Markdown-based** content with YAML frontmatter
- **Automatic table of contents** generation
- **Category and tag** organization
- **Reading time** calculation
- **Full-text search** across all posts

### Customization
- **Fully configurable color themes** (light and dark)
- **Typography settings** (fonts, sizes, line height)
- **Easy navigation** structure configuration
- **All settings in one YAML file**

## Quick Start

### Installation

```bash
npm install
```

### Create Your First Post

Create a new Markdown file in `content/posts/`:

```markdown
---
title: "My First Post"
date: 2025-10-03
categories: ["Writing"]
tags: ["example"]
description: "This is my first post"
---

Write your content here in Markdown...
```

### Build & Preview

```bash
# Build the site
npm run build

# Serve locally (with auto-rebuild on changes)
npm run dev

# Or just serve without watching
npm run serve
```

Visit `http://localhost:8000` to preview your site.

## Configuration

Edit `config.yaml` to customize your site:

### Site Settings

```yaml
site:
  title: "Your Name"
  subtitle: "Essays & Research"
  description: "I write about X, Y, & Z"
  url: "https://yourdomain.com"
  author: "Your Name"
```

### Theme Colors

Customize both light and dark mode colors:

```yaml
theme:
  light:
    background: "#ffffff"
    text: "#000000"
    link: "#0000ee"
    # ... more colors
  
  dark:
    background: "#1a1a1a"
    text: "#e0e0e0"
    link: "#6699ff"
    # ... more colors
```

### Typography

```yaml
theme:
  fonts:
    body: "Georgia, 'Times New Roman', serif"
    headings: "Georgia, 'Times New Roman', serif"
    mono: "'Consolas', 'Monaco', 'Courier New', monospace"
  
  font-size: "18px"
  line-height: "1.6"
  max-width: "900px"
```

## Content Structure

```
content/
├── posts/          # Blog posts
│   └── *.md
└── pages/          # Static pages
    ├── about.md
    └── links.md
```

### Post Frontmatter

```yaml
---
title: "Post Title"           # Required
date: YYYY-MM-DD              # Required for posts
categories: ["Category"]      # Optional
tags: ["tag1", "tag2"]       # Optional
description: "Brief summary" # Optional (for SEO)
---
```

## Features

### Dark Mode

Click the ◐ button in the bottom-right corner to toggle between light and dark themes. Your preference is automatically saved.

### Reader Mode

Click the ◱ button to enable reader mode, which hides navigation, metadata, and UI elements for distraction-free reading.

### Search

Click the 🔍 button to search across all your posts and pages. Search works on titles and content.

### Table of Contents

Posts with 2+ headings automatically get a table of contents with smooth-scrolling anchor links.

## Deployment

The built site is in the `public/` directory. Deploy to any static host:

### GitHub Pages

```bash
# Build the site
npm run build

# Copy public/ contents to your GitHub Pages repo
# Or configure GitHub Actions to build automatically
```

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`

### Vercel

1. Import your repository to Vercel
2. Framework preset: Other
3. Build command: `npm run build`
4. Output directory: `public`

### Custom Server

Simply upload the contents of `public/` to your web server.

## File Structure

```
.
├── build.js              # Build script
├── serve.js              # Development server
├── config.yaml           # Site configuration
├── package.json          # Dependencies
├── content/              # Your content
│   ├── posts/           # Blog posts (Markdown)
│   └── pages/           # Static pages (Markdown)
├── templates/            # HTML templates
│   ├── layout.html      # Base layout
│   ├── index.html       # Home page template
│   └── post.html        # Post/page template
├── styles/               # CSS
│   └── main.css         # Main stylesheet
├── scripts/              # JavaScript
│   └── main.js          # Interactive features
└── public/               # Generated site (git ignored)
```

## Customization

### Adding Custom CSS

Edit `styles/main.css` to add your own styles. The theme colors from `config.yaml` are automatically injected as CSS variables:

```css
/* Use theme variables */
.my-element {
  color: var(--accent);
  background: var(--bg);
}
```

### Adding Custom JavaScript

Edit `scripts/main.js` or add your own script file. Make sure to copy it in the build script if you add new files.

### Modifying Templates

Edit files in `templates/` to change the HTML structure:
- `layout.html` - Overall page structure
- `index.html` - Home page content
- `post.html` - Post and page content

## Inspiration

This project is heavily inspired by [gwern.net](https://gwern.net/), one of the best personal websites on the internet. Key influences include:

- Clean, academic typography prioritizing readability
- Comprehensive categorization and organization
- Long-form content focus
- Sidenotes and marginal notes (to be implemented)
- Minimalist, distraction-free design

## License

MIT License - feel free to use this for your own blog!

## Credits

- Design inspiration: [gwern.net](https://gwern.net/)
- Markdown parsing: [marked](https://github.com/markedjs/marked)
- YAML parsing: [js-yaml](https://github.com/nodeca/js-yaml)

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

Happy writing! 📝

