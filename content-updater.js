// SIMPLE CONTENT UPDATER for GitHub Pages
class ContentUpdater {
    constructor() {
        this.contentData = null;
        this.init();
    }
    
    async init() {
        console.log('ContentUpdater: Starting...');
        
        // Try to load from localStorage first (for admin previews)
        this.loadFromLocalStorage();
        
        // If no localStorage data, extract from HTML
        if (!this.contentData) {
            this.extractFromHTML();
        }
        
        // Apply updates immediately
        this.updateAllContent();
        
        // Setup periodic check
        this.setupAutoCheck();
        
        console.log('ContentUpdater: Ready');
    }
    
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('travel_blog_content');
            if (saved) {
                this.contentData = JSON.parse(saved);
                console.log('Loaded from localStorage');
                return true;
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
        return false;
    }
    
    extractFromHTML() {
        // Create basic structure from current page content
        this.contentData = {
            home: {
                title: this.getText('#home h2') || 'Welcome to My Travel Blog',
                about1: this.getText('#home .card p:nth-child(1)') || 'About paragraph 1',
                about2: this.getText('#home .card p:nth-child(2)') || 'About paragraph 2',
                about3: this.getText('#home .card p:nth-child(3)') || 'About paragraph 3'
            },
            // Add more sections as needed
            lastUpdated: new Date().toISOString()
        };
    }
    
    getText(selector) {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
    }
    
    updateAllContent() {
        if (!this.contentData) return;
        
        // Update home section
        this.updateElement('#home h2', this.contentData.home?.title);
        
        // Update about paragraphs
        this.updateElement('#home .card p:nth-child(1)', this.contentData.home?.about1);
        this.updateElement('#home .card p:nth-child(2)', this.contentData.home?.about2);
        this.updateElement('#home .card p:nth-child(3)', this.contentData.home?.about3);
        
        // Update featured destination cards
        this.updateCards('#home .grid .card', this.contentData.featuredCards);
        
        console.log('Content updated');
    }
    
    updateElement(selector, content) {
        if (!content) return;
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = content;
        }
    }
    
    updateCards(selector, cardsData) {
        const cards = document.querySelectorAll(selector);
        if (!cardsData || cards.length === 0) return;
        
        // Update each card if we have data for it
        cards.forEach((card, index) => {
            const cardKey = ['europe', 'asia', 'america'][index];
            if (cardsData && cardsData[cardKey]) {
                const title = card.querySelector('h3');
                const desc = card.querySelector('p');
                
                if (title && cardsData[cardKey].title) {
                    title.textContent = cardsData[cardKey].title;
                }
                if (desc && cardsData[cardKey].description) {
                    desc.textContent = cardsData[cardKey].description;
                }
            }
        });
    }
    
    setupAutoCheck() {
        // Check for updates every 30 seconds
        setInterval(() => {
            if (this.loadFromLocalStorage()) {
                this.updateAllContent();
                console.log('Checked for updates');
            }
        }, 30000);
        
        // Listen for storage events (when admin saves)
        window.addEventListener('storage', (e) => {
            if (e.key === 'travel_blog_content') {
                console.log('Storage event detected, updating content...');
                this.loadFromLocalStorage();
                this.updateAllContent();
                this.showNotification('Content updated!');
            }
        });
    }
    
    showNotification(message) {
        // Create and show notification
        const note = document.createElement('div');
        note.textContent = message;
        note.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contentUpdater = new ContentUpdater();
});