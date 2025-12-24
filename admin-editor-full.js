// Admin Editor for ALL website content
const ADMIN_PASSWORD = 'travel2025'; // CHANGE THIS PASSWORD!
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
    
    window.location.href = 'admin-login.html';
    return false;
}

// Initialize editor
async function initEditor() {
    if (!checkAuth()) return;
    
    await loadContent();
    populateForm();
    setupAutoSave();
    
    console.log('Editor initialized with all content');
}

// Load content from JSON
async function loadContent() {
    try {
        const response = await fetch(`${CONTENT_FILE}?t=${Date.now()}`);
        
        if (response.ok) {
            contentData = await response.json();
            console.log('Content loaded successfully');
        } else {
            contentData = getDefaultContent();
            console.log('Using default content structure');
        }
    } catch (error) {
        console.warn('Could not load content:', error);
        contentData = getDefaultContent();
    }
}

// Get default content structure
function getDefaultContent() {
    return {
        home: {
            title: "Welcome to My Travel Blog",
            about1: "This is my path. A path through lands, flavors, experiences, and feelings…\nAt heart, I'm a nomad, and my soul's journey is one of exploration, tasting, creating, sensing, and connecting.\n\nIf you're looking for classic travel blogs,\nyou won't find them here.\nBut you will find many sincere reflections and feelings from my journey.\n\nMy name is Maria.\nFor a long time, I believed that the meaning of life was in work, parenting, and everyday survival—but deep inside, I felt there was something more calling me.\nAnd that's how love for myself was born—\nalongside the exploration of my own depths.",
            about2: "Today I live a simple, slow life in the countryside—\nalongside the love of my life, two curious geese, and two gentle cats.\nI feel connected to myself, to nature, and to the universe.\nMy motto? To be here and now. Fully present in this moment.\n\nI start my mornings with a glass of warm water with lemon,\nwatching nature unfold.\nThese are the moments when life feels enough.\nWhen I feel peace and freedom.\nFrom this silence and presence, this website was born.",
            about3: "If something in my words resonates with your own journey,\nI am grateful.\nGrateful that I can offer a small piece of my path\nto a world longing for more authenticity.\n\nEach of us carries something unique.\nI simply offer a glimpse into mine."
        },
        featuredCards: {
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
        cuisineCards: {
            west: {
                title: "Western Cuisine",
                description: "Italian pasta, French pastries and Mediterranean flavors."
            },
            east: {
                title: "Eastern Cuisine",
                description: "Japanese sushi, Thai curries and Vietnamese street food."
            }
        },
        homeStories: {
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
        // ALL DESTINATIONS
        destinations: {
            europe: {
                colosseum: {
                    title: "Roman Colosseum",
                    description: "Historic monument testifying to the power of ancient Rome."
                },
                paris: {
                    title: "Parisian Streets",
                    description: "Magical atmosphere of the city of love with iconic landmarks."
                },
                alps: {
                    title: "Alpine Valleys",
                    description: "Natural beauty that takes every visitor's breath away."
                }
            },
            asia: {
                cherry: {
                    title: "Japanese Cherry Blossoms",
                    description: "Magical sakura festivals in spring."
                },
                bazaar: {
                    title: "Indian Bazaars",
                    description: "Colorful mix of scents, colors and sounds."
                },
                vietnam: {
                    title: "Vietnamese Rice Fields",
                    description: "Green terraced landscapes of northern Vietnam."
                }
            },
            america: {
                west: {
                    title: "Wild West",
                    description: "Open plains and iconic landscapes of Arizona and Utah."
                },
                ny: {
                    title: "New York",
                    description: "The city that never sleeps, full of iconic landmarks."
                },
                latin: {
                    title: "Latin America",
                    description: "Welcoming people, hot music and festive atmospheres."
                }
            },
            africa: {
                kenya: {
                    title: "Kenyan Wilderness",
                    description: "Natural habitat of numerous African animals."
                },
                morocco: {
                    title: "Moroccan Markets",
                    description: "Colorful souks with traditional products."
                },
                egypt: {
                    title: "Egyptian Deserts",
                    description: "Mysterious beauty of the Sahara and pyramids."
                }
            },
            oceania: {
                kangaroo: {
                    title: "Australian Kangaroos",
                    description: "Iconic native animals of Australia."
                },
                reef: {
                    title: "Great Barrier Reef",
                    description: "The world's largest coral reef system."
                },
                islands: {
                    title: "Paradise Islands",
                    description: "White sand beaches and crystal clear water."
                }
            },
            middleEast: {
                dubai: {
                    title: "Dubai's Modern Architecture",
                    description: "Futuristic skyscrapers and luxury lifestyle."
                },
                petra: {
                    title: "Petra's Ancient City",
                    description: "Historical site carved into rose-red rock."
                },
                pyramids: {
                    title: "Egyptian Pyramids",
                    description: "Mystical monuments of ancient civilization."
                }
            },
            mariaAtHome: {
                garden: {
                    title: "My Garden",
                    description: "Growing vegetables, herbs and flowers in my backyard."
                },
                cooking: {
                    title: "Cooking at Home",
                    description: "Sharing my favorite recipes and cooking tips."
                },
                cozy: {
                    title: "Cozy Evenings",
                    description: "Enjoying quiet evenings with a good book and a cup of tea."
                }
            }
        },
        // ALL TRAVEL STORIES
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
            },
            story3: {
                title: "Mornings in Mexico",
                description: "Scent of tortillas, sounds of mariachi music and warmth of people.",
                date: "Published: January 10, 2023"
            },
            story4: {
                title: "Alone in Iceland",
                description: "Glacial lagoons, geysers and nights full of northern lights.",
                date: "Published: December 5, 2022"
            },
            story5: {
                title: "Vietnam by Bicycle",
                description: "From Hanoi to Ho Chi Minh - journey through lively streets and rice fields.",
                date: "Published: November 20, 2022"
            },
            story6: {
                title: "Magical Marrakech",
                description: "Colorful souks, scent of spices and warm Arabic hospitality.",
                date: "Published: October 15, 2022"
            },
            story7: {
                title: "Winter Fairytale in Salzburg",
                description: "Christmas markets, Mozart's music and freshly snowed streets.",
                date: "Published: December 5, 2021"
            },
            story8: {
                title: "Trans-Siberian Railway Journey",
                description: "Endless landscapes, interesting encounters and an amazing adventure.",
                date: "Published: August 20, 2021"
            }
        },
        // SUNRISE & SUNSET
        sunriseSunset: {
            sunriseText: "Each sunrise is a new beginning.\nNot just of the day, but of me.\n\nWhen the sky gently glows, I don't just watch it—I breathe it in.\nWith every inhale, I fill my body with light. I awaken my cells, greet my organs, and whisper:\n\"Good morning. I am here. I am alive.\"\n\nI collect these moments as reminders\nthat everything can start anew.\nThat each day is a chance to shine—from within.\n\nThese are my sunrises.\nMay they touch yours too.",
            sunsetText: "I've seen many of them. Those fiery ones over the desert, softly pink over the ocean, dramatic in the mountains and quiet above city rooftops.\nEach one caught me for a moment \nand reminded me how beautiful it is when the day respectfully bows into the night.But the most beautiful sunset?\nIt's on the terrace of my little house.\nThere, where I know every corner of the light. Where the wind brings familiar scents. Where the sky paints a different farewell each evening, but the feeling remains the same: this is me, I belong here.\nNothing is more calming, nothing more real.\nMaybe because nothing disturbs me. Because there's nothing to catch, prove, or capture.\nI just sit. I just am. And the world goes to sleep.",
            sunrisePhotos: {
                photo1: {
                    title: "LANZAROTE BEACH (CANARY ISLANDS; SPAIN)",
                    description: "On a quiet beach with volcanic rocks, the sun slowly rises. Warm hues light up the sand and the calm sea, creating a beautiful and peaceful morning scene."
                },
                photo2: {
                    title: "ISTANBUL (TURKEY)",
                    description: "The sky in shades of gray, blue and orange gently embraces the sea. People are already rushing to work, while the city awakens on soft light."
                },
                photo3: {
                    title: "CAPPADOCIA (TURKEY)",
                    description: "Golden white morning in Cappadocia. The sky fills with hundreds of balloons, slowly rising like gentle breaths of color caught in soft light. Stone chimneys stand tall, wrapped in morning mist that melts beneath the warm embrace of the first sun."
                },
                photo4: {
                    title: "DAWN-SOMEWHERE ABOVE THE CLOUDS",
                    description: "While all sleeps and night quietly lingers, somewhere in the distance, among mist and clouds, a sliver of light begins to appear. It gently heralds the arrival of the sun - the birth of a new day and with it, the promise of new hope."
                }
            },
            sunsetPhotos: {
                photo1: {
                    title: "NILE IN LUXOR (EGYPT)",
                    description: "The Nile and the palm trees around it glow with the warm colors of the sunset. A moment of quiet and peace that fills you with energy."
                },
                photo2: {
                    title: "LAKE GARDA (ITALY)",
                    description: "The sky turns warm shades of orange, seagulls circle above the lake and the water gently laps the shore. A peaceful and magical evening."
                },
                photo3: {
                    title: "WADI RUM (JORDAN)",
                    description: "The sun slowly sets behind the sandy dunes of Wadi Rum, painting the desert in warm orange and yellow tones. The silence and vast sky create a feeling of freedom and peace."
                },
                photo4: {
                    title: "THULUSDHOO (MALDIVES)",
                    description: "The sea is calm, gentle waves touch the sandy shore. The sky turns soft shades of grey and pink as the day fades into evening. A moment of tenderness and perfect peace."
                },
                photo5: {
                    title: "OIA, SANTORINI (GREECE)",
                    description: "A cross in the silence of sunset. Santorini glows in golden hues, the sky breathes with the sea and the heart pauses in the sacredness of the moment."
                },
                photo6: {
                    title: "KAMNIK (SLOVENIA)",
                    description: "The sky burns with fiery hues. The color spreads gently. Warmth flows through the air. Silence holds the space. Everything is at peace."
                }
            }
        },
        // OVERNIGHT STAYS
        overnightStays: {
            unique: {
                title: "Unique Stays",
                description: "From treehouses to yurts, find the perfect place to rest."
            },
            reviews: {
                title: "Hotel Reviews",
                description: "Read our reviews of the best hotels around the world."
            },
            camping: {
                title: "Camping Adventures",
                description: "Explore the great outdoors with our camping guides."
            }
        },
        // CONTACT
        contact: {
            email: "info@mytravelblog.com",
            phone: "",
            instagram: "@mytraveljourney",
            facebook: "My Travel Journey",
            collaboration: "If you'd like to collaborate or have any questions, please email me."
        },
        // FOOTER
        footer: {
            copyright: "© 2025 My Travel Journey | All Rights Reserved",
            madeBy: "-Made by UTW_Websites-"
        },
        lastUpdated: new Date().toISOString()
    };
}

