#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');
const { glob } = require('glob');

// Directories
const CONTENT_DIR = path.join(__dirname, 'content');
const OUTPUT_DIR = path.join(__dirname, 'public');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STYLES_DIR = path.join(__dirname, 'styles');
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

// Load configuration
function loadConfig() {
  const configPath = path.join(__dirname, 'config.yaml');
  const configContent = fs.readFileSync(configPath, 'utf8');
  return yaml.load(configContent);
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatter = yaml.load(match[1]);
    const markdown = match[2];
    return { frontmatter, markdown };
  }
  
  return { frontmatter: {}, markdown: content };
}

// Simple template engine
function renderTemplate(template, data) {
  let result = template;
  
  // Replace simple {{variable}} placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
  
  // Replace {{{variable}}} (unescaped HTML)
  result = result.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
  
  // Handle {{#section}} blocks
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, block) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        return data[key].map(item => renderTemplate(block, item)).join('');
      }
      return block;
    }
    return '';
  });
  
  return result;
}

// Calculate reading time
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Generate table of contents
function generateTOC(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level, text, id });
    }
  }
  
  if (headings.length < 2) return null;
  
  let html = '<ul>';
  let currentLevel = 2;
  
  for (const heading of headings) {
    if (heading.level > currentLevel) {
      html += '<ul>'.repeat(heading.level - currentLevel);
    } else if (heading.level < currentLevel) {
      html += '</ul>'.repeat(currentLevel - heading.level);
    }
    
    html += `<li><a href="#${heading.id}">${heading.text}</a></li>`;
    currentLevel = heading.level;
  }
  
  html += '</ul>'.repeat(currentLevel - 1);
  return html;
}

// Generate custom CSS from config
function generateCustomCSS(config) {
  const theme = config.theme;
  let css = ':root {\n';
  
  // Light mode colors
  if (theme.light) {
    for (const [key, value] of Object.entries(theme.light)) {
      css += `  --${key}: ${value};\n`;
    }
  }
  
  // Fonts
  if (theme.fonts) {
    css += `  --font-body: ${theme.fonts.body};\n`;
    css += `  --font-heading: ${theme.fonts.headings};\n`;
    css += `  --font-mono: ${theme.fonts.mono};\n`;
  }
  
  // Sizes
  if (theme['font-size']) css += `  --font-size: ${theme['font-size']};\n`;
  if (theme['line-height']) css += `  --line-height: ${theme['line-height']};\n`;
  if (theme['max-width']) css += `  --max-width: ${theme['max-width']};\n`;
  
  css += '}\n\n';
  
  // Dark mode colors
  if (theme.dark) {
    css += '[data-theme="dark"] {\n';
    for (const [key, value] of Object.entries(theme.dark)) {
      css += `  --${key}: ${value};\n`;
    }
    css += '}\n';
  }
  
  return css;
}

