# Theme Configuration Guide

This guide helps you customize your blog's appearance by editing `config.yaml`.

## Understanding Color Variables

Your blog uses CSS variables that you can customize in `config.yaml`:

### Core Colors

| Variable | Purpose | Light Default | Dark Default |
|----------|---------|---------------|--------------|
| `background` | Page background | `#ffffff` | `#1a1a1a` |
| `text` | Main text color | `#000000` | `#e0e0e0` |
| `text-secondary` | Less important text | `#666666` | `#999999` |
| `link` | Link color | `#0000ee` | `#6699ff` |
| `link-visited` | Visited link color | `#551a8b` | `#9999ff` |
| `link-hover` | Link hover color | `#0000ff` | `#99ccff` |
| `border` | Borders, separators | `#cccccc` | `#444444` |
| `code-background` | Code blocks | `#f5f5f5` | `#2d2d2d` |
| `blockquote-border` | Blockquote accent | `#dddddd` | `#555555` |
| `accent` | Special highlights | `#0066cc` | `#3399ff` |

## Pre-made Color Schemes

### Classic Gwern (Default)
Clean, academic black and white:
```yaml
theme:
  light:
    background: "#ffffff"
    text: "#000000"
    link: "#0000ee"
    accent: "#0066cc"
```

### Warm Paper
Easy on the eyes, like old paper:
```yaml
theme:
  light:
    background: "#faf8f3"
    text: "#2d2a26"
    text-secondary: "#6b6560"
    link: "#8b4513"
    link-visited: "#654321"
    link-hover: "#a0522d"
    border: "#d4cfc7"
    code-background: "#f0ebe4"
    blockquote-border: "#e0dbd4"
    accent: "#cd853f"
  
  dark:
    background: "#1f1e1c"
    text: "#e8e4dd"
    text-secondary: "#a39e95"
    link: "#d4a574"
    link-visited: "#b8936a"
    link-hover: "#e6b880"
    border: "#3d3a35"
    code-background: "#2a2825"
    blockquote-border: "#4a4540"
    accent: "#daa520"
```

### Cool Blue
Modern, professional blue tones:
```yaml
theme:
  light:
    background: "#f8f9fa"
    text: "#1a1a2e"
    text-secondary: "#6c757d"
    link: "#0066cc"
    link-visited: "#551a8b"
    link-hover: "#0080ff"
    border: "#dee2e6"
    code-background: "#e9ecef"
    blockquote-border: "#cbd3da"
    accent: "#007bff"
  
  dark:
    background: "#0f1419"
    text: "#e6edf3"
    text-secondary: "#8b949e"
    link: "#58a6ff"
    link-visited: "#a475f9"
    link-hover: "#79c0ff"
    border: "#30363d"
    code-background: "#161b22"
    blockquote-border: "#21262d"
    accent: "#1f6feb"
```

### Solarized Light
Popular, carefully designed palette:
```yaml
theme:
  light:
    background: "#fdf6e3"
    text: "#657b83"
    text-secondary: "#93a1a1"
    link: "#268bd2"
    link-visited: "#6c71c4"
    link-hover: "#2aa198"
    border: "#eee8d5"
    code-background: "#eee8d5"
    blockquote-border: "#93a1a1"
    accent: "#cb4b16"
  
  dark:
    background: "#002b36"
    text: "#839496"
    text-secondary: "#586e75"
    link: "#268bd2"
    link-visited: "#6c71c4"
    link-hover: "#2aa198"
    border: "#073642"
    code-background: "#073642"
    blockquote-border: "#586e75"
    accent: "#cb4b16"
```

### Dracula
Popular dark theme with vibrant colors:
```yaml
theme:
  light:
    background: "#f8f8f2"
    text: "#282a36"
    text-secondary: "#6272a4"
    link: "#8be9fd"
    link-visited: "#bd93f9"
    link-hover: "#50fa7b"
    border: "#e6e6e6"
    code-background: "#f1f1eb"
    blockquote-border: "#d4d4d4"
    accent: "#ff79c6"
  
  dark:
    background: "#282a36"
    text: "#f8f8f2"
    text-secondary: "#6272a4"
    link: "#8be9fd"
    link-visited: "#bd93f9"
    link-hover: "#50fa7b"
    border: "#44475a"
    code-background: "#44475a"
    blockquote-border: "#6272a4"
    accent: "#ff79c6"
```

