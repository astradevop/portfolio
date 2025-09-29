/**
 * Playground functionality
 * Handles interactive demos and experiments
 */

class PlaygroundManager {
    constructor() {
        this.todos = [];
        this.currentQuote = null;
        this.currentPalette = [];
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
            { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
            { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
            { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
            { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
            { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
            { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
        ];
        
        this.init();
    }
    
    init() {
        this.generatePalette();
        this.generateQuote();
        this.updateTodoCount();
        console.log('Playground initialized');
    }
    
    // Todo App Functionality
    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        
        if (!text) {
            PortfolioApp.showToast('Please enter a task', 'warning');
            return;
        }
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date()
        };
        
        this.todos.push(todo);
        this.renderTodos();
        this.updateTodoCount();
        input.value = '';
        
        // Show success message
        PortfolioApp.showToast('Task added successfully!', 'success');
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.renderTodos();
            this.updateTodoCount();
            
            const message = todo.completed ? 'Task completed! 🎉' : 'Task marked as incomplete';
            PortfolioApp.showToast(message, todo.completed ? 'success' : 'info');
        }
    }
    
    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.renderTodos();
        this.updateTodoCount();
        PortfolioApp.showToast('Task removed', 'info');
    }
    
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            PortfolioApp.showToast('No completed tasks to clear', 'info');
            return;
        }
        
        this.todos = this.todos.filter(t => !t.completed);
        this.renderTodos();
        this.updateTodoCount();
        PortfolioApp.showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'success');
    }
    
    renderTodos() {
        const container = document.getElementById('todo-list');
        if (!container) return;
        
        if (this.todos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.todos.map(todo => `
            <div class="todo-item flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${todo.completed ? 'opacity-75' : ''}">
                <input type="checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="playgroundManager.toggleTodo(${todo.id})"
                       class="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500">
                <span class="flex-1 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}">${todo.text}</span>
                <button onclick="playgroundManager.removeTodo(${todo.id})" 
                        class="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }
    
    updateTodoCount() {
        const remaining = this.todos.filter(t => !t.completed).length;
        const countElement = document.getElementById('todo-count');
        if (countElement) {
            countElement.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
        }
    }
    
    // Quote Generator Functionality
    generateQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.currentQuote = randomQuote;
        
        const quoteContent = document.getElementById('quote-content');
        if (quoteContent) {
            quoteContent.innerHTML = `
                <blockquote class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 italic">
                    "${randomQuote.text}"
                </blockquote>
                <cite class="text-primary-600 dark:text-primary-400 font-semibold">— ${randomQuote.author}</cite>
            `;
        }
        
        // Add loading effect to button
        const button = document.getElementById('quote-button');
        if (button) {
            button.disabled = true;
            button.textContent = 'Generating...';
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'New Quote';
            }, 500);
        }
    }
    
    shareQuote() {
        if (!this.currentQuote) return;
        
        const text = `"${this.currentQuote.text}" - ${this.currentQuote.author}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Inspirational Quote',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            this.copyToClipboard(text);
            PortfolioApp.showToast('Quote copied to clipboard!', 'success');
        }
    }
    
    // Color Palette Generator
    generatePalette() {
        // Generate a harmonious color palette
        const baseHue = Math.floor(Math.random() * 360);
        const colors = [];
        
        // Generate 5 colors with different saturations and lightness
        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + (i * 30)) % 360;
            const saturation = 60 + (i * 8);
            const lightness = 45 + (i * 10);
            
            const color = this.hslToHex(hue, saturation, lightness);
            colors.push(color);
        }
        
        this.currentPalette = colors;
        this.renderPalette();
    }
    
    renderPalette() {
        const container = document.getElementById('color-palette');
        const codesContainer = document.getElementById('color-codes');
        
        if (container) {
            container.innerHTML = this.currentPalette.map((color, index) => `
                <div class="relative group cursor-pointer" onclick="playgroundManager.copyColor('${color}')">
                    <div style="background-color: ${color}" 
                         class="w-full h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"></div>
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <span class="text-white text-xs font-medium">Copy</span>
                    </div>
                </div>
            `).join('');
        }
        
        if (codesContainer) {
            codesContainer.innerHTML = this.currentPalette.join(' • ');
        }
    }
    
    copyPalette() {
        if (this.currentPalette.length === 0) return;
        
        const paletteText = this.currentPalette.join(', ');
        this.copyToClipboard(paletteText);
        PortfolioApp.showToast('Palette copied to clipboard!', 'success');
    }
    
    copyColor(color) {
        this.copyToClipboard(color);
        PortfolioApp.showToast(`Color ${color} copied!`, 'success');
    }
    
    // Text Analyzer
    analyzeText() {
        const textInput = document.getElementById('text-input');
        if (!textInput) return;
        
        const text = textInput.value;
        
        // Calculate statistics
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
        
        // Update display
        document.getElementById('char-count').textContent = charCount.toLocaleString();
        document.getElementById('word-count').textContent = wordCount.toLocaleString();
        document.getElementById('sentence-count').textContent = sentenceCount.toLocaleString();
        document.getElementById('reading-time').textContent = readingTime;
    }
    
    // Utility Functions
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } catch (error) {
                console.error('Failed to copy text:', error);
            }
            
            textArea.remove();
        }
    }
}

// Initialize playground when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('todo-app')) {
        window.playgroundManager = new PlaygroundManager();
    }
});
