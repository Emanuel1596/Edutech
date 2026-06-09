(() => {
  const linksPanel = document.querySelectorAll('.mi-cuenta-link[data-panel]');
  const botonesPanel = document.querySelectorAll('[data-panel-target]');
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');

  const dashboardCursosResumen = document.getElementById('dashboardCursosResumen');
  const dashboardCursosTodos = document.getElementById('dashboardCursosTodos');
  const dashboardLogros = document.getElementById('dashboardLogros');
  const dashboardLogrosCompleto = document.getElementById('dashboardLogrosCompleto');
  const dashboardCertificados = document.getElementById('dashboardCertificados');
  const dashboardCertificadosTodos = document.getElementById('dashboardCertificadosTodos');
  const dashboardAvisos = document.getElementById('dashboardAvisos');
  const dashboardPedidos = document.getElementById('dashboardPedidos');

  const formEditarCuenta = document.getElementById('formEditarCuenta');
  const accountNombre = document.getElementById('accountNombre');
  const accountCorreo = document.getElementById('accountCorreo');
  const mensajeCuentaGuardada = document.getElementById('mensajeCuentaGuardada');

  const obtenerJSON = (clave, valorDefault) => {
    const valorLocal = localStorage.getItem(clave);
    const valorSession = sessionStorage.getItem(clave);
    const valor = valorLocal || valorSession;

    if (!valor) {
      return valorDefault;
    }

    try {
      return JSON.parse(valor);
    } catch (error) {
      return valorDefault;
    }
  };

  const guardarJSON = (clave, valor) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  };

  const crearElemento = (etiqueta, clase, texto) => {
    const elemento = document.createElement(etiqueta);

    if (clase) {
      elemento.className = clase;
    }

    if (texto !== undefined && texto !== null) {
      elemento.textContent = texto;
    }

    return elemento;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return 'Fecha no disponible';
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaConvertida.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearPrecio = (precio) => {
    const numero = Number(precio);

    if (Number.isNaN(numero)) {
      return '$0 MXN';
    }

    return `$${numero.toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })} MXN`;
  };

  const obtenerUsuario = () => {
    return obtenerJSON('edutech_usuario', {
      nombre: 'Alumno EduTech',
      correo: ''
    });
  };

  const obtenerAvances = () => {
    return obtenerJSON('edutech_avances_cursos', {});
  };

  const normalizarCurso = (curso) => {
    const titulo = curso.curso || curso.titulo || 'Curso EduTech';
    const instructorNombre = curso.instructor || curso.nombre_instructor || 'Instructor EduTech';
    const instructorApellido = curso.apellido_paterno_instructor || '';
    const instructorCompleto = `${instructorNombre} ${instructorApellido}`.trim();
    const nivel = curso.nivel || curso.nombre_nivel || 'Por definir';
    const lecciones = curso.lecciones || curso.total_lecciones || 'Por definir';
    const precio = curso.precio || curso.precio_mxn || curso.total || 0;
    const imagen = curso.imagen_portada || 'assets/img/banner-cursos-edutech.svg';
    const estado = curso.estatus || 'Matriculado';
    const fechaCompra = curso.fecha_compra || curso.fecha || null;

    return {
      id_curso: curso.id_curso || curso.id || null,
      curso: titulo,
      instructor: instructorCompleto || 'Instructor EduTech',
      nivel,
      lecciones,
      precio,
      imagen_portada: imagen,
      estatus: estado,
      fecha_compra: fechaCompra
    };
  };

  const obtenerCursos = () => {
    const cursosGuardados = obtenerJSON('edutech_mis_cursos', []);

    if (!Array.isArray(cursosGuardados)) {
      return [];
    }

    return cursosGuardados.map(normalizarCurso);
  };

  const obtenerPorcentajeCurso = (curso) => {
    const avances = obtenerAvances();
    const avanceCurso = avances[String(curso.id_curso)];

    if (!avanceCurso) {
      return 0;
    }

    const totalLecciones = typeof curso.lecciones === 'number' ? curso.lecciones : Number(curso.lecciones);

    if (!totalLecciones || Number.isNaN(totalLecciones) || totalLecciones <= 0) {
      return 0;
    }

    const completadas = Object.values(avanceCurso).filter(Boolean).length;
    const porcentaje = Math.round((completadas / totalLecciones) * 100);

    if (porcentaje > 100) {
      return 100;
    }

    return porcentaje;
  };

  const crearTarjetaCurso = (curso) => {
    const item = crearElemento('li', 'mi-cuenta-course-item');
    const card = crearElemento('article', 'mi-cuenta-course-card');

    const enlace = document.createElement('a');
    enlace.className = 'mi-cuenta-course-link';
    enlace.href = curso.id_curso ? `detalle-curso.html?id=${curso.id_curso}` : 'detalle-curso.html';

    const imagen = document.createElement('img');
    imagen.className = 'mi-cuenta-course-image';
    imagen.src = curso.imagen_portada;
    imagen.alt = `Imagen del curso ${curso.curso}`;
    imagen.loading = 'lazy';
    imagen.onerror = () => {
      imagen.onerror = null;
      imagen.src = 'assets/img/banner-cursos-edutech.svg';
    };

    const contenido = crearElemento('div', 'mi-cuenta-course-body');
    const titulo = crearElemento('h4', 'mi-cuenta-course-title', curso.curso);

    const autor = crearElemento('p', 'mi-cuenta-course-author', curso.instructor);

    const dificultad = crearElemento('p', 'mi-cuenta-course-meta');
    dificultad.innerHTML = `<strong>Dificultad:</strong> ${curso.nivel}`;

    const lecciones = crearElemento('p', 'mi-cuenta-course-meta');
    lecciones.innerHTML = `<strong>Número de lecciones:</strong> ${curso.lecciones}`;

    const estado = crearElemento('p', 'mi-cuenta-course-meta');
    estado.innerHTML = `<strong>Estado:</strong> ${curso.estatus}`;

    const fecha = crearElemento('p', 'mi-cuenta-course-meta');
    fecha.innerHTML = `<strong>Matriculado:</strong> ${formatearFecha(curso.fecha_compra)}`;

    const progresoWrap = crearElemento('div', 'mi-cuenta-progress-wrap');
    const progresoTexto = crearElemento('span', 'mi-cuenta-progress-text', `${obtenerPorcentajeCurso(curso)}% completado`);
    const progresoBarra = crearElemento('div', 'mi-cuenta-progress-bar');
    const progresoCompleto = crearElemento('div', 'mi-cuenta-progress-fill');

    progresoCompleto.style.width = `${obtenerPorcentajeCurso(curso)}%`;

    progresoBarra.appendChild(progresoCompleto);
    progresoWrap.appendChild(progresoTexto);
    progresoWrap.appendChild(progresoBarra);

    contenido.appendChild(titulo);
    contenido.appendChild(autor);
    contenido.appendChild(dificultad);
    contenido.appendChild(lecciones);
    contenido.appendChild(estado);
    contenido.appendChild(fecha);
    contenido.appendChild(progresoWrap);

    enlace.appendChild(imagen);
    enlace.appendChild(contenido);

    card.appendChild(enlace);
    item.appendChild(card);

    return item;
  };

  const pintarListaVacia = (contenedor, texto) => {
    if (!contenedor) {
      return;
    }

    contenedor.innerHTML = '';

    const caja = crearElemento('div', 'mi-cuenta-empty-box');
    const mensaje = crearElemento('p', 'mi-cuenta-empty-text', texto);
    const enlace = document.createElement('a');

    enlace.href = 'cursos.html';
    enlace.className = 'mi-cuenta-action-button';
    enlace.textContent = 'Ver cursos';

    caja.appendChild(mensaje);
    caja.appendChild(enlace);
    contenedor.appendChild(caja);
  };

  const pintarCursos = (contenedor, limite = null) => {
    if (!contenedor) {
      return;
    }

    const cursos = obtenerCursos();

    if (cursos.length === 0) {
      pintarListaVacia(contenedor, 'Todavía no tienes cursos comprados.');
      return;
    }

    contenedor.innerHTML = '';

    const cursosMostrar = limite ? cursos.slice(0, limite) : cursos;

    cursosMostrar.forEach((curso) => {
      contenedor.appendChild(crearTarjetaCurso(curso));
    });
  };

  const obtenerLogros = () => {
    const cursos = obtenerCursos();
    const cursosCompletados = cursos.filter((curso) => obtenerPorcentajeCurso(curso) === 100);

    return cursosCompletados.map((curso) => {
      return `Completaste el curso ${curso.curso}`;
    });
  };

  const pintarLogros = (contenedor) => {
    if (!contenedor) {
      return;
    }

    const logros = obtenerLogros();
    contenedor.innerHTML = '';

    if (logros.length === 0) {
      contenedor.appendChild(crearElemento('p', 'mi-cuenta-plain-text', 'No hay ningún logro obtenido. Los mismos estarán disponibles en breve.'));
      return;
    }

    const lista = crearElemento('ul', 'mi-cuenta-simple-list');

    logros.forEach((logro) => {
      lista.appendChild(crearElemento('li', null, logro));
    });

    contenedor.appendChild(lista);
  };

  const obtenerCertificados = () => {
    const cursos = obtenerCursos();

    return cursos.filter((curso) => obtenerPorcentajeCurso(curso) === 100).map((curso) => {
      return {
        curso: curso.curso,
        fecha: curso.fecha_compra
      };
    });
  };

  const pintarCertificados = (contenedor) => {
    if (!contenedor) {
      return;
    }

    const certificados = obtenerCertificados();
    contenedor.innerHTML = '';

    if (certificados.length === 0) {
      contenedor.appendChild(crearElemento('p', 'mi-cuenta-plain-text', 'Todavía no hay certificados disponibles.'));
      return;
    }

    certificados.forEach((certificado) => {
      const card = crearElemento('div', 'mi-cuenta-info-card');
      const titulo = crearElemento('h4', 'mi-cuenta-info-card-title', certificado.curso);
      const fecha = crearElemento('p', 'mi-cuenta-plain-text', `Emitido: ${formatearFecha(certificado.fecha)}`);

      card.appendChild(titulo);
      card.appendChild(fecha);
      contenedor.appendChild(card);
    });
  };

  const pintarAvisos = () => {
    if (!dashboardAvisos) {
      return;
    }

    dashboardAvisos.innerHTML = '';

    const cursos = obtenerCursos();

    if (cursos.length === 0) {
      dashboardAvisos.appendChild(crearElemento('p', 'mi-cuenta-plain-text', 'No hay avisos nuevos por el momento.'));
      return;
    }

    const lista = crearElemento('ul', 'mi-cuenta-simple-list');

    lista.appendChild(crearElemento('li', null, 'Recuerda revisar tus cursos comprados en la sección Mis cursos.'));
    lista.appendChild(crearElemento('li', null, 'Si completas un curso, aquí se reflejarán tus avances y certificados.'));

    dashboardAvisos.appendChild(lista);
  };

  const pintarPedidos = () => {
    if (!dashboardPedidos) {
      return;
    }

    const cursos = obtenerCursos();
    dashboardPedidos.innerHTML = '';

    if (cursos.length === 0) {
      dashboardPedidos.appendChild(crearElemento('p', 'mi-cuenta-plain-text', 'Todavía no hay pedidos registrados.'));
      return;
    }

    const tabla = document.createElement('table');
    tabla.className = 'mi-cuenta-table';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    thead.innerHTML = `
      <tr>
        <th>Curso</th>
        <th>Total</th>
        <th>Fecha</th>
        <th>Estado</th>
      </tr>
    `;

    cursos.forEach((curso) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${curso.curso}</td>
        <td>${formatearPrecio(curso.precio)}</td>
        <td>${formatearFecha(curso.fecha_compra)}</td>
        <td>${curso.estatus}</td>
      `;
      tbody.appendChild(fila);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    dashboardPedidos.appendChild(tabla);
  };

  const cargarDatosUsuario = () => {
    const usuario = obtenerUsuario();

    if (accountNombre) {
      accountNombre.value = usuario.nombre || '';
    }

    if (accountCorreo) {
      accountCorreo.value = usuario.correo || '';
    }
  };

  const guardarDatosUsuario = (evento) => {
    evento.preventDefault();

    const usuarioActual = obtenerUsuario();
    const nuevoUsuario = {
      ...usuarioActual,
      nombre: accountNombre ? accountNombre.value.trim() : '',
      correo: accountCorreo ? accountCorreo.value.trim() : ''
    };

    guardarJSON('edutech_usuario', nuevoUsuario);

    if (mensajeCuentaGuardada) {
      mensajeCuentaGuardada.style.display = 'block';
    }
  };

  const cambiarPanel = (panel) => {
    document.querySelectorAll('.mi-cuenta-panel').forEach((panelItem) => {
      panelItem.classList.remove('active');
    });

    document.querySelectorAll('.mi-cuenta-link[data-panel]').forEach((link) => {
      link.classList.remove('active');
    });

    const panelObjetivo = document.getElementById(`panel-${panel}`);
    const linkObjetivo = document.querySelector(`.mi-cuenta-link[data-panel="${panel}"]`);

    if (panelObjetivo) {
      panelObjetivo.classList.add('active');
    }

    if (linkObjetivo) {
      linkObjetivo.classList.add('active');
    }
  };

  const cerrarSesionCuenta = () => {
    sessionStorage.removeItem('edutech_usuario');
    sessionStorage.removeItem('edutech_id_usuario');
    window.location.href = 'index.html';
  };

  linksPanel.forEach((link) => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      cambiarPanel(link.dataset.panel);
    });
  });

  botonesPanel.forEach((boton) => {
    boton.addEventListener('click', (evento) => {
      evento.preventDefault();
      cambiarPanel(boton.dataset.panelTarget);
    });
  });

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (evento) => {
      evento.preventDefault();
      cerrarSesionCuenta();
    });
  }

  if (formEditarCuenta) {
    formEditarCuenta.addEventListener('submit', guardarDatosUsuario);
  }

  document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    pintarCursos(dashboardCursosResumen, 4);
    pintarCursos(dashboardCursosTodos);
    pintarLogros(dashboardLogros);
    pintarLogros(dashboardLogrosCompleto);
    pintarCertificados(dashboardCertificados);
    pintarCertificados(dashboardCertificadosTodos);
    pintarAvisos();
    pintarPedidos();
  });
})();
