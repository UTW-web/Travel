// CONTENT UPDATER - Dodajte v vašo glavno spletno stran (index.html)
// Ta koda AVTOMATSKO posodablja besedila iz admin urejevalnika

class ContentUpdater {
    constructor() {
        this.contentData = null;
        this.autoUpdateInterval = null;
        this.init();
    }
    
    async init() {
        // Preveri, če je v preview načinu
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.has('preview');
        
        if (isPreview) {
            this.enablePreviewMode();
        }
        
        // Naloži vsebino
        await this.loadContent();
        
        // Posodobi stran
        this.updatePageContent();
        
        // Nastavi avtomatsko posodabljanje
        this.setupAutoUpdate();
        
        console.log('Content updater initialized');
    }
    
    async loadContent() {
        try {
            // Najprej preveri localStorage (za takojšnje posodobitve)
            const savedContent = localStorage.getItem('travel_blog_live_content');
            const lastUpdate = localStorage.getItem('travel_blog_last_update');
            
            if (savedContent && lastUpdate) {
                // Preveri, če so podatki sveži (manj kot 1 ura)
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                
                if (parseInt(lastUpdate) > oneHourAgo) {
                    this.contentData = JSON.parse(savedContent);
                    console.log('Loaded fresh content from localStorage');
                    return;
                }
            }
            
            // Če ni v localStorage, naloži iz GitHub
            const response = await fetch('content-data.json?t=' + Date.now());
            
            if (response.ok) {
                this.contentData = await response.json();
                console.log('Loaded content from GitHub');
                
                // Shrani v localStorage za naslednjič
                localStorage.setItem('travel_blog_live_content', JSON.stringify(this.contentData));
                localStorage.setItem('travel_blog_last_update', Date.now().toString());
            } else {
                console.warn('Could not load content-data.json, using default content');
                this.useDefaultContent();
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.useDefaultContent();
        }
    }
    
    useDefaultContent() {
        // Uporabi privzete vrednosti iz trenutne strani
        this.contentData = this.extractCurrentContent();
    }
    
    extractCurrentContent() {
        // Izlušči trenutno vsebino iz strani
        return {
            home: {
                mainTitle: document.querySelector('#home h2')?.textContent || 'Welcome to My Travel Blog'
            },
            lastUpdated: new Date().toISOString()
        };
    }
    
    updatePageContent() {
        if (!this.contentData) return;
        
        // HOME PAGE
        // Naslov
        const mainTitle = document.querySelector('#home h2');
        if (mainTitle && this.contentData.home?.mainTitle) {
            mainTitle.textContent = this.contentData.home.mainTitle;
        }
        
        // About Me odstavki
        const aboutCard = document.querySelector('#home .card');
        if (aboutCard && this.contentData.home?.aboutPart1) {
            const paragraphs = aboutCard.querySelectorAll('p');
            
            if (paragraphs.length >= 1 && this.contentData.home.aboutPart1) {
                paragraphs[0].innerHTML = this.formatText(this.contentData.home.aboutPart1);
            }
            if (paragraphs.length >= 2 && this.contentData.home.aboutPart2) {
                paragraphs[1].innerHTML = this.formatText(this.contentData.home.aboutPart2);
            }
            if (paragraphs.length >= 3 && this.contentData.home.aboutPart3) {
                paragraphs[2].innerHTML = this.formatText(this.contentData.home.aboutPart3);
            }
        }
        
        // Featured Destinations kartice
        this.updateCard('Europe', this.contentData.cards?.europe);
        this.updateCard('Asia', this.contentData.cards?.asia);
        this.updateCard('America', this.contentData.cards?.america);
        
        // Travel Stories
        this.updateStoryCard(0, this.contentData.stories?.story1);
        this.updateStoryCard(1, this.contentData.stories?.story2);
        
        // Sunrise/Sunset
        this.updateSunriseSunset();
        
        // Contact information
        this.updateContactInfo();
        
        // Footer
        this.updateFooter();
        
        console.log('Page content updated');
    }
    
    updateCard(cardName, cardData) {
        if (!cardData) return;
        
        const cards = document.querySelectorAll('#home .grid .card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3');
            if (title && title.textContent.includes(cardName)) {
                // Posodobi naslov
                if (cardData.title) {
                    title.textContent = cardData.title;
                }
                
                // Posodobi opis
                const desc = card.querySelector('p');
                if (desc && cardData.description) {
                    desc.textContent = cardData.description;
                }
            }
        });
    }
    
    updateStoryCard(index, storyData) {
        if (!storyData) return;
        
        // Poišči story kartice v home sekciji
        const storySections = document.querySelectorAll('#home h3.section-subtitle');
        let storyGrid = null;
        
        for (let section of storySections) {
            if (section.textContent.includes('Recent Travel Stories')) {
                let nextElement = section.nextElementSibling;
                while (nextElement && !nextElement.classList.contains('grid')) {
                    nextElement = nextElement.nextElementSibling;
                }
                storyGrid = nextElement;
                break;
            }
        }
        
        if (storyGrid) {
            const storyCards = storyGrid.querySelectorAll('.card');
            if (storyCards[index]) {
                // Posodobi naslov
                const title = storyCards[index].querySelector('h3');
                if (title && storyData.title) {
                    title.textContent = storyData.title;
                }
                
                // Posodobi opis
                const desc = storyCards[index].querySelector('p');
                if (desc && storyData.description) {
                    desc.textContent = storyData.description;
                }
                
                // Posodobi datum
                const date = storyCards[index].querySelector('p:last-child');
                if (date && storyData.date) {
                    date.textContent = storyData.date;
                }
            }
        }
    }
    
    updateSunriseSunset() {
        if (!this.contentData.sunriseSunset) return;
        
        const sunriseSection = document.getElementById('sunset & sunrise');
        if (!sunriseSection) return;
        
        // Sunrise text
        const sunriseCard = sunriseSection.querySelector('.card');
        if (sunriseCard && this.contentData.sunriseSunset.sunriseText) {
            const paragraphs = sunriseCard.querySelectorAll('p');
            if (paragraphs[0]) {
                paragraphs[0].innerHTML = this.formatText(this.contentData.sunriseSunset.sunriseText);
            }
        }
        
        // Sunset text (drugi card)
        const sunsetCards = sunriseSection.querySelectorAll('.card');
        if (sunsetCards.length >= 2 && this.contentData.sunriseSunset.sunsetText) {
            const sunsetParagraphs = sunsetCards[1].querySelectorAll('p');
            if (sunsetParagraphs[0]) {
                sunsetParagraphs[0].innerHTML = this.formatText(this.contentData.sunriseSunset.sunsetText);
            }
        }
    }
    
    updateContactInfo() {
        if (!this.contentData.contact) return;
        
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;
        
        const cards = contactSection.querySelectorAll('.card');
        
        if (cards.length >= 3) {
            // Email
            if (this.contentData.contact.email) {
                const emailPara = cards[0].querySelector('p:nth-child(1)');
                if (emailPara) {
                    emailPara.textContent = `Email: ${this.contentData.contact.email}`;
                }
            }
            
            // Collaboration text
            if (this.contentData.contact.collaboration) {
                const collabPara = cards[1].querySelector('p');
                if (collabPara) {
                    collabPara.textContent = this.contentData.contact.collaboration;
                }
            }
            
            // Social media
            if (this.contentData.contact.instagram) {
                const instaPara = cards[2].querySelector('p:nth-child(1)');
                if (instaPara) {
                    instaPara.textContent = `Instagram: ${this.contentData.contact.instagram}`;
                }
            }
            
            if (this.contentData.contact.facebook) {
                const fbPara = cards[2].querySelector('p:nth-child(2)');
                if (fbPara) {
                    fbPara.textContent = `Facebook: ${this.contentData.contact.facebook}`;
                }
            }
        }
    }
    
    updateFooter() {
        if (!this.contentData.footer) return;
        
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        // Copyright
        if (this.contentData.footer.copyright) {
            const copyrightPara = footer.querySelector('p:nth-child(1)');
            if (copyrightPara) {
                copyrightPara.textContent = this.contentData.footer.copyright;
            }
        }
        
        // Made by
        if (this.contentData.footer.madeBy) {
            const madeByPara = footer.querySelector('h5');
            if (madeByPara) {
                madeByPara.textContent = this.contentData.footer.madeBy;
            }
        }
    }
    
    formatText(text) {
        // Zamenjaj nove vrstice z <br> in ohrani ostalo HTML
        return text.replace(/\n/g, '<br>');
    }
    
    setupAutoUpdate() {
        // Preveri za posodobitve vsakih 30 sekund
        this.autoUpdateInterval = setInterval(() => {
            this.checkForUpdates();
        }, 30000); // 30 seconds
        
        // Poslušaj sporočila od admin urejevalnika
        window.addEventListener('storage', (event) => {
            if (event.key === 'travel_blog_last_update') {
                this.handleContentUpdate();
            }
        });
    }
    
    async checkForUpdates() {
        try {
            // Preveri čas zadnje posodobitve
            const lastUpdate = localStorage.getItem('travel_blog_last_update');
            const currentTime = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (!lastUpdate || (currentTime - parseInt(lastUpdate)) > fiveMinutes) {
                // Naloži svežo vsebino
                await this.loadContent();
                this.updatePageContent();
            }
        } catch (error) {
            console.warn('Error checking for updates:', error);
        }
    }
    
    handleContentUpdate() {
        // Takojšnje posodabljanje ob spremembah
        this.loadContent().then(() => {
            this.updatePageContent();
            console.log('Content updated immediately from admin editor');
        });
    }
    
    enablePreviewMode() {
        // Dodaj preview oznako
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
        
        // Dodaj gumb za zaprtje preview
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
    
    // Dodaj skrito admin povezavo (Ctrl+Alt+E)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'E') {
            e.preventDefault();
            window.open('admin-login.html', '_blank');
        }
    });
    
    // Dodaj informacijo o posodobitvi v footer
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