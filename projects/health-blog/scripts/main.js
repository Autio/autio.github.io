// Feature toggles and interactive functionality
(function() {
  'use strict';

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  function getTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }
  
  // Initialize theme
  setTheme(getTheme());
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
  
  // Listen for system theme changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Reader Mode Toggle
  const readerModeToggle = document.getElementById('reader-mode-toggle');
  
  function setReaderMode(enabled) {
    if (enabled) {
      document.body.classList.add('reader-mode');
      localStorage.setItem('reader-mode', 'true');
    } else {
      document.body.classList.remove('reader-mode');
      localStorage.setItem('reader-mode', 'false');
    }
  }
  
  // Initialize reader mode
  if (localStorage.getItem('reader-mode') === 'true') {
    setReaderMode(true);
  }
  
  if (readerModeToggle) {
    readerModeToggle.addEventListener('click', () => {
      const enabled = document.body.classList.contains('reader-mode');
      setReaderMode(!enabled);
    });
  }

  // Search Functionality
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  let searchIndex = null;
  
  // Load search index
  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    
    try {
      const response = await fetch('/search-index.json');
      searchIndex = await response.json();
      return searchIndex;
    } catch (error) {
      console.error('Failed to load search index:', error);
      return [];
    }
  }
  
  // Simple search function
  function search(query) {
    if (!searchIndex || !query) return [];
    
    query = query.toLowerCase();
    const results = [];
    
    for (const item of searchIndex) {
      const titleMatch = item.title.toLowerCase().includes(query);
      const contentMatch = item.content.toLowerCase().includes(query);
      
      if (titleMatch || contentMatch) {
        // Calculate relevance score
        let score = 0;
        if (titleMatch) score += 10;
        if (contentMatch) score += 1;
        
        // Get context snippet
        const contentLower = item.content.toLowerCase();
        const index = contentLower.indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(item.content.length, index + query.length + 50);
        let snippet = item.content.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < item.content.length) snippet = snippet + '...';
        
        results.push({
          ...item,
          snippet,
          score
        });
      }
    }
    
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
  }
  
  // Display search results
  function displayResults(results) {
    if (!results.length) {
      searchResults.innerHTML = '<div class="search-result"><p>No results found.</p></div>';
      return;
    }
    
    searchResults.innerHTML = results.map(result => `
      <div class="search-result">
        <h3><a href="${result.url}">${escapeHtml(result.title)}</a></h3>
        <p>${escapeHtml(result.snippet)}</p>
      </div>
    `).join('');
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', async () => {
      searchOverlay.classList.add('active');
      searchInput.focus();
      await loadSearchIndex();
    });
    
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      
      const results = search(query);
      displayResults(results);
    });
    
    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });
  }

  // Help Toggle
  const helpToggle = document.getElementById('help-toggle');
  
  if (helpToggle) {
    helpToggle.addEventListener('click', () => {
      alert(`Navigation Help:
      
◐ - Toggle between light and dark mode
◱ - Toggle reader mode (distraction-free reading)
🔍 - Search the site
? - Show this help

Keyboard shortcuts:
Escape - Close search overlay

Features:
• Dark mode preference is saved
• Reader mode hides navigation and metadata
• Search searches titles and content
• Responsive design for mobile devices`);
    });
  }

  // Table of Contents (if exists)
  const toc = document.querySelector('.table-of-contents');
  if (toc) {
    // Make TOC sticky on scroll (optional enhancement)
    const tocTop = toc.offsetTop;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > tocTop - 20 && window.innerWidth > 768) {
        toc.style.position = 'sticky';
        toc.style.top = '2rem';
      }
    });
  }

  // Add anchor links to headings
  const postContent = document.querySelector('.post-content');
  if (postContent) {
    const headings = postContent.querySelectorAll('h2, h3, h4, h5, h6');
    
    headings.forEach(heading => {
      if (!heading.id) {
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        heading.id = id;
      }
      
      // Add link icon
      heading.innerHTML = `
        <a href="#${heading.id}" class="heading-anchor" aria-hidden="true">#</a>
        ${heading.innerHTML}
      `;
    });
  }

  // Smooth scroll polyfill for older browsers
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // External link indicators (optional)
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Print-friendly links
  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener((mql) => {
      if (mql.matches) {
        // Before print
        document.body.classList.add('printing');
      } else {
        // After print
        document.body.classList.remove('printing');
      }
    });
  }

  // Wikipedia Tooltips
  class WikipediaTooltip {
    constructor() {
      this.cache = new Map();
      this.activeTooltip = null;
      this.init();
    }

    init() {
      // Process all elements with data-wikipedia attribute
      this.processElements();
      
      // Listen for clicks to close tooltips
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.wikipedia-tooltip')) {
          this.hideTooltip();
        }
      });
    }

    processElements() {
      const elements = document.querySelectorAll('[data-wikipedia]');
      elements.forEach(element => {
        element.classList.add('wikipedia-tooltip');
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.showTooltip(element);
        });
      });
    }

    async showTooltip(element) {
      const term = element.getAttribute('data-wikipedia');
      if (!term) return;

      // Hide any existing tooltip
      this.hideTooltip();

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-content';
      tooltip.innerHTML = '<div class="tooltip-loading">Loading...</div>';
      
      element.appendChild(tooltip);
      this.activeTooltip = tooltip;

      // Show loading state
      setTimeout(() => tooltip.classList.add('show'), 10);

      try {
        const data = await this.fetchWikipediaData(term);
        this.updateTooltipContent(tooltip, data, term);
      } catch (error) {
        console.error('Failed to fetch Wikipedia data:', error);
        tooltip.innerHTML = '<div class="tooltip-loading">Failed to load data</div>';
      }
    }

    hideTooltip() {
      if (this.activeTooltip) {
        this.activeTooltip.classList.remove('show');
        setTimeout(() => {
          if (this.activeTooltip && this.activeTooltip.parentNode) {
            this.activeTooltip.parentNode.removeChild(this.activeTooltip);
          }
          this.activeTooltip = null;
        }, 200);
      }
    }

    async fetchWikipediaData(term) {
      // Check cache first
      if (this.cache.has(term)) {
        return this.cache.get(term);
      }

      try {
        // Use Wikipedia API
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Cache the result
        this.cache.set(term, data);
        
        return data;
      } catch (error) {
        console.error('Wikipedia API error:', error);
        throw error;
      }
    }

    updateTooltipContent(tooltip, data, term) {
      const title = data.title || term;
      const extract = data.extract || 'No summary available.';
      const url = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`;

      tooltip.innerHTML = `
        <div class="tooltip-title">${title}</div>
        <div class="tooltip-text">${extract}</div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="tooltip-link">
          Read more on Wikipedia →
        </a>
      `;
    }
  }

  // Initialize Wikipedia tooltips when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new WikipediaTooltip();
    });
  } else {
    new WikipediaTooltip();
  }

})();

