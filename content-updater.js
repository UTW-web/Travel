// SIMPLE CONTENT UPDATER - Updates ALL content from localStorage
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
                about: document.querySelector('#home .card p')?.innerHTML || 'About me text...'
            },
            lastUpdated: new Date().toISOString()
        };
    }
    
    updateAllContent() {
        if (!this.contentData) return;
        
        // Update HOME PAGE
        this.updateHomePage();
        
        // Update ALL DESTINATIONS
        this.updateDestinations();
        
        // Update TRAVEL STORIES
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
        // Main title
        this.updateText('#home h2', this.contentData.home?.mainTitle);
        
        // About me text (all in one)
        const aboutContainer = document.querySelector('#home .card');
        if (aboutContainer && this.contentData.home?.about) {
            aboutContainer.innerHTML = this.formatText(this.contentData.home.about);
        }
        
        // Featured destination cards
        this.updateFeaturedCards();
        
        // World Cuisine cards
        this.updateCuisineCards();
        
        // Recent travel stories on home page
        this.updateHomeStories();
    }
    
    updateFeaturedCards() {
        const cards = document.querySelectorAll('#home .grid .card');
        
        // Europe card
        if (cards[0] && this.contentData.home?.europeCard) {
            this.updateText(cards[0].querySelector('h3'), this.contentData.home.europeCard.title);
            this.updateText(cards[0].querySelector('p'), this.contentData.home.europeCard.description);
        }
        
        // Asia card
        if (cards[1] && this.contentData.home?.asiaCard) {
            this.updateText(cards[1].querySelector('h3'), this.contentData.home.asiaCard.title);
            this.updateText(cards[1].querySelector('p'), this.contentData.home.asiaCard.description);
        }
        
        // America card
        if (cards[2] && this.contentData.home?.americaCard) {
            this.updateText(cards[2].querySelector('h3'), this.contentData.home.americaCard.title);
            this.updateText(cards[2].querySelector('p'), this.contentData.home.americaCard.description);
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
            
            // Western cuisine card
            if (cards[0] && this.contentData.home?.westernCuisine) {
                this.updateText(cards[0].querySelector('h3'), this.contentData.home.westernCuisine.title);
                this.updateText(cards[0].querySelector('p'), this.contentData.home.westernCuisine.description);
            }
            
            // Eastern cuisine card
            if (cards[1] && this.contentData.home?.easternCuisine) {
                this.updateText(cards[1].querySelector('h3'), this.contentData.home.easternCuisine.title);
                this.updateText(cards[1].querySelector('p'), this.contentData.home.easternCuisine.description);
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
            if (cards[0] && this.contentData.home?.story1) {
                this.updateText(cards[0].querySelector('h3'), this.contentData.home.story1.title);
                this.updateText(cards[0].querySelector('p:nth-child(2)'), this.contentData.home.story1.description);
                this.updateText(cards[0].querySelector('p:last-child'), this.contentData.home.story1.date);
            }
            
            // Story 2
            if (cards[1] && this.contentData.home?.story2) {
                this.updateText(cards[1].querySelector('h3'), this.contentData.home.story2.title);
                this.updateText(cards[1].querySelector('p:nth-child(2)'), this.contentData.home.story2.description);
                this.updateText(cards[1].querySelector('p:last-child'), this.contentData.home.story2.date);
            }
        }
    }
    
    updateDestinations() {
        // EUROPE
        this.updateDestinationSection('europe', 'Europe', [
            'Roman Colosseum',
            'Parisian Streets',
            'Alpine Valleys'
        ]);
        
        // ASIA
        this.updateDestinationSection('asia', 'Asia', [
            'Japanese Cherry Blossoms',
            'Indian Bazaars',
            'Vietnamese Rice Fields'
        ]);
        
        // AMERICA
        this.updateDestinationSection('america', 'America', [
            'Wild West',
            'New York',
            'Latin America'
        ]);
        
        // AFRICA
        this.updateDestinationSection('africa', 'Africa', [
            'Kenyan Wilderness',
            'Moroccan Markets',
            'Egyptian Deserts'
        ]);
        
        // OCEANIA
        this.updateDestinationSection('oceania', 'Oceania', [
            'Australian Kangaroos',
            'Great Barrier Reef',
            'Paradise Islands'
        ]);
        
        // MIDDLE EAST
        this.updateDestinationSection('Middle East', 'Middle East', [
            'Dubai\'s Modern Architecture',
            'Petra\'s Ancient City',
            'Egyptian Pyramids'
        ]);
        
        // MARIA AT HOME
        this.updateDestinationSection('maria at home', 'Maria At Home', [
            'My Garden',
            'Cooking at Home',
            'Cozy Evenings'
        ]);
    }
    
    updateDestinationSection(sectionId, sectionName, cardTitles) {
        const section = document.getElementById(sectionId);
        if (!section || !this.contentData.destinations?.[sectionName]) return;
        
        const destData = this.contentData.destinations[sectionName];
        const cards = section.querySelectorAll('.card');
        
        // Update each card in the section
        cardTitles.forEach((title, index) => {
            if (cards[index] && destData[title]) {
                // Update title
                const titleElement = cards[index].querySelector('h3');
                if (titleElement) {
                    titleElement.textContent = title;
                }
                
                // Update description
                const descElement = cards[index].querySelector('p');
                if (descElement && destData[title].description) {
                    descElement.textContent = destData[title].description;
                }
                
                // Update additional content (ul if exists)
                const ulElement = cards[index].querySelector('ul');
                if (ulElement && destData[title].points) {
                    ulElement.innerHTML = '';
                    destData[title].points.forEach(point => {
                        const li = document.createElement('li');
                        li.textContent = point;
                        ulElement.appendChild(li);
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
        const storyKeys = Object.keys(this.contentData.stories);
        
        // Update each story card
        storyKeys.forEach((key, index) => {
            if (cards[index] && this.contentData.stories[key]) {
                const story = this.contentData.stories[key];
                
                // Update title
                const title = cards[index].querySelector('h3');
                if (title) title.textContent = story.title;
                
                // Update description
                const desc = cards[index].querySelector('p:nth-child(2)');
                if (desc) desc.textContent = story.description;
                
                // Update date
                const date = cards[index].querySelector('p:last-child');
                if (date) date.textContent = story.date;
            }
        });
    }
    
    updateSunriseSunset() {
        const section = document.getElementById('sunset & sunrise');
        if (!section || !this.contentData.sunriseSunset) return;
        
        // Update sunrise text
        const sunriseCard = section.querySelector('.card');
        if (sunriseCard && this.contentData.sunriseSunset.sunriseText) {
            const paragraph = sunriseCard.querySelector('p');
            if (paragraph) {
                paragraph.innerHTML = this.formatText(this.contentData.sunriseSunset.sunriseText);
            }
        }
        
        // Update sunset text (find second card)
        const cards = section.querySelectorAll('.card');
        if (cards[1] && this.contentData.sunriseSunset.sunsetText) {
            const paragraph = cards[1].querySelector('p');
            if (paragraph) {
                paragraph.innerHTML = this.formatText(this.contentData.sunriseSunset.sunsetText);
            }
        }
        
        // Update sunrise gallery
        this.updateGallery('sunrisePhotos');
        
        // Update sunset gallery
        this.updateGallery('sunsetPhotos');
    }
    
    updateGallery(galleryType) {
        const section = document.getElementById('sunset & sunrise');
        if (!section || !this.contentData.sunriseSunset?.[galleryType]) return;
        
        // Find all h3 elements in the section
        const h3Elements = section.querySelectorAll('h3');
        const galleryData = this.contentData.sunriseSunset[galleryType];
        
        // Update each h3 and its following p element
        h3Elements.forEach(h3 => {
            const title = h3.textContent.trim();
            if (galleryData[title]) {
                // Update title if needed (optional)
                // h3.textContent = galleryData[title].title;
                
                // Update description
                const pElement = h3.nextElementSibling;
                if (pElement && pElement.tagName === 'P' && galleryData[title].description) {
                    pElement.textContent = galleryData[title].description;
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
            this.updateText(cards[0].querySelector('h3'), this.contentData.overnightStays.unique.title);
            this.updateText(cards[0].querySelector('p'), this.contentData.overnightStays.unique.description);
        }
        
        // Hotel Reviews
        if (cards[1] && this.contentData.overnightStays.reviews) {
            this.updateText(cards[1].querySelector('h3'), this.contentData.overnightStays.reviews.title);
            this.updateText(cards[1].querySelector('p'), this.contentData.overnightStays.reviews.description);
        }
        
        // Camping Adventures
        if (cards[2] && this.contentData.overnightStays.camping) {
            this.updateText(cards[2].querySelector('h3'), this.contentData.overnightStays.camping.title);
            this.updateText(cards[2].querySelector('p'), this.contentData.overnightStays.camping.description);
        }
    }
    
    updateContact() {
        const section = document.getElementById('contact');
        if (!section || !this.contentData.contact) return;
        
        const cards = section.querySelectorAll('.card');
        
        if (cards.length >= 3) {
            // Contact details card
            const emailPara = cards[0].querySelector('p:nth-child(2)');
            const phonePara = cards[0].querySelector('p:nth-child(3)');
            if (emailPara) emailPara.textContent = `Email: ${this.contentData.contact.email}`;
            if (phonePara && this.contentData.contact.phone) {
                phonePara.textContent = `Phone: ${this.contentData.contact.phone}`;
            }
            
            // Collaboration card
            const collabPara = cards[1].querySelector('p');
            if (collabPara) collabPara.textContent = this.contentData.contact.collaboration;
            
            // Social media card
            const instaPara = cards[2].querySelector('p:nth-child(2)');
            const fbPara = cards[2].querySelector('p:nth-child(3)');
            if (instaPara) instaPara.textContent = `Instagram: ${this.contentData.contact.instagram}`;
            if (fbPara) fbPara.textContent = `Facebook: ${this.contentData.contact.facebook}`;
        }
        
        // Update footer
        const footer = document.querySelector('footer');
        if (footer && this.contentData.footer) {
            const copyrightPara = footer.querySelector('p:nth-child(1)');
            const madeByPara = footer.querySelector('h5');
            
            if (copyrightPara) copyrightPara.textContent = this.contentData.footer.copyright;
            if (madeByPara) madeByPara.textContent = this.contentData.footer.madeBy;
        }
    }
    
    updateText(selector, text) {
        if (!text) return;
        
        if (typeof selector === 'string') {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        } else if (selector && selector.textContent !== undefined) {
            selector.textContent = text;
        }
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
        
        // Auto-check for updates every 5 seconds in preview mode
        setInterval(() => {
            this.checkForUpdates();
        }, 5000);
    }
    
    checkForUpdates() {
        const oldData = JSON.stringify(this.contentData);
        this.loadContent();
        const newData = JSON.stringify(this.contentData);
        
        if (oldData !== newData) {
            this.updateAllContent();
            console.log('Content updated on refresh');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contentUpdater = new ContentUpdater();
});