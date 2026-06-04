document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     Sticky Navigation Bar
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run once on load in case page is refreshed scrolled down
  handleScroll();


  /* ==========================================================================
     Mobile Hamburger Navigation Menu
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    // Prevent body scrolling when mobile menu is open
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  };

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ==========================================================================
     Before & After Draggable Slider
     ========================================================================== */
  const slider = document.getElementById('before-after-slider');
  
  if (slider) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      
      // Calculate percentage clamped between 0 and 100
      let percentage = (x / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      
      // Apply the CSS custom variable to the slider element
      slider.style.setProperty('--slider-pos', `${percentage}%`);
    };

    // Desktop mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobile touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }


  /* ==========================================================================
     FAQ Accordion toggling
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other open FAQ items first
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });


  /* ==========================================================================
     Appointment Booking Form mock validation & submission
     ========================================================================== */
  const form = document.getElementById('appointment-form');
  const successMsg = document.getElementById('form-success-message');

  if (form && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic front-end checks
      const name = document.getElementById('full-name').value.trim();
      const phone = document.getElementById('phone-number').value.trim();

      if (name.length < 2) {
        alert('Please enter a valid name.');
        return;
      }

      if (phone.length < 9) {
        alert('Please enter a valid phone number.');
        return;
      }

      // Hide the form visually by fading out
      form.style.opacity = '0';
      
      // After fade transition, show the success panel
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.add('show');
      }, 300);
    });
  }

  /* ==========================================================================
     Scroll Reveal (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -20px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Stagger items inside lists dynamically
  const staggerContainers = document.querySelectorAll('.stagger-grid');
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.reveal');
    if (children.length > 0) {
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.12}s`;
      });
    }
  });
});
