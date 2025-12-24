// CONTENT UPDATER - Updates ALL text on the website automatically
class ContentUpdater {
    constructor() {
        this.contentData = null;
        this.autoUpdateInterval = null;
        this.init();
    }
    
    async init() {
        // Check preview mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.has('preview');
        
        if (isPreview) {
            this.enablePreviewMode();
        }
        
        // Load content
        await this.loadContent();
        
        // Update ALL page content
        this.updateAllContent();
        
        // Setup auto-update
        this.setupAutoUpdate();
        
        console.log('Content updater initialized - ALL content ready');
    }
    
    async loadContent() {
        try {
            // First check localStorage (immediate updates)
            const savedContent = localStorage.getItem('travel_blog_live_content');
            const lastUpdate = localStorage.getItem('travel_blog_last_update');
            
            if (savedContent && lastUpdate) {
                // Check if data is fresh (less than 1 hour)
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                
                if (parseInt(lastUpdate) > oneHourAgo) {
                    this.contentData = JSON.parse(savedContent);
                    console.log('Loaded fresh content from localStorage');
                    return;
                }
            }
            
            // If not in localStorage, load from GitHub
            const response = await fetch('content-data.json?t=' + Date.now());
            
            if (response.ok) {
                this.contentData = await response.json();
                console.log('Loaded content from GitHub');
                
                // Save to localStorage for next time
                localStorage.setItem('travel_blog_live_content', JSON.stringify(this.contentData));
                localStorage.setItem('travel_blog_last_update', Date.now().toString());
            } else {
                console.warn('Could not load content-data.json, using defaults');
                this.useDefaultContent();
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.useDefaultContent();
        }
    }
    
    useDefaultContent() {
        // Extract current content from page
        this.contentData = this.extractCurrentContent();
    }
    
    extractCurrentContent() {
        // Basic extraction for fallback
        return {
            home: {
                title: document.querySelector('#home h2')?.textContent || 'Welcome to My Travel Blog'
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
        
        console.log('ALL content updated successfully');
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
    
    setupAutoUpdate() {
        // Check for updates every 30 seconds
        this.autoUpdateInterval = setInterval(() => {
            this.checkForUpdates();
        }, 30000);
        
        // Listen for updates from admin editor
        window.addEventListener('storage', (event) => {
            if (event.key === 'travel_blog_last_update') {
                this.handleContentUpdate();
            }
        });
    }
    
    async checkForUpdates() {
        try {
            const lastUpdate = localStorage.getItem('travel_blog_last_update');
            const currentTime = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (!lastUpdate || (currentTime - parseInt(lastUpdate)) > fiveMinutes) {
                await this.loadContent();
                this.updateAllContent();
            }
        } catch (error) {
            console.warn('Error checking for updates:', error);
        }
    }
    
    handleContentUpdate() {
        this.loadContent().then(() => {
            this.updateAllContent();
            console.log('Content updated immediately from admin editor');
        });
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
        previewBanner.textContent = '👁️ PREVIEW MODE - Showing latest saved content';
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

// Initialize content updater
document.addEventListener('DOMContentLoaded', function() {
    window.contentUpdater = new ContentUpdater();
    
    // Add last update info to footer
    setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer && window.contentUpdater.contentData?.lastUpdated) {
            const updateTime = new Date(window.contentUpdater.contentData.lastUpdated);
            const updateInfo = document.createElement('div');
            updateInfo.style.cssText = 'font-size: 0.8rem; color: #7d716a; margin-top: 5px;';
            updateInfo.innerHTML = `Content updated: ${updateTime.toLocaleDateString()} ${updateTime.toLocaleTimeString()}`;
            footer.appendChild(updateInfo);
        }
    }, 1000);
});