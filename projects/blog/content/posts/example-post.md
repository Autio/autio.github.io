---
title: "Welcome to Your Blog"
date: 2025-10-03
categories: ["Meta"]
tags: ["welcome", "introduction"]
description: "An introduction to this gwern.net-inspired blog"
---

This is your first blog post. The blog system is designed to capture the essence of gwern.net while giving you full control over theming and content.

## Features

This blog includes several key features inspired by gwern.net:

### Clean, Academic Typography

The design prioritizes readability with:
- Serif fonts for body text (Georgia)
- Generous line height (1.6)
- Maximum width for optimal reading (900px)
- Thoughtful spacing and hierarchy

### Dark Mode

Toggle between light and dark themes using the feature bar in the bottom-right corner. Your preference is saved automatically.

### Reader Mode

For distraction-free reading, enable reader mode to hide navigation, metadata, and other UI elements.

### Search

Full-text search across all your posts. Press the search button or use keyboard shortcuts to quickly find content.

### Configurable Theming

Edit `config.yaml` to customize:
- Colors (both light and dark modes)
- Fonts (body, headings, monospace)
- Typography settings
- Navigation structure

## Writing Content

Create new posts in the `content/posts/` directory using Markdown. Each post should have frontmatter with:

```yaml
---
title: "Your Post Title"
date: YYYY-MM-DD
categories: ["Category"]
tags: ["tag1", "tag2"]
description: "Brief description"
---
```

Then write your content in Markdown below the frontmatter.

## Building Your Site

Run `npm run build` to generate the static site in the `public/` directory. For development with live reload, use `npm run dev`.

## Code Examples

Inline code looks like `this`, while code blocks are formatted nicely:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

## Lists and Organization

The blog supports:

1. Numbered lists
2. Bullet lists
3. Nested structures
4. Multiple levels

- Essays
  - Long-form content
  - Research articles
- Blog posts
  - Short updates
  - Quick thoughts
- Documentation
  - How-to guides
  - References

## Blockquotes

> This is a blockquote. Use it for highlighting important text, quotes from other sources, or callouts.
> 
> They support multiple paragraphs too.

## Links and References

External links open in new tabs automatically. Internal links scroll smoothly. All visited links show a distinct color, like on gwern.net.

## Next Steps

1. Edit `config.yaml` to personalize your site
2. Customize colors to match your preferences
3. Write your own posts in `content/posts/`
4. Run `npm run build` to generate your site
5. Deploy to GitHub Pages or any static host

Happy writing!

