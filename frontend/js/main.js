document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.menu-toggle');

  if (button) {
    button.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach((toggle) => {
    const targetId = toggle.getAttribute('data-target');
    const input = targetId ? document.getElementById(targetId) : toggle.parentElement.querySelector('input');

    if (!input) {
      return;
    }

    toggle.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(isHidden));
      toggle.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.hero-carousel');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
  const prev = carousel.querySelector('.hero-prev');
  const next = carousel.querySelector('.hero-next');

  if (!slides.length) {
    return;
  }

  let current = 0;
  let timer = null;
  let locked = false;

  const showSlide = (index, direction) => {
    if (locked || index === current) {
      return;
    }

    locked = true;

    const previous = current;
    current = (index + slides.length) % slides.length;

    slides[previous].classList.remove('active', 'is-leaving-left', 'is-leaving-right');
    slides[previous].classList.add(direction === 'prev' ? 'is-leaving-right' : 'is-leaving-left');

    if (dots[previous]) {
      dots[previous].classList.remove('active');
    }

    slides[current].classList.remove('is-leaving-left', 'is-leaving-right');
    slides[current].classList.add('active');

    if (dots[current]) {
      dots[current].classList.add('active');
    }

    window.setTimeout(() => {
      slides[previous].classList.remove('is-leaving-left', 'is-leaving-right');
      locked = false;
    }, 680);
  };

  const nextSlide = () => {
    showSlide(current + 1, 'next');
  };

  const prevSlide = () => {
    showSlide(current - 1, 'prev');
  };

  const restartTimer = () => {
    window.clearInterval(timer);
    timer = window.setInterval(nextSlide, 6500);
  };

  if (next) {
    next.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const direction = index < current ? 'prev' : 'next';
      showSlide(index, direction);
      restartTimer();
    });
  });

  carousel.addEventListener('mouseenter', () => {
    window.clearInterval(timer);
  });

  carousel.addEventListener('mouseleave', restartTimer);

  restartTimer();
});
