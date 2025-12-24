// CONTENT UPDATER - Uses localStorage ONLY (no file downloads)
class ContentUpdater {
    constructor() {
        this.contentData = null;
        this.init();
    }
    
    async init() {
        // Check preview mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.has('preview');
        
        if (isPreview) {
            this.enablePreviewMode();
        }
        
        // Load content from localStorage
        this.loadContent();
        
        // Update ALL page content
        this.updateAllContent();
        
        // Setup auto-refresh
        this.setupAutoRefresh();
        
        console.log('Content updater initialized');
    }
    
    loadContent() {
        try {
            // Load from localStorage (set by admin editor)
            const savedContent = localStorage.getItem('travel_blog_live_content');
            
            if (savedContent) {
                this.contentData = JSON.parse(savedContent);
                console.log('Content loaded from localStorage');
            } else {
                // No saved content, use page defaults
                console.log('No saved content, using page defaults');
                this.contentData = this.extractCurrentContent();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentData = this.extractCurrentContent();
        }
    }
    
    extractCurrentContent() {
        // Extract current text from page as fallback
        return {
            home: {
                title: document.querySelector('#home h2')?.textContent || 'Welcome to My Travel Blog',
                about1: 'This is my travel blog where I share my adventures.',
                about2: 'Join me as I explore the world one destination at a time.',
                about3: 'From breathtaking landscapes to cultural experiences.'
            },
            lastUpdated: new Date().toISOString()
        };
    }
    
    updateAllContent() {
        if (!this.contentData) return;
        
        // Update HOME PAGE
        this.updateHomePage();
        
        // Update ALL DESTINATIONS
        this.updateAllDestinations();
        
        // Update ALL STORIES
        this.updateAllStories();
        
        // Update SUNRISE & SUNSET
        this.updateSunriseSunset();
        
        // Update OVERNIGHT STAYS
        this.updateOvernightStays();
        
        // Update CONTACT & FOOTER
        this.updateContactFooter();
        
        console.log('Page content updated');
    }
    
    updateHomePage() {
        // Main Title
        const mainTitle = document.querySelector('#home h2');
        if (mainTitle && this.contentData.home?.title) {
            mainTitle.textContent = this.contentData.home.title;
        }
        
        // About Me paragraphs
        const aboutCard = document.querySelector('#home .card');
        if (aboutCard && this.contentData.home) {
            const paragraphs = aboutCard.querySelectorAll('p');
            
            if (paragraphs.length >= 1 && this.contentData.home.about1) {
                paragraphs[0].innerHTML = this.formatText(this.contentData.home.about1);
            }
            if (paragraphs.length >= 2 && this.contentData.home.about2) {
                paragraphs[1].innerHTML = this.formatText(this.contentData.home.about2);
            }
            if (paragraphs.length >= 3 && this.contentData.home.about3) {
                paragraphs[2].innerHTML = this.formatText(this.contentData.home.about3);
            }
        }
        
        // Featured Destination Cards
        this.updateFeaturedCards();
        
        // Cuisine Cards
        this.updateCuisineCards();
        
        // Recent Stories on Home
        this.updateHomeStories();
    }
    
    updateFeaturedCards() {
        const cards = document.querySelectorAll('#home .grid .card');
        
        // Europe Card
        if (cards[0] && this.contentData.featuredCards?.europe) {
            const title = cards[0].querySelector('h3');
            const desc = cards[0].querySelector('p');
            if (title) title.textContent = this.contentData.featuredCards.europe.title;
            if (desc) desc.textContent = this.contentData.featuredCards.europe.description;
        }
        
        // Asia Card
        if (cards[1] && this.contentData.featuredCards?.asia) {
            const title = cards[1].querySelector('h3');
            const desc = cards[1].querySelector('p');
            if (title) title.textContent = this.contentData.featuredCards.asia.title;
            if (desc) desc.textContent = this.contentData.featuredCards.asia.description;
        }
        
        // America Card
        if (cards[2] && this.contentData.featuredCards?.america) {
            const title = cards[2].querySelector('h3');
            const desc = cards[2].querySelector('p');
            if (title) title.textContent = this.contentData.featuredCards.america.title;
            if (desc) desc.textContent = this.contentData.featuredCards.america.description;
        }
    }
    
    updateCuisineCards() {
        // Find cuisine section
        const cuisineSection = document.querySelector('#home h3.section-subtitle');
        if (!cuisineSection || !cuisineSection.textContent.includes('Cuisine')) return;
        
        let nextElement = cuisineSection.nextElementSibling;
        while (nextElement && !nextElement.classList.contains('grid')) {
            nextElement = nextElement.nextElementSibling;
        }
        
        if (nextElement && nextElement.classList.contains('grid')) {
            const cards = nextElement.querySelectorAll('.card');
            
            // Western Cuisine
            if (cards[0] && this.contentData.cuisineCards?.west) {
                const title = cards[0].querySelector('h3');
                const desc = cards[0].querySelector('p');
                if (title) title.textContent = this.contentData.cuisineCards.west.title;
                if (desc) desc.textContent = this.contentData.cuisineCards.west.description;
            }
            
            // Eastern Cuisine
            if (cards[1] && this.contentData.cuisineCards?.east) {
                const title = cards[1].querySelector('h3');
                const desc = cards[1].querySelector('p');
                if (title) title.textContent = this.contentData.cuisineCards.east.title;
                if (desc) desc.textContent = this.contentData.cuisineCards.east.description;
            }
        }
    }
    
    updateHomeStories() {
        // Find recent stories section
        const storiesSection = document.querySelector('#home h3.section-subtitle');
        if (!storiesSection || !storiesSection.textContent.includes('Recent')) return;
        
        let nextElement = storiesSection.nextElementSibling;
        while (nextElement && !nextElement.classList.contains('grid')) {
            nextElement = nextElement.nextElementSibling;
        }
        
        if (nextElement && nextElement.classList.contains('grid')) {
            const cards = nextElement.querySelectorAll('.card');
            
            // Story 1
            if (cards[0] && this.contentData.homeStories?.story1) {
                const title = cards[0].querySelector('h3');
                const desc = cards[0].querySelector('p:nth-child(2)');
                const date = cards[0].querySelector('p:last-child');
                
                if (title) title.textContent = this.contentData.homeStories.story1.title;
                if (desc) desc.textContent = this.contentData.homeStories.story1.description;
                if (date) date.textContent = this.contentData.homeStories.story1.date;
            }
            
            // Story 2
            if (cards[1] && this.contentData.homeStories?.story2) {
                const title = cards[1].querySelector('h3');
                const desc = cards[1].querySelector('p:nth-child(2)');
                const date = cards[1].querySelector('p:last-child');
                
                if (title) title.textContent = this.contentData.homeStories.story2.title;
                if (desc) desc.textContent = this.contentData.homeStories.story2.description;
                if (date) date.textContent = this.contentData.homeStories.story2.date;
            }
        }
    }
    
    updateAllDestinations() {
        // EUROPE
        this.updateDestinationSection('europe', 'Roman Colosseum');
        
        // ASIA
        this.updateDestinationSection('asia', 'Japanese Cherry Blossoms');
        
        // AMERICA
        this.updateDestinationSection('america', 'Wild West');
        
        // AFRICA
        this.updateDestinationSection('africa', 'Kenyan Wilderness');
        
        // OCEANIA
        this.updateDestinationSection('oceania', 'Australian Kangaroos');
        
        // MIDDLE EAST
        this.updateDestinationSection('middleEast', 'Dubai\'s Modern Architecture');
        
        // MARIA AT HOME
        this.updateDestinationSection('mariaAtHome', 'My Garden');
    }
    
    updateDestinationSection(destId, firstCardTitle) {
        const section = document.getElementById(destId.toLowerCase().replace(/\s+/g, '-'));
        if (!section || !this.contentData.destinations?.[destId]) return;
        
        const destData = this.contentData.destinations[destId];
        const cards = section.querySelectorAll('.card');
        
        // Update each card
        Object.values(destData).forEach((cardData, index) => {
            if (cards[index]) {
                const title = cards[index].querySelector('h3');
                const desc = cards[index].querySelector('p');
                
                if (title && cardData.title) {
                    title.textContent = cardData.title;
                }
                if (desc && cardData.description) {
                    desc.textContent = cardData.description;
                }
            }
        });
    }
    
    updateAllStories() {
        const section = document.getElementById('stories');
        if (!section || !this.contentData.stories) return;
        
        const grid = section.querySelector('.grid');
        if (!grid) return;
        
        // Find and update existing story cards
        const storyCards = grid.querySelectorAll('.card');
        
        // Update each story card
        Object.values(this.contentData.stories).forEach((story, index) => {
            if (storyCards[index]) {
                const title = storyCards[index].querySelector('h3');
                const desc = storyCards[index].querySelector('p:nth-child(2)');
                const date = storyCards[index].querySelector('p:last-child');
                
                if (title) title.textContent = story.title;
                if (desc) desc.textContent = story.description;
                if (date) date.textContent = story.date;
            }
        });
    }
    
    updateSunriseSunset() {
        const section = document.getElementById('sunset & sunrise');
        if (!section || !this.contentData.sunriseSunset) return;
        
        // Sunrise Text
        const sunriseCards = section.querySelectorAll('.card');
        if (sunriseCards[0] && this.contentData.sunriseSunset.sunriseText) {
            const paragraphs = sunriseCards[0].querySelectorAll('p');
            if (paragraphs[0]) {
                paragraphs[0].innerHTML = this.formatText(this.contentData.sunriseSunset.sunriseText);
            }
        }
        
        // Sunset Text
        if (sunriseCards[1] && this.contentData.sunriseSunset.sunsetText) {
            const paragraphs = sunriseCards[1].querySelectorAll('p');
            if (paragraphs[0]) {
                paragraphs[0].innerHTML = this.formatText(this.contentData.sunriseSunset.sunsetText);
            }
        }
        
        // Update Sunrise Gallery
        this.updateGallery('sunrisePhotos', 'LANZAROTE BEACH');
        
        // Update Sunset Gallery
        this.updateGallery('sunsetPhotos', 'NILE IN LUXOR');
    }
    
    updateGallery(galleryType, defaultTitle) {
        const section = document.getElementById('sunset & sunrise');
        if (!section || !this.contentData.sunriseSunset?.[galleryType]) return;
        
        // Find the grid after the gallery title
        const titles = section.querySelectorAll('h2, h3');
        let targetGrid = null;
        
        for (let i = 0; i < titles.length; i++) {
            if (titles[i].textContent.includes(defaultTitle)) {
                let nextElement = titles[i].parentElement;
                while (nextElement && !nextElement.classList.contains('grid')) {
                    nextElement = nextElement.nextElementSibling;
                }
                if (nextElement && nextElement.classList.contains('grid')) {
                    targetGrid = nextElement;
                    break;
                }
            }
        }
        
        if (targetGrid) {
            const galleryItems = this.contentData.sunriseSunset[galleryType];
            const cards = targetGrid.querySelectorAll('.card');
            
            // Update each gallery card
            Object.values(galleryItems).forEach((item, index) => {
                if (cards[index]) {
                    const title = cards[index].querySelector('h3');
                    const desc = cards[index].querySelector('p');
                    
                    if (title && item.title) {
                        title.textContent = item.title;
                    }
                    if (desc && item.description) {
                        desc.textContent = item.description;
                    }
                }
            });
        }
    }
    
    updateOvernightStays() {
        const section = document.getElementById('overnight stays along the way');
        if (!section || !this.contentData.overnightStays) return;
        
        const cards = section.querySelectorAll('.card');
        
        // Unique Stays
        if (cards[0] && this.contentData.overnightStays.unique) {
            const title = cards[0].querySelector('h3');
            const desc = cards[0].querySelector('p');
            if (title) title.textContent = this.contentData.overnightStays.unique.title;
            if (desc) desc.textContent = this.contentData.overnightStays.unique.description;
        }
        
        // Hotel Reviews
        if (cards[1] && this.contentData.overnightStays.reviews) {
            const title = cards[1].querySelector('h3');
            const desc = cards[1].querySelector('p');
            if (title) title.textContent = this.contentData.overnightStays.reviews.title;
            if (desc) desc.textContent = this.contentData.overnightStays.reviews.description;
        }
        
        // Camping Adventures
        if (cards[2] && this.contentData.overnightStays.camping) {
            const title = cards[2].querySelector('h3');
            const desc = cards[2].querySelector('p');
            if (title) title.textContent = this.contentData.overnightStays.camping.title;
            if (desc) desc.textContent = this.contentData.overnightStays.camping.description;
        }
    }
    
    updateContactFooter() {
        // CONTACT SECTION
        const contactSection = document.getElementById('contact');
        if (contactSection && this.contentData.contact) {
            const cards = contactSection.querySelectorAll('.card');
            
            if (cards.length >= 3) {
                // Email & Phone
                const emailPara = cards[0].querySelector('p:nth-child(1)');
                const phonePara = cards[0].querySelector('p:nth-child(2)');
                if (emailPara) emailPara.textContent = `Email: ${this.contentData.contact.email}`;
                if (phonePara && this.contentData.contact.phone) {
                    phonePara.textContent = `Phone: ${this.contentData.contact.phone}`;
                }
                
                // Collaboration
                const collabPara = cards[1].querySelector('p');
                if (collabPara) collabPara.textContent = this.contentData.contact.collaboration;
                
                // Social Media
                const instaPara = cards[2].querySelector('p:nth-child(1)');
                const fbPara = cards[2].querySelector('p:nth-child(2)');
                if (instaPara) instaPara.textContent = `Instagram: ${this.contentData.contact.instagram}`;
                if (fbPara) fbPara.textContent = `Facebook: ${this.contentData.contact.facebook}`;
            }
        }
        
        // FOOTER
        const footer = document.querySelector('footer');
        if (footer && this.contentData.footer) {
            const copyrightPara = footer.querySelector('p:nth-child(1)');
            const madeByPara = footer.querySelector('h5');
            
            if (copyrightPara) copyrightPara.textContent = this.contentData.footer.copyright;
            if (madeByPara) madeByPara.textContent = this.contentData.footer.madeBy;
        }
    }
    
    formatText(text) {
        return text.replace(/\n/g, '<br>');
    }
    
    setupAutoRefresh() {
        // Refresh content every 10 seconds
        setInterval(() => {
            this.checkForUpdates();
        }, 10000);
        
        // Listen for updates from admin editor
        window.addEventListener('storage', (event) => {
            if (event.key === 'travel_blog_last_update') {
                console.log('Update detected from admin editor');
                this.loadContent();
                this.updateAllContent();
                this.showUpdateNotification();
            }
        });
    }
    
    checkForUpdates() {
        // Just reload from localStorage
        const oldData = JSON.stringify(this.contentData);
        this.loadContent();
        const newData = JSON.stringify(this.contentData);
        
        if (oldData !== newData) {
            this.updateAllContent();
            console.log('Content updated on refresh');
        }
    }
    
    showUpdateNotification() {
        // Show subtle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            animation: fadeInOut 3s ease;
        `;
        notification.innerHTML = '🔄 Content updated';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    enablePreviewMode() {
        const previewBanner = document.createElement('div');
        previewBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        previewBanner.textContent = '👁️ PREVIEW MODE - Auto-updates enabled';
        document.body.prepend(previewBanner);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => {
            window.location.href = window.location.pathname;
        };
        previewBanner.appendChild(closeBtn);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.contentUpdater = new ContentUpdater();
});