// Populate form with ALL content
function populateForm() {
    // HOME PAGE
    document.getElementById('home-title').value = contentData.home?.title || '';
    document.getElementById('home-about1').value = contentData.home?.about1 || '';
    document.getElementById('home-about2').value = contentData.home?.about2 || '';
    document.getElementById('home-about3').value = contentData.home?.about3 || '';
    
    // FEATURED CARDS
    document.getElementById('card-europe-title').value = contentData.featuredCards?.europe?.title || '';
    document.getElementById('card-europe-desc').value = contentData.featuredCards?.europe?.description || '';
    document.getElementById('card-asia-title').value = contentData.featuredCards?.asia?.title || '';
    document.getElementById('card-asia-desc').value = contentData.featuredCards?.asia?.description || '';
    document.getElementById('card-america-title').value = contentData.featuredCards?.america?.title || '';
    document.getElementById('card-america-desc').value = contentData.featuredCards?.america?.description || '';
    
    // CUISINE CARDS
    document.getElementById('cuisine-west-title').value = contentData.cuisineCards?.west?.title || '';
    document.getElementById('cuisine-west-desc').value = contentData.cuisineCards?.west?.description || '';
    document.getElementById('cuisine-east-title').value = contentData.cuisineCards?.east?.title || '';
    document.getElementById('cuisine-east-desc').value = contentData.cuisineCards?.east?.description || '';
    
    // HOME STORIES
    document.getElementById('story-home1-title').value = contentData.homeStories?.story1?.title || '';
    document.getElementById('story-home1-desc').value = contentData.homeStories?.story1?.description || '';
    document.getElementById('story-home1-date').value = contentData.homeStories?.story1?.date || '';
    document.getElementById('story-home2-title').value = contentData.homeStories?.story2?.title || '';
    document.getElementById('story-home2-desc').value = contentData.homeStories?.story2?.description || '';
    document.getElementById('story-home2-date').value = contentData.homeStories?.story2?.date || '';
    
    // ALL DESTINATIONS - EUROPE
    document.getElementById('dest-europe-colosseum-title').value = contentData.destinations?.europe?.colosseum?.title || '';
    document.getElementById('dest-europe-colosseum-desc').value = contentData.destinations?.europe?.colosseum?.description || '';
    document.getElementById('dest-europe-paris-title').value = contentData.destinations?.europe?.paris?.title || '';
    document.getElementById('dest-europe-paris-desc').value = contentData.destinations?.europe?.paris?.description || '';
    document.getElementById('dest-europe-alps-title').value = contentData.destinations?.europe?.alps?.title || '';
    document.getElementById('dest-europe-alps-desc').value = contentData.destinations?.europe?.alps?.description || '';
    
    // ASIA
    document.getElementById('dest-asia-cherry-title').value = contentData.destinations?.asia?.cherry?.title || '';
    document.getElementById('dest-asia-cherry-desc').value = contentData.destinations?.asia?.cherry?.description || '';
    document.getElementById('dest-asia-bazaar-title').value = contentData.destinations?.asia?.bazaar?.title || '';
    document.getElementById('dest-asia-bazaar-desc').value = contentData.destinations?.asia?.bazaar?.description || '';
    document.getElementById('dest-asia-vietnam-title').value = contentData.destinations?.asia?.vietnam?.title || '';
    document.getElementById('dest-asia-vietnam-desc').value = contentData.destinations?.asia?.vietnam?.description || '';
    
    // AMERICA
    document.getElementById('dest-america-west-title').value = contentData.destinations?.america?.west?.title || '';
    document.getElementById('dest-america-west-desc').value = contentData.destinations?.america?.west?.description || '';
    document.getElementById('dest-america-ny-title').value = contentData.destinations?.america?.ny?.title || '';
    document.getElementById('dest-america-ny-desc').value = contentData.destinations?.america?.ny?.description || '';
    document.getElementById('dest-america-latin-title').value = contentData.destinations?.america?.latin?.title || '';
    document.getElementById('dest-america-latin-desc').value = contentData.destinations?.america?.latin?.description || '';
    
    // AFRICA
    document.getElementById('dest-africa-kenya-title').value = contentData.destinations?.africa?.kenya?.title || '';
    document.getElementById('dest-africa-kenya-desc').value = contentData.destinations?.africa?.kenya?.description || '';
    document.getElementById('dest-africa-morocco-title').value = contentData.destinations?.africa?.morocco?.title || '';
    document.getElementById('dest-africa-morocco-desc').value = contentData.destinations?.africa?.morocco?.description || '';
    document.getElementById('dest-africa-egypt-title').value = contentData.destinations?.africa?.egypt?.title || '';
    document.getElementById('dest-africa-egypt-desc').value = contentData.destinations?.africa?.egypt?.description || '';
    
    // OCEANIA
    document.getElementById('dest-oceania-kangaroo-title').value = contentData.destinations?.oceania?.kangaroo?.title || '';
    document.getElementById('dest-oceania-kangaroo-desc').value = contentData.destinations?.oceania?.kangaroo?.description || '';
    document.getElementById('dest-oceania-reef-title').value = contentData.destinations?.oceania?.reef?.title || '';
    document.getElementById('dest-oceania-reef-desc').value = contentData.destinations?.oceania?.reef?.description || '';
    document.getElementById('dest-oceania-islands-title').value = contentData.destinations?.oceania?.islands?.title || '';
    document.getElementById('dest-oceania-islands-desc').value = contentData.destinations?.oceania?.islands?.description || '';
    
    // MIDDLE EAST
    document.getElementById('dest-mideast-dubai-title').value = contentData.destinations?.middleEast?.dubai?.title || '';
    document.getElementById('dest-mideast-dubai-desc').value = contentData.destinations?.middleEast?.dubai?.description || '';
    document.getElementById('dest-mideast-petra-title').value = contentData.destinations?.middleEast?.petra?.title || '';
    document.getElementById('dest-mideast-petra-desc').value = contentData.destinations?.middleEast?.petra?.description || '';
    document.getElementById('dest-mideast-pyramids-title').value = contentData.destinations?.middleEast?.pyramids?.title || '';
    document.getElementById('dest-mideast-pyramids-desc').value = contentData.destinations?.middleEast?.pyramids?.description || '';
    
    // MARIA AT HOME
    document.getElementById('dest-maria-garden-title').value = contentData.destinations?.mariaAtHome?.garden?.title || '';
    document.getElementById('dest-maria-garden-desc').value = contentData.destinations?.mariaAtHome?.garden?.description || '';
    document.getElementById('dest-maria-cooking-title').value = contentData.destinations?.mariaAtHome?.cooking?.title || '';
    document.getElementById('dest-maria-cooking-desc').value = contentData.destinations?.mariaAtHome?.cooking?.description || '';
    document.getElementById('dest-maria-cozy-title').value = contentData.destinations?.mariaAtHome?.cozy?.title || '';
    document.getElementById('dest-maria-cozy-desc').value = contentData.destinations?.mariaAtHome?.cozy?.description || '';
    
    // ALL TRAVEL STORIES
    document.getElementById('story1-title').value = contentData.stories?.story1?.title || '';
    document.getElementById('story1-desc').value = contentData.stories?.story1?.description || '';
    document.getElementById('story1-date').value = contentData.stories?.story1?.date || '';
    document.getElementById('story2-title').value = contentData.stories?.story2?.title || '';
    document.getElementById('story2-desc').value = contentData.stories?.story2?.description || '';
    document.getElementById('story2-date').value = contentData.stories?.story2?.date || '';
    document.getElementById('story3-title').value = contentData.stories?.story3?.title || '';
    document.getElementById('story3-desc').value = contentData.stories?.story3?.description || '';
    document.getElementById('story3-date').value = contentData.stories?.story3?.date || '';
    document.getElementById('story4-title').value = contentData.stories?.story4?.title || '';
    document.getElementById('story4-desc').value = contentData.stories?.story4?.description || '';
    document.getElementById('story4-date').value = contentData.stories?.story4?.date || '';
    document.getElementById('story5-title').value = contentData.stories?.story5?.title || '';
    document.getElementById('story5-desc').value = contentData.stories?.story5?.description || '';
    document.getElementById('story5-date').value = contentData.stories?.story5?.date || '';
    document.getElementById('story6-title').value = contentData.stories?.story6?.title || '';
    document.getElementById('story6-desc').value = contentData.stories?.story6?.description || '';
    document.getElementById('story6-date').value = contentData.stories?.story6?.date || '';
    document.getElementById('story7-title').value = contentData.stories?.story7?.title || '';
    document.getElementById('story7-desc').value = contentData.stories?.story7?.description || '';
    document.getElementById('story7-date').value = contentData.stories?.story7?.date || '';
    document.getElementById('story8-title').value = contentData.stories?.story8?.title || '';
    document.getElementById('story8-desc').value = contentData.stories?.story8?.description || '';
    document.getElementById('story8-date').value = contentData.stories?.story8?.date || '';
    
    // SUNRISE & SUNSET
    document.getElementById('sunrise-main-text').value = contentData.sunriseSunset?.sunriseText || '';
    document.getElementById('sunset-main-text').value = contentData.sunriseSunset?.sunsetText || '';
    
    // SUNRISE PHOTOS
    document.getElementById('sunrise1-title').value = contentData.sunriseSunset?.sunrisePhotos?.photo1?.title || '';
    document.getElementById('sunrise1-desc').value = contentData.sunriseSunset?.sunrisePhotos?.photo1?.description || '';
    document.getElementById('sunrise2-title').value = contentData.sunriseSunset?.sunrisePhotos?.photo2?.title || '';
    document.getElementById('sunrise2-desc').value = contentData.sunriseSunset?.sunrisePhotos?.photo2?.description || '';
    document.getElementById('sunrise3-title').value = contentData.sunriseSunset?.sunrisePhotos?.photo3?.title || '';
    document.getElementById('sunrise3-desc').value = contentData.sunriseSunset?.sunrisePhotos?.photo3?.description || '';
    document.getElementById('sunrise4-title').value = contentData.sunriseSunset?.sunrisePhotos?.photo4?.title || '';
    document.getElementById('sunrise4-desc').value = contentData.sunriseSunset?.sunrisePhotos?.photo4?.description || '';
    
    // SUNSET PHOTOS
    document.getElementById('sunset1-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo1?.title || '';
    document.getElementById('sunset1-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo1?.description || '';
    document.getElementById('sunset2-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo2?.title || '';
    document.getElementById('sunset2-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo2?.description || '';
    document.getElementById('sunset3-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo3?.title || '';
    document.getElementById('sunset3-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo3?.description || '';
    document.getElementById('sunset4-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo4?.title || '';
    document.getElementById('sunset4-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo4?.description || '';
    document.getElementById('sunset5-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo5?.title || '';
    document.getElementById('sunset5-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo5?.description || '';
    document.getElementById('sunset6-title').value = contentData.sunriseSunset?.sunsetPhotos?.photo6?.title || '';
    document.getElementById('sunset6-desc').value = contentData.sunriseSunset?.sunsetPhotos?.photo6?.description || '';
    
    // OVERNIGHT STAYS
    document.getElementById('stays-unique-title').value = contentData.overnightStays?.unique?.title || '';
    document.getElementById('stays-unique-desc').value = contentData.overnightStays?.unique?.description || '';
    document.getElementById('stays-reviews-title').value = contentData.overnightStays?.reviews?.title || '';
    document.getElementById('stays-reviews-desc').value = contentData.overnightStays?.reviews?.description || '';
    document.getElementById('stays-camping-title').value = contentData.overnightStays?.camping?.title || '';
    document.getElementById('stays-camping-desc').value = contentData.overnightStays?.camping?.description || '';
    
    // CONTACT
    document.getElementById('contact-email').value = contentData.contact?.email || '';
    document.getElementById('contact-phone').value = contentData.contact?.phone || '';
    document.getElementById('contact-instagram').value = contentData.contact?.instagram || '';
    document.getElementById('contact-facebook').value = contentData.contact?.facebook || '';
    document.getElementById('contact-collab').value = contentData.contact?.collaboration || '';
    
    // FOOTER
    document.getElementById('footer-copyright').value = contentData.footer?.copyright || '';
    document.getElementById('footer-madeby').value = contentData.footer?.madeBy || '';
}

// Setup auto-save
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateContentData();
            scheduleSave();
        });
    });
    
    // Also save on blur (when user leaves a field)
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            updateContentData();
            scheduleSave();
        });
    });
}

// Update content data object
function updateContentData() {
    // HOME PAGE
    contentData.home = {
        title: document.getElementById('home-title').value,
        about1: document.getElementById('home-about1').value,
        about2: document.getElementById('home-about2').value,
        about3: document.getElementById('home-about3').value
    };
    
    // FEATURED CARDS
    contentData.featuredCards = {
        europe: {
            title: document.getElementById('card-europe-title').value,
            description: document.getElementById('card-europe-desc').value
        },
        asia: {
            title: document.getElementById('card-asia-title').value,
            description: document.getElementById('card-asia-desc').value
        },
        america: {
            title: document.getElementById('card-america-title').value,
            description: document.getElementById('card-america-desc').value
        }
    };
    
    // CUISINE CARDS
    contentData.cuisineCards = {
        west: {
            title: document.getElementById('cuisine-west-title').value,
            description: document.getElementById('cuisine-west-desc').value
        },
        east: {
            title: document.getElementById('cuisine-east-title').value,
            description: document.getElementById('cuisine-east-desc').value
        }
    };
    
    // HOME STORIES
    contentData.homeStories = {
        story1: {
            title: document.getElementById('story-home1-title').value,
            description: document.getElementById('story-home1-desc').value,
            date: document.getElementById('story-home1-date').value
        },
        story2: {
            title: document.getElementById('story-home2-title').value,
            description: document.getElementById('story-home2-desc').value,
            date: document.getElementById('story-home2-date').value
        }
    };
    
    // ALL DESTINATIONS - EUROPE
    contentData.destinations = contentData.destinations || {};
    contentData.destinations.europe = {
        colosseum: {
            title: document.getElementById('dest-europe-colosseum-title').value,
            description: document.getElementById('dest-europe-colosseum-desc').value
        },
        paris: {
            title: document.getElementById('dest-europe-paris-title').value,
            description: document.getElementById('dest-europe-paris-desc').value
        },
        alps: {
            title: document.getElementById('dest-europe-alps-title').value,
            description: document.getElementById('dest-europe-alps-desc').value
        }
    };
    
    // ASIA
    contentData.destinations.asia = {
        cherry: {
            title: document.getElementById('dest-asia-cherry-title').value,
            description: document.getElementById('dest-asia-cherry-desc').value
        },
        bazaar: {
            title: document.getElementById('dest-asia-bazaar-title').value,
            description: document.getElementById('dest-asia-bazaar-desc').value
        },
        vietnam: {
            title: document.getElementById('dest-asia-vietnam-title').value,
            description: document.getElementById('dest-asia-vietnam-desc').value
        }
    };
    
    // AMERICA
    contentData.destinations.america = {
        west: {
            title: document.getElementById('dest-america-west-title').value,
            description: document.getElementById('dest-america-west-desc').value
        },
        ny: {
            title: document.getElementById('dest-america-ny-title').value,
            description: document.getElementById('dest-america-ny-desc').value
        },
        latin: {
            title: document.getElementById('dest-america-latin-title').value,
            description: document.getElementById('dest-america-latin-desc').value
        }
    };
    
    // AFRICA
    contentData.destinations.africa = {
        kenya: {
            title: document.getElementById('dest-africa-kenya-title').value,
            description: document.getElementById('dest-africa-kenya-desc').value
        },
        morocco: {
            title: document.getElementById('dest-africa-morocco-title').value,
            description: document.getElementById('dest-africa-morocco-desc').value
        },
        egypt: {
            title: document.getElementById('dest-africa-egypt-title').value,
            description: document.getElementById('dest-africa-egypt-desc').value
        }
    };
    
    // OCEANIA
    contentData.destinations.oceania = {
        kangaroo: {
            title: document.getElementById('dest-oceania-kangaroo-title').value,
            description: document.getElementById('dest-oceania-kangaroo-desc').value
        },
        reef: {
            title: document.getElementById('dest-oceania-reef-title').value,
            description: document.getElementById('dest-oceania-reef-desc').value
        },
        islands: {
            title: document.getElementById('dest-oceania-islands-title').value,
            description: document.getElementById('dest-oceania-islands-desc').value
        }
    };
    
    // MIDDLE EAST
    contentData.destinations.middleEast = {
        dubai: {
            title: document.getElementById('dest-mideast-dubai-title').value,
            description: document.getElementById('dest-mideast-dubai-desc').value
        },
        petra: {
            title: document.getElementById('dest-mideast-petra-title').value,
            description: document.getElementById('dest-mideast-petra-desc').value
        },
        pyramids: {
            title: document.getElementById('dest-mideast-pyramids-title').value,
            description: document.getElementById('dest-mideast-pyramids-desc').value
        }
    };
    
    // MARIA AT HOME
    contentData.destinations.mariaAtHome = {
        garden: {
            title: document.getElementById('dest-maria-garden-title').value,
            description: document.getElementById('dest-maria-garden-desc').value
        },
        cooking: {
            title: document.getElementById('dest-maria-cooking-title').value,
            description: document.getElementById('dest-maria-cooking-desc').value
        },
        cozy: {
            title: document.getElementById('dest-maria-cozy-title').value,
            description: document.getElementById('dest-maria-cozy-desc').value
        }
    };
    
    // ALL TRAVEL STORIES
    contentData.stories = {
        story1: {
            title: document.getElementById('story1-title').value,
            description: document.getElementById('story1-desc').value,
            date: document.getElementById('story1-date').value
        },
        story2: {
            title: document.getElementById('story2-title').value,
            description: document.getElementById('story2-desc').value,
            date: document.getElementById('story2-date').value
        },
        story3: {
            title: document.getElementById('story3-title').value,
            description: document.getElementById('story3-desc').value,
            date: document.getElementById('story3-date').value
        },
        story4: {
            title: document.getElementById('story4-title').value,
            description: document.getElementById('story4-desc').value,
            date: document.getElementById('story4-date').value
        },
        story5: {
            title: document.getElementById('story5-title').value,
            description: document.getElementById('story5-desc').value,
            date: document.getElementById('story5-date').value
        },
        story6: {
            title: document.getElementById('story6-title').value,
            description: document.getElementById('story6-desc').value,
            date: document.getElementById('story6-date').value
        },
        story7: {
            title: document.getElementById('story7-title').value,
            description: document.getElementById('story7-desc').value,
            date: document.getElementById('story7-date').value
        },
        story8: {
            title: document.getElementById('story8-title').value,
            description: document.getElementById('story8-desc').value,
            date: document.getElementById('story8-date').value
        }
    };
    
    // SUNRISE & SUNSET
    contentData.sunriseSunset = {
        sunriseText: document.getElementById('sunrise-main-text').value,
        sunsetText: document.getElementById('sunset-main-text').value,
        sunrisePhotos: {
            photo1: {
                title: document.getElementById('sunrise1-title').value,
                description: document.getElementById('sunrise1-desc').value
            },
            photo2: {
                title: document.getElementById('sunrise2-title').value,
                description: document.getElementById('sunrise2-desc').value
            },
            photo3: {
                title: document.getElementById('sunrise3-title').value,
                description: document.getElementById('sunrise3-desc').value
            },
            photo4: {
                title: document.getElementById('sunrise4-title').value,
                description: document.getElementById('sunrise4-desc').value
            }
        },
        sunsetPhotos: {
            photo1: {
                title: document.getElementById('sunset1-title').value,
                description: document.getElementById('sunset1-desc').value
            },
            photo2: {
                title: document.getElementById('sunset2-title').value,
                description: document.getElementById('sunset2-desc').value
            },
            photo3: {
                title: document.getElementById('sunset3-title').value,
                description: document.getElementById('sunset3-desc').value
            },
            photo4: {
                title: document.getElementById('sunset4-title').value,
                description: document.getElementById('sunset4-desc').value
            },
            photo5: {
                title: document.getElementById('sunset5-title').value,
                description: document.getElementById('sunset5-desc').value
            },
            photo6: {
                title: document.getElementById('sunset6-title').value,
                description: document.getElementById('sunset6-desc').value
            }
        }
    };
    
    // OVERNIGHT STAYS
    contentData.overnightStays = {
        unique: {
            title: document.getElementById('stays-unique-title').value,
            description: document.getElementById('stays-unique-desc').value
        },
        reviews: {
            title: document.getElementById('stays-reviews-title').value,
            description: document.getElementById('stays-reviews-desc').value
        },
        camping: {
            title: document.getElementById('stays-camping-title').value,
            description: document.getElementById('stays-camping-desc').value
        }
    };
    
    // CONTACT
    contentData.contact = {
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        instagram: document.getElementById('contact-instagram').value,
        facebook: document.getElementById('contact-facebook').value,
        collaboration: document.getElementById('contact-collab').value
    };
    
    // FOOTER
    contentData.footer = {
        copyright: document.getElementById('footer-copyright').value,
        madeBy: document.getElementById('footer-madeby').value
    };
    
    contentData.lastUpdated = new Date().toISOString();
}

// Schedule save with debounce
function scheduleSave() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    const status = document.getElementById('statusIndicator');
    status.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Saving changes...</span>';
    status.className = 'status-indicator saving';
    
    saveTimeout = setTimeout(async () => {
        await saveContent();
    }, 1500);
}

