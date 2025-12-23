// GitHub authentication and content management
const GITHUB_TOKEN_KEY = 'github_token';
let currentUser = null;
let contentData = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    setupAuth();
    generateFormFields();
});

// Authentication with GitHub
async function setupAuth() {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    
    if (token) {
        try {
            const user = await verifyGitHubToken(token);
            currentUser = user;
            document.getElementById('authStatus').innerHTML = 
                `✅ Logged in as <strong>${user.login}</strong>`;
            document.getElementById('authBtn').textContent = '🔓 Logout';
            document.getElementById('authBtn').onclick = logout;
        } catch (error) {
            localStorage.removeItem(GITHUB_TOKEN_KEY);
        }
    }
    
    document.getElementById('authBtn').onclick = loginWithGitHub;
}

async function loginWithGitHub() {
    if (currentUser) {
        logout();
        return;
    }
    
    // GitHub OAuth flow
    const clientId = 'Ov23lisS9eDPOxjdJHug';
    const redirectUri = encodeURIComponent('https://utw-web.github.io/Travel/admin-panel.html');
    const scope = encodeURIComponent('repo');
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    // For GitHub Pages, we need to handle the callback
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
        try {
            // Exchange code for token (would need server-side component)
            // For simplicity, we'll use a simpler approach
            alert('For production, you need a backend to handle OAuth. For now, we\'ll use local storage.');
            
            const username = prompt('Enter your GitHub username:');
            if (username) {
                localStorage.setItem(GITHUB_TOKEN_KEY, 'demo_token_' + username);
                currentUser = { login: username };
                document.getElementById('authStatus').innerHTML = 
                    `✅ Logged in as <strong>${username}</strong> (Demo Mode)`;
                document.getElementById('authBtn').textContent = '🔓 Logout';
                document.getElementById('authBtn').onclick = logout;
                
                // Remove code from URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            showStatus('Authentication failed: ' + error.message, 'error');
        }
    } else {
        // Redirect to GitHub auth
        window.location.href = authUrl;
    }
}

function logout() {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    currentUser = null;
    document.getElementById('authStatus').innerHTML = '';
    document.getElementById('authBtn').textContent = '🔑 Login with GitHub';
    document.getElementById('authBtn').onclick = loginWithGitHub;
    showStatus('Logged out', 'success');
}

async function verifyGitHubToken(token) {
    // In production, verify token with GitHub API
    // For demo, return dummy user
    return { login: 'demo_user', name: 'Demo User' };
}

// Tab navigation
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

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        if (response.ok) {
            contentData = await response.json();
            populateForm();
        } else {
            // Create default content structure
            contentData = getDefaultContent();
            showStatus('Using default content. Create data/content.json file.', 'error');
        }
    } catch (error) {
        contentData = getDefaultContent();
        showStatus('Could not load content.json. Using defaults.', 'error');
    }
}

