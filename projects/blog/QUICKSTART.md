# Quick Start Guide

Get your blog running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

> **Note:** Need Node.js? See [SETUP.md](SETUP.md) for installation instructions.

## 2. Personalize Your Site

Edit `config.yaml`:
```yaml
site:
  title: "Your Name"           # Change this
  subtitle: "Your tagline"     # Change this
  description: "What you write about"  # Change this
  author: "Your Name"          # Change this
```

## 3. Write Your First Post

Create `content/posts/my-first-post.md`:
```markdown
---
title: "My First Post"
date: 2025-10-03
categories: ["Personal"]
tags: ["introduction"]
description: "Hello world"
---

# Hello!

This is my first blog post.
```

## 4. Build & Preview

```bash
npm run dev
```

Open http://localhost:8000 in your browser.

## 5. Customize Colors (Optional)

Edit `config.yaml` to change colors:
```yaml
theme:
  light:
    background: "#ffffff"
    text: "#000000"
    link: "#0000ee"
  dark:
    background: "#1a1a1a"
    text: "#e0e0e0"
    link: "#6699ff"
```

See [THEMES.md](THEMES.md) for pre-made color schemes!

## Common Commands

```bash
# Development server with auto-reload
npm run dev

# Build site once
npm run build

# Serve without watching
npm run serve
```

## File Structure

```
content/
├── posts/          # Your blog posts (.md files)
└── pages/          # Static pages (.md files)

config.yaml         # Site configuration & colors
styles/main.css     # Custom CSS
scripts/main.js     # Custom JavaScript
```

## Features

Click the buttons in the bottom-right corner:
- **◐** - Dark mode toggle
- **◱** - Reader mode (distraction-free)
- **🔍** - Search your posts
- **?** - Help

## Next Steps

1. **Write more posts** in `content/posts/`
2. **Customize colors** in `config.yaml` (see [THEMES.md](THEMES.md))
3. **Edit about page** in `content/pages/about.md`
4. **Read full docs** in [README.md](README.md)

## Need Help?

- 📖 Read [README.md](README.md) for full documentation
- 🎨 See [THEMES.md](THEMES.md) for color schemes
- ⚙️ Check [SETUP.md](SETUP.md) for installation help
- 💡 Inspired by [gwern.net](https://gwern.net/)

## Deployment

When ready to publish:

```bash
npm run build
```

Upload the `public/` folder to:
- GitHub Pages
- Netlify
- Vercel
- Any static host

---

**That's it!** Start writing and let your ideas flow. 📝

