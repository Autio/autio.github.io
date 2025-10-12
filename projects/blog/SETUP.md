# Setup Instructions

This guide will help you get your gwern-style blog up and running.

## Prerequisites

You need Node.js installed on your system. This blog requires Node.js 16 or higher.

### Installing Node.js

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Windows:**
- Download the installer from https://nodejs.org/
- Run the installer and follow the prompts

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Customize your site:**
   - Edit `config.yaml` to set your name, description, and colors
   - Modify the example post in `content/posts/example-post.md`
   - Update the about page in `content/pages/about.md`

3. **Build your site:**
   ```bash
   npm run build
   ```

4. **Preview locally:**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:8000 in your browser

## First Steps After Installation

### 1. Personalize Your Site

Edit `config.yaml`:
```yaml
site:
  title: "Your Name"
  subtitle: "Your tagline"
  description: "What you write about"
  author: "Your Name"
```

### 2. Customize Colors

Still in `config.yaml`, modify the theme colors:
```yaml
theme:
  light:
    background: "#ffffff"
    text: "#000000"
    link: "#0000ee"
    # ... customize other colors
  
  dark:
    background: "#1a1a1a"
    text: "#e0e0e0"
    # ... customize other colors
```

### 3. Write Your First Post

Create `content/posts/hello-world.md`:
```markdown
---
title: "Hello World"
date: 2025-10-03
categories: ["Personal"]
tags: ["introduction"]
description: "My first post"
---

Welcome to my blog!
```

### 4. Build and Deploy

```bash
# Build the site
npm run build

# The output is in public/ directory
# Upload public/ to your web host
```

## Development Workflow

### Writing Posts

1. Create a new `.md` file in `content/posts/`
2. Add frontmatter (title, date, etc.)
3. Write your content in Markdown
4. Run `npm run dev` to see changes live

### Editing Pages

Edit files in `content/pages/` to modify:
- `about.md` - Your about page
- `links.md` - Link collection
- Add more pages as needed

### Customizing Design

- **Colors & fonts:** Edit `config.yaml`
- **CSS styles:** Edit `styles/main.css`
- **JavaScript:** Edit `scripts/main.js`
- **HTML structure:** Edit `templates/*.html`

## Common Issues

### npm: command not found

Install Node.js first (see Prerequisites above).

### Port 8000 already in use

Change the PORT in `serve.js` or kill the process using port 8000:
```bash
# Find process
lsof -i :8000

# Kill it
kill -9 <PID>
```

### Changes not showing up

Make sure you're running `npm run dev` (with watch mode) or rebuild with `npm run build` after changes.

### Search not working

Make sure `search-index.json` is generated in the `public/` directory. It's created automatically during build.

## Next Steps

1. **Read the README.md** for full documentation
2. **Explore gwern.net** for design inspiration
3. **Write regularly** - content is what matters!
4. **Share your site** once you've deployed it

## Support

If you run into issues:
1. Check this guide first
2. Read the README.md
3. Check if Node.js and npm are properly installed
4. Make sure you ran `npm install` successfully

Happy blogging! 📝

