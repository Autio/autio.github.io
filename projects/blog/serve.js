#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const PORT = 8000;
const OUTPUT_DIR = path.join(__dirname, 'public');

// Check if watch mode is enabled
const watchMode = process.argv.includes('--watch');

// Simple MIME type detection
function getMimeType(ext) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

// Create HTTP server
const server = http.createServer((req, res) => {
  let filePath = path.join(OUTPUT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // If path is a directory, try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
    return;
  }
  
  // Read and serve file
  const ext = path.extname(filePath);
  const mimeType = getMimeType(ext);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>500 Internal Server Error</h1>');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  });
});

// Build the site first
console.log('🔨 Building site...\n');
exec('node build.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
  
  console.log(stdout);
  if (stderr) console.error(stderr);
  
  // Start server
  server.listen(PORT, () => {
    console.log(`\n🌐 Server running at http://localhost:${PORT}/`);
    console.log(`📁 Serving from: ${OUTPUT_DIR}\n`);
    
    if (watchMode) {
      console.log('👀 Watch mode enabled. Watching for changes...\n');
      setupWatcher();
    } else {
      console.log('💡 Tip: Use --watch flag for auto-rebuild on changes\n');
    }
  });
});

// File watcher for development
function setupWatcher() {
  const chokidar = require('chokidar');
  
  const watcher = chokidar.watch([
    'content/**/*.md',
    'templates/**/*.html',
    'styles/**/*.css',
    'scripts/**/*.js',
    'config.yaml'
  ], {
    persistent: true,
    ignoreInitial: true
  });
  
  let rebuilding = false;
  
  watcher.on('all', (event, filePath) => {
    if (rebuilding) return;
    
    rebuilding = true;
    console.log(`\n📝 Change detected: ${filePath}`);
    console.log('🔨 Rebuilding...');
    
    exec('node build.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Build failed:', error.message);
      } else {
        console.log('✅ Rebuild complete!');
      }
      
      rebuilding = false;
    });
  });
  
  watcher.on('error', error => {
    console.error('❌ Watcher error:', error);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