// Build the site
async function build() {
  console.log('🚀 Building site...\n');
  
  const config = loadConfig();
  
  // Create output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // Load templates
  const layoutTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'layout.html'), 'utf8');
  const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf8');
  const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf8');
  
  // Copy and generate styles
  const stylesOutputDir = path.join(OUTPUT_DIR, 'styles');
  fs.mkdirSync(stylesOutputDir, { recursive: true });
  
  const mainCSS = fs.readFileSync(path.join(STYLES_DIR, 'main.css'), 'utf8');
  const customCSS = generateCustomCSS(config);
  
  // Replace CSS variables in main.css with config values
  const finalCSS = mainCSS.replace(
    /(:root\s*\{[\s\S]*?\})/,
    customCSS
  );
  
  fs.writeFileSync(path.join(stylesOutputDir, 'main.css'), finalCSS);
  console.log('✅ Generated styles');
  
  // Copy scripts
  const scriptsOutputDir = path.join(OUTPUT_DIR, 'scripts');
  fs.mkdirSync(scriptsOutputDir, { recursive: true });
  fs.copyFileSync(
    path.join(SCRIPTS_DIR, 'main.js'),
    path.join(scriptsOutputDir, 'main.js')
  );
  console.log('✅ Copied scripts');
  
  // Process posts
  const postFiles = await glob('**/*.md', { cwd: path.join(CONTENT_DIR, 'posts') });
  const posts = [];
  const searchIndex = [];
  
  for (const file of postFiles) {
    const filePath = path.join(CONTENT_DIR, 'posts', file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, markdown } = parseFrontmatter(content);
    
    const html = marked(markdown);
    const readingTime = calculateReadingTime(markdown);
    const toc = generateTOC(markdown);
    
    const postData = {
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : '',
      isoDate: frontmatter.date || '',
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      description: frontmatter.description || '',
      content: html,
      readingTime,
      toc
    };
    
    // Generate post HTML
    const postHtml = renderTemplate(postTemplate, postData);
    const pageHtml = renderTemplate(layoutTemplate, {
      title: postData.title,
      siteTitle: config.site.title,
      siteSubtitle: config.site.subtitle,
      description: postData.description,
      author: config.site.author,
      content: postHtml,
      customStyles: '',
      year: new Date().getFullYear()
    });
    
    // Write post file
    const slug = file.replace('.md', '').replace(/\//g, '-');
    const postOutputDir = path.join(OUTPUT_DIR, 'posts', slug);
    fs.mkdirSync(postOutputDir, { recursive: true });
    fs.writeFileSync(path.join(postOutputDir, 'index.html'), pageHtml);
    
    posts.push({
      ...postData,
      url: `/posts/${slug}/`,
      slug,
      rawContent: markdown
    });
    
    // Add to search index
    searchIndex.push({
      title: postData.title,
      url: `/posts/${slug}/`,
      content: markdown.substring(0, 500),
      date: postData.date
    });
  }
  
  console.log(`✅ Generated ${posts.length} post(s)`);
  
  // Process pages
  const pageFiles = await glob('**/*.md', { cwd: path.join(CONTENT_DIR, 'pages') });
  
  for (const file of pageFiles) {
    const filePath = path.join(CONTENT_DIR, 'pages', file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, markdown } = parseFrontmatter(content);
    
    const html = marked(markdown);
    const toc = generateTOC(markdown);
    
    const pageData = {
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description || '',
      content: html,
      toc
    };
    
    // Generate page HTML (reuse post template)
    const pageContent = renderTemplate(postTemplate, pageData);
    const pageHtml = renderTemplate(layoutTemplate, {
      title: pageData.title,
      siteTitle: config.site.title,
      siteSubtitle: config.site.subtitle,
      description: pageData.description,
      author: config.site.author,
      content: pageContent,
      customStyles: '',
      year: new Date().getFullYear()
    });
    
    // Write page file
    const slug = file.replace('.md', '');
    const pageOutputDir = path.join(OUTPUT_DIR, slug);
    fs.mkdirSync(pageOutputDir, { recursive: true });
    fs.writeFileSync(path.join(pageOutputDir, 'index.html'), pageHtml);
    
    // Add to search index
    searchIndex.push({
      title: pageData.title,
      url: `/${slug}/`,
      content: markdown.substring(0, 500)
    });
  }
  
  console.log(`✅ Generated ${pageFiles.length} page(s)`);
  
  // Generate index page
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.isoDate) - new Date(a.isoDate)
  );
  
  const sections = [
    {
      name: 'Recent Posts',
      posts: sortedPosts.slice(0, 10).map(post => ({
        title: post.title,
        url: post.url
      }))
    }
  ];
  
  const indexContent = renderTemplate(indexTemplate, {
    siteDescription: config.site.description,
    sections
  });
  
  const indexHtml = renderTemplate(layoutTemplate, {
    title: 'Home',
    siteTitle: config.site.title,
    siteSubtitle: config.site.subtitle,
    description: config.site.description,
    author: config.site.author,
    content: indexContent,
    customStyles: '',
    year: new Date().getFullYear()
  });
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
  console.log('✅ Generated index page');
  
  // Generate search index
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );
  console.log('✅ Generated search index');
  
  console.log('\n✨ Build complete! Output in public/');
  console.log(`\nTo preview: cd public && python3 -m http.server 8000`);
}

// Run build
build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});

