(() => {
  const paginasConCargaControlada = new Set([
    'cursos.html',
    'detalle-curso.html',
    'comprar-curso.html',
    'compra-aprobada.html',
    'mi-cuenta.html',
    'mis-cursos.html',
    'examen.html',
    'aula.html',
    'instructor.html',
    'admin.html'
  ]);

  const estado = {
    listo: false,
    temporizador: null,
    inicio: 0
  };

  const obtenerPaginaActual = () => {
    const archivo = window.location.pathname.split('/').pop();
    return archivo || 'index.html';
  };

  const esPaginaConCargaControlada = () => {
    return paginasConCargaControlada.has(obtenerPaginaActual());
  };

  const obtenerBody = () => document.body;

  const revelarPagina = () => {
    const body = obtenerBody();

    if (!body || estado.listo) {
      return;
    }

    estado.listo = true;
    window.clearTimeout(estado.temporizador);

    const tiempoMinimo = 80;
    const transcurrido = Date.now() - estado.inicio;
    const espera = Math.max(0, tiempoMinimo - transcurrido);

    window.setTimeout(() => {
      body.classList.add('edutech-data-ready');
      body.classList.remove('edutech-data-pending');
      body.classList.remove('edutech-data-loading');
    }, espera);
  };

  const prepararPagina = () => {
    const body = obtenerBody();

    if (!body || !esPaginaConCargaControlada()) {
      return;
    }

    estado.listo = false;
    estado.inicio = Date.now();
    body.classList.add('edutech-data-pending');
    body.classList.add('edutech-data-loading');
    body.classList.remove('edutech-data-ready');
    window.clearTimeout(estado.temporizador);

    estado.temporizador = window.setTimeout(() => {
      revelarPagina();
    }, 900);
  };

  window.EduTechPrepararPagina = prepararPagina;
  window.EduTechMarcarPaginaLista = revelarPagina;

  if (document.body && esPaginaConCargaControlada()) {
    prepararPagina();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!estado.listo && esPaginaConCargaControlada()) {
        prepararPagina();
      }
    });
  }
})();


