const body = document.body;
const root = document.documentElement;
const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const loader = document.getElementById('pageLoader');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const navItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], main section');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
  backToTop?.classList.toggle('visible', window.scrollY > 600);

  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id') || '';
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-count'));
    const duration = 1400;
    const startTime = performance.now();

    const step = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(step);
  });
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  },
  { threshold: 0.6 }
);

const statsSection = document.querySelector('.stats-card');
statsSection && counterObserver.observe(statsSection);

let testimonialIndex = 0;
let sliderTimer;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === index);
  });
  dots.forEach((dot) => {
    dot.classList.toggle('active', Number(dot.dataset.index) === index);
  });
};

const startSlider = () => {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 5000);
};

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    testimonialIndex = Number(dot.dataset.index);
    showTestimonial(testimonialIndex);
    startSlider();
  });
});

showTestimonial(testimonialIndex);
startSlider();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-list details').forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.textContent = 'Thanks for reaching out — we will contact you shortly.';
  contactForm.reset();
});

document.querySelectorAll('.newsletter-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    if (input) {
      input.value = '';
      alert('Thank you for subscribing to EstateFlow updates.');
    }
  });
});

const updateThemeToggle = () => {
  if (!themeToggle) return;
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
};

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
  localStorage.setItem('estateflow-theme', nextTheme);
  updateThemeToggle();
});

updateThemeToggle();

window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 700);
});
