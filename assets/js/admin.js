/**
 * Portfolio Admin Panel JavaScript
 * Handles CRUD operations for all portfolio data
 */

class AdminPanel {
    constructor() {
        this.currentSection = 'profile';
        this.currentItem = null;
        this.currentItemType = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadProfileData();
        this.showToast = this.showToast.bind(this);
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.admin-nav-item');
        const sections = document.querySelectorAll('.form-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const sectionId = e.target.dataset.section;
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');

                // Show corresponding section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(`${sectionId}-section`).classList.add('active');

                this.currentSection = sectionId;
                this.loadSectionData(sectionId);
            });
        });
    }

    setupEventListeners() {
        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Add buttons
        document.getElementById('add-project-btn')?.addEventListener('click', () => this.showModal('project'));
        document.getElementById('add-experience-btn')?.addEventListener('click', () => this.showModal('experience'));
        document.getElementById('add-education-btn')?.addEventListener('click', () => this.showModal('education'));
        document.getElementById('add-tech-btn')?.addEventListener('click', () => this.showModal('tech'));
        document.getElementById('add-service-btn')?.addEventListener('click', () => this.showModal('service'));
        document.getElementById('add-blog-btn')?.addEventListener('click', () => this.showModal('blog'));
        document.getElementById('add-testimonial-btn')?.addEventListener('click', () => this.showModal('testimonial'));

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
        document.getElementById('generic-modal').addEventListener('click', (e) => {
            if (e.target.id === 'generic-modal') this.hideModal();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('admin_token');
                window.location.href = 'admin-login.html';
            }
        });
    }

    async loadSectionData(section) {
        switch (section) {
            case 'projects':
                await this.loadProjects();
                break;
            case 'experience':
                await this.loadExperience();
                break;
            case 'education':
                await this.loadEducation();
                break;
            case 'tech-stack':
                await this.loadTechStack();
                break;
            case 'services':
                await this.loadServices();
                break;
            case 'blog':
                await this.loadBlogPosts();
                break;
            case 'testimonials':
                await this.loadTestimonials();
                break;
        }
    }

    // Profile Management
    async loadProfileData() {
        try {
            const response = await fetch('/.netlify/functions/admin-profile');
            const result = await response.json();
            
            if (result.success && result.data) {
                const profile = result.data;
                document.getElementById('profile-name').value = profile.name || '';
                document.getElementById('profile-title').value = profile.title || '';
                document.getElementById('profile-bio').value = profile.bio || '';
                document.getElementById('profile-email').value = profile.email || '';
                document.getElementById('profile-phone').value = profile.phone || '';
                document.getElementById('profile-location').value = profile.location || '';
                document.getElementById('profile-github').value = profile.github_url || '';
                document.getElementById('profile-linkedin').value = profile.linkedin_url || '';
                document.getElementById('profile-twitter').value = profile.twitter_url || '';
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            this.showToast('Failed to load profile data', 'error');
        }
    }

    async saveProfile() {
        const profileData = {
            name: document.getElementById('profile-name').value,
            title: document.getElementById('profile-title').value,
            bio: document.getElementById('profile-bio').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            location: document.getElementById('profile-location').value,
            github_url: document.getElementById('profile-github').value,
            linkedin_url: document.getElementById('profile-linkedin').value,
            twitter_url: document.getElementById('profile-twitter').value
        };

        try {
            const response = await fetch('/.netlify/functions/admin-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            
            const result = await response.json();
            if (result.success) {
                this.showToast('Profile saved successfully!', 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            this.showToast('Failed to save profile', 'error');
        }
    }

    // Projects Management
    async loadProjects() {
        try {
            const response = await fetch('/.netlify/functions/projects');
            const result = await response.json();
            
            if (result.success) {
                this.renderProjectsTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    renderProjectsTable(projects) {
        const tbody = document.getElementById('projects-table');
        tbody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.title}</td>
                <td>${project.category}</td>
                <td>${project.featured ? 'Yes' : 'No'}</td>
                <td>${project.is_published ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('project', ${project.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('project', ${project.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Experience Management
    async loadExperience() {
        try {
            const response = await fetch('/.netlify/functions/admin-experience');
            const result = await response.json();
            
            if (result.success) {
                this.renderExperienceTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load experience:', error);
        }
    }

    renderExperienceTable(experiences) {
        const tbody = document.getElementById('experience-table');
        tbody.innerHTML = experiences.map(exp => `
            <tr>
                <td>${exp.company}</td>
                <td>${exp.position}</td>
                <td>${this.formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</td>
                <td>${exp.is_current ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('experience', ${exp.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('experience', ${exp.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Education Management
    async loadEducation() {
        try {
            const response = await fetch('/.netlify/functions/admin-education');
            const result = await response.json();
            
            if (result.success) {
                this.renderEducationTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load education:', error);
        }
    }

    renderEducationTable(education) {
        const tbody = document.getElementById('education-table');
        tbody.innerHTML = education.map(edu => `
            <tr>
                <td>${edu.institution}</td>
                <td>${edu.degree}</td>
                <td>${edu.field_of_study || 'N/A'}</td>
                <td>${this.formatDateRange(edu.start_date, edu.end_date)}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('education', ${edu.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('education', ${edu.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Tech Stack Management
    async loadTechStack() {
        try {
            const response = await fetch('/.netlify/functions/tech-stack');
            const result = await response.json();
            
            if (result.success) {
                const techStack = Array.isArray(result.data) ? result.data : Object.values(result.data).flat();
                this.renderTechStackTable(techStack);
            }
        } catch (error) {
            console.error('Failed to load tech stack:', error);
        }
    }

    renderTechStackTable(techStack) {
        const tbody = document.getElementById('tech-stack-table');
        tbody.innerHTML = techStack.map(tech => `
            <tr>
                <td>${tech.name}</td>
                <td>${tech.category}</td>
                <td>${tech.proficiency}%</td>
                <td>${tech.is_active ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('tech', ${tech.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('tech', ${tech.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Services Management
    async loadServices() {
        try {
            const response = await fetch('/.netlify/functions/admin-services');
            const result = await response.json();
            
            if (result.success) {
                this.renderServicesTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load services:', error);
        }
    }

    renderServicesTable(services) {
        const tbody = document.getElementById('services-table');
        tbody.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.description.substring(0, 50)}...</td>
                <td>${service.is_active ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('service', ${service.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('service', ${service.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Blog Management
    async loadBlogPosts() {
        try {
            const response = await fetch('/.netlify/functions/blog-posts');
            const result = await response.json();
            
            if (result.success) {
                this.renderBlogTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        }
    }

    renderBlogTable(posts) {
        const tbody = document.getElementById('blog-table');
        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.status}</td>
                <td>${new Date(post.published_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('blog', ${post.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('blog', ${post.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Testimonials Management
    async loadTestimonials() {
        try {
            const response = await fetch('/.netlify/functions/testimonials');
            const result = await response.json();
            
            if (result.success) {
                this.renderTestimonialsTable(result.data);
            }
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        }
    }

    renderTestimonialsTable(testimonials) {
        const tbody = document.getElementById('testimonials-table');
        tbody.innerHTML = testimonials.map(testimonial => `
            <tr>
                <td>${testimonial.name}</td>
                <td>${testimonial.company}</td>
                <td>${testimonial.rating}/5</td>
                <td>${testimonial.is_featured ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-admin btn-secondary mr-2" onclick="adminPanel.editItem('testimonial', ${testimonial.id})">Edit</button>
                    <button class="btn-admin btn-danger" onclick="adminPanel.deleteItem('testimonial', ${testimonial.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Modal Management
    showModal(type, data = null) {
        this.currentItemType = type;
        this.currentItem = data;
        
        const modal = document.getElementById('generic-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        title.textContent = data ? `Edit ${this.capitalizeFirst(type)}` : `Add New ${this.capitalizeFirst(type)}`;
        body.innerHTML = this.getModalForm(type, data);
        
        modal.classList.add('show');
    }

    hideModal() {
        document.getElementById('generic-modal').classList.remove('show');
        this.currentItem = null;
        this.currentItemType = null;
    }

    getModalForm(type, data) {
        switch (type) {
            case 'project':
                return this.getProjectForm(data);
            case 'experience':
                return this.getExperienceForm(data);
            case 'education':
                return this.getEducationForm(data);
            case 'tech':
                return this.getTechForm(data);
            case 'service':
                return this.getServiceForm(data);
            case 'blog':
                return this.getBlogForm(data);
            case 'testimonial':
                return this.getTestimonialForm(data);
            default:
                return '<p>Form not implemented yet.</p>';
        }
    }

    getProjectForm(data) {
        const project = data || {};
        return `
            <form id="item-form">
                <div class="space-y-4">
                    <div>
                        <label class="form-label">Title</label>
                        <input type="text" name="title" class="form-input" value="${project.title || ''}" required>
                    </div>
                    <div>
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-input" rows="4">${project.description || ''}</textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Category</label>
                            <select name="category" class="form-input">
                                <option value="web" ${project.category === 'web' ? 'selected' : ''}>Web</option>
                                <option value="mobile" ${project.category === 'mobile' ? 'selected' : ''}>Mobile</option>
                                <option value="fintech" ${project.category === 'fintech' ? 'selected' : ''}>FinTech</option>
                                <option value="other" ${project.category === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Image URL</label>
                            <input type="url" name="image" class="form-input" value="${project.image || ''}">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">GitHub URL</label>
                            <input type="url" name="github_url" class="form-input" value="${project.github_url || ''}">
                        </div>
                        <div>
                            <label class="form-label">Demo URL</label>
                            <input type="url" name="demo_url" class="form-input" value="${project.demo_url || ''}">
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Technologies (comma-separated)</label>
                        <input type="text" name="technologies" class="form-input" 
                               value="${project.technologies ? project.technologies.join(', ') : ''}">
                    </div>
                    <div class="flex space-x-4">
                        <label class="flex items-center">
                            <input type="checkbox" name="featured" ${project.featured ? 'checked' : ''}>
                            <span class="ml-2">Featured</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_published" ${project.is_published !== false ? 'checked' : ''}>
                            <span class="ml-2">Published</span>
                        </label>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-6">
                    <button type="button" class="btn-admin btn-secondary" onclick="adminPanel.hideModal()">Cancel</button>
                    <button type="submit" class="btn-admin btn-primary">Save</button>
                </div>
            </form>
        `;
    }

    getExperienceForm(data) {
        const exp = data || {};
        return `
            <form id="item-form">
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Company</label>
                            <input type="text" name="company" class="form-input" value="${exp.company || ''}" required>
                        </div>
                        <div>
                            <label class="form-label">Position</label>
                            <input type="text" name="position" class="form-input" value="${exp.position || ''}" required>
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-input" rows="4">${exp.description || ''}</textarea>
                    </div>
                    <div>
                        <label class="form-label">Technologies (comma-separated)</label>
                        <input type="text" name="technologies" class="form-input" 
                               value="${exp.technologies ? exp.technologies.join(', ') : ''}">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Start Date</label>
                            <input type="date" name="start_date" class="form-input" value="${exp.start_date || ''}">
                        </div>
                        <div>
                            <label class="form-label">End Date</label>
                            <input type="date" name="end_date" class="form-input" value="${exp.end_date || ''}" ${exp.is_current ? 'disabled' : ''}>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_current" ${exp.is_current ? 'checked' : ''} onchange="document.querySelector('[name=end_date]').disabled = this.checked; if(this.checked) document.querySelector('[name=end_date]').value = '';">
                            <span class="ml-2">Current Position</span>
                        </label>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-6">
                    <button type="button" class="btn-admin btn-secondary" onclick="adminPanel.hideModal()">Cancel</button>
                    <button type="submit" class="btn-admin btn-primary">Save</button>
                </div>
            </form>
        `;
    }

    // Additional form methods would go here...
    getTechForm(data) {
        const tech = data || {};
        return `
            <form id="item-form">
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Name</label>
                            <input type="text" name="name" class="form-input" value="${tech.name || ''}" required>
                        </div>
                        <div>
                            <label class="form-label">Category</label>
                            <select name="category" class="form-input">
                                <option value="frontend" ${tech.category === 'frontend' ? 'selected' : ''}>Frontend</option>
                                <option value="backend" ${tech.category === 'backend' ? 'selected' : ''}>Backend</option>
                                <option value="database" ${tech.category === 'database' ? 'selected' : ''}>Database</option>
                                <option value="tools" ${tech.category === 'tools' ? 'selected' : ''}>Tools</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-input" rows="3">${tech.description || ''}</textarea>
                    </div>
                    <div>
                        <label class="form-label">Proficiency (%)</label>
                        <input type="number" name="proficiency" class="form-input" min="0" max="100" value="${tech.proficiency || 80}">
                    </div>
                    <div>
                        <label class="form-label">Icon Class</label>
                        <input type="text" name="icon" class="form-input" value="${tech.icon || ''}" placeholder="e.g., devicon-react-original">
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_active" ${tech.is_active !== false ? 'checked' : ''}>
                            <span class="ml-2">Active</span>
                        </label>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-6">
                    <button type="button" class="btn-admin btn-secondary" onclick="adminPanel.hideModal()">Cancel</button>
                    <button type="submit" class="btn-admin btn-primary">Save</button>
                </div>
            </form>
        `;
    }

    // Generic save item method
    async saveItem() {
        const form = document.getElementById('item-form');
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key === 'technologies' && value) {
                data[key] = value.split(',').map(item => item.trim());
            } else if (form.querySelector(`[name="${key}"][type="checkbox"]`)) {
                data[key] = form.querySelector(`[name="${key}"]`).checked;
            } else {
                data[key] = value;
            }
        }

        try {
            const endpoint = `/.netlify/functions/admin-${this.currentItemType}`;
            const method = this.currentItem ? 'PUT' : 'POST';
            const url = this.currentItem ? `${endpoint}?id=${this.currentItem.id}` : endpoint;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                this.showToast(`${this.capitalizeFirst(this.currentItemType)} saved successfully!`, 'success');
                this.hideModal();
                this.loadSectionData(this.currentSection);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to save item:', error);
            this.showToast('Failed to save item', 'error');
        }
    }

    async editItem(type, id) {
        try {
            const response = await fetch(`/.netlify/functions/admin-${type}?id=${id}`);
            const result = await response.json();
            
            if (result.success) {
                this.showModal(type, result.data);
            }
        } catch (error) {
            console.error('Failed to load item:', error);
            this.showToast('Failed to load item', 'error');
        }
    }

    async deleteItem(type, id) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`/.netlify/functions/admin-${type}?id=${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                this.showToast('Item deleted successfully!', 'success');
                this.loadSectionData(this.currentSection);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
            this.showToast('Failed to delete item', 'error');
        }
    }

    // Utility methods
    formatDateRange(startDate, endDate, isCurrent = false) {
        const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (isCurrent) return `${start} - Present`;
        const end = endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
        return `${start} - ${end}`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-orange-500'
        };

        toast.className = `fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Placeholder methods for other forms
    getEducationForm(data) { return '<p>Education form - to be implemented</p>'; }
    getServiceForm(data) { return '<p>Service form - to be implemented</p>'; }
    getBlogForm(data) { return '<p>Blog form - to be implemented</p>'; }
    getTestimonialForm(data) { return '<p>Testimonial form - to be implemented</p>'; }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Handle form submissions in modals
document.addEventListener('submit', (e) => {
    if (e.target.id === 'item-form') {
        e.preventDefault();
        adminPanel.saveItem();
    }
});