document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.menu-toggle');

  if (button) {
    button.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const obtenerUsuarioActual = () => {
    if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
      return window.EduTech.obtenerUsuarioSesion();
    }

    const usuarioGuardado = localStorage.getItem('edutech_usuario');

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch (error) {
      return null;
    }
  };

  const haySesion = () => {
    if (window.EduTech && typeof window.EduTech.haySesionActiva === 'function') {
      return window.EduTech.haySesionActiva();
    }

    return localStorage.getItem('edutech_sesion_activa') === 'true' && Boolean(obtenerUsuarioActual());
  };

  const obtenerItemPorHref = (menu, href) => {
    const enlace = menu.querySelector(`a[href="${href}"]`);
    return enlace ? enlace.closest('li') : null;
  };

  const paginaActualMenu = () => {
    const ruta = window.location.pathname || '';
    return ruta.split('/').pop() || 'index.html';
  };

  const estaEnPanelInstructor = () => paginaActualMenu() === 'instructor.html';

  const usuarioEsInstructorMenu = (usuario) => {
    if (!usuario) {
      return false;
    }

    if (window.EduTech && typeof window.EduTech.usuarioTieneRol === 'function') {
      return window.EduTech.usuarioTieneRol(usuario, 'Instructor');
    }

    const idRol = Number(usuario.id_rol || usuario.idRol || 0);
    const rol = String(usuario.nombre_rol || usuario.rol || '').trim().toLowerCase();

    return idRol === 2 || rol === 'instructor';
  };

  const obtenerRutaCuenta = (usuario) => {
    if (usuarioEsInstructorMenu(usuario)) {
      return estaEnPanelInstructor() ? '#dashboard' : 'instructor.html#dashboard';
    }

    if (window.EduTech && typeof window.EduTech.obtenerRutaInicioPorRol === 'function') {
      return window.EduTech.obtenerRutaInicioPorRol(usuario);
    }

    return 'mi-cuenta.html#dashboard';
  };

  const obtenerTextoCuenta = (usuario) => {
    if (window.EduTech && typeof window.EduTech.usuarioTieneRol === 'function') {
      if (window.EduTech.usuarioTieneRol(usuario, 'Administrador')) {
        return 'Admin';
      }
    }

    return 'Mi cuenta';
  };

  const crearItemCuenta = (usuario) => {
    const item = document.createElement('li');
    item.className = 'menu-account-item';
    item.setAttribute('data-auth-item', 'cuenta');

    const enlace = document.createElement('a');
    enlace.href = obtenerRutaCuenta(usuario);
    enlace.textContent = obtenerTextoCuenta(usuario);

    if (usuarioEsInstructorMenu(usuario) && estaEnPanelInstructor()) {
      enlace.dataset.panel = 'dashboard';
    }

    item.appendChild(enlace);
    return item;
  };


  const marcarMenuListo = (menu) => {
    menu.classList.add('menu-sesion-listo');
  };

  const actualizarMenuSesion = () => {
    const menus = document.querySelectorAll('.main-menu');

    menus.forEach((menu) => {
      const itemRegistro = obtenerItemPorHref(menu, 'registro.html');
      const itemLogin = obtenerItemPorHref(menu, 'login.html');
      const itemCarrito = menu.querySelector('.menu-icon-item');
      const itemSolicitudInstructor = obtenerItemPorHref(menu, 'solicitud-instructor.html');
      let itemCuenta = menu.querySelector('[data-auth-item="cuenta"]');
      const itemCerrarSesion = menu.querySelector('[data-auth-item="cerrar-sesion"]');
      const usuario = obtenerUsuarioActual();

      if (haySesion() && usuario) {
        if (itemRegistro) {
          itemRegistro.style.display = 'none';
        }

        if (itemLogin) {
          itemLogin.style.display = 'none';
        }

        document.body.classList.toggle('edutech-role-instructor', usuarioEsInstructorMenu(usuario));

        if (itemCarrito) {
          itemCarrito.style.display = usuarioEsInstructorMenu(usuario) ? 'none' : '';
        }

        if (itemSolicitudInstructor) {
          itemSolicitudInstructor.style.display = usuarioEsInstructorMenu(usuario) ? 'none' : '';
        }

        if (!itemCuenta) {
          itemCuenta = crearItemCuenta(usuario);

          if (itemCarrito) {
            menu.insertBefore(itemCuenta, itemCarrito);
          } else {
            menu.appendChild(itemCuenta);
          }
        }

        const enlaceCuenta = itemCuenta.querySelector('a');
        if (enlaceCuenta) {
          enlaceCuenta.href = obtenerRutaCuenta(usuario);
          enlaceCuenta.textContent = obtenerTextoCuenta(usuario);

          if (usuarioEsInstructorMenu(usuario) && estaEnPanelInstructor()) {
            enlaceCuenta.dataset.panel = 'dashboard';
          } else {
            enlaceCuenta.removeAttribute('data-panel');
          }
        }

        if (itemCerrarSesion) {
          itemCerrarSesion.remove();
        }

        itemCuenta.style.display = '';
        marcarMenuListo(menu);
        return;
      }

      if (itemRegistro) {
        itemRegistro.style.display = '';
      }

      if (itemLogin) {
        itemLogin.style.display = '';
      }

      document.body.classList.remove('edutech-role-instructor');

      if (itemCarrito) {
        itemCarrito.style.display = '';
      }

      if (itemSolicitudInstructor) {
        itemSolicitudInstructor.style.display = '';
      }

      if (itemCuenta) {
        itemCuenta.remove();
      }

      if (itemCerrarSesion) {
        itemCerrarSesion.remove();
      }

      marcarMenuListo(menu);
    });
  };

  actualizarMenuSesion();
  window.addEventListener('storage', actualizarMenuSesion);
  window.EduTechActualizarMenuSesion = actualizarMenuSesion;
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
