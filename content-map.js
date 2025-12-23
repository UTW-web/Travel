// Content Map - Maps all text on the website for easy replacement
const contentMap = {
    // HOME PAGE
    "home-title": {
        selector: "#home h2",
        currentText: "Welcome to My Travel Blog"
    },
    "home-about-1": {
        selector: "#home .card p:nth-child(1)",
        currentText: "This is my path. A path through lands, flavors, experiences, and feelings…\nAt heart, I'm a nomad, and my soul's journey is one of exploration, tasting, creating, sensing, and connecting.\n\nIf you're looking for classic travel blogs,\nyou won't find them here.\nBut you will find many sincere reflections and feelings from my journey.\n\nMy name is Maria.\nFor a long time, I believed that the meaning of life was in work, parenting, and everyday survival—but deep inside, I felt there was something more calling me.\nAnd that's how love for myself was born—\nalongside the exploration of my own depths."
    },
    "home-about-2": {
        selector: "#home .card p:nth-child(2)",
        currentText: "Today I live a simple, slow life in the countryside—\nalongside the love of my life, two curious geese, and two gentle cats.\nI feel connected to myself, to nature, and to the universe.\nMy motto? To be here and now. Fully present in this moment.\n\nI start my mornings with a glass of warm water with lemon,\nwatching nature unfold.\nThese are the moments when life feels enough.\nWhen I feel peace and freedom.\nFrom this silence and presence, this website was born."
    },
    "home-about-3": {
        selector: "#home .card p:nth-child(3)",
        currentText: "If something in my words resonates with your own journey,\nI am grateful.\nGrateful that I can offer a small piece of my path\nto a world longing for more authenticity.\n\nEach of us carries something unique.\nI simply offer a glimpse into mine."
    },
    
    // FEATURED DESTINATIONS
    "card-europe-title": {
        selector: "#home .grid .card:nth-child(1) h3",
        currentText: "Europe"
    },
    "card-europe-desc": {
        selector: "#home .grid .card:nth-child(1) p",
        currentText: "Roman Colosseum, Parisian streets and Alpine valleys – my European adventures."
    },
    "card-asia-title": {
        selector: "#home .grid .card:nth-child(2) h3",
        currentText: "Asia"
    },
    "card-asia-desc": {
        selector: "#home .grid .card:nth-child(2) p",
        currentText: "From Japanese cherry blossoms to Indian bazaars – every step tells a story."
    },
    "card-america-title": {
        selector: "#home .grid .card:nth-child(3) h3",
        currentText: "America"
    },
    "card-america-desc": {
        selector: "#home .grid .card:nth-child(3) p",
        currentText: "Wild West, New York streets and Latin America – freedom on the road."
    },
    
    // TRAVEL STORIES
    "story1-title": {
        selector: "#home .grid .card:nth-child(4) h3",
        currentText: "Falling in Love with Amsterdam"
    },
    "story1-desc": {
        selector: "#home .grid .card:nth-child(4) p:nth-child(2)",
        currentText: "Bikes, canals and art at every turn – a magical experience."
    },
    "story1-date": {
        selector: "#home .grid .card:nth-child(4) p:nth-child(3)",
        currentText: "Published: March 15, 2023"
    },
    
    // SUNRISE & SUNSET
    "sunrise-text": {
        selector: "#sunset\\ \\&\\ sunrise .card:nth-child(1) p",
        currentText: "Each sunrise is a new beginning.\nNot just of the day, but of me.\n\nWhen the sky gently glows, I don't just watch it—I breathe it in.\nWith every inhale, I fill my body with light. I awaken my cells, greet my organs, and whisper:\n\"Good morning. I am here. I am alive.\"\n\nI collect these moments as reminders\nthat everything can start anew.\nThat each day is a chance to shine—from within.\n\nThese are my sunrises.\nMay they touch yours too."
    },
    "sunset-text": {
        selector: "#sunset\\ \\&\\ sunrise .card:nth-child(2) p",
        currentText: "I've seen many of them. Those fiery ones over the desert, softly pink over the ocean, dramatic in the mountains and quiet above city rooftops.\nEach one caught me for a moment \nand reminded me how beautiful it is when the day respectfully bows into the night.But the most beautiful sunset?\nIt's on the terrace of my little house.\nThere, where I know every corner of the light. Where the wind brings familiar scents. Where the sky paints a different farewell each evening, but the feeling remains the same: this is me, I belong here.\nNothing is more calming, nothing more real.\nMaybe because nothing disturbs me. Because there's nothing to catch, prove, or capture.\nI just sit. I just am. And the world goes to sleep."
    },
    
    // CONTACT
    "contact-email": {
        selector: "#contact .card:nth-child(1) p:nth-child(1)",
        currentText: "Email: info@mytravelblog.com"
    },
    "contact-collab": {
        selector: "#contact .card:nth-child(2) p",
        currentText: "If you'd like to collaborate or have any questions, please email me."
    },
    "contact-instagram": {
        selector: "#contact .card:nth-child(3) p:nth-child(1)",
        currentText: "Instagram: @mytraveljourney"
    },
    "contact-facebook": {
        selector: "#contact .card:nth-child(3) p:nth-child(2)",
        currentText: "Facebook: My Travel Journey"
    },
    
    // FOOTER
    "footer-copyright": {
        selector: "footer p:nth-child(1)",
        currentText: "© 2025 My Travel Journey | All Rights Reserved"
    },
    "footer-madeby": {
        selector: "footer h5",
        currentText: "-Made by UTW_Websites-"
    }
};

// Function to update content
function updateContent(updates) {
    for (const [key, newText] of Object.entries(updates)) {
        if (contentMap[key]) {
            const element = document.querySelector(contentMap[key].selector);
            if (element) {
                element.textContent = newText;
                // For paragraphs with line breaks
                if (newText.includes('\n')) {
                    element.innerHTML = newText.replace(/\n/g, '<br>');
                }
            }
        }
    }
}

// Generate edit form based on content map
function generateEditForm() {
    let formHTML = '<h1>Edit Website Content</h1><form id="content-form">';
    
    for (const [key, data] of Object.entries(contentMap)) {
        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        formHTML += `
            <div class="form-group">
                <label for="${key}">${label}:</label>
                <textarea id="${key}" name="${key}" rows="4">${data.currentText}</textarea>
            </div>
        `;
    }
    
    formHTML += '<button type="submit">Generate Update Code</button></form>';
    return formHTML;
}

// Load current content into form
function loadCurrentContentToForm() {
    for (const [key, data] of Object.entries(contentMap)) {
        const textarea = document.getElementById(key);
        if (textarea) {
            textarea.value = data.currentText;
        }
    }
}