// Default content structure
function getDefaultContent() {
    return {
        home: {
            heroImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
            mainTitle: "Welcome to My Travel Blog",
            aboutMe: [
                "This is my path. A path through lands, flavors, experiences, and feelings…",
                "Today I live a simple, slow life in the countryside...",
                "If something in my words resonates with your own journey..."
            ],
            signatureImage: "Slike/podpis.png",
            featuredDestinations: [
                {
                    title: "Europe",
                    image: "Slike/image_processing20220630-4-1di4kln.jpg",
                    description: "Roman Colosseum, Parisian streets and Alpine valleys – my European adventures."
                },
                {
                    title: "Asia",
                    image: "Slike/IMG-20250213-WA0151 (1).jpg",
                    description: "From Japanese cherry blossoms to Indian bazaars – every step tells a story."
                },
                {
                    title: "America",
                    image: "Slike/licensed-image.jpeg",
                    description: "Wild West, New York streets and Latin America – freedom on the road."
                }
            ],
            cuisine: [
                {
                    title: "Western Cuisine",
                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                    description: "Italian pasta, French pastries and Mediterranean flavors."
                },
                {
                    title: "Eastern Cuisine",
                    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
                    description: "Japanese sushi, Thai curries and Vietnamese street food."
                }
            ],
            recentStories: [
                {
                    title: "Falling in Love with Amsterdam",
                    description: "Bikes, canals and art at every turn – a magical experience.",
                    date: "Published: March 15, 2023"
                },
                {
                    title: "Train Through Sri Lanka",
                    description: "The most beautiful railway journey through green tea hills.",
                    date: "Published: February 2, 2023"
                }
            ]
        },
        destinations: {
            europe: {
                heroImage: "Slike/IMG-20241110-WA0031.jpg",
                cards: [
                    {
                        title: "Roman Colosseum",
                        description: "Historic monument testifying to the power of ancient Rome.",
                        facts: [
                            "Built in 80 AD",
                            "Location: Rome, Italy",
                            "Could hold up to 50,000 spectators"
                        ]
                    }
                    // ... more cards
                ]
            }
            // ... other destinations
        },
        stories: [
            {
                title: "Falling in Love with Amsterdam",
                description: "Bikes, canals and art at every turn – a magical experience.",
                date: "Published: March 15, 2023"
            }
            // ... more stories
        ],
        sunriseSunset: {
            sunriseText: "Each sunrise is a new beginning...",
            sunsetText: "I've seen many of them...",
            sunriseImages: [
                {
                    title: "LANZAROTE BEACH (CANARY ISLANDS; SPAIN)",
                    image: "Slike/20211002_080209 (1).jpg",
                    description: "On a quiet beach with volcanic rocks..."
                }
                // ... more
            ],
            sunsetImages: [
                {
                    title: "NILE IN LUXOR (EGYPT)",
                    image: "Slike/20200506_180727.jpg",
                    description: "The Nile and the palm trees around it glow..."
                }
                // ... more
            ]
        },
        contact: {
            email: "info@mytravelblog.com",
            phone: "",
            instagram: "@mytraveljourney",
            facebook: "My Travel Journey",
            collaboration: "If you'd like to collaborate or have any questions, please email me."
        },
        footer: {
            copyright: "© 2025 My Travel Journey | All Rights Reserved",
            madeBy: "-Made by UTW_Websites-"
        },
        navigation: {
            home: "Home",
            destinations: "Destinations",
            stories: "Travel Stories",
            sunrise: "My Sunrises & Sunsets",
            stays: "Overnight Stays Along The Way",
            contact: "Contact"
        }
    };
}

// Populate form with loaded data
function populateForm() {
    // Home tab
    document.getElementById('heroImage').value = contentData.home.heroImage || '';
    document.getElementById('mainTitle').value = contentData.home.mainTitle || '';
    document.getElementById('aboutMe1').value = contentData.home.aboutMe[0] || '';
    document.getElementById('aboutMe2').value = contentData.home.aboutMe[1] || '';
    document.getElementById('aboutMe3').value = contentData.home.aboutMe[2] || '';
    document.getElementById('signatureImage').value = contentData.home.signatureImage || '';
    
    // Featured destinations
    generateFeaturedCards();
    generateCuisineCards();
    generateRecentStories();
    
    // Contact
    document.getElementById('contactEmail').value = contentData.contact.email || '';
    document.getElementById('contactPhone').value = contentData.contact.phone || '';
    document.getElementById('contactInstagram').value = contentData.contact.instagram || '';
    document.getElementById('contactFacebook').value = contentData.contact.facebook || '';
    document.getElementById('collabText').value = contentData.contact.collaboration || '';
    
    // Footer
    document.getElementById('footerCopyright').value = contentData.footer.copyright || '';
    document.getElementById('footerMadeBy').value = contentData.footer.madeBy || '';
    
    // Navigation
    document.getElementById('navHome').value = contentData.navigation.home || '';
    document.getElementById('navDestinations').value = contentData.navigation.destinations || '';
    document.getElementById('navStories').value = contentData.navigation.stories || '';
    document.getElementById('navSunrise').value = contentData.navigation.sunrise || '';
    document.getElementById('navStays').value = contentData.navigation.stays || '';
    document.getElementById('navContact').value = contentData.navigation.contact || '';
    
    // Sunrise/Sunset
    document.getElementById('sunriseText').value = contentData.sunriseSunset.sunriseText || '';
    document.getElementById('sunsetText').value = contentData.sunriseSunset.sunsetText || '';
    document.getElementById('sunriseMainImage').value = contentData.sunriseSunset.sunriseMainImage || '';
    document.getElementById('sunsetMainImage').value = contentData.sunriseSunset.sunsetMainImage || '';
    
    generateSunriseGallery();
    generateSunsetGallery();
    generateStoryCards();
}