### Monochrome Minimalist
Pure black and white:
```yaml
theme:
  light:
    background: "#ffffff"
    text: "#000000"
    text-secondary: "#666666"
    link: "#000000"
    link-visited: "#555555"
    link-hover: "#333333"
    border: "#cccccc"
    code-background: "#f5f5f5"
    blockquote-border: "#dddddd"
    accent: "#000000"
  
  dark:
    background: "#000000"
    text: "#ffffff"
    text-secondary: "#999999"
    link: "#ffffff"
    link-visited: "#cccccc"
    link-hover: "#eeeeee"
    border: "#333333"
    code-background: "#1a1a1a"
    blockquote-border: "#444444"
    accent: "#ffffff"
```

## Typography Settings

### Font Choices

```yaml
theme:
  fonts:
    # Serif options (recommended for body text)
    body: "Georgia, 'Times New Roman', serif"
    # or: "Baskerville, 'Libre Baskerville', serif"
    # or: "'Merriweather', Georgia, serif"
    # or: "'Crimson Text', Georgia, serif"
    
    # Sans-serif options (for modern look)
    # body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    # or: "'Inter', -apple-system, sans-serif"
    # or: "'Source Sans Pro', Arial, sans-serif"
    
    # Headings (can be same as body or different)
    headings: "Georgia, 'Times New Roman', serif"
    # or: "'Playfair Display', Georgia, serif"
    # or: "'Cormorant Garamond', Georgia, serif"
    
    # Monospace (for code)
    mono: "'Consolas', 'Monaco', 'Courier New', monospace"
    # or: "'Fira Code', 'Monaco', monospace"
    # or: "'JetBrains Mono', 'Consolas', monospace"
```

### Size Settings

```yaml
theme:
  # Base font size (affects everything)
  font-size: "18px"    # Default, gwern-style
  # font-size: "16px"  # Smaller, modern
  # font-size: "20px"  # Larger, easier reading
  
  # Line height (spacing between lines)
  line-height: "1.6"   # Default, comfortable
  # line-height: "1.5" # Tighter
  # line-height: "1.8" # More spacious
  
  # Maximum content width
  max-width: "900px"   # Default, optimal reading
  # max-width: "700px" # Narrower, book-like
  # max-width: "1100px" # Wider, more content
```

## Using Web Fonts

To use fonts from Google Fonts or other sources:

1. Add the font link to `templates/layout.html`:
```html
<head>
  ...
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
</head>
```

2. Update `config.yaml`:
```yaml
theme:
  fonts:
    body: "'Merriweather', Georgia, serif"
```

## Tips for Choosing Colors

1. **Contrast is key**: Ensure text is readable against the background
   - Use contrast checkers: https://webaim.org/resources/contrastchecker/

2. **Consistency**: Links and accents should feel harmonious
   - Use color palette generators: https://coolors.co/

3. **Test both modes**: Make sure both light and dark themes work well
   - Toggle between them frequently during customization

4. **Less is more**: Gwern.net's power is in simplicity
   - Stick to a few core colors
   - Let typography do the heavy lifting

5. **Save your changes**: Keep a backup of your config.yaml
   - Git commit after you find a theme you like

## Quick Theme Switching

To quickly test different themes:

1. Edit `config.yaml`
2. Save the file
3. If using `npm run dev`, changes rebuild automatically
4. Otherwise, run `npm run build` again
5. Refresh your browser

## Advanced: Creating Your Own Theme

1. Start with a color palette tool:
   - https://coolors.co/
   - https://color.adobe.com/
   - https://paletton.com/

2. Pick 3-5 core colors:
   - Background
   - Text
   - Accent/Link color
   - Optional: Secondary accent

3. Create variations:
   - Light mode: Light background, dark text
   - Dark mode: Dark background, light text
   - Borders: 10-20% different from background
   - Code backgrounds: 3-5% different from background

4. Test accessibility:
   - Text vs background: at least 4.5:1 ratio
   - Links should be distinguishable from regular text

5. Iterate:
   - Write a real post
   - View it in both themes
   - Adjust colors until it feels right

## Examples in the Wild

For inspiration, check out sites with great color schemes:
- gwern.net (classic)
- https://macwright.com/ (clean blue)
- https://waitbutwhy.com/ (warm, friendly)
- https://danluu.com/ (minimalist)

Remember: The best theme is one that gets out of the way and lets your content shine!

