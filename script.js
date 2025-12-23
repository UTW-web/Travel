  document.addEventListener('DOMContentLoaded', function() {
      const navLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('section');
      const homeBtn = document.querySelector('.home-btn');
      
      // Navigation link click
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const sectionId = this.getAttribute('data-section');
          
          // Hide all sections
          sections.forEach(section => {
            section.classList.remove('active');
          });
          
          // Show selected section
          document.getElementById(sectionId).classList.add('active');
          
          // Update active nav link
          navLinks.forEach(link => link.classList.remove('active'));
          this.classList.add('active');
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Show home button if not on home page
          homeBtn.style.display = sectionId === 'home' ? 'none' : 'flex';
        });
      });
      
      // Home button click
      homeBtn.addEventListener('click', function() {
        // Hide all sections
        sections.forEach(section => {
          section.classList.remove('active');
        });
        
        // Show home page
        document.getElementById('home').classList.add('active');
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('[data-section="home"]').classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Hide home button
        this.style.display = 'none';
      });
      
      // Show home button on scroll
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          homeBtn.style.display = 'flex';
        } else {
          const activeSection = document.querySelector('section.active');
          if (activeSection && activeSection.id !== 'home') {
            homeBtn.style.display = 'none';
          }
        }
      });
    });

     // Image upload functionality
  const sunriseUpload = document.getElementById('sunrise-upload');
  const sunrisePreview = document.getElementById('sunrise-preview');
  
  if (sunriseUpload) {
    sunriseUpload.addEventListener('change', function() {
      sunrisePreview.innerHTML = '';
      const files = this.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = 'Uploaded sunrise photo';
          sunrisePreview.appendChild(img);
        }
        
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Make sure the nav links for sunset/sunrise work
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.section === 'Sunset') {
      link.dataset.section = 'sunset';
    }
    if (link.dataset.section === 'Sunrise') {
      link.dataset.section = 'sunrise';
    }
  });


//Clickable image
  document.addEventListener('click', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
      const src = e.target.src;
      const overlay = document.createElement('div');
      overlay.classList.add('image-overlay');

      const zoomContainer = document.createElement('div');
      zoomContainer.className = 'zoom-container';

      const overlayImg = document.createElement('img');
      overlayImg.src = src;

      let scale = 1;
      let originX = 0;
      let originY = 0;
      let startX, startY, currentX = 0, currentY = 0;
      let isDragging = false;

      // Zoom on scroll
      zoomContainer.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.5, scale + delta), 5);
        overlayImg.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
      });

      document.addEventListener('mousemove', (ev) => {
        if (!isDragging) return;
        currentX += (ev.clientX - startX) / scale;
        currentY += (ev.clientY - startY) / scale;
        startX = ev.clientX;
        startY = ev.clientY;
        overlayImg.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        zoomContainer.style.cursor = 'grab';
      });

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-button';
      closeBtn.innerHTML = '✕';
      closeBtn.onclick = () => document.body.removeChild(overlay);

      // Close on background click
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) {
          document.body.removeChild(overlay);
        }
      });

      zoomContainer.appendChild(overlayImg);
      overlay.appendChild(zoomContainer);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
    }
  });
  
  const hamburger = document.querySelector('.hamburger');
  const menu = document.getElementById('mobileMenu');
  const submenu = document.getElementById('submenu');

  function toggleMenu() {
    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
      hamburger.style.display = 'none'; // hide hamburger when menu open
      menu.setAttribute('aria-hidden', 'false');
    } else {
      hamburger.style.display = 'flex'; // show hamburger when menu closed
      submenu.classList.remove('show'); // close submenu on menu close
      menu.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleSubmenu() {
    submenu.classList.toggle('show');
  }

  // Close menu when clicking a link (except submenu toggle)
  function closeMenu() {
    menu.classList.remove('active');
    hamburger.style.display = 'flex';
    submenu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
  }

// Initialize content loader after page loads
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    // Add admin link functionality
    const adminKey = 'travel_admin';
    
    // Add secret key combination to enable admin mode
    let keySequence = [];
    const secretCode = '3839'; // Code: 'EDIT'
    
    document.addEventListener('keydown', function(e) {
        keySequence.push(e.keyCode);
        if (keySequence.length > 4) keySequence.shift();
        
        if (keySequence.join('') === secretCode) {
            localStorage.setItem(adminKey, 'enabled');
            alert('Admin mode enabled! Edit link added to footer.');
            location.reload();
        }
    });
    
    // Check if admin mode is enabled
    if (localStorage.getItem(adminKey) === 'enabled' || window.location.search.includes('admin')) {
        const adminLink = document.createElement('a');
        adminLink.href = 'admin-panel.html';
        adminLink.innerHTML = '✏️ Edit Website Content';
        adminLink.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #f1cdaf;
            color: #5c524d;
            padding: 10px 15px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
        `;
        document.body.appendChild(adminLink);
        
        // Add disable option
        adminLink.oncontextmenu = function(e) {
            e.preventDefault();
            if (confirm('Disable admin mode?')) {
                localStorage.removeItem(adminKey);
                location.reload();
            }
        };
    }
});
