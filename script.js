/**
 * JORBEL Carpintería Ebanistería — JavaScript
 * Interacciones, animaciones y filtros interactivos
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // 3. Gallery Filtering
  const filterBtns = document.querySelectorAll('.filtro');
  const galleryItems = document.querySelectorAll('.galeria-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 4. Contact Form Simulation & Validation
  const contactForm = document.getElementById('contacto-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre');
      const telefono = document.getElementById('telefono');
      const mensaje = document.getElementById('mensaje');
      const privacidad = document.getElementById('privacidad');

      let isValid = true;

      // Simple validation
      [nombre, telefono, mensaje].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#DC2626';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!privacidad.checked) {
        privacidad.focus();
        isValid = false;
      }

      if (!isValid) return;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitud...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar solicitud de presupuesto';
        formSuccess.style.display = 'flex';

        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 6000);
      }, 1000);
    });
  }

  // 5. Animated Number Counters
  const counters = document.querySelectorAll('.stat-num');
  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const targetText = counter.innerText;
      const targetNum = parseInt(targetText, 10);
      const isPercent = targetText.includes('%');
      const isPlus = targetText.includes('+');

      let current = 0;
      const duration = 1500;
      const stepTime = 20;
      const increment = targetNum / (duration / stepTime);

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          counter.innerText = targetNum + (isPlus ? '+' : '') + (isPercent ? '%' : '');
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current) + (isPlus ? '+' : '') + (isPercent ? '%' : '');
        }
      }, stepTime);
    });
  };

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.servicio-card, .testimonio-card, .proceso-step, .info-card');
  
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Trigger counters when hero stats in view
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // Lightbox modal for gallery
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.innerHTML = `
    <div class="lightbox-content">
      <img src="" alt="Vista previa del proyecto" id="lightbox-img" />
      <button class="lightbox-close" aria-label="Cerrar vista previa">&times;</button>
      <div class="lightbox-caption" id="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = modal.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || '';
      const cat = item.querySelector('.galeria-cat')?.textContent || '';
      
      lightboxImg.src = img.src;
      lightboxCaption.innerHTML = `<strong>${title}</strong> <span>· ${cat}</span>`;
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');
  lightboxClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
