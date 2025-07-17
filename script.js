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