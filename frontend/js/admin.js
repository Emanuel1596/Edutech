(() => {
  const estado = {
    usuarioAdmin: null,
    usuarios: [],
    roles: [],
    cursosRevision: [],
    panelActual: 'dashboard',
    busqueda: '',
    filtroRol: 'todos',
    filtroCursosRevision: 'pendiente',
    cargandoUsuarios: false,
    cargandoCursosRevision: false
  };

  const elementos = {
    mensaje: document.getElementById('adminMensaje'),
    nombre: document.getElementById('adminNombre'),
    correo: document.getElementById('adminCorreo'),
    cerrarSesion: document.getElementById('adminCerrarSesion'),
    navLinks: Array.from(document.querySelectorAll('.admin-nav .mi-cuenta-link[data-panel]')),
    paneles: Array.from(document.querySelectorAll('.admin-panel')),
    tablaUsuarios: document.getElementById('adminUsuariosTabla'),
    buscarUsuario: document.getElementById('adminBuscarUsuario'),
    filtroRol: document.getElementById('adminFiltroRol'),
    recargarUsuarios: document.getElementById('adminRecargarUsuarios'),
    totalUsuarios: document.getElementById('adminTotalUsuarios'),
    totalAlumnos: document.getElementById('adminTotalAlumnos'),
    totalInstructores: document.getElementById('adminTotalInstructores'),
    totalAdministradores: document.getElementById('adminTotalAdministradores'),
    filtroCursosRevision: document.getElementById('adminFiltroCursosRevision'),
    recargarCursos: document.getElementById('adminRecargarCursos'),
    cursosRevisionLista: document.getElementById('adminCursosRevisionLista')
  };

  const normalizarTexto = (valor) => String(valor || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const escaparHtml = (valor) => String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const formatearDinero = (valor) => {
    const numero = Number(valor || 0);

    return numero.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };

  const formatearFecha = (valor) => {
    if (!valor) {
      return 'Sin fecha';
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
      return 'Sin fecha';
    }

    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const mostrarMensaje = (texto, esError = false) => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = texto;
    elementos.mensaje.classList.toggle('admin-message-error', esError);
    elementos.mensaje.style.display = 'block';
  };

  const ocultarMensaje = () => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = '';
    elementos.mensaje.style.display = 'none';
    elementos.mensaje.classList.remove('admin-message-error');
  };

  const obtenerNombreCompleto = (usuario) => {
    if (!usuario) {
      return 'Administrador';
    }

    return [
      usuario.nombre,
      usuario.apellido_paterno,
      usuario.apellido_materno
    ].filter(Boolean).join(' ') || usuario.correo || 'Administrador';
  };

  const obtenerPanelDesdeHash = () => {
    const panel = window.location.hash.replace('#', '').trim();
    return panel || 'dashboard';
  };

  const activarPanel = (panel, actualizarHash = true) => {
    const panelSeguro = document.getElementById(`panel-${panel}`) ? panel : 'dashboard';

    if (estado.panelActual !== panelSeguro) {
      ocultarMensaje();
    }

    estado.panelActual = panelSeguro;

    elementos.paneles.forEach((panelItem) => {
      const activo = panelItem.id === `panel-${panelSeguro}`;
      panelItem.classList.toggle('active', activo);
      panelItem.hidden = !activo;
    });

    elementos.navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.panel === panelSeguro);
    });

    if (actualizarHash && window.location.hash !== `#${panelSeguro}`) {
      window.history.pushState({ panel: panelSeguro }, '', `#${panelSeguro}`);
    }

    if (panelSeguro === 'usuarios' && estado.usuarios.length === 0 && !estado.cargandoUsuarios) {
      cargarUsuarios();
    }

    if (panelSeguro === 'cursos' && estado.cursosRevision.length === 0 && !estado.cargandoCursosRevision) {
      cargarCursosRevision();
    }
  };

  const validarAdmin = () => {
    const usuario = window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function'
      ? window.EduTech.obtenerUsuarioSesion()
      : null;

    if (!usuario) {
      if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
        window.EduTech.guardarRedirectDespuesLogin('admin.html');
      }

      if (window.EduTechSessionGuard && typeof window.EduTechSessionGuard.ocultar === 'function') {
        window.EduTechSessionGuard.ocultar();
      }

      window.location.replace('login.html');
      return null;
    }

    if (!window.EduTech.usuarioTieneRol(usuario, 'Administrador')) {
      if (window.EduTechSessionGuard && typeof window.EduTechSessionGuard.ocultar === 'function') {
        window.EduTechSessionGuard.ocultar();
      }

      window.location.replace(window.EduTech.obtenerRutaInicioPorRol(usuario));
      return null;
    }

    estado.usuarioAdmin = usuario;

    if (elementos.nombre) {
      elementos.nombre.textContent = obtenerNombreCompleto(usuario);
    }

    if (elementos.correo) {
      elementos.correo.textContent = usuario.correo || 'Sin correo registrado';
    }

    if (window.EduTechSessionGuard && typeof window.EduTechSessionGuard.mostrar === 'function') {
      window.EduTechSessionGuard.mostrar();
    } else if (typeof window.EduTechMarcarPaginaLista === 'function') {
      window.EduTechMarcarPaginaLista();
    }

    return usuario;
  };

  const obtenerRolesOrdenados = () => {
    if (estado.roles.length > 0) {
      return estado.roles;
    }

    return [
      { id_rol: 1, nombre_rol: 'Alumno' },
      { id_rol: 2, nombre_rol: 'Instructor' },
      { id_rol: 3, nombre_rol: 'Administrador' }
    ];
  };

  const pintarResumen = () => {
    const usuarios = estado.usuarios;
    const contarRol = (rol) => usuarios.filter((usuario) => normalizarTexto(usuario.nombre_rol) === normalizarTexto(rol)).length;

    if (elementos.totalUsuarios) {
      elementos.totalUsuarios.textContent = String(usuarios.length);
    }

    if (elementos.totalAlumnos) {
      elementos.totalAlumnos.textContent = String(contarRol('Alumno'));
    }

    if (elementos.totalInstructores) {
      elementos.totalInstructores.textContent = String(contarRol('Instructor'));
    }

    if (elementos.totalAdministradores) {
      elementos.totalAdministradores.textContent = String(contarRol('Administrador'));
    }
  };

  const obtenerUsuariosFiltrados = () => {
    const busqueda = normalizarTexto(estado.busqueda);
    const filtroRol = normalizarTexto(estado.filtroRol);

    return estado.usuarios.filter((usuario) => {
      const nombreCompleto = normalizarTexto(obtenerNombreCompleto(usuario));
      const correo = normalizarTexto(usuario.correo);
      const rol = normalizarTexto(usuario.nombre_rol);

      const coincideBusqueda = !busqueda || nombreCompleto.includes(busqueda) || correo.includes(busqueda);
      const coincideRol = filtroRol === 'todos' || rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  };

  const construirOpcionesRol = (idRolActual) => obtenerRolesOrdenados()
    .map((rol) => `
      <option value="${rol.id_rol}" ${Number(idRolActual) === Number(rol.id_rol) ? 'selected' : ''}>
        ${escaparHtml(rol.nombre_rol)}
      </option>
    `)
    .join('');

  const pintarUsuarios = () => {
    if (!elementos.tablaUsuarios) {
      return;
    }

    const usuarios = obtenerUsuariosFiltrados();

    if (estado.cargandoUsuarios) {
      elementos.tablaUsuarios.innerHTML = '<tr class="admin-loading-row"><td colspan="7">Cargando usuarios...</td></tr>';
      return;
    }

    if (estado.usuarios.length === 0) {
      elementos.tablaUsuarios.innerHTML = '<tr><td colspan="7">No hay usuarios registrados.</td></tr>';
      return;
    }

    if (usuarios.length === 0) {
      elementos.tablaUsuarios.innerHTML = '<tr><td colspan="7">No hay usuarios con ese filtro.</td></tr>';
      return;
    }

    elementos.tablaUsuarios.innerHTML = usuarios.map((usuario) => {
      const esSesionActual = Number(usuario.id_usuario) === Number(estado.usuarioAdmin?.id_usuario);
      const estadoTexto = usuario.esta_activo ? 'Activo' : 'Inactivo';
      const nombreCompleto = obtenerNombreCompleto(usuario);

      return `
        <tr data-id-usuario="${usuario.id_usuario}">
          <td>${escaparHtml(usuario.id_usuario)}</td>
          <td>
            <strong>${escaparHtml(nombreCompleto)}</strong>
            ${esSesionActual ? '<span class="admin-current-user">Sesión actual</span>' : ''}
          </td>
          <td>${escaparHtml(usuario.correo)}</td>
          <td><span class="admin-role-text">${escaparHtml(usuario.nombre_rol)}</span></td>
          <td>${escaparHtml(estadoTexto)}</td>
          <td>
            <select class="admin-role-select" data-id-usuario="${usuario.id_usuario}" ${esSesionActual ? 'disabled' : ''}>
              ${construirOpcionesRol(usuario.id_rol)}
            </select>
          </td>
          <td>
            <button type="button" class="admin-table-button adminGuardarRol" data-id-usuario="${usuario.id_usuario}" ${esSesionActual ? 'disabled' : ''}>
              Guardar rol
            </button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const cargarUsuarios = async () => {
    const usuario = validarAdmin();

    if (!usuario || estado.cargandoUsuarios) {
      return;
    }

    try {
      estado.cargandoUsuarios = true;
      pintarUsuarios();
      ocultarMensaje();

      const datos = await window.EduTech.apiRequest(`/admin/usuarios?idAdmin=${encodeURIComponent(usuario.id_usuario)}`);

      estado.roles = Array.isArray(datos.roles) ? datos.roles : obtenerRolesOrdenados();
      estado.usuarios = Array.isArray(datos.usuarios) ? datos.usuarios : [];
      estado.cargandoUsuarios = false;

      pintarResumen();
      pintarUsuarios();
    } catch (error) {
      estado.cargandoUsuarios = false;
      mostrarMensaje(error.message || 'No se pudieron cargar los usuarios.', true);
      pintarUsuarios();
    }
  };

  const cambiarRolUsuario = async (idUsuario) => {
    const usuario = validarAdmin();

    if (!usuario) {
      return;
    }

    const fila = elementos.tablaUsuarios?.querySelector(`tr[data-id-usuario="${idUsuario}"]`);
    const select = fila?.querySelector('.admin-role-select');
    const boton = fila?.querySelector('.adminGuardarRol');

    if (!select) {
      return;
    }

    const idRolNuevo = Number(select.value);

    if (!idRolNuevo) {
      mostrarMensaje('Selecciona un rol válido.', true);
      return;
    }

    try {
      if (boton) {
        boton.disabled = true;
        boton.dataset.textoOriginal = boton.textContent;
        boton.textContent = 'Guardando...';
      }

      ocultarMensaje();

      const datos = await window.EduTech.apiRequest(`/admin/usuarios/${encodeURIComponent(idUsuario)}/rol`, {
        method: 'PATCH',
        body: {
          id_admin: usuario.id_usuario,
          id_rol: idRolNuevo
        }
      });

      const usuarioActualizado = datos.usuario;

      estado.usuarios = estado.usuarios.map((item) => (
        Number(item.id_usuario) === Number(idUsuario) ? usuarioActualizado : item
      ));

      pintarResumen();
      pintarUsuarios();
      mostrarMensaje(datos.message || 'Rol actualizado correctamente.');
    } catch (error) {
      if (boton) {
        boton.disabled = false;
        boton.textContent = boton.dataset.textoOriginal || 'Guardar rol';
      }

      mostrarMensaje(error.message || 'No se pudo actualizar el rol.', true);
    }
  };

  const obtenerEstadoRevisionCurso = (curso) => normalizarTexto(
    curso.ultima_revision?.estado_revision || curso.nombre_estado_revision_curso || curso.nombre_estado_curso || ''
  );

  const cursoEstaPendiente = (curso) => {
    const revision = obtenerEstadoRevisionCurso(curso);
    const estadoCurso = normalizarTexto(curso.nombre_estado_curso);

    return revision.includes('pendient') || estadoCurso.includes('pendiente');
  };

  const obtenerCursosRevisionFiltrados = () => {
    const filtro = normalizarTexto(estado.filtroCursosRevision || 'pendiente');

    return estado.cursosRevision.filter((curso) => {
      if (filtro === 'todos') {
        return true;
      }

      if (filtro === 'pendiente') {
        return cursoEstaPendiente(curso);
      }

      return obtenerEstadoRevisionCurso(curso).includes(filtro);
    });
  };

  const crearListaModulos = (curso) => {
    const modulos = Array.isArray(curso.modulos) ? curso.modulos : [];

    if (modulos.length === 0) {
      return '<p class="admin-review-muted">Sin módulos registrados.</p>';
    }

    return `
      <div class="admin-review-modules">
        ${modulos.map((modulo) => {
          const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];

          return `
            <article class="admin-review-module">
              <h4>Módulo ${escaparHtml(modulo.numero_orden)}: ${escaparHtml(modulo.titulo)}</h4>
              ${lecciones.length > 0 ? `
                <ul>
                  ${lecciones.map((leccion) => `
                    <li>Lección ${escaparHtml(leccion.numero_orden)}: ${escaparHtml(leccion.titulo)}</li>
                  `).join('')}
                </ul>
              ` : '<p class="admin-review-muted">Sin lecciones registradas.</p>'}
            </article>
          `;
        }).join('')}
      </div>
    `;
  };

  const crearCursoRevisionCard = (curso) => {
    const revision = curso.ultima_revision || {};
    const estadoRevision = revision.estado_revision || 'sin revisión';
    const comentario = revision.comentario || 'Sin comentario';
    const fechaRevision = revision.fecha_revision || curso.fecha_actualizacion;
    const instructor = obtenerNombreCompleto({
      nombre: curso.instructor_nombre,
      apellido_paterno: curso.instructor_apellido_paterno,
      apellido_materno: curso.instructor_apellido_materno,
      correo: curso.instructor_correo
    });

    const puedeRevisar = cursoEstaPendiente(curso);
    const modulos = Number(curso.total_modulos || 0);
    const lecciones = Number(curso.total_lecciones || 0);
    const recursos = Number(curso.total_recursos || 0);

    return `
      <article class="admin-review-card" data-id-curso="${curso.id_curso}">
        <div class="admin-review-main">
          <div>
            <p class="admin-review-status">${escaparHtml(estadoRevision)} · ${escaparHtml(curso.nombre_estado_curso || 'sin estado')}</p>
            <h3>${escaparHtml(curso.titulo)}</h3>
            <p>${escaparHtml(curso.descripcion)}</p>
          </div>

          <div class="admin-review-price">
            <span>Precio</span>
            <strong>${formatearDinero(curso.precio_mxn)}</strong>
          </div>
        </div>

        <div class="admin-review-meta">
          <span>Instructor: ${escaparHtml(instructor)}</span>
          <span>Correo: ${escaparHtml(curso.instructor_correo || 'Sin correo')}</span>
          <span>Nivel: ${escaparHtml(curso.nombre_nivel || 'Sin nivel')}</span>
          <span>Fecha revisión: ${formatearFecha(fechaRevision)}</span>
        </div>

        <div class="admin-review-metrics">
          <span><strong>${modulos}</strong> módulos</span>
          <span><strong>${lecciones}</strong> lecciones</span>
          <span><strong>${recursos}</strong> recursos</span>
        </div>

        <div class="admin-review-last-comment">
          <strong>Último comentario:</strong>
          <span>${escaparHtml(comentario)}</span>
        </div>

        <div class="admin-review-actions">
          <a class="admin-link-button adminPreviewCurso" href="admin-preview-curso.html?idCurso=${curso.id_curso}&modo=publica">
            Vista pública
          </a>
          <a class="admin-link-button adminPreviewCurso" href="admin-preview-curso.html?idCurso=${curso.id_curso}&modo=aula">
            Vista aula
          </a>
          <a class="admin-link-button adminPreviewCurso" href="admin-preview-curso.html?idCurso=${curso.id_curso}&modo=examen">
            Vista examen
          </a>
          <button type="button" class="admin-link-button adminAprobarCurso" data-id-curso="${curso.id_curso}" ${puedeRevisar ? '' : 'disabled'}>
            Aprobar
          </button>
          <button type="button" class="admin-link-button adminRechazarCurso" data-id-curso="${curso.id_curso}" ${puedeRevisar ? '' : 'disabled'}>
            Rechazar
          </button>
        </div>

        <label class="mi-cuenta-field admin-field admin-review-comment-field">
          <span>Comentario de revisión</span>
          <textarea class="adminRevisionComentario" rows="3" placeholder="Escribe un comentario si vas a rechazar o si quieres dejar una observación."></textarea>
          <small class="error-message"></small>
        </label>
      </article>
    `;
  };

  const pintarCursosRevision = () => {
    if (!elementos.cursosRevisionLista) {
      return;
    }

    if (estado.cargandoCursosRevision) {
      elementos.cursosRevisionLista.innerHTML = '<p class="admin-empty-text">Cargando cursos por revisar...</p>';
      return;
    }

    const cursos = obtenerCursosRevisionFiltrados();

    if (estado.cursosRevision.length === 0) {
      elementos.cursosRevisionLista.innerHTML = '<p class="admin-empty-text">No hay cursos enviados a revisión.</p>';
      return;
    }

    if (cursos.length === 0) {
      elementos.cursosRevisionLista.innerHTML = '<p class="admin-empty-text">No hay cursos con ese filtro.</p>';
      return;
    }

    elementos.cursosRevisionLista.innerHTML = cursos.map(crearCursoRevisionCard).join('');
  };

  const cargarCursosRevision = async () => {
    const usuario = validarAdmin();

    if (!usuario || estado.cargandoCursosRevision) {
      return;
    }

    try {
      estado.cargandoCursosRevision = true;
      pintarCursosRevision();
      ocultarMensaje();

      const datos = await window.EduTech.apiRequest(`/admin/cursos-revision?idAdmin=${encodeURIComponent(usuario.id_usuario)}`);

      estado.cursosRevision = Array.isArray(datos.cursos) ? datos.cursos : [];
      estado.cargandoCursosRevision = false;
      pintarCursosRevision();
    } catch (error) {
      estado.cargandoCursosRevision = false;
      mostrarMensaje(error.message || 'No se pudieron cargar los cursos por revisar.', true);
      pintarCursosRevision();
    }
  };

  const revisarCurso = async (idCurso, accion, boton) => {
    const usuario = validarAdmin();

    if (!usuario) {
      return;
    }

    const tarjeta = elementos.cursosRevisionLista?.querySelector(`.admin-review-card[data-id-curso="${idCurso}"]`);
    const comentarioCampo = tarjeta?.querySelector('.adminRevisionComentario');
    const comentario = comentarioCampo ? comentarioCampo.value.trim() : '';

    if (accion === 'rechazar' && comentario.length < 5) {
      mostrarMensaje('Para rechazar el curso escribe un motivo claro.', true);
      comentarioCampo?.focus();
      return;
    }

    try {
      if (boton) {
        boton.disabled = true;
        boton.dataset.textoOriginal = boton.textContent;
        boton.textContent = accion === 'aprobar' ? 'Aprobando...' : 'Rechazando...';
      }

      ocultarMensaje();

      const datos = await window.EduTech.apiRequest(`/admin/cursos/${encodeURIComponent(idCurso)}/revision`, {
        method: 'PATCH',
        body: {
          id_admin: usuario.id_usuario,
          accion,
          comentario
        }
      });

      mostrarMensaje(datos.message || 'Curso revisado correctamente.');
      await cargarCursosRevision();
    } catch (error) {
      if (boton) {
        boton.disabled = false;
        boton.textContent = boton.dataset.textoOriginal || (accion === 'aprobar' ? 'Aprobar' : 'Rechazar');
      }

      mostrarMensaje(error.message || 'No se pudo revisar el curso.', true);
    }
  };

  const configurarEventos = () => {
    elementos.navLinks.forEach((link) => {
      link.addEventListener('click', (evento) => {
        evento.preventDefault();
        activarPanel(link.dataset.panel);
      });
    });

    window.addEventListener('popstate', () => {
      activarPanel(obtenerPanelDesdeHash(), false);
    });

    window.addEventListener('hashchange', () => {
      activarPanel(obtenerPanelDesdeHash(), false);
    });

    if (elementos.buscarUsuario) {
      elementos.buscarUsuario.addEventListener('input', () => {
        estado.busqueda = elementos.buscarUsuario.value;
        pintarUsuarios();
      });
    }

    if (elementos.filtroRol) {
      elementos.filtroRol.addEventListener('change', () => {
        estado.filtroRol = elementos.filtroRol.value || 'todos';
        pintarUsuarios();
      });
    }

    if (elementos.recargarUsuarios) {
      elementos.recargarUsuarios.addEventListener('click', cargarUsuarios);
    }

    if (elementos.tablaUsuarios) {
      elementos.tablaUsuarios.addEventListener('click', (evento) => {
        const boton = evento.target.closest('.adminGuardarRol');

        if (!boton) {
          return;
        }

        cambiarRolUsuario(boton.dataset.idUsuario);
      });
    }

    if (elementos.filtroCursosRevision) {
      elementos.filtroCursosRevision.addEventListener('change', () => {
        estado.filtroCursosRevision = elementos.filtroCursosRevision.value || 'pendiente';
        pintarCursosRevision();
      });
    }

    if (elementos.recargarCursos) {
      elementos.recargarCursos.addEventListener('click', cargarCursosRevision);
    }

    if (elementos.cursosRevisionLista) {
      elementos.cursosRevisionLista.addEventListener('click', (evento) => {
        const botonAprobar = evento.target.closest('.adminAprobarCurso');
        const botonRechazar = evento.target.closest('.adminRechazarCurso');
        if (botonAprobar) {
          revisarCurso(botonAprobar.dataset.idCurso, 'aprobar', botonAprobar);
          return;
        }

        if (botonRechazar) {
          revisarCurso(botonRechazar.dataset.idCurso, 'rechazar', botonRechazar);
        }
      });
    }

    if (elementos.cerrarSesion) {
      elementos.cerrarSesion.addEventListener('click', (evento) => {
        evento.preventDefault();
        window.EduTech.cerrarSesion();
        window.location.replace('login.html');
      });
    }
  };

  const iniciar = () => {
    const usuario = validarAdmin();

    if (!usuario) {
      return;
    }

    configurarEventos();
    activarPanel(obtenerPanelDesdeHash(), false);
    cargarUsuarios();
  };

  document.addEventListener('DOMContentLoaded', iniciar);
  window.addEventListener('pageshow', validarAdmin);
})();
