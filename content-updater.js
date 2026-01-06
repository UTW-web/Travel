// COMPLETE CONTENT UPDATER - Updates EVERYTHING from localStorage
class ContentUpdater {
    constructor() {
        this.contentData = null;
        this.init();
    }
    
    async init() {
        console.log('ContentUpdater: Starting...');
        
        // Check for preview mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.has('preview');
        
        if (isPreview) {
            this.enablePreviewMode();
        }
        
        // Load content from localStorage
        this.loadContent();
        
        // Update ALL content on page
        this.updateAllContent();
        
        // Auto-check for updates in preview mode
        if (isPreview) {
            setInterval(() => {
                this.checkForUpdates();
            }, 5000);
        }
        
        console.log('ContentUpdater: Ready');
    }
    
    loadContent() {
        try {
            // Load from localStorage (set by admin editor)
            const savedContent = localStorage.getItem('travel_blog_content');
            
            if (savedContent) {
                this.contentData = JSON.parse(savedContent);
                console.log('Content loaded from localStorage');
            } else {
                // If no saved content, extract from HTML
                this.contentData = this.extractContentFromHTML();
                console.log('Using default content from HTML');
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentData = this.extractContentFromHTML();
        }
    }
    
    extractContentFromHTML() {
        // Extract current content from HTML as fallback
        return {
            home: {
                mainTitle: document.querySelector('#home h2')?.textContent || 'Welcome to My Travel Blog',
                about: this.getAboutText(),
                featuredCards: this.getFeaturedCards(),
                cuisineCards: this.getCuisineCards(),
                recentStories: this.getRecentStories()
            },
            lastUpdated: new Date().toISOString()
        };
    }
    
getAboutText() {
    const aboutCard = document.querySelector('#home .card');
    if (!aboutCard) return '';
    
    // Find the first <p> tag in the card (where About Me text is)
    const aboutParagraph = aboutCard.querySelector('p');
    if (!aboutParagraph) return '';
    
    // Get the innerHTML which contains <br> tags
    let aboutText = aboutParagraph.innerHTML;
    
    // Convert <br> tags to \n for storage in admin editor
    aboutText = aboutText.replace(/<br\s*\/?>/gi, '\n');
    
    // Also handle any other HTML entities
    aboutText = aboutText.replace(/&nbsp;/g, ' ');
    aboutText = aboutText.replace(/&amp;/g, '&');
    
    return aboutText.trim();
}
    
    getFeaturedCards() {
        const cards = document.querySelectorAll('#home .grid .card');
        return {
            europe: {
                title: cards[0]?.querySelector('h3')?.textContent || 'Europe',
                description: cards[0]?.querySelector('p')?.textContent || ''
            },
            asia: {
                title: cards[1]?.querySelector('h3')?.textContent || 'Asia',
                description: cards[1]?.querySelector('p')?.textContent || ''
            },
            america: {
                title: cards[2]?.querySelector('h3')?.textContent || 'America',
                description: cards[2]?.querySelector('p')?.textContent || ''
            }
        };
    }
    updateDestinationSectionTitles() {
    // Update main section titles
    const sectionTitles = {
        'europe': 'Europe',
        'asia': 'Asia',
        'america': 'America',
        'africa': 'Africa',
        'oceania': 'Oceania',
        'Middle East': 'Middle East',
        'maria at home': 'Maria At Home'
    };
    
    Object.keys(sectionTitles).forEach(sectionId => {
        const titleElement = document.querySelector(`#${sectionId} .destination-title`);
        if (titleElement) {
            titleElement.textContent = sectionTitles[sectionId];
        }
    });
}
    updateAllContent() {
        if (!this.contentData) return;
        if (!this.contentData) return;
    
    // Update HOME PAGE
    this.updateHomePage();
    
    // Update destination section titles
    this.updateDestinationSectionTitles();
    
    // Update ALL DESTINATIONS
    this.updateDestinations();
        
        // Update HOME PAGE
        this.updateHomePage();
        
        // Update ALL DESTINATIONS
        this.updateDestinations();
        
        // Update ALL TRAVEL STORIES
        this.updateTravelStories();
        
        // Update SUNRISE & SUNSET
        this.updateSunriseSunset();
        
        // Update OVERNIGHT STAYS
        this.updateOvernightStays();
        
        // Update CONTACT
        this.updateContact();
        
        console.log('All content updated successfully');
    }
    
updateHomePage() {
    console.log('Updating Home Page...');
    
    // Main title
    this.updateText('#home h2', this.contentData.home?.mainTitle);
    
    // About me text - SIMPLE VERSION
    if (this.contentData.home?.about) {
        const aboutCard = document.querySelector('#home .card');
        if (aboutCard) {
            // Find the paragraph element
            const aboutParagraph = aboutCard.querySelector('p');
            if (aboutParagraph) {
                // Simply replace the innerHTML with formatted text
                aboutParagraph.innerHTML = this.contentData.home.about.replace(/\n/g, '<br>');
                console.log('Updated About Me text');
            }
        }
    }
    
    // Featured destination cards - FIXED: Select SECOND grid
    console.log('Looking for Featured Destinations grid...');
    const allGrids = document.querySelectorAll('#home .grid');
    console.log('Found', allGrids.length, 'grids in home section');
    
    if (allGrids.length >= 2) {
        const featuredGrid = allGrids[1]; // SECOND grid
        console.log('Using second grid for Featured Destinations');
        
        const featuredCards = featuredGrid.querySelectorAll('.card');
        console.log('Found', featuredCards.length, 'cards in featured grid');
        
        // Europe Card
        if (featuredCards[0] && this.contentData.home?.featuredCards?.europe) {
            const titleElement = featuredCards[0].querySelector('h3');
            const descElement = featuredCards[0].querySelector('p');
            
            if (titleElement) {
                titleElement.textContent = this.contentData.home.featuredCards.europe.title || 'Europe';
                console.log('Set Europe title');
            }
            if (descElement) {
                descElement.textContent = this.contentData.home.featuredCards.europe.description || '';
                console.log('Set Europe description');
            }
        }
        
        // Asia Card
        if (featuredCards[1] && this.contentData.home?.featuredCards?.asia) {
            const titleElement = featuredCards[1].querySelector('h3');
            const descElement = featuredCards[1].querySelector('p');
            
            if (titleElement) {
                titleElement.textContent = this.contentData.home.featuredCards.asia.title || 'Asia';
                console.log('Set Asia title');
            }
            if (descElement) {
                descElement.textContent = this.contentData.home.featuredCards.asia.description || '';
                console.log('Set Asia description');
            }
        }
        
        // America Card
        if (featuredCards[2] && this.contentData.home?.featuredCards?.america) {
            const titleElement = featuredCards[2].querySelector('h3');
            const descElement = featuredCards[2].querySelector('p');
            
            if (titleElement) {
                titleElement.textContent = this.contentData.home.featuredCards.america.title || 'America';
                console.log('Set America title');
            }
            if (descElement) {
                descElement.textContent = this.contentData.home.featuredCards.america.description || '';
                console.log('Set America description');
            }
        }
    } else {
        console.error('Could not find Featured Destinations grid!');
    }
    
    // Cuisine cards
    this.updateCuisineCards();
    
    // Recent stories on home
    this.updateHomeStories();
    
    console.log('Home page update complete');
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
            
            if (this.contentData.home?.cuisineCards?.western) {
                this.updateElement(cards[0]?.querySelector('h3'), this.contentData.home.cuisineCards.western.title);
                this.updateElement(cards[0]?.querySelector('p'), this.contentData.home.cuisineCards.western.description);
            }
            
            if (this.contentData.home?.cuisineCards?.eastern) {
                this.updateElement(cards[1]?.querySelector('h3'), this.contentData.home.cuisineCards.eastern.title);
                this.updateElement(cards[1]?.querySelector('p'), this.contentData.home.cuisineCards.eastern.description);
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
            
            if (this.contentData.home?.recentStories?.story1) {
                this.updateElement(cards[0]?.querySelector('h3'), this.contentData.home.recentStories.story1.title);
                this.updateElement(cards[0]?.querySelector('p:nth-child(2)'), this.contentData.home.recentStories.story1.description);
                this.updateElement(cards[0]?.querySelector('p:last-child'), this.contentData.home.recentStories.story1.date);
            }
            
            if (this.contentData.home?.recentStories?.story2) {
                this.updateElement(cards[1]?.querySelector('h3'), this.contentData.home.recentStories.story2.title);
                this.updateElement(cards[1]?.querySelector('p:nth-child(2)'), this.contentData.home.recentStories.story2.description);
                this.updateElement(cards[1]?.querySelector('p:last-child'), this.contentData.home.recentStories.story2.date);
            }
        }
    }
    
    updateDestinations() {
        // EUROPE
        this.updateDestinationSection('europe', [
            'Roman Colosseum',
            'Parisian Streets', 
            'Alpine Valleys'
        ]);
        
        // ASIA
        this.updateDestinationSection('asia', [
            'Japanese Cherry Blossoms',
            'Indian Bazaars',
            'Vietnamese Rice Fields'
        ]);
        
        // AMERICA
        this.updateDestinationSection('america', [
            'Wild West',
            'New York',
            'Latin America'
        ]);
        
        // AFRICA
        this.updateDestinationSection('africa', [
            'Kenyan Wilderness',
            'Moroccan Markets',
            'Egyptian Deserts'
        ]);
        
        // OCEANIA
        this.updateDestinationSection('oceania', [
            'Australian Kangaroos',
            'Great Barrier Reef',
            'Paradise Islands'
        ]);
        
        // MIDDLE EAST
        this.updateDestinationSection('Middle East', [
            'Dubai\'s Modern Architecture',
            'Petra\'s Ancient City',
            'Egyptian Pyramids'
        ]);
        
        // MARIA AT HOME
        this.updateDestinationSection('maria at home', [
            'My Garden',
            'Cooking at Home',
            'Cozy Evenings'
        ]);
    }
    
    updateDestinationSection(sectionId, cardTitles) {
        const section = document.getElementById(sectionId);
        if (!section || !this.contentData.destinations?.[sectionId]) return;
        
        const destData = this.contentData.destinations[sectionId];
        const cards = section.querySelectorAll('.card');
        
        cardTitles.forEach((title, index) => {
            if (cards[index] && destData[title]) {
                // Update title
                this.updateElement(cards[index].querySelector('h3'), title);
                
                // Update description
                this.updateElement(cards[index].querySelector('p'), destData[title].description);
                
                // Update list items if they exist
                const ul = cards[index].querySelector('ul');
                if (ul && destData[title].listItems) {
                    ul.innerHTML = '';
                    destData[title].listItems.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                }
            }
        });
    }
    
    updateTravelStories() {
        const section = document.getElementById('stories');
        if (!section || !this.contentData.stories) return;
        
        const grid = section.querySelector('.grid');
        if (!grid) return;
        
        const cards = grid.querySelectorAll('.card');
        const storyKeys = Object.keys(this.contentData.stories).sort();
        
        storyKeys.forEach((key, index) => {
            if (cards[index] && this.contentData.stories[key]) {
                const story = this.contentData.stories[key];
                
                this.updateElement(cards[index].querySelector('h3'), story.title);
                this.updateElement(cards[index].querySelector('p:nth-child(2)'), story.description);
                this.updateElement(cards[index].querySelector('p:last-child'), story.date);
            }
        });
    }
    
    updateSunriseSunset() {
        const section = document.getElementById('sunset & sunrise');
        if (!section || !this.contentData.sunriseSunset) return;
        
        // Update sunrise main text
        const sunriseCard = section.querySelector('.card');
        if (sunriseCard && this.contentData.sunriseSunset.sunriseText) {
            const paragraph = sunriseCard.querySelector('p');
            if (paragraph) {
                paragraph.innerHTML = this.formatText(this.contentData.sunriseSunset.sunriseText);
            }
        }
        
        // Update sunset main text (second card)
        const cards = section.querySelectorAll('.card');
        if (cards[1] && this.contentData.sunriseSunset.sunsetText) {
            const paragraph = cards[1].querySelector('p');
            if (paragraph) {
                paragraph.innerHTML = this.formatText(this.contentData.sunriseSunset.sunsetText);
            }
        }
        
        // Update sunrise gallery cards
        this.updateGalleryCards('LANZAROTE BEACH', this.contentData.sunriseSunset?.sunriseGallery?.lanzarote);
        this.updateGalleryCards('ISTANBUL (TURKEY)', this.contentData.sunriseSunset?.sunriseGallery?.istanbul);
        this.updateGalleryCards('CAPPADOCIA (TURKEY)', this.contentData.sunriseSunset?.sunriseGallery?.cappadocia);
        this.updateGalleryCards('DAWN-SOMEWHERE ABOVE THE CLOUDS', this.contentData.sunriseSunset?.sunriseGallery?.dawn);
        
        // Update sunset gallery cards
        this.updateGalleryCards('NILE IN LUXOR (EGYPT)', this.contentData.sunriseSunset?.sunsetGallery?.nile);
        this.updateGalleryCards('LAKE GARDA (ITALY)', this.contentData.sunriseSunset?.sunsetGallery?.garda);
        this.updateGalleryCards('WADI RUM (JORDAN)', this.contentData.sunriseSunset?.sunsetGallery?.wadi);
        this.updateGalleryCards('THULUSDHOO (MALDIVES)', this.contentData.sunriseSunset?.sunsetGallery?.thulusdhoo);
        this.updateGalleryCards('OIA, SANTORINI (GREECE)', this.contentData.sunriseSunset?.sunsetGallery?.santorini);
        this.updateGalleryCards('KAMNIK (SLOVENIA)', this.contentData.sunriseSunset?.sunsetGallery?.kamnik);
    }
    
    updateGalleryCards(title, data) {
        if (!data) return;
        
        const section = document.getElementById('sunset & sunrise');
        const allH3 = section.querySelectorAll('h3');
        
        allH3.forEach(h3 => {
            if (h3.textContent.trim() === title) {
                // Update title if different
                if (data.title && data.title !== title) {
                    h3.textContent = data.title;
                }
                
                // Update description
                const nextP = h3.nextElementSibling;
                if (nextP && nextP.tagName === 'P' && data.description) {
                    nextP.textContent = data.description;
                }
            }
        });
    }
    
    updateOvernightStays() {
        const section = document.getElementById('overnight stays along the way');
        if (!section || !this.contentData.overnightStays) return;
        
        const cards = section.querySelectorAll('.card');
        
        // Unique Stays
        if (cards[0] && this.contentData.overnightStays.unique) {
            this.updateElement(cards[0].querySelector('h3'), this.contentData.overnightStays.unique.title);
            this.updateElement(cards[0].querySelector('p'), this.contentData.overnightStays.unique.description);
            
            // Update list
            const ul = cards[0].querySelector('ul');
            if (ul && this.contentData.overnightStays.unique.listItems) {
                ul.innerHTML = '';
                this.contentData.overnightStays.unique.listItems.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
            }
        }
        
        // Hotel Reviews
        if (cards[1] && this.contentData.overnightStays.reviews) {
            this.updateElement(cards[1].querySelector('h3'), this.contentData.overnightStays.reviews.title);
            this.updateElement(cards[1].querySelector('p'), this.contentData.overnightStays.reviews.description);
            
            // Update list
            const ul = cards[1].querySelector('ul');
            if (ul && this.contentData.overnightStays.reviews.listItems) {
                ul.innerHTML = '';
                this.contentData.overnightStays.reviews.listItems.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
            }
        }
        
        // Camping Adventures
        if (cards[2] && this.contentData.overnightStays.camping) {
            this.updateElement(cards[2].querySelector('h3'), this.contentData.overnightStays.camping.title);
            this.updateElement(cards[2].querySelector('p'), this.contentData.overnightStays.camping.description);
        }
    }
    
    updateContact() {
        const section = document.getElementById('contact');
        if (!section || !this.contentData.contact) return;
        
        const cards = section.querySelectorAll('.card');
        
        if (cards.length >= 3) {
            // Contact details card
            this.updateElement(cards[0].querySelector('p:nth-child(2)'), `Email: ${this.contentData.contact.email || ''}`);
            this.updateElement(cards[0].querySelector('p:nth-child(3)'), `Phone: ${this.contentData.contact.phone || ''}`);
            
            // Collaboration card
            this.updateElement(cards[1].querySelector('p'), this.contentData.contact.collaboration || '');
            
            // Social media card
            this.updateElement(cards[2].querySelector('p:nth-child(2)'), `Instagram: ${this.contentData.contact.instagram || ''}`);
            this.updateElement(cards[2].querySelector('p:nth-child(3)'), `Facebook: ${this.contentData.contact.facebook || ''}`);
        }
        
        // Update footer
        const footer = document.querySelector('footer');
        if (footer && this.contentData.footer) {
            this.updateElement('footer p:nth-child(1)', this.contentData.footer.copyright || '');
            this.updateElement('footer h5', this.contentData.footer.madeBy || '');
        }
    }
    
updateElement(selector, text) {
    if (!text || text === 'undefined' || text === 'null') return;
    
    let element;
    if (typeof selector === 'string') {
        element = document.querySelector(selector);
    } else {
        element = selector;
    }
    
    if (element && element.textContent !== text) {
        element.textContent = text;
    }
}
    
    updateText(selector, text) {
        this.updateElement(selector, text);
    }
    
    formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>');
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
        previewBanner.textContent = '👁️ PREVIEW MODE - Live updates enabled';
        document.body.prepend(previewBanner);
    }
    
    checkForUpdates() {
        const oldData = JSON.stringify(this.contentData);
        this.loadContent();
        const newData = JSON.stringify(this.contentData);
        
        if (oldData !== newData) {
            this.updateAllContent();
            console.log('Content auto-updated in preview mode');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contentUpdater = new ContentUpdater();
});
