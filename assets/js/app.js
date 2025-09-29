/**
 * Static Portfolio App JavaScript
 * Handles theme toggling, animations, and dynamic content loading
 */

// Global app object
window.PortfolioApp = {
    theme: 'dark',
    isLoading: false,
    
    // Initialize the application
    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupToasts();
        this.loadDynamicContent();
        this.setupTypewriter();
        this.setupCounters();
        this.setupCarousel();
        this.setupContactForm();
        
        console.log('Portfolio app initialized');
    },
    
    // Theme management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme();
        
        // Theme toggle button
        const themeButton = document.getElementById('theme-button');
        if (themeButton) {
            themeButton.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    },
    
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    },
    
    applyTheme() {
        const html = document.documentElement;
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        if (this.theme === 'dark') {
            html.classList.add('dark');
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        } else {
            html.classList.remove('dark');
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        }
    },
    
    // Navigation setup
    setupNavigation() {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger');
        const closeIcon = document.getElementById('close');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isOpen = !mobileMenu.classList.contains('hidden');
                
                if (isOpen) {
                    mobileMenu.classList.add('hidden');
                    hamburger?.classList.remove('hidden');
                    closeIcon?.classList.add('hidden');
                } else {
                    mobileMenu.classList.remove('hidden');
                    hamburger?.classList.add('hidden');
                    closeIcon?.classList.remove('hidden');
                }
            });
        }
        
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    navbar.classList.add('navbar-scrolled');
                    navbar.style.backgroundColor = this.theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                    navbar.style.borderBottom = this.theme === 'dark' ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(229, 231, 235, 0.3)';
                } else {
                    navbar.classList.remove('navbar-scrolled');
                    navbar.style.backgroundColor = 'transparent';
                    navbar.style.backdropFilter = 'none';
                    navbar.style.borderBottom = 'none';
                }
                
                // Hide/show navbar on scroll (mobile)
                if (window.innerWidth < 768) {
                    if (currentScrollY > lastScrollY && currentScrollY > 200) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                }
                
                lastScrollY = currentScrollY;
            });
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    // Scroll effects
    setupScrollEffects() {
        // Scroll to top button
        const scrollToTopButton = document.getElementById('scroll-to-top');
        
        if (scrollToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    scrollToTopButton.classList.remove('opacity-0', 'translate-y-4');
                    scrollToTopButton.classList.add('opacity-100', 'translate-y-0');
                } else {
                    scrollToTopButton.classList.add('opacity-0', 'translate-y-4');
                    scrollToTopButton.classList.remove('opacity-100', 'translate-y-0');
                }
            });
            
            scrollToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Parallax effects (respect motion preferences)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.setupParallax();
        }
    },
    
    setupParallax() {
        const hero = document.getElementById('home');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const rate = scrolled * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    },
    
    // Animation setup
    setupAnimations() {
        // Intersection Observer for fade-up animations
        const observeElements = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements for animations
        document.querySelectorAll('.card, .tech-item, .project-card, .blog-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observeElements.observe(el);
        });
    },
    
    // Toast notification system
    setupToasts() {
        this.toastContainer = document.getElementById('toast-container') || this.createToastContainer();
    },
    
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
        return container;
    },
    
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        const bgColors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-orange-500',
            info: 'bg-blue-500'
        };
        
        toast.className = `${bgColors[type]} text-white p-4 rounded-xl shadow-lg max-w-md flex items-center space-x-3 transform translate-x-full transition-transform duration-300`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            ${icon}
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    getToastIcon(type) {
        const icons = {
            success: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
            info: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[type] || icons.info;
    },
    
    // Typewriter effect
    setupTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;
        
        const words = JSON.parse(typewriterElement.dataset.words);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, 50);
                }
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentWord.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        type();
                    }, 2000);
                } else {
                    setTimeout(type, 100);
                }
            }
        }
        
        type();
    },
    
    // Animate counters on scroll
    setupCounters() {
        const observeCounters = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const increment = target / 100;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.round(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observeCounters.unobserve(counter);
                }
            });
        });
        
        document.querySelectorAll('.counter').forEach(counter => {
            observeCounters.observe(counter);
        });
    },
    
    // Load dynamic content
    async loadDynamicContent() {
        await Promise.all([
            this.loadStats(),
            this.loadTechStack(),
            this.loadFeaturedProjects(),
            this.loadBlogPosts(),
            this.loadTestimonials()
        ]);
    },

    async loadStats() {
        try {
            const response = await fetch('/.netlify/functions/stats');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            this.renderStats(result.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
            // Fallback to default values
            this.renderStats({
                projects: 6,
                commits: 450,
                hours_coding: 1200,
                technologies: 12
            });
        }
    },

    renderStats(stats) {
        const container = document.getElementById('stats-container');
        if (!container) return;

        const statsHtml = [
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>`,
                count: stats.projects,
                label: 'Projects',
                gradient: 'from-primary-500 to-secondary-500'
            },
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`,
                count: stats.commits,
                label: 'Commits',
                gradient: 'from-green-500 to-teal-500'
            },
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
                count: stats.hours_coding,
                label: 'Hours Coding',
                gradient: 'from-orange-500 to-red-500'
            },
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>`,
                count: stats.technologies,
                label: 'Technologies',
                gradient: 'from-purple-500 to-pink-500'
            }
        ];

        container.innerHTML = statsHtml.map(stat => `
            <div class="text-center group">
                <div class="bg-gradient-to-r ${stat.gradient} p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${stat.icon}
                    </svg>
                </div>
                <div class="text-3xl font-bold text-gray-900 dark:text-white counter" data-target="${stat.count}">0</div>
                <div class="text-gray-600 dark:text-gray-400 font-medium">${stat.label}</div>
            </div>
        `).join('');

        // Initialize counter animations for new stats
        this.setupCounters();
    },
    
    async loadTechStack() {
        try {
            const response = await fetch('/.netlify/functions/tech-stack');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            // Convert database result to expected format
            const techStack = Object.values(result.data).flat();
            
            const container = document.getElementById('tech-stack-container');
            if (!container) return;
            
            container.innerHTML = techStack.map(tech => `
                <div class="tech-item" data-tech="${tech.name}">
                    <div class="relative z-10">
                        <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                            <span class="text-white font-bold text-lg">${tech.name.charAt(0)}</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">${tech.name}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">${tech.description}</p>
                        
                        <div class="mb-3">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs text-gray-500 dark:text-gray-400">Proficiency</span>
                                <span class="text-xs font-medium text-primary-600 dark:text-primary-400">${tech.proficiency}%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                     style="width: 0%" 
                                     data-width="${tech.proficiency}%"></div>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <span class="text-xs text-gray-500 dark:text-gray-400">${tech.category}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Animate proficiency bars
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('[data-width]');
                        bars.forEach((bar, index) => {
                            setTimeout(() => {
                                bar.style.width = bar.dataset.width;
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(container);
        } catch (error) {
            console.error('Failed to load tech stack:', error);
        }
    },
    
    async loadFeaturedProjects() {
        try {
            const response = await fetch('/.netlify/functions/projects?featured=true&limit=6');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const featuredProjects = result.data;
            
            const container = document.getElementById('featured-projects-container');
            if (!container) return;
            
            container.innerHTML = featuredProjects.map(project => `
                <div class="project-card group">
                    <div class="relative overflow-hidden rounded-xl">
                        <img src="${project.image || './assets/img/project-placeholder.jpg'}" 
                             alt="${project.title}" 
                             class="w-full h-48 object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                            <div class="flex space-x-2">
                                ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="px-3 py-1 bg-primary-600 text-white text-sm rounded-full hover:bg-primary-700">Live Demo</a>` : ''}
                                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="px-3 py-1 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-900">GitHub</a>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${project.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">${project.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${(project.technologies || []).slice(0, 3).map(tag => `
                                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full">${tag}</span>
                            `).join('')}
                        </div>
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            ${project.category}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load featured projects:', error);
        }
    },
    
    async loadBlogPosts() {
        try {
            const response = await fetch('/.netlify/functions/blog-posts?limit=4');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const recentPosts = result.data;
            
            const container = document.getElementById('blog-posts-container');
            if (!container) return;
            
            container.innerHTML = recentPosts.map(post => `
                <div class="blog-card">
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <time datetime="${post.published_at}">${new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                            <span class="mx-2">•</span>
                            <span>${post.read_time || '5'} min read</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">${post.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">${post.excerpt}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${(post.tags || []).slice(0, 2).map(tag => `
                                <span class="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 text-xs rounded-full">${tag}</span>
                            `).join('')}
                        </div>
                        <a href="${post.slug ? `blog/${post.slug}.html` : '#'}" class="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                            <span>Read More</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        }
    },
    
    async loadTestimonials() {
        try {
            const response = await fetch('/.netlify/functions/testimonials');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const testimonials = result.data;
            
            const container = document.getElementById('testimonials-container');
            const dotsContainer = document.getElementById('testimonial-dots');
            if (!container || !dotsContainer) return;
            
            container.innerHTML = `
                <div class="testimonials-track flex transition-transform duration-500 ease-in-out" id="testimonials-track">
                    ${testimonials.map(testimonial => `
                        <div class="testimonial-slide flex-shrink-0 w-full px-4">
                            <div class="max-w-4xl mx-auto">
                                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft text-center">
                                    <div class="mb-6">
                                        <svg class="w-12 h-12 text-primary-500 mx-auto opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <blockquote class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-8 leading-relaxed">
                                        "${testimonial.content}"
                                    </blockquote>
                                    <div class="flex items-center justify-center space-x-4">
                                        <img src="${testimonial.avatar || './assets/img/avatar-placeholder.svg'}" 
                                             alt="${testimonial.name}" 
                                             class="w-16 h-16 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
                                             onerror="this.src='./assets/img/avatar-placeholder.svg'">
                                        <div class="text-left">
                                            <div class="font-bold text-gray-900 dark:text-white">${testimonial.name}</div>
                                            <div class="text-sm text-gray-600 dark:text-gray-400">${testimonial.position}</div>
                                            <div class="text-sm text-primary-600 dark:text-primary-400">${testimonial.company}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            dotsContainer.innerHTML = testimonials.map((_, index) => `
                <button class="testimonial-dot w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors duration-200 ${index === 0 ? 'active bg-primary-500' : ''}"
                        data-slide="${index}"></button>
            `).join('');
            
            // Setup carousel functionality
            this.currentTestimonial = 0;
            this.testimonialCount = testimonials.length;
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        }
    },
    
    setupCarousel() {
        // Wait for testimonials to load
        setTimeout(() => {
            const track = document.getElementById('testimonials-track');
            const dots = document.querySelectorAll('.testimonial-dot');
            
            if (!track || !dots.length) return;
            
            this.currentTestimonial = 0;
            this.testimonialCount = dots.length;
            
            const showTestimonial = (index) => {
                this.currentTestimonial = index;
                const translateX = -index * 100;
                track.style.transform = `translateX(${translateX}%)`;
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                    dot.classList.toggle('bg-primary-500', i === index);
                    dot.classList.toggle('bg-gray-300', i !== index);
                });
            };
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showTestimonial(index));
            });
            
            // Auto-advance testimonials
            setInterval(() => {
                const nextIndex = (this.currentTestimonial + 1) % this.testimonialCount;
                showTestimonial(nextIndex);
            }, 5000);
        }, 1000);
    },
    
    // Contact form handling
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitButton = document.getElementById('contact-submit');
                const submitText = document.getElementById('submit-text');
                const submitIcon = document.getElementById('submit-icon');
                const submitSpinner = document.getElementById('submit-spinner');
                
                // Show loading state
                submitButton.disabled = true;
                submitText.textContent = 'Sending...';
                submitIcon.classList.add('hidden');
                submitSpinner.classList.remove('hidden');
                
                try {
                    const formData = new FormData(contactForm);
                    const data = {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    };

                    const response = await fetch('/.netlify/functions/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.showToast(result.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        this.showToast(result.error || 'Failed to send message. Please try again.', 'error');
                    }
                    
                } catch (error) {
                    this.showToast('Failed to send message. Please try again or contact me directly.', 'error');
                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitText.textContent = 'Send Message';
                    submitIcon.classList.remove('hidden');
                    submitSpinner.classList.add('hidden');
                }
            });
        }
    },
    
    // Utility functions
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
};

// Smooth scroll helper
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.init();
});

// Export for use in other scripts
window.App = PortfolioApp;