// Save content
async function saveContent() {
    if (isSaving) return;
    
    isSaving = true;
    
    try {
        updateContentData();
        
        // Save to localStorage as backup
        localStorage.setItem('travel_blog_content', JSON.stringify(contentData));
        localStorage.setItem('travel_blog_last_update', Date.now().toString());
        
        // Create downloadable JSON file
        const jsonStr = JSON.stringify(contentData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
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
        
        showNotification('All changes saved successfully!');
        
        // Update live site
        updateLiveSite();
        
    } catch (error) {
        console.error('Error saving content:', error);
        
        const status = document.getElementById('statusIndicator');
        status.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Error saving</span>';
        status.className = 'status-indicator saving';
        
        showNotification('Error saving changes. Please try again.', true);
    } finally {
        isSaving = false;
    }
}

// Update live site
function updateLiveSite() {
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
    
    setTimeout(() => {
        notice.style.display = 'none';
    }, 3000);
}

// Filter sections by search
function filterSections() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sections = document.querySelectorAll('.edit-section');
    const cards = document.querySelectorAll('.card-edit');
    
    if (!searchTerm) {
        // Show everything
        sections.forEach(section => section.style.display = 'block');
        cards.forEach(card => card.style.display = 'block');
        return;
    }
    
    // Hide all sections first
    sections.forEach(section => section.style.display = 'none');
    
    // Show sections that match search
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            section.style.display = 'block';
            
            // Within visible sections, hide non-matching cards
            const sectionCards = section.querySelectorAll('.card-edit');
            sectionCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                card.style.display = cardText.includes(searchTerm) ? 'block' : 'none';
            });
        }
    });
}

// View live site
function viewLiveSite() {
    window.open('index.html?preview=true', '_blank');
}

// Logout
function logout() {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = 'admin-login.html';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initEditor);