// Generate form fields dynamically
function generateFormFields() {
    // This will be called to generate dynamic form elements
}

function generateFeaturedCards() {
    const container = document.getElementById('featuredCards');
    container.innerHTML = '';
    
    (contentData.home.featuredDestinations || []).forEach((card, index) => {
        const cardHtml = `
            <div class="card-item">
                <label>Card ${index + 1} Title:</label>
                <input type="text" class="featured-title" data-index="${index}" value="${card.title || ''}">
                
                <label>Card ${index + 1} Image URL:</label>
                <input type="url" class="featured-image" data-index="${index}" value="${card.image || ''}">
                
                <label>Card ${index + 1} Description:</label>
                <textarea class="featured-desc" data-index="${index}" rows="3">${card.description || ''}</textarea>
                
                <button onclick="removeFeaturedCard(${index})" style="background:#ff6b6b;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Remove</button>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function addFeaturedCard() {
    if (!contentData.home.featuredDestinations) contentData.home.featuredDestinations = [];
    contentData.home.featuredDestinations.push({
        title: "New Destination",
        image: "",
        description: ""
    });
    generateFeaturedCards();
}

function removeFeaturedCard(index) {
    contentData.home.featuredDestinations.splice(index, 1);
    generateFeaturedCards();
}

function generateCuisineCards() {
    const container = document.getElementById('cuisineCards');
    container.innerHTML = '';
    
    (contentData.home.cuisine || []).forEach((card, index) => {
        container.innerHTML += `
            <div class="card-item">
                <label>Cuisine ${index + 1} Title:</label>
                <input type="text" class="cuisine-title" data-index="${index}" value="${card.title || ''}">
                
                <label>Cuisine ${index + 1} Image URL:</label>
                <input type="url" class="cuisine-image" data-index="${index}" value="${card.image || ''}">
                
                <label>Cuisine ${index + 1} Description:</label>
                <textarea class="cuisine-desc" data-index="${index}" rows="3">${card.description || ''}</textarea>
            </div>
        `;
    });
}

function generateRecentStories() {
    const container = document.getElementById('recentStories');
    container.innerHTML = '';
    
    (contentData.home.recentStories || []).forEach((story, index) => {
        container.innerHTML += `
            <div class="card-item">
                <label>Story ${index + 1} Title:</label>
                <input type="text" class="story-title" data-index="${index}" value="${story.title || ''}">
                
                <label>Story ${index + 1} Description:</label>
                <textarea class="story-desc" data-index="${index}" rows="3">${story.description || ''}</textarea>
                
                <label>Story ${index + 1} Date:</label>
                <input type="text" class="story-date" data-index="${index}" value="${story.date || ''}">
            </div>
        `;
    });
}

function generateStoryCards() {
    const container = document.getElementById('storyCards');
    container.innerHTML = '';
    
    (contentData.stories || []).forEach((story, index) => {
        container.innerHTML += `
            <div class="card-item">
                <label>Story ${index + 1} Title:</label>
                <input type="text" class="fullstory-title" data-index="${index}" value="${story.title || ''}">
                
                <label>Story ${index + 1} Description:</label>
                <textarea class="fullstory-desc" data-index="${index}" rows="3">${story.description || ''}</textarea>
                
                <label>Story ${index + 1} Date:</label>
                <input type="text" class="fullstory-date" data-index="${index}" value="${story.date || ''}">
                
                <label>Story ${index + 1} Image URL:</label>
                <input type="url" class="fullstory-image" data-index="${index}" value="${story.image || ''}">
                
                <button onclick="removeStory(${index})" style="background:#ff6b6b;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Remove</button>
            </div>
        `;
    });
}

function addStory() {
    if (!contentData.stories) contentData.stories = [];
    contentData.stories.push({
        title: "New Travel Story",
        description: "",
        date: "Published: " + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: ""
    });
    generateStoryCards();
}

function removeStory(index) {
    contentData.stories.splice(index, 1);
    generateStoryCards();
}

function generateSunriseGallery() {
    const container = document.getElementById('sunriseGallery');
    container.innerHTML = '';
    
    (contentData.sunriseSunset.sunriseImages || []).forEach((item, index) => {
        container.innerHTML += `
            <div class="card-item">
                <label>Sunrise ${index + 1} Title:</label>
                <input type="text" class="sunrise-title" data-index="${index}" value="${item.title || ''}">
                
                <label>Sunrise ${index + 1} Image URL:</label>
                <input type="url" class="sunrise-image" data-index="${index}" value="${item.image || ''}">
                
                <label>Sunrise ${index + 1} Description:</label>
                <textarea class="sunrise-desc" data-index="${index}" rows="3">${item.description || ''}</textarea>
                
                <button onclick="removeSunriseCard(${index})" style="background:#ff6b6b;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Remove</button>
            </div>
        `;
    });
}

function addSunriseCard() {
    if (!contentData.sunriseSunset.sunriseImages) contentData.sunriseSunset.sunriseImages = [];
    contentData.sunriseSunset.sunriseImages.push({
        title: "New Sunrise Location",
        image: "",
        description: ""
    });
    generateSunriseGallery();
}

function removeSunriseCard(index) {
    contentData.sunriseSunset.sunriseImages.splice(index, 1);
    generateSunriseGallery();
}

function generateSunsetGallery() {
    const container = document.getElementById('sunsetGallery');
    container.innerHTML = '';
    
    (contentData.sunriseSunset.sunsetImages || []).forEach((item, index) => {
        container.innerHTML += `
            <div class="card-item">
                <label>Sunset ${index + 1} Title:</label>
                <input type="text" class="sunset-title" data-index="${index}" value="${item.title || ''}">
                
                <label>Sunset ${index + 1} Image URL:</label>
                <input type="url" class="sunset-image" data-index="${index}" value="${item.image || ''}">
                
                <label>Sunset ${index + 1} Description:</label>
                <textarea class="sunset-desc" data-index="${index}" rows="3">${item.description || ''}</textarea>
                
                <button onclick="removeSunsetCard(${index})" style="background:#ff6b6b;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Remove</button>
            </div>
        `;
    });
}

function addSunsetCard() {
    if (!contentData.sunriseSunset.sunsetImages) contentData.sunriseSunset.sunsetImages = [];
    contentData.sunriseSunset.sunsetImages.push({
        title: "New Sunset Location",
        image: "",
        description: ""
    });
    generateSunsetGallery();
}

function removeSunsetCard(index) {
    contentData.sunriseSunset.sunsetImages.splice(index, 1);
    generateSunsetGallery();
}

function loadDestination() {
    const dest = document.getElementById('destinationSelect').value;
    // Implement destination loading
}

// Save all content
async function saveAllContent() {
    if (!currentUser) {
        showStatus('Please login first!', 'error');
        return;
    }
    
    // Collect all form data
    collectFormData();
    
    try {
        // In production, save to GitHub via API
        // For demo, save to localStorage and download JSON
        const jsonStr = JSON.stringify(contentData, null, 2);
        localStorage.setItem('travel_blog_content', jsonStr);
        
        // Create download link
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus('Content saved and downloaded! Upload content.json to your GitHub repository in the "data" folder.', 'success');
        
        // Instructions for GitHub
        alert('To make changes live on your website:\n\n1. Upload the downloaded content.json file to:\n   https://github.com/UTW-web/Travel/tree/main/data\n\n2. Replace the old content.json file\n\n3. Wait a few minutes for GitHub Pages to update');
        
    } catch (error) {
        showStatus('Error saving: ' + error.message, 'error');
    }
}

function collectFormData() {
    // Home
    contentData.home.heroImage = document.getElementById('heroImage').value;
    contentData.home.mainTitle = document.getElementById('mainTitle').value;
    contentData.home.aboutMe = [
        document.getElementById('aboutMe1').value,
        document.getElementById('aboutMe2').value,
        document.getElementById('aboutMe3').value
    ];
    contentData.home.signatureImage = document.getElementById('signatureImage').value;
    
    // Featured destinations
    contentData.home.featuredDestinations = [];
    document.querySelectorAll('.featured-title').forEach((input, index) => {
        contentData.home.featuredDestinations[index] = {
            title: input.value,
            image: document.querySelectorAll('.featured-image')[index].value,
            description: document.querySelectorAll('.featured-desc')[index].value
        };
    });
    
    // Cuisine
    contentData.home.cuisine = [];
    document.querySelectorAll('.cuisine-title').forEach((input, index) => {
        contentData.home.cuisine[index] = {
            title: input.value,
            image: document.querySelectorAll('.cuisine-image')[index].value,
            description: document.querySelectorAll('.cuisine-desc')[index].value
        };
    });
    
    // Recent stories
    contentData.home.recentStories = [];
    document.querySelectorAll('.story-title').forEach((input, index) => {
        contentData.home.recentStories[index] = {
            title: input.value,
            description: document.querySelectorAll('.story-desc')[index].value,
            date: document.querySelectorAll('.story-date')[index].value
        };
    });
    
    // All stories
    contentData.stories = [];
    document.querySelectorAll('.fullstory-title').forEach((input, index) => {
        contentData.stories[index] = {
            title: input.value,
            description: document.querySelectorAll('.fullstory-desc')[index].value,
            date: document.querySelectorAll('.fullstory-date')[index].value,
            image: document.querySelectorAll('.fullstory-image')[index].value
        };
    });
    
    // Contact
    contentData.contact.email = document.getElementById('contactEmail').value;
    contentData.contact.phone = document.getElementById('contactPhone').value;
    contentData.contact.instagram = document.getElementById('contactInstagram').value;
    contentData.contact.facebook = document.getElementById('contactFacebook').value;
    contentData.contact.collaboration = document.getElementById('collabText').value;
    
    // Footer
    contentData.footer.copyright = document.getElementById('footerCopyright').value;
    contentData.footer.madeBy = document.getElementById('footerMadeBy').value;
    
    // Navigation
    contentData.navigation.home = document.getElementById('navHome').value;
    contentData.navigation.destinations = document.getElementById('navDestinations').value;
    contentData.navigation.stories = document.getElementById('navStories').value;
    contentData.navigation.sunrise = document.getElementById('navSunrise').value;
    contentData.navigation.stays = document.getElementById('navStays').value;
    contentData.navigation.contact = document.getElementById('navContact').value;
    
    // Sunrise/Sunset
    contentData.sunriseSunset.sunriseText = document.getElementById('sunriseText').value;
    contentData.sunriseSunset.sunsetText = document.getElementById('sunsetText').value;
    contentData.sunriseSunset.sunriseMainImage = document.getElementById('sunriseMainImage').value;
    contentData.sunriseSunset.sunsetMainImage = document.getElementById('sunsetMainImage').value;
    
    // Sunrise gallery
    contentData.sunriseSunset.sunriseImages = [];
    document.querySelectorAll('.sunrise-title').forEach((input, index) => {
        contentData.sunriseSunset.sunriseImages[index] = {
            title: input.value,
            image: document.querySelectorAll('.sunrise-image')[index].value,
            description: document.querySelectorAll('.sunrise-desc')[index].value
        };
    });
    
    // Sunset gallery
    contentData.sunriseSunset.sunsetImages = [];
    document.querySelectorAll('.sunset-title').forEach((input, index) => {
        contentData.sunriseSunset.sunsetImages[index] = {
            title: input.value,
            image: document.querySelectorAll('.sunset-image')[index].value,
            description: document.querySelectorAll('.sunset-desc')[index].value
        };
    });
}

function showStatus(message, type) {
    const status = document.getElementById('statusMessage');
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 5000);
}