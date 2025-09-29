/**
 * Projects page functionality
 * Handles project filtering, search, and display
 */

class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            search: '',
            tag: '',
            sort: 'recent'
        };
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.setupEventListeners();
        this.applyFilters();
    }
    
    async loadProjects() {
        try {
            const response = await fetch('./assets/data/projects.json');
            this.projects = await response.json();
            this.filteredProjects = [...this.projects];
        } catch (error) {
            console.error('Failed to load projects:', error);
            PortfolioApp.showToast('Failed to load projects', 'error');
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
        
        // Sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.currentFilters.sort = sortFilter.value;
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
        let filtered = [...this.projects];
        
        // Apply search filter
        if (this.currentFilters.search) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(this.currentFilters.search) ||
                project.summary.toLowerCase().includes(this.currentFilters.search) ||
                project.tech_tags.some(tag => tag.toLowerCase().includes(this.currentFilters.search))
            );
        }
        
        // Apply tag filter
        if (this.currentFilters.tag) {
            filtered = filtered.filter(project => 
                project.tech_tags.includes(this.currentFilters.tag)
            );
        }
        
        // Apply sorting
        switch (this.currentFilters.sort) {
            case 'featured':
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.id - a.id; // Then by recent
                });
                break;
            case 'stars':
                filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
                break;
            case 'recent':
            default:
                filtered.sort((a, b) => b.id - a.id);
                break;
        }
        
        this.filteredProjects = filtered;
        this.updateDisplay();
        this.updateActiveFilters();
        this.updateURL();
    }
    
    updateDisplay() {
        const container = document.getElementById('projects-container');
        const resultsCount = document.getElementById('results-count');
        const noResults = document.getElementById('no-results');
        
        if (!container) return;
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = this.filteredProjects.length;
        }
        
        // Show/hide no results message
        if (noResults) {
            if (this.filteredProjects.length === 0) {
                noResults.classList.remove('hidden');
                container.classList.add('hidden');
            } else {
                noResults.classList.add('hidden');
                container.classList.remove('hidden');
            }
        }
        
        // Render projects
        container.innerHTML = this.filteredProjects.map(project => this.renderProjectCard(project)).join('');
    }
    
    renderProjectCard(project) {
        return `
            <div class="project-card group" data-project="${project.id}">
                <div class="relative overflow-hidden rounded-xl">
                    <img src="${project.image || './assets/img/project-placeholder.jpg'}" 
                         alt="${project.title}" 
                         class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                         onerror="this.src='./assets/img/project-placeholder.jpg'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <div class="flex space-x-2">
                            ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-primary-600 text-white text-sm rounded-full hover:bg-primary-700 transition-colors">Live Demo</a>` : ''}
                            ${project.repo_url ? `<a href="${project.repo_url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-900 transition-colors">GitHub</a>` : ''}
                        </div>
                    </div>
                    ${project.featured ? '<div class="absolute top-4 right-4 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">Featured</div>' : ''}
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        ${project.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        ${project.summary}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tech_tags.slice(0, 4).map(tag => `
                            <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full font-medium cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                  onclick="projectsManager.filterByTag('${tag}')">${tag}</span>
                        `).join('')}
                        ${project.tech_tags.length > 4 ? `<span class="text-xs text-gray-500 dark:text-gray-400">+${project.tech_tags.length - 4} more</span>` : ''}
                    </div>
                    <div class="flex items-center justify-between">
                        ${project.stars ? `
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <svg class="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                ${project.stars}
                            </div>
                        ` : '<div></div>'}
                        <button onclick="projectsManager.showProjectDetails('${project.slug}')" 
                                class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors">
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
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
                label: `Tech: ${this.currentFilters.tag}`,
                value: this.currentFilters.tag
            });
        }
        
        if (this.currentFilters.sort !== 'recent') {
            const sortLabels = {
                'featured': 'Featured First',
                'stars': 'Most Popular'
            };
            filters.push({
                type: 'sort',
                label: `Sort: ${sortLabels[this.currentFilters.sort]}`,
                value: this.currentFilters.sort
            });
        }
        
        if (filters.length > 0) {
            container.innerHTML = filters.map(filter => `
                <div class="chip bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 text-sm">
                    <span>${filter.label}</span>
                    <button onclick="projectsManager.removeFilter('${filter.type}')" class="ml-2 hover:text-primary-900 dark:hover:text-primary-100">
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
            case 'sort':
                this.currentFilters.sort = 'recent';
                document.getElementById('sort-filter').value = 'recent';
                break;
        }
        this.applyFilters();
    }
    
    clearFilters() {
        this.currentFilters = {
            search: '',
            tag: '',
            sort: 'recent'
        };
        
        // Update form inputs
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (searchInput) searchInput.value = '';
        if (tagFilter) tagFilter.value = '';
        if (sortFilter) sortFilter.value = 'recent';
        
        this.applyFilters();
    }
    
    filterByTag(tag) {
        this.currentFilters.tag = tag;
        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) tagFilter.value = tag;
        this.applyFilters();
    }
    
    showProjectDetails(slug) {
        const project = this.projects.find(p => p.slug === slug);
        if (!project) return;
        
        // Create a simple modal with project details
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${project.title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <img src="${project.image || './assets/img/project-placeholder.jpg'}" 
                         alt="${project.title}" 
                         class="w-full h-64 object-cover rounded-xl mb-6"
                         onerror="this.src='./assets/img/project-placeholder.jpg'">
                    <div class="prose dark:prose-invert max-w-none mb-6">
                        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">${project.summary}</p>
                    </div>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${project.tech_tags.map(tag => `
                            <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm rounded-full font-medium">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="flex space-x-4">
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn-neuro bg-primary-600 hover:bg-primary-700 text-white px-6 py-3">Live Demo</a>` : ''}
                        ${project.repo_url ? `<a href="${project.repo_url}" target="_blank" rel="noopener noreferrer" class="btn-neuro bg-gray-800 hover:bg-gray-900 text-white px-6 py-3">View Code</a>` : ''}
                    </div>
                    ${project.stars ? `
                        <div class="flex items-center mt-4 text-gray-500 dark:text-gray-400">
                            <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            ${project.stars} stars on GitHub
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
    
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.search) params.set('search', this.currentFilters.search);
        if (this.currentFilters.tag) params.set('tag', this.currentFilters.tag);
        if (this.currentFilters.sort !== 'recent') params.set('sort', this.currentFilters.sort);
        
        const newURL = params.toString() ? 
            `${window.location.pathname}?${params}` : 
            window.location.pathname;
        
        window.history.replaceState({}, '', newURL);
    }
    
    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        this.currentFilters.search = params.get('search') || '';
        this.currentFilters.tag = params.get('tag') || '';
        this.currentFilters.sort = params.get('sort') || 'recent';
        
        // Update form inputs
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (searchInput) searchInput.value = this.currentFilters.search;
        if (tagFilter) tagFilter.value = this.currentFilters.tag;
        if (sortFilter) sortFilter.value = this.currentFilters.sort;
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

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('projects-container')) {
        window.projectsManager = new ProjectsManager();
        // Load filters from URL after initialization
        projectsManager.loadFiltersFromURL();
    }
});
