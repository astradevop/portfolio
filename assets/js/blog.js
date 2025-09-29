/**
 * Blog page functionality
 * Handles blog post filtering, search, and display
 */

class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilters = {
            search: '',
            tag: ''
        };
        this.init();
    }
    
    async init() {
        await this.loadPosts();
        this.setupEventListeners();
        this.applyFilters();
    }
    
    async loadPosts() {
        try {
            const response = await fetch('/.netlify/functions/blog-posts');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            this.posts = result.data;
            this.filteredPosts = [...this.posts];
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            PortfolioApp.showToast('Failed to load blog posts', 'error');
        }
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentFilters.search = searchInput.value.trim().toLowerCase();
                this.applyFilters();
            }, 300));
        }
        
        // Tag filter
        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) {
            tagFilter.addEventListener('change', () => {
                this.currentFilters.tag = tagFilter.value;
                this.applyFilters();
            });
        }
        
        // Clear filters button
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.posts];
        
        // Apply search filter
        if (this.currentFilters.search) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(this.currentFilters.search) ||
                post.excerpt.toLowerCase().includes(this.currentFilters.search) ||
                (post.tags || []).some(tag => tag.toLowerCase().includes(this.currentFilters.search))
            );
        }
        
        // Apply tag filter
        if (this.currentFilters.tag) {
            filtered = filtered.filter(post => 
                (post.tags || []).includes(this.currentFilters.tag)
            );
        }
        
        // Sort by published date (most recent first)
        filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        
        this.filteredPosts = filtered;
        this.updateDisplay();
        this.updateActiveFilters();
        this.updateURL();
    }
    
    updateDisplay() {
        const container = document.getElementById('blog-posts-container');
        const resultsCount = document.getElementById('results-count');
        const pluralS = document.getElementById('plural-s');
        const noResults = document.getElementById('no-results');
        
        if (!container) return;
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = this.filteredPosts.length;
        }
        if (pluralS) {
            pluralS.textContent = this.filteredPosts.length === 1 ? '' : 's';
        }
        
        // Show/hide no results message
        if (noResults) {
            if (this.filteredPosts.length === 0) {
                noResults.classList.remove('hidden');
                container.classList.add('hidden');
            } else {
                noResults.classList.add('hidden');
                container.classList.remove('hidden');
            }
        }
        
        // Render posts
        container.innerHTML = this.filteredPosts.map(post => this.renderPostCard(post)).join('');
    }
    
    renderPostCard(post) {
        const publishedDate = new Date(post.published_at);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <article class="blog-card bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group">
                <div class="p-8">
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <time datetime="${post.published_at}" class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </time>
                        <span class="mx-3">•</span>
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${post.read_time || 5} min read
                        </span>
                        ${post.views ? `
                            <span class="mx-3">•</span>
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                ${post.views.toLocaleString()} views
                            </span>
                        ` : ''}
                    </div>
                    
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                        <a href="#" onclick="blogManager.showPostDetails('${post.slug}'); return false;" class="hover:underline">
                            ${post.title}
                        </a>
                    </h2>
                    
                    <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                        ${post.excerpt}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${(post.tags || []).map(tag => `
                            <span class="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 text-sm rounded-full font-medium cursor-pointer hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition-colors"
                                  onclick="blogManager.filterByTag('${tag}')">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                                    AN
                                </div>
                                <div class="ml-3">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">Akash Nair</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">Full-Stack Developer</div>
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="blogManager.showPostDetails('${post.slug}')" 
                                class="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors group">
                            <span>Read Article</span>
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
    
    updateActiveFilters() {
        const container = document.getElementById('active-filters');
        if (!container) return;
        
        const filters = [];
        
        if (this.currentFilters.search) {
            filters.push({
                type: 'search',
                label: `Search: "${this.currentFilters.search}"`,
                value: this.currentFilters.search
            });
        }
        
        if (this.currentFilters.tag) {
            filters.push({
                type: 'tag',
                label: `Topic: ${this.currentFilters.tag}`,
                value: this.currentFilters.tag
            });
        }
        
        if (filters.length > 0) {
            container.innerHTML = filters.map(filter => `
                <div class="chip bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 text-sm">
                    <span>${filter.label}</span>
                    <button onclick="blogManager.removeFilter('${filter.type}')" class="ml-2 hover:text-primary-900 dark:hover:text-primary-100">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }
    
    removeFilter(type) {
        switch (type) {
            case 'search':
                this.currentFilters.search = '';
                document.getElementById('search-input').value = '';
                break;
            case 'tag':
                this.currentFilters.tag = '';
                document.getElementById('tag-filter').value = '';
                break;
        }
        this.applyFilters();
    }
    
    clearFilters() {
        this.currentFilters = {
            search: '',
            tag: ''
        };
        
        // Update form inputs
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        
        if (searchInput) searchInput.value = '';
        if (tagFilter) tagFilter.value = '';
        
        this.applyFilters();
    }
    
    filterByTag(tag) {
        this.currentFilters.tag = tag;
        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) tagFilter.value = tag;
        this.applyFilters();
    }
    
    showPostDetails(slug) {
        const post = this.posts.find(p => p.slug === slug);
        if (!post) return;
        
        const publishedDate = new Date(post.published_at);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create a modal with the full article
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            AN
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900 dark:text-white">Akash Nair</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">${formattedDate} • ${post.read_time || 5} min read</div>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">${post.title}</h1>
                        <div class="flex flex-wrap gap-2">
                            ${(post.tags || []).map(tag => `
                                <span class="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 text-sm rounded-full font-medium">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="prose dark:prose-invert max-w-none">
                        <div class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-medium">
                            ${post.excerpt}
                        </div>
                        <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            ${this.renderMarkdown(post.content || 'Full content would be loaded from the database...')}
                        </div>
                    </div>
                    
                    ${post.views ? `
                        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                ${post.views.toLocaleString()} views
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close modal on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    renderMarkdown(markdown) {
        // Simple markdown renderer - for a production app, you'd use a proper markdown parser
        let html = markdown
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-white">$1</h3>')
            .replace(/^\- (.*$)/gim, '<li class="mb-1">$1</li>')
            .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
            .replace(/```([\\s\\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto mb-4"><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n\n/gim, '</p><p class="mb-4">');
        
        // Wrap in paragraph tags and handle lists
        html = '<p class="mb-4">' + html + '</p>';
        html = html.replace(/(<li.*<\/li>)/gim, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>');
        
        return html;
    }
    
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.search) params.set('search', this.currentFilters.search);
        if (this.currentFilters.tag) params.set('tag', this.currentFilters.tag);
        
        const newURL = params.toString() ? 
            `${window.location.pathname}?${params}` : 
            window.location.pathname;
        
        window.history.replaceState({}, '', newURL);
    }
    
    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        this.currentFilters.search = params.get('search') || '';
        this.currentFilters.tag = params.get('tag') || '';
        
        // Update form inputs
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        
        if (searchInput) searchInput.value = this.currentFilters.search;
        if (tagFilter) tagFilter.value = this.currentFilters.tag;
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog-posts-container')) {
        window.blogManager = new BlogManager();
        // Load filters from URL after initialization
        setTimeout(() => {
            if (window.blogManager) {
                blogManager.loadFiltersFromURL();
                blogManager.applyFilters();
            }
        }, 100);
    }
});
