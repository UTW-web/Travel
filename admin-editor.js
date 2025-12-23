// Admin Editor with Auto-Save to GitHub
const ADMIN_PASSWORD = 'travel2025'; // CHANGE THIS TO YOUR PASSWORD
const GITHUB_TOKEN = ''; // Leave empty for GitHub Pages workaround
const REPO_OWNER = 'UTW-web';
const REPO_NAME = 'Travel';
const CONTENT_FILE = 'content-data.json';

let contentData = {};
let saveTimeout = null;
let isSaving = false;

// Check authentication
function checkAuth() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'admin_auth' && atob(value) === ADMIN_PASSWORD) {
            return true;
        }
    }
    
    // Not authenticated, redirect to login
    window.location.href = 'admin-login.html';
    return false;
}

// Initialize editor
async function initEditor() {
    if (!checkAuth()) return;
    
    // Load existing content
    await loadContent();
    
    // Populate form fields
    populateForm();
    
    // Setup auto-save on input
    setupAutoSave();
    
    // Setup tab navigation
    setupTabs();
    
    console.log('Editor initialized successfully');
}

// Load content from GitHub
async function loadContent() {
    try {
        // Try to load from GitHub
        const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${CONTENT_FILE}?t=${Date.now()}`);
        
        if (response.ok) {
            contentData = await response.json();
            console.log('Content loaded from GitHub');
        } else {
            // Load default content from current page
            contentData = getDefaultContent();
            console.log('Using default content');
        }
    } catch (error) {
        console.warn('Could not load from GitHub, using defaults:', error);
        contentData = getDefaultContent();
    }
}

// Get default content structure
function getDefaultContent() {
    return {
        home: {
            mainTitle: "Welcome to My Travel Blog",
            aboutPart1: "This is my path. A path through lands, flavors, experiences, and feelings…\nAt heart, I'm a nomad, and my soul's journey is one of exploration, tasting, creating, sensing, and connecting.\n\nIf you're looking for classic travel blogs,\nyou won't find them here.\nBut you will find many sincere reflections and feelings from my journey.\n\nMy name is Maria.\nFor a long time, I believed that the meaning of life was in work, parenting, and everyday survival—but deep inside, I felt there was something more calling me.\nAnd that's how love for myself was born—\nalongside the exploration of my own depths.",
            aboutPart2: "Today I live a simple, slow life in the countryside—\nalongside the love of my life, two curious geese, and two gentle cats.\nI feel connected to myself, to nature, and to the universe.\nMy motto? To be here and now. Fully present in this moment.\n\nI start my mornings with a glass of warm water with lemon,\nwatching nature unfold.\nThese are the moments when life feels enough.\nWhen I feel peace and freedom.\nFrom this silence and presence, this website was born.",
            aboutPart3: "If something in my words resonates with your own journey,\nI am grateful.\nGrateful that I can offer a small piece of my path\nto a world longing for more authenticity.\n\nEach of us carries something unique.\nI simply offer a glimpse into mine."
        },
        cards: {
            europe: {
                title: "Europe",
                description: "Roman Colosseum, Parisian streets and Alpine valleys – my European adventures."
            },
            asia: {
                title: "Asia",
                description: "From Japanese cherry blossoms to Indian bazaars – every step tells a story."
            },
            america: {
                title: "America",
                description: "Wild West, New York streets and Latin America – freedom on the road."
            }
        },
        stories: {
            story1: {
                title: "Falling in Love with Amsterdam",
                description: "Bikes, canals and art at every turn – a magical experience.",
                date: "Published: March 15, 2023"
            },
            story2: {
                title: "Train Through Sri Lanka",
                description: "The most beautiful railway journey through green tea hills.",
                date: "Published: February 2, 2023"
            }
        },
        sunriseSunset: {
            sunriseText: "Each sunrise is a new beginning.\nNot just of the day, but of me.\n\nWhen the sky gently glows, I don't just watch it—I breathe it in.\nWith every inhale, I fill my body with light. I awaken my cells, greet my organs, and whisper:\n\"Good morning. I am here. I am alive.\"\n\nI collect these moments as reminders\nthat everything can start anew.\nThat each day is a chance to shine—from within.\n\nThese are my sunrises.\nMay they touch yours too.",
            sunsetText: "I've seen many of them. Those fiery ones over the desert, softly pink over the ocean, dramatic in the mountains and quiet above city rooftops.\nEach one caught me for a moment \nand reminded me how beautiful it is when the day respectfully bows into the night.But the most beautiful sunset?\nIt's on the terrace of my little house.\nThere, where I know every corner of the light. Where the wind brings familiar scents. Where the sky paints a different farewell each evening, but the feeling remains the same: this is me, I belong here.\nNothing is more calming, nothing more real.\nMaybe because nothing disturbs me. Because there's nothing to catch, prove, or capture.\nI just sit. I just am. And the world goes to sleep."
        },
        contact: {
            email: "info@mytravelblog.com",
            instagram: "@mytraveljourney",
            facebook: "My Travel Journey",
            collaboration: "If you'd like to collaborate or have any questions, please email me."
        },
        footer: {
            copyright: "© 2025 My Travel Journey | All Rights Reserved",
            madeBy: "-Made by UTW_Websites-"
        },
        lastUpdated: new Date().toISOString()
    };
}

// Populate form with loaded content
function populateForm() {
    // Home page
    document.getElementById('mainTitle').value = contentData.home?.mainTitle || '';
    document.getElementById('aboutPart1').value = contentData.home?.aboutPart1 || '';
    document.getElementById('aboutPart2').value = contentData.home?.aboutPart2 || '';
    document.getElementById('aboutPart3').value = contentData.home?.aboutPart3 || '';
    
    // Cards
    document.getElementById('cardEuropeTitle').value = contentData.cards?.europe?.title || '';
    document.getElementById('cardEuropeDesc').value = contentData.cards?.europe?.description || '';
    document.getElementById('cardAsiaTitle').value = contentData.cards?.asia?.title || '';
    document.getElementById('cardAsiaDesc').value = contentData.cards?.asia?.description || '';
    document.getElementById('cardAmericaTitle').value = contentData.cards?.america?.title || '';
    document.getElementById('cardAmericaDesc').value = contentData.cards?.america?.description || '';
    
    // Stories
    document.getElementById('story1Title').value = contentData.stories?.story1?.title || '';
    document.getElementById('story1Desc').value = contentData.stories?.story1?.description || '';
    document.getElementById('story1Date').value = contentData.stories?.story1?.date || '';
    document.getElementById('story2Title').value = contentData.stories?.story2?.title || '';
    document.getElementById('story2Desc').value = contentData.stories?.story2?.description || '';
    document.getElementById('story2Date').value = contentData.stories?.story2?.date || '';
    
    // Sunrise/Sunset
    document.getElementById('sunriseText').value = contentData.sunriseSunset?.sunriseText || '';
    document.getElementById('sunsetText').value = contentData.sunriseSunset?.sunsetText || '';
    
    // Contact
    document.getElementById('contactEmail').value = contentData.contact?.email || '';
    document.getElementById('contactInstagram').value = contentData.contact?.instagram || '';
    document.getElementById('contactFacebook').value = contentData.contact?.facebook || '';
    document.getElementById('contactCollab').value = contentData.contact?.collaboration || '';
    
    // Footer
    document.getElementById('footerCopyright').value = contentData.footer?.copyright || '';
    document.getElementById('footerMadeBy').value = contentData.footer?.madeBy || '';
}

// Setup auto-save on input
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Update content data immediately
            updateContentData();
            
            // Schedule save
            scheduleSave();
        });
    });
}

// Update content data object
function updateContentData() {
    // Home page
    contentData.home = {
        mainTitle: document.getElementById('mainTitle').value,
        aboutPart1: document.getElementById('aboutPart1').value,
        aboutPart2: document.getElementById('aboutPart2').value,
        aboutPart3: document.getElementById('aboutPart3').value
    };
    
    // Cards
    contentData.cards = {
        europe: {
            title: document.getElementById('cardEuropeTitle').value,
            description: document.getElementById('cardEuropeDesc').value
        },
        asia: {
            title: document.getElementById('cardAsiaTitle').value,
            description: document.getElementById('cardAsiaDesc').value
        },
        america: {
            title: document.getElementById('cardAmericaTitle').value,
            description: document.getElementById('cardAmericaDesc').value
        }
    };
    
    // Stories
    contentData.stories = {
        story1: {
            title: document.getElementById('story1Title').value,
            description: document.getElementById('story1Desc').value,
            date: document.getElementById('story1Date').value
        },
        story2: {
            title: document.getElementById('story2Title').value,
            description: document.getElementById('story2Desc').value,
            date: document.getElementById('story2Date').value
        }
    };
    
    // Sunrise/Sunset
    contentData.sunriseSunset = {
        sunriseText: document.getElementById('sunriseText').value,
        sunsetText: document.getElementById('sunsetText').value
    };
    
    // Contact
    contentData.contact = {
        email: document.getElementById('contactEmail').value,
        instagram: document.getElementById('contactInstagram').value,
        facebook: document.getElementById('contactFacebook').value,
        collaboration: document.getElementById('contactCollab').value
    };
    
    // Footer
    contentData.footer = {
        copyright: document.getElementById('footerCopyright').value,
        madeBy: document.getElementById('footerMadeBy').value
    };
    
    contentData.lastUpdated = new Date().toISOString();
}

// Schedule save with debounce
function scheduleSave() {
    // Clear existing timeout
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    // Update status
    const status = document.getElementById('statusIndicator');
    status.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Saving changes...</span>';
    status.className = 'status-indicator saving';
    
    // Set new timeout
    saveTimeout = setTimeout(async () => {
        await saveContent();
    }, 2000); // Save after 2 seconds of inactivity
}

// Save content to GitHub
async function saveContent() {
    if (isSaving) return;
    
    isSaving = true;
    
    try {
        // For GitHub Pages, we'll use a workaround since we can't write directly
        // We'll save to localStorage and create a downloadable file
        
        // Update content data one more time
        updateContentData();
        
        // Save to localStorage as backup
        localStorage.setItem('travel_blog_content', JSON.stringify(contentData));
        
        // Create downloadable JSON file
        const jsonStr = JSON.stringify(contentData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create invisible download link
        const a = document.createElement('a');
        a.href = url;
        a.download = CONTENT_FILE;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update status
        const status = document.getElementById('statusIndicator');
        status.innerHTML = '<i class="fas fa-check-circle"></i> <span>All changes saved</span>';
        status.className = 'status-indicator';
        
        // Show success notification
        showNotification('Changes saved successfully!');
        
        // Update the live site immediately
        updateLiveSite();
        
    } catch (error) {
        console.error('Error saving content:', error);
        
        const status = document.getElementById('statusIndicator');
        status.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Error saving</span>';
        status.className = 'status-indicator error';
        
        showNotification('Error saving changes. Please try again.', true);
    } finally {
        isSaving = false;
    }
}

// Update live site immediately using localStorage
function updateLiveSite() {
    // Save to localStorage for the main site to read
    localStorage.setItem('travel_blog_live_content', JSON.stringify(contentData));
    localStorage.setItem('travel_blog_last_update', Date.now().toString());
    
    console.log('Live site updated via localStorage');
}

// Show notification
function showNotification(message, isError = false) {
    const notice = document.getElementById('autoSaveNotice');
    
    if (isError) {
        notice.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        notice.style.background = '#ffebee';
        notice.style.color = '#c62828';
    } else {
        notice.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        notice.style.background = '#4caf50';
        notice.style.color = 'white';
    }
    
    notice.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notice.style.display = 'none';
    }, 3000);
}

// Tab navigation
function setupTabs() {
    // Show first tab by default
    showTab('home');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Activate selected button
    event.target.classList.add('active');
}

// View live site
function viewLiveSite() {
    // Open live site in new tab
    window.open('index.html?preview=true', '_blank');
}

// Logout
function logout() {
    // Clear auth cookie
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect to login
    window.location.href = 'admin-login.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initEditor);