   const sections = document.querySelectorAll('.continents');

    function showSection(id) {
      sections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(id).classList.add('active');
    }

    window.onscroll = function () {
      const btn = document.getElementById("scrollTopBtn");
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
    };

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.addEventListener("DOMContentLoaded", () => {
      showSection('home');
    });