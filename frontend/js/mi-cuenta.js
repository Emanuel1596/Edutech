(() => {
  const usuarioSesionInicial = window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function'
    ? window.EduTech.obtenerUsuarioSesion()
    : null;

  if (!usuarioSesionInicial) {
    if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
      window.EduTech.guardarRedirectDespuesLogin('mi-cuenta.html');
    }

    window.location.href = 'login.html';
    return;
  }

  if (window.EduTech && typeof window.EduTech.usuarioTieneRol === 'function' && !window.EduTech.usuarioTieneRol(usuarioSesionInicial, 'Alumno')) {
    if (window.EduTech.usuarioTieneRol(usuarioSesionInicial, 'Instructor')) {
      window.location.replace('instructor.html#dashboard');
      return;
    }

    window.location.replace(window.EduTech.obtenerRutaInicioPorRol(usuarioSesionInicial));
    return;
  }

  const linksPanel = document.querySelectorAll('.mi-cuenta-link[data-panel]');
  const botonesPanel = document.querySelectorAll('[data-panel-target]');
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');

  const dashboardCursosResumen = document.getElementById('dashboardCursosResumen');
  const dashboardCursosTodos = document.getElementById('dashboardCursosTodos');
  const dashboardCursosConteo = document.getElementById('dashboardCursosConteo');
  const dashboardLogros = document.getElementById('dashboardLogros');
  const dashboardLogrosCompleto = document.getElementById('dashboardLogrosCompleto');
  const dashboardCertificados = document.getElementById('dashboardCertificados');
  const dashboardCertificadosTodos = document.getElementById('dashboardCertificadosTodos');
  const dashboardAvisos = document.getElementById('dashboardAvisos');
  const dashboardPedidos = document.getElementById('dashboardPedidos');
  const dashboardCalificaciones = document.getElementById('dashboardCalificaciones');
  const calificacionesVistaLista = document.getElementById('calificacionesVistaLista');
  const calificacionesVistaDetalle = document.getElementById('calificacionesVistaDetalle');
  const dashboardCalificacionesDetalle = document.getElementById('dashboardCalificacionesDetalle');
  const calificacionesDetalleTitulo = document.getElementById('calificacionesDetalleTitulo');

  const formEditarCuenta = document.getElementById('formEditarCuenta');
  const accountNombre = document.getElementById('accountNombre');
  const accountApellidos = document.getElementById('accountApellidos');
  const accountCorreo = document.getElementById('accountCorreo');
  const accountTelefono = document.getElementById('accountTelefono');
  const accountDireccion = document.getElementById('accountDireccion');
  const accountInterior = document.getElementById('accountInterior');
  const accountEstado = document.getElementById('accountEstado');
  const accountCiudad = document.getElementById('accountCiudad');
  const accountCodigoPostal = document.getElementById('accountCodigoPostal');
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

  const ciudadesPorEstadoCuenta = {
    'Ciudad de México': [
      { id: 1, nombre: 'Ciudad de México' }
    ],
    'Estado de México': [
      { id: 2, nombre: 'Toluca' },
      { id: 5, nombre: 'Ecatepec' },
      { id: 6, nombre: 'Nezahualcóyotl' },
      { id: 7, nombre: 'Naucalpan' },
      { id: 8, nombre: 'Tlalnepantla' }
    ],
    Jalisco: [
      { id: 3, nombre: 'Guadalajara' },
      { id: 9, nombre: 'Zapopan' },
      { id: 10, nombre: 'Tlaquepaque' },
      { id: 11, nombre: 'Tonalá' }
    ],
    'Nuevo León': [
      { id: 4, nombre: 'Monterrey' },
      { id: 12, nombre: 'San Pedro Garza García' },
      { id: 13, nombre: 'San Nicolás de los Garza' },
      { id: 14, nombre: 'Guadalupe' }
    ],
    Puebla: [
      { id: 15, nombre: 'Puebla' },
      { id: 16, nombre: 'San Andrés Cholula' },
      { id: 17, nombre: 'San Pedro Cholula' },
      { id: 18, nombre: 'Tehuacán' }
    ]
  };

  const limpiarTextoSimple = (valor) => String(valor || '').trim();

  const esCorreoValidoCuenta = (valor) => {
    const correo = limpiarTextoSimple(valor);

    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{3,}$/.test(correo);
  };

  const obtenerCampoContenedorCuenta = (campo) => campo ? campo.closest('.mi-cuenta-field') : null;

  const obtenerMensajeErrorCuenta = (campo) => {
    const contenedor = obtenerCampoContenedorCuenta(campo);

    if (!contenedor) {
      return null;
    }

    let mensaje = contenedor.querySelector('.mi-cuenta-error-message');

    if (!mensaje) {
      mensaje = document.createElement('small');
      mensaje.className = 'mi-cuenta-error-message';
      contenedor.appendChild(mensaje);
    }

    return mensaje;
  };

  const mostrarErrorCuenta = (campo, mensajeTexto) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerCampoContenedorCuenta(campo);
    const mensaje = obtenerMensajeErrorCuenta(campo);

    campo.classList.add('is-invalid');
    campo.setAttribute('aria-invalid', 'true');

    if (contenedor) {
      contenedor.classList.add('has-error');
    }

    if (mensaje) {
      mensaje.textContent = mensajeTexto;
      mensaje.style.display = 'block';
    }
  };

  const limpiarErrorCuenta = (campo) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerCampoContenedorCuenta(campo);
    const mensaje = obtenerMensajeErrorCuenta(campo);

    campo.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');

    if (contenedor) {
      contenedor.classList.remove('has-error');
    }

    if (mensaje) {
      mensaje.textContent = '';
      mensaje.style.display = 'none';
    }
  };

  const obtenerMensajeValidacionCuenta = (campo) => {
    if (!campo) {
      return '';
    }

    const valor = limpiarTextoSimple(campo.value);

    if (campo === accountCorreo) {
      if (!valor) {
        return 'Agrega tu correo electrónico.';
      }

      if (!esCorreoValidoCuenta(valor)) {
        return 'Agrega un correo electrónico válido.';
      }
    }

    if (campo === accountTelefono) {
      if (!valor) {
        return '';
      }

      if (/[^0-9]/.test(valor)) {
        return 'El teléfono solo permite números.';
      }

      if (valor.length !== 10) {
        return 'El teléfono debe tener 10 dígitos.';
      }
    }

    if (campo === accountCodigoPostal) {
      if (!valor) {
        return '';
      }

      if (/[^0-9]/.test(valor)) {
        return 'El código postal solo permite números.';
      }

      if (valor.length !== 5) {
        return 'El código postal debe tener 5 dígitos.';
      }
    }

    return '';
  };

  const validarCampoCuenta = (campo) => {
    const mensaje = obtenerMensajeValidacionCuenta(campo);

    if (mensaje) {
      mostrarErrorCuenta(campo, mensaje);
      return false;
    }

    limpiarErrorCuenta(campo);
    return true;
  };

  const validarFormularioCuenta = () => {
    const campos = [
      accountCorreo,
      accountTelefono,
      accountCodigoPostal
    ];
    const errores = [];

    campos.forEach((campo) => {
      if (!validarCampoCuenta(campo)) {
        errores.push(campo);
      }
    });

    if (errores.length > 0 && typeof errores[0].focus === 'function') {
      errores[0].focus();
    }

    return errores.length === 0;
  };

  const campoCuentaRequiereValidacionInmediata = (campo) => {
    const valor = limpiarTextoSimple(campo ? campo.value : '');

    if (!valor) {
      return campo && campo.classList.contains('is-invalid');
    }

    if (campo === accountCorreo) {
      return campo.classList.contains('is-invalid');
    }

    if (campo === accountTelefono) {
      return /[^0-9]/.test(valor) || valor.length > 10 || campo.classList.contains('is-invalid');
    }

    if (campo === accountCodigoPostal) {
      return /[^0-9]/.test(valor) || valor.length > 5 || campo.classList.contains('is-invalid');
    }

    return false;
  };

  const activarValidacionCuenta = (campo) => {
    if (!campo) {
      return;
    }

    campo.addEventListener('blur', () => {
      campo.dataset.validacionCuentaIniciada = 'true';
      validarCampoCuenta(campo);
    });

    campo.addEventListener('input', () => {
      if (campo.dataset.validacionCuentaIniciada === 'true' || campoCuentaRequiereValidacionInmediata(campo)) {
        validarCampoCuenta(campo);
      }

      if (mensajeCuentaGuardada) {
        mensajeCuentaGuardada.style.display = 'none';
      }
    });
  };

  const obtenerPerfilAlumno = () => {
    const perfil = obtenerJSON('edutech_perfil_alumno', {});
    return perfil && typeof perfil === 'object' && !Array.isArray(perfil) ? perfil : {};
  };

  const separarUsuarioNombre = (usuario) => {
    const nombreDirecto = limpiarTextoSimple(usuario.nombre || usuario.primer_nombre || usuario.name);
    const apellidoPaterno = limpiarTextoSimple(usuario.apellido_paterno || usuario.apellidoPaterno);
    const apellidoMaterno = limpiarTextoSimple(usuario.apellido_materno || usuario.apellidoMaterno);
    const apellidosDirectos = limpiarTextoSimple(usuario.apellidos || usuario.apellido || usuario.last_name);
    const nombreCompleto = limpiarTextoSimple(usuario.nombre_completo || usuario.full_name);

    let nombre = nombreDirecto;
    let apellidos = [apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ') || apellidosDirectos;

    if (!nombre && nombreCompleto) {
      const partes = nombreCompleto.split(/\s+/).filter(Boolean);
      nombre = partes.shift() || '';
      apellidos = apellidos || partes.join(' ');
    }

    return { nombre, apellidos };
  };

  const poblarCiudadesCuenta = (ciudadDeseada = '') => {
    if (!accountEstado || !accountCiudad) {
      return;
    }

    const estado = limpiarTextoSimple(accountEstado.value);
    const ciudades = ciudadesPorEstadoCuenta[estado] || [];
    const ciudadActual = ciudadDeseada || limpiarTextoSimple(accountCiudad.value);

    accountCiudad.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona una ciudad';
    accountCiudad.appendChild(placeholder);

    ciudades.forEach((ciudad) => {
      const option = document.createElement('option');
      option.value = String(ciudad.id);
      option.textContent = ciudad.nombre;
      option.dataset.nombreCiudad = ciudad.nombre;
      accountCiudad.appendChild(option);
    });

    const ciudadEncontrada = ciudades.find((ciudad) => {
      return String(ciudad.id) === String(ciudadActual) || ciudad.nombre.toLowerCase() === String(ciudadActual).toLowerCase();
    });

    accountCiudad.value = ciudadEncontrada ? String(ciudadEncontrada.id) : '';
  };

  const obtenerNombreCiudadCuenta = () => {
    if (!accountCiudad) {
      return '';
    }

    const option = accountCiudad.selectedOptions && accountCiudad.selectedOptions[0];
    return option ? limpiarTextoSimple(option.dataset.nombreCiudad || option.textContent) : limpiarTextoSimple(accountCiudad.value);
  };

  const obtenerDatosPerfilDesdeFormulario = () => {
    return {
      nombre: accountNombre ? limpiarTextoSimple(accountNombre.value) : '',
      apellidos: accountApellidos ? limpiarTextoSimple(accountApellidos.value) : '',
      correo: accountCorreo ? limpiarTextoSimple(accountCorreo.value) : '',
      telefono: accountTelefono ? limpiarTextoSimple(accountTelefono.value) : '',
      direccion: accountDireccion ? limpiarTextoSimple(accountDireccion.value) : '',
      interior: accountInterior ? limpiarTextoSimple(accountInterior.value) : '',
      estado: accountEstado ? limpiarTextoSimple(accountEstado.value) : '',
      ciudad: obtenerNombreCiudadCuenta(),
      id_ciudad: accountCiudad ? limpiarTextoSimple(accountCiudad.value) : '',
      codigo_postal: accountCodigoPostal ? limpiarTextoSimple(accountCodigoPostal.value) : ''
    };
  };

  let cursosCache = null;

  const obtenerIdUsuarioActual = () => {
    if (window.EduTech && typeof window.EduTech.obtenerIdUsuarioSesion === 'function') {
      const id = window.EduTech.obtenerIdUsuarioSesion();

      if (id) {
        return id;
      }
    }

    const idDirecto = localStorage.getItem('edutech_id_usuario');

    if (idDirecto) {
      return idDirecto;
    }

    const usuario = obtenerJSON('edutech_usuario', null);
    return usuario ? (usuario.id_usuario || usuario.id || null) : null;
  };

  const guardarCursosComprados = (cursos) => {
    const normalizados = cursos.map((curso) => normalizarCurso(combinarConCatalogo(curso)));
    const mapa = new Map();

    normalizados.forEach((curso) => {
      const clave = curso.id_curso ? String(curso.id_curso) : String(curso.curso || '').toLowerCase();
      const anterior = mapa.get(clave);

      if (!anterior) {
        mapa.set(clave, curso);
        return;
      }

      const nivelAnteriorValido = !esNivelInvalido(anterior.nivel);
      const nivelNuevoValido = !esNivelInvalido(curso.nivel);

      const fechaAnterior = obtenerFechaCompraCurso(anterior);
      const fechaNueva = obtenerFechaCompraCurso(curso);
      const fechaFinal = esFechaValida(fechaNueva) ? fechaNueva : fechaAnterior;

      mapa.set(clave, asegurarFechaCurso({
        ...anterior,
        ...curso,
        nivel: nivelNuevoValido ? curso.nivel : anterior.nivel,
        nombre_nivel: nivelNuevoValido ? curso.nivel : anterior.nivel,
        fecha_compra: fechaFinal || curso.fecha_compra || anterior.fecha_compra,
        fecha_inscripcion: curso.fecha_inscripcion || anterior.fecha_inscripcion || fechaFinal,
        porcentaje_avance: Math.max(Number(anterior.porcentaje_avance || 0), Number(curso.porcentaje_avance || 0))
      }));
    });

    const cursosFinales = Array.from(mapa.values()).map(asegurarFechaCurso);
    const ids = cursosFinales
      .map((curso) => Number(curso.id_curso))
      .filter((id) => Number.isInteger(id) && id > 0);

    cursosCache = cursosFinales;
    guardarJSON('edutech_mis_cursos', cursosFinales);
    guardarJSON('edutech_cursos_comprados_ids', ids);

    return cursosFinales;
  };

  const obtenerCursosCatalogoBackend = async () => {
    if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
      return [];
    }

    const respuesta = await conTiempoMaximo(window.EduTech.apiRequest('/cursos'));
    return Array.isArray(respuesta.cursos) ? respuesta.cursos : [];
  };

  const obtenerMisCursosBackend = async () => {
    const idUsuario = obtenerIdUsuarioActual();

    if (!idUsuario || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
      return [];
    }

    const respuesta = await conTiempoMaximo(window.EduTech.apiRequest(`/usuarios/${idUsuario}/mis-cursos`));
    return Array.isArray(respuesta.cursos) ? respuesta.cursos : [];
  };


  const obtenerCertificadosBackend = async () => {
    const idUsuario = obtenerIdUsuarioActual();

    if (!idUsuario || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
      return [];
    }

    const respuesta = await conTiempoMaximo(window.EduTech.apiRequest(`/usuarios/${idUsuario}/certificados`), 2000);
    return Array.isArray(respuesta.certificados) ? respuesta.certificados : [];
  };

  const sincronizarDificultadesCursos = async () => {
    try {
      const catalogo = await obtenerCursosCatalogoBackend();

      if (catalogo.length > 0) {
        guardarJSON('edutech_catalogo_cursos', catalogo);
      }
    } catch (error) {
      // Si el catálogo no responde, se usa el último guardado en localStorage.
    }

    try {
      const cursosBackend = await obtenerMisCursosBackend();
      const cursosLocales = obtenerJSON('edutech_mis_cursos', []);
      const locales = Array.isArray(cursosLocales) ? cursosLocales : [];

      if (cursosBackend.length > 0 || locales.length > 0) {
        guardarCursosComprados([...locales, ...cursosBackend]);
      }
    } catch (error) {
      const cursosLocales = obtenerJSON('edutech_mis_cursos', []);
      cursosCache = Array.isArray(cursosLocales)
        ? cursosLocales.map((curso) => normalizarCurso(combinarConCatalogo(curso)))
        : [];
    }

    try {
      const certificadosBackend = await obtenerCertificadosBackend();

      if (certificadosBackend.length > 0) {
        guardarJSON('edutech_certificados', certificadosBackend);
      }
    } catch (error) {
      // Si certificados no responde, se usa el respaldo local.
    }
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

  const esFechaValida = (fecha) => {
    if (!fecha) {
      return false;
    }

    const texto = String(fecha).trim().toLowerCase();

    if (!texto || texto === 'fecha no disponible' || texto === 'null' || texto === 'undefined') {
      return false;
    }

    const fechaConvertida = new Date(fecha);
    return !Number.isNaN(fechaConvertida.getTime());
  };

  const formatearFecha = (fecha) => {
    if (!esFechaValida(fecha)) {
      return 'Fecha no disponible';
    }

    const fechaConvertida = new Date(fecha);

    return fechaConvertida.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenerMapaFechasCompra = () => {
    const mapa = obtenerJSON('edutech_fechas_compra_cursos', {});
    return mapa && typeof mapa === 'object' && !Array.isArray(mapa) ? mapa : {};
  };

  const guardarMapaFechasCompra = (mapa) => {
    guardarJSON('edutech_fechas_compra_cursos', mapa);
  };

  const obtenerFechaDesdeCompraConfirmada = (curso) => {
    const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);
    const compraConfirmada = obtenerJSON('edutech_compra_aprobada_backend', null);
    const compraPendiente = obtenerJSON('edutech_compra_pendiente', null);
    const compras = [compraConfirmada, compraPendiente].filter(Boolean);

    for (const compra of compras) {
      const idCompra = compra.id_curso || compra.idCurso || compra.id;

      if (idCurso && idCompra && String(idCurso) !== String(idCompra)) {
        continue;
      }

      const fecha = obtenerCampoCurso(compra, [
        'fecha_compra',
        'fecha_pago',
        'fecha_inscripcion',
        'fecha_orden',
        'fecha_creacion',
        'fecha'
      ]);

      if (esFechaValida(fecha)) {
        return fecha;
      }
    }

    return '';
  };

  const obtenerFechaCompraCurso = (curso) => {
    const fechaDirecta = obtenerCampoCurso(curso, [
      'fecha_compra',
      'fecha_pago',
      'fecha_inscripcion',
      'fecha_orden',
      'fecha_creacion',
      'created_at',
      'fecha'
    ]);

    if (esFechaValida(fechaDirecta)) {
      return fechaDirecta;
    }

    const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);
    const mapaFechas = obtenerMapaFechasCompra();
    const fechaMapa = idCurso ? mapaFechas[String(idCurso)] : '';

    if (esFechaValida(fechaMapa)) {
      return fechaMapa;
    }

    const fechaCompraConfirmada = obtenerFechaDesdeCompraConfirmada(curso);

    if (esFechaValida(fechaCompraConfirmada)) {
      return fechaCompraConfirmada;
    }

    return '';
  };

  const asegurarFechaCurso = (curso) => {
    const fechaExistente = obtenerFechaCompraCurso(curso);
    const fechaFinal = esFechaValida(fechaExistente) ? fechaExistente : new Date().toISOString();
    const idCurso = curso && (curso.id_curso || curso.idCurso || curso.id);

    if (idCurso) {
      const mapaFechas = obtenerMapaFechasCompra();
      mapaFechas[String(idCurso)] = fechaFinal;
      guardarMapaFechasCompra(mapaFechas);
    }

    return {
      ...curso,
      fecha_compra: fechaFinal,
      fecha_inscripcion: curso.fecha_inscripcion || fechaFinal
    };
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

  const normalizarTextoVisible = (valor) => {
    const texto = String(valor || '').trim();

    if (!texto) {
      return '';
    }

    return texto
      .toLowerCase()
      .replace(/(^|[\s,\/])([a-záéíóúüñ])/g, (_, prefijo, letra) => `${prefijo}${letra.toUpperCase()}`);
  };

  const CLAVES_NIVEL_CURSO = [
    'nombre_nivel',
    'nivel',
    'dificultad',
    'nombre_dificultad',
    'dificultad_curso',
    'nivel_curso'
  ];

  const esNivelInvalido = (valor) => {
    const texto = String(valor || '').trim().toLowerCase();

    return !texto || [
      'curso disponible',
      'nivel no disponible',
      'no disponible',
      'disponible',
      'por definir',
      'sin nivel'
    ].includes(texto);
  };

  const obtenerNivelValido = (curso) => {
    for (const clave of CLAVES_NIVEL_CURSO) {
      const valor = curso && curso[clave];

      if (!esNivelInvalido(valor)) {
        return valor;
      }
    }

    const titulo = String((curso && (curso.curso || curso.titulo)) || '').trim().toLowerCase();
    const nivelesLocales = {
      'hackeo': 'Intermedio',
      'bases de datos': 'Principiante',
      'desarrollo web': 'Principiante'
    };

    return nivelesLocales[titulo] || '';
  };

  const normalizarNivelCurso = (curso) => {
    const nivelValido = obtenerNivelValido(curso);
    return normalizarTextoVisible(nivelValido || 'Nivel no disponible');
  };

  const conTiempoMaximo = (promesa, milisegundos = 1400) => {
    return Promise.race([
      promesa,
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error('Tiempo de espera agotado')), milisegundos);
      })
    ]);
  };



  const obtenerCampoCurso = (curso, claves) => {
    for (const clave of claves) {
      const valor = curso[clave];

      if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return valor;
      }
    }

    return '';
  };

  const normalizarEstadoAcceso = (valor) => {
    const estado = String(valor || '').trim().toLowerCase();

    if (!estado) {
      return 'Activo';
    }

    if (['aprobada', 'aprobado', 'activa', 'activo', 'matriculado', 'comprado', 'completada'].includes(estado)) {
      return 'Activo';
    }

    if (estado === 'completado') {
      return 'Completado';
    }

    return normalizarTextoVisible(estado);
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
    const nivel = normalizarNivelCurso(curso);
    const lecciones = curso.lecciones || curso.total_lecciones || 'Por definir';
    const precio = curso.precio || curso.precio_mxn || curso.total || 0;
    const imagen = curso.imagen_portada || 'assets/img/banner-cursos-edutech.svg';
    const estado = normalizarEstadoAcceso(curso.nombre_estado_inscripcion || curso.estado || curso.estatus);
    const fechaCompra = obtenerFechaCompraCurso(curso);

    return {
      id_curso: curso.id_curso || curso.id || null,
      id_inscripcion: curso.id_inscripcion || curso.idInscripcion || null,
      curso: titulo,
      instructor: instructorCompleto || 'Instructor EduTech',
      nivel,
      lecciones,
      precio,
      imagen_portada: imagen,
      estatus: estado,
      fecha_compra: fechaCompra,
      lecciones_completadas: curso.lecciones_completadas || curso.completadas || 0,
      porcentaje_avance: curso.porcentaje_avance ?? curso.avance ?? 0
    };
  };

  const obtenerCatalogoCursos = () => {
    const cursosCatalogo = obtenerJSON('edutech_catalogo_cursos', []);
    return Array.isArray(cursosCatalogo) ? cursosCatalogo : [];
  };

  const obtenerCursoCatalogo = (curso) => {
    const idCurso = curso.id_curso || curso.idCurso || curso.id;
    const tituloCurso = String(curso.curso || curso.titulo || '').trim().toLowerCase();

    return obtenerCatalogoCursos().find((item) => {
      const idItem = item.id_curso || item.idCurso || item.id;
      const tituloItem = String(item.curso || item.titulo || '').trim().toLowerCase();

      if (idCurso && idItem && String(idCurso) === String(idItem)) {
        return true;
      }

      return Boolean(tituloCurso && tituloItem && tituloCurso === tituloItem);
    }) || null;
  };

  const combinarConCatalogo = (curso) => {
    const catalogo = obtenerCursoCatalogo(curso);

    if (!catalogo) {
      return curso;
    }

    const nivelCompra = obtenerNivelValido(curso);
    const nivelCatalogo = obtenerNivelValido(catalogo);
    const nivelFinal = nivelCompra || nivelCatalogo;

    return {
      ...catalogo,
      ...curso,
      nombre_nivel: nivelFinal || '',
      nivel: nivelFinal || '',
      dificultad: nivelFinal || '',
      descripcion: curso.descripcion || catalogo.descripcion,
      total_lecciones: curso.total_lecciones || curso.lecciones || catalogo.total_lecciones || catalogo.lecciones,
      lecciones: curso.lecciones || curso.total_lecciones || catalogo.lecciones || catalogo.total_lecciones,
      imagen_portada: curso.imagen_portada || curso.imagen || catalogo.imagen_portada || catalogo.imagen
    };
  };

  const obtenerCursos = () => {
    if (Array.isArray(cursosCache)) {
      return cursosCache;
    }

    const cursosGuardados = obtenerJSON('edutech_mis_cursos', []);

    if (!Array.isArray(cursosGuardados)) {
      return [];
    }

    cursosCache = cursosGuardados.map((curso) => normalizarCurso(combinarConCatalogo(curso)));
    return cursosCache;
  };

  const obtenerPorcentajeCurso = (curso) => {
    const porcentajeBackend = Number(curso.porcentaje_avance ?? curso.avance);

    if (!Number.isNaN(porcentajeBackend) && porcentajeBackend > 0) {
      return Math.min(100, Math.round(porcentajeBackend));
    }

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

    const enlace = document.createElement('div');
    enlace.className = 'mi-cuenta-course-link';

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

    const autor = crearElemento('p', 'mi-cuenta-course-author');
    autor.innerHTML = `<strong>Instructor:</strong> ${curso.instructor}`;

    const dificultad = crearElemento('p', 'mi-cuenta-course-meta');
    dificultad.innerHTML = `<strong>Dificultad:</strong> ${curso.nivel}`;

    const lecciones = crearElemento('p', 'mi-cuenta-course-meta');
    lecciones.innerHTML = `<strong>Número de lecciones:</strong> ${curso.lecciones}`;

    const estado = crearElemento('p', 'mi-cuenta-course-meta');
    estado.innerHTML = `<strong>Estado:</strong> ${curso.estatus}`;

    const fecha = crearElemento('p', 'mi-cuenta-course-meta');
    fecha.innerHTML = `<strong>Comprado:</strong> ${formatearFecha(curso.fecha_compra)}`;

    const porcentaje = obtenerPorcentajeCurso(curso);
    const progresoWrap = crearElemento('div', 'mi-cuenta-progress-wrap');
    const progresoTexto = crearElemento('span', 'mi-cuenta-progress-text');
    const progresoLabel = crearElemento('span', null, 'Avance');
    const progresoValor = crearElemento('strong', null, `${porcentaje}%`);
    const progresoBarra = crearElemento('div', 'mi-cuenta-progress-bar');
    const progresoCompleto = crearElemento('div', 'mi-cuenta-progress-fill');

    progresoCompleto.style.width = `${porcentaje}%`;
    progresoTexto.appendChild(progresoLabel);
    progresoTexto.appendChild(progresoValor);
    progresoBarra.appendChild(progresoCompleto);
    progresoWrap.appendChild(progresoTexto);
    progresoWrap.appendChild(progresoBarra);

    const acciones = crearElemento('div', 'mi-cuenta-course-actions');
    const entrar = crearElemento('a', 'mi-cuenta-course-entry-link', 'Entrar al curso');
    if (curso.id_inscripcion) {
      entrar.href = `aula.html?idInscripcion=${curso.id_inscripcion}&idCurso=${curso.id_curso || ''}`;
    } else if (curso.id_curso) {
      entrar.href = `aula.html?idCurso=${curso.id_curso}`;
    } else {
      entrar.href = 'aula.html';
    }
    acciones.appendChild(entrar);

    contenido.appendChild(titulo);
    contenido.appendChild(autor);
    contenido.appendChild(dificultad);
    contenido.appendChild(lecciones);
    contenido.appendChild(estado);
    contenido.appendChild(fecha);
    contenido.appendChild(progresoWrap);
    contenido.appendChild(acciones);

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

    const acciones = crearElemento('div', 'mi-cuenta-empty-actions');

    acciones.appendChild(enlace);

    caja.appendChild(mensaje);
    caja.appendChild(acciones);
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

    if (contenedor === dashboardCursosTodos && dashboardCursosConteo) {
      dashboardCursosConteo.textContent = cursos.length === 1 ? '1 curso comprado.' : `${cursos.length} cursos comprados.`;
    }
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

  const normalizarCertificado = (certificado) => {
    const idCurso = certificado.id_curso || certificado.idCurso || certificado.id;
    const curso = certificado.titulo_curso || certificado.curso || certificado.titulo || 'Curso EduTech';
    const codigo = certificado.codigo_certificado || certificado.codigo || '';
    const idCertificado = certificado.id_certificado || certificado.idCertificado || '';
    const url = idCertificado
      ? `certificado.html?id=${encodeURIComponent(idCertificado)}`
      : codigo
        ? `certificado.html?codigo=${encodeURIComponent(codigo)}`
        : 'certificado.html';

    return {
      ...certificado,
      id_curso: idCurso,
      id_certificado: idCertificado,
      curso,
      codigo,
      fecha: certificado.fecha_emision || certificado.fecha_finalizacion || certificado.fecha_aprobacion || certificado.fecha,
      instructor: certificado.nombre_instructor || certificado.instructor || 'Instructor EduTech',
      calificacion: certificado.calificacion,
      url
    };
  };

  const obtenerCertificados = () => {
    const certificadosGuardados = obtenerJSON('edutech_certificados', []);

    if (Array.isArray(certificadosGuardados) && certificadosGuardados.length > 0) {
      return certificadosGuardados.map(normalizarCertificado);
    }

    const cursos = obtenerCursos();

    return cursos.filter((curso) => obtenerPorcentajeCurso(curso) === 100).map((curso) => {
      return normalizarCertificado({
        id_curso: curso.id_curso,
        curso: curso.curso,
        fecha: curso.fecha_finalizacion || curso.fecha_compra,
        instructor: curso.instructor,
        calificacion: obtenerResultadoCurso(curso.id_curso) ? obtenerResultadoCurso(curso.id_curso).calificacion : ''
      });
    });
  };


  const mostrarSalidaCertificado = (url) => {
    let overlay = document.querySelector('.edutech-certificado-salida');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'edutech-certificado-salida';
      overlay.innerHTML = '<div class="edutech-certificado-salida-card"><span>Preparando certificado</span></div>';
      document.body.appendChild(overlay);
    }

    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });

    window.setTimeout(() => {
      window.location.href = url;
    }, 120);
  };

  const pintarCertificados = (contenedor) => {
    if (!contenedor) {
      return;
    }

    const certificados = obtenerCertificados();
    contenedor.innerHTML = '';

    if (certificados.length === 0) {
      contenedor.appendChild(crearElemento('p', 'mi-cuenta-plain-text mi-cuenta-certificados-vacio', 'Todavía no hay certificados disponibles.'));
      return;
    }

    const lista = document.createElement('ul');
    lista.className = 'mi-cuenta-certificados-grid';

    certificados.forEach((certificado) => {
      const item = document.createElement('li');
      item.className = 'mi-cuenta-certificado-item';

      const enlace = crearElemento('a', 'mi-cuenta-certificado-card');
      enlace.href = certificado.url;
      enlace.setAttribute('aria-label', `Ver certificado de ${certificado.curso}`);

      const titulo = crearElemento('h3', 'mi-cuenta-certificado-titulo', certificado.curso);
      const fecha = crearElemento('p', 'mi-cuenta-certificado-fecha', formatearFecha(certificado.fecha));

      enlace.addEventListener('click', (evento) => {
        if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || evento.button !== 0) {
          return;
        }

        evento.preventDefault();
        mostrarSalidaCertificado(enlace.href);
      });

      enlace.appendChild(titulo);
      enlace.appendChild(fecha);
      item.appendChild(enlace);
      lista.appendChild(item);
    });

    contenedor.appendChild(lista);
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
        <td>${curso.estatus || curso.estado || 'Activo'}</td>
      `;
      tbody.appendChild(fila);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    dashboardPedidos.appendChild(tabla);
  };


  const obtenerResultadosExamenes = () => {
    const ultimos = obtenerJSON('edutech_resultados_examenes', []);
    return Array.isArray(ultimos) ? ultimos : [];
  };

  const obtenerHistorialResultadosExamenes = () => {
    const historial = obtenerJSON('edutech_resultados_examenes_historial', []);
    return Array.isArray(historial) ? historial : [];
  };

  const obtenerResultadoCurso = (idCurso) => {
    const resultados = obtenerResultadosExamenes();
    const directo = resultados.find((resultado) => String(resultado.id_curso) === String(idCurso));

    if (directo) {
      return directo;
    }

    const historial = obtenerHistorialResultadosExamenes()
      .filter((resultado) => String(resultado.id_curso) === String(idCurso))
      .sort((a, b) => Number(b.numero_intento || 0) - Number(a.numero_intento || 0));

    return historial[0] || null;
  };

  const obtenerCursoRawPorId = (idCurso) => {
    const fuentes = [obtenerJSON('edutech_mis_cursos', []), obtenerJSON('edutech_catalogo_cursos', [])];

    for (const fuente of fuentes) {
      if (!Array.isArray(fuente)) {
        continue;
      }

      const curso = fuente.find((item) => String(item.id_curso || item.idCurso || item.id) === String(idCurso));

      if (curso) {
        return curso;
      }
    }

    return null;
  };

  const formatearPorcentajeVisual = (valor) => {
    const numero = Math.max(0, Math.min(100, Number(valor) || 0));
    return numero % 1 === 0 ? numero.toFixed(0) : numero.toFixed(2).replace(/\.?0+$/, '');
  };

  const generarDonutCalificacionHTML = (porcentaje, clase = 'mini', caption = '') => {
    const valor = Math.max(0, Math.min(100, Number(porcentaje) || 0));
    const valorTexto = formatearPorcentajeVisual(valor);

    return `
      <div class="llms-donut ${clase}" data-perc="${valor}" style="--tdc-score:${valor}%;">
        <div class="inside">
          <div class="percentage">${valorTexto}<small>%</small>${caption ? `<div class="caption">${caption}</div>` : ''}</div>
        </div>
      </div>
    `;
  };

  const crearDonutCalificacion = (porcentaje, clase = 'mini') => {
    const contenedor = document.createElement('div');
    contenedor.innerHTML = generarDonutCalificacionHTML(porcentaje, clase).trim();
    return contenedor.firstElementChild;
  };

  const crearProgresoTablaCalificaciones = (porcentaje) => {
    const progreso = Math.max(0, Math.min(100, Number(porcentaje) || 0));
    const progresoTexto = formatearPorcentajeVisual(progreso);
    const wrap = crearElemento('div', 'llms-progress mi-cuenta-grade-progress');
    wrap.innerHTML = `
      <div class="progress__indicator">${progresoTexto}%</div>
      <div class="llms-progress-bar">
        <div class="progress-bar-complete" data-progress="${progresoTexto}%" style="width:${progreso}%"></div>
      </div>
    `;
    return wrap;
  };

  const obtenerFechaOrdenCalificacion = (curso) => {
    const fecha = new Date(curso.fecha_compra || curso.fecha_inscripcion || 0).getTime();
    return Number.isNaN(fecha) ? 0 : fecha;
  };

  const ordenarCursosCalificaciones = (cursos, orden) => {
    const copia = [...cursos];

    if (orden === 'fecha_asc') {
      return copia.sort((a, b) => obtenerFechaOrdenCalificacion(a) - obtenerFechaOrdenCalificacion(b));
    }

    if (orden === 'titulo_az') {
      return copia.sort((a, b) => String(a.curso || '').localeCompare(String(b.curso || ''), 'es', { sensitivity: 'base' }));
    }

    if (orden === 'titulo_za') {
      return copia.sort((a, b) => String(b.curso || '').localeCompare(String(a.curso || ''), 'es', { sensitivity: 'base' }));
    }

    return copia.sort((a, b) => obtenerFechaOrdenCalificacion(b) - obtenerFechaOrdenCalificacion(a));
  };

  const pintarCalificaciones = () => {
    if (!dashboardCalificaciones) {
      return;
    }

    const ordenCalificaciones = localStorage.getItem('edutech_orden_calificaciones') || 'fecha_desc';
    let cursos = obtenerCursos();
    cursos = ordenarCursosCalificaciones(cursos, ordenCalificaciones);
    dashboardCalificaciones.innerHTML = '';

    if (cursos.length === 0) {
      dashboardCalificaciones.appendChild(crearElemento('p', 'mi-cuenta-plain-text', 'Todavía no tienes cursos comprados.'));
      return;
    }

    const tabla = document.createElement('table');
    tabla.className = 'llms-table mi-cuenta-grades-table';
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Curso</th>
          <th>Fecha de inscripción</th>
          <th>Progreso</th>
          <th>Calificación</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
        <tr>
          <td class="llms-table-sort" colspan="4">
            <div class="mi-cuenta-grade-sort-group">
              <label>Ordenar:</label>
              <select aria-label="Ordenar calificaciones" data-orden-calificaciones>
                <option value="fecha_desc" ${ordenCalificaciones === 'fecha_desc' ? 'selected' : ''}>Fecha de inscripción (la más nueva)</option>
                <option value="fecha_asc" ${ordenCalificaciones === 'fecha_asc' ? 'selected' : ''}>Fecha de inscripción (la más antigua)</option>
                <option value="titulo_az" ${ordenCalificaciones === 'titulo_az' ? 'selected' : ''}>Título del curso (A-Z)</option>
                <option value="titulo_za" ${ordenCalificaciones === 'titulo_za' ? 'selected' : ''}>Título del curso (Z-A)</option>
              </select>
            </div>
          </td>
        </tr>
      </tfoot>
    `;

    const tbody = tabla.querySelector('tbody');

    cursos.forEach((curso) => {
      const resultado = obtenerResultadoCurso(curso.id_curso);
      const porcentaje = obtenerPorcentajeCurso(curso);
      const fila = document.createElement('tr');
      const grado = resultado ? crearDonutCalificacion(resultado.calificacion || 0, 'mini') : document.createTextNode('–');

      const tdCurso = document.createElement('td');
      const enlace = crearElemento('a', 'mi-cuenta-grade-course-link mi-cuenta-edutech-link lesson-title-link', curso.curso);
      enlace.href = '#calificaciones';
      enlace.dataset.calificacionCurso = String(curso.id_curso || '');
      tdCurso.appendChild(enlace);

      const tdFecha = crearElemento('td', null, formatearFecha(curso.fecha_compra || curso.fecha_inscripcion));
      const tdProgreso = document.createElement('td');
      tdProgreso.appendChild(crearProgresoTablaCalificaciones(porcentaje));
      const tdGrado = document.createElement('td');
      tdGrado.appendChild(grado);

      fila.appendChild(tdCurso);
      fila.appendChild(tdFecha);
      fila.appendChild(tdProgreso);
      fila.appendChild(tdGrado);
      tbody.appendChild(fila);
    });

    dashboardCalificaciones.appendChild(tabla);

    const selectOrden = tabla.querySelector('[data-orden-calificaciones]');

    const aplicarOrden = () => {
      if (selectOrden) {
        localStorage.setItem('edutech_orden_calificaciones', selectOrden.value || 'fecha_desc');
      }
      pintarCalificaciones();
    };

    if (selectOrden) {
      selectOrden.addEventListener('change', aplicarOrden);
    }
  };

  const mostrarListaCalificaciones = () => {
    if (calificacionesVistaLista) {
      calificacionesVistaLista.style.display = 'block';
    }

    if (calificacionesVistaDetalle) {
      calificacionesVistaDetalle.style.display = 'none';
    }
  };

  const obtenerModulosCursoRaw = (cursoRaw) => {
    if (cursoRaw && Array.isArray(cursoRaw.modulos)) {
      return cursoRaw.modulos;
    }

    return [];
  };

  const pluralizarUnidadTiempo = (cantidad, singular, plural) => `${cantidad} ${cantidad === 1 ? singular : plural}`;

  const formatearTiempoRelativo = (fecha) => {
    if (!esFechaValida(fecha)) {
      return '';
    }

    const inicio = new Date(fecha).getTime();
    const ahora = Date.now();
    let segundos = Math.max(0, Math.floor((ahora - inicio) / 1000));

    if (segundos < 60) {
      return pluralizarUnidadTiempo(Math.max(1, segundos), 'segundo', 'segundos');
    }

    const unidades = [
      { nombre: 'año', plural: 'años', segundos: 31536000 },
      { nombre: 'mes', plural: 'meses', segundos: 2592000 },
      { nombre: 'semana', plural: 'semanas', segundos: 604800 },
      { nombre: 'día', plural: 'días', segundos: 86400 },
      { nombre: 'hora', plural: 'horas', segundos: 3600 },
      { nombre: 'minuto', plural: 'minutos', segundos: 60 },
      { nombre: 'segundo', plural: 'segundos', segundos: 1 }
    ];

    const partes = [];

    unidades.forEach((unidad) => {
      if (partes.length >= 2) {
        return;
      }

      const cantidad = Math.floor(segundos / unidad.segundos);

      if (cantidad > 0) {
        partes.push(pluralizarUnidadTiempo(cantidad, unidad.nombre, unidad.plural));
        segundos -= cantidad * unidad.segundos;
      }
    });

    return partes.join(', ');
  };

  const crearFechaActividad = (fecha) => {
    const valor = esFechaValida(fecha) ? new Date(fecha) : new Date();
    return {
      mes: valor.toLocaleDateString('es-MX', { month: 'long' }),
      dia: valor.toLocaleDateString('es-MX', { day: 'numeric' }),
      anio: valor.toLocaleDateString('es-MX', { year: 'numeric' }),
      diferencia: formatearTiempoRelativo(valor)
    };
  };

  const generarFechaDashboardHTML = (fecha) => {
    const partes = crearFechaActividad(fecha);
    const diferencia = partes.diferencia ? `<span class="diff">${partes.diferencia}</span>` : '';

    return `
      <div class="llms-sd-date">
        <span class="month">${partes.mes}</span>
        <span class="day">${partes.dia}</span>
        <span class="year">${partes.anio}</span>
        ${diferencia}
      </div>
    `;
  };

  const pintarDetalleCalificacion = (idCurso) => {
    if (!dashboardCalificacionesDetalle || !calificacionesVistaDetalle || !calificacionesVistaLista) {
      return;
    }

    const curso = obtenerCursos().find((item) => String(item.id_curso) === String(idCurso));

    if (!curso) {
      mostrarListaCalificaciones();
      return;
    }

    const cursoRaw = obtenerCursoRawPorId(idCurso) || {};
    const resultado = obtenerResultadoCurso(idCurso);
    const progreso = obtenerPorcentajeCurso(curso);
    const calificacion = resultado ? Number(resultado.calificacion || 0) : 0;
    const fechaInscripcion = curso.fecha_compra || curso.fecha_inscripcion;
    const fechaUltimaActividad = resultado && (resultado.fecha_fin || resultado.fecha_inicio)
      ? resultado.fecha_fin || resultado.fecha_inicio
      : fechaInscripcion;
    const modulos = obtenerModulosCursoRaw(cursoRaw);

    calificacionesVistaLista.style.display = 'none';
    calificacionesVistaDetalle.style.display = 'block';

    if (calificacionesDetalleTitulo) {
      calificacionesDetalleTitulo.innerHTML = `<a href="#calificaciones" id="volverListaCalificaciones" class="mi-cuenta-edutech-link mi-cuenta-calificaciones-back-link lesson-title-link">Mis calificaciones</a> <small>&gt;</small> <a class="mi-cuenta-edutech-link mi-cuenta-calificaciones-curso-link lesson-title-link" href="detalle-curso.html?id=${curso.id_curso}">${curso.curso}</a>`;
    }

    const widgets = `
      <section class="llms-sd-widgets mi-cuenta-grade-widgets">
        <div class="llms-sd-widget">
          <h4 class="llms-sd-widget-title">Progreso</h4>
          ${generarDonutCalificacionHTML(progreso, 'medium')}
        </div>
        <div class="llms-sd-widget">
          <h4 class="llms-sd-widget-title">Calificación</h4>
          ${resultado ? generarDonutCalificacionHTML(calificacion, 'medium') : '<p class="llms-sd-widget-empty">Sin calificación</p>'}
        </div>
        <div class="llms-sd-widget">
          <h4 class="llms-sd-widget-title">Fecha de inscripción</h4>
          ${generarFechaDashboardHTML(fechaInscripcion)}
        </div>
        <div class="llms-sd-widget">
          <h4 class="llms-sd-widget-title">Última actividad</h4>
          ${generarFechaDashboardHTML(fechaUltimaActividad)}
        </div>
      </section>
    `;

    const filasModulos = modulos.length > 0 ? modulos.map((modulo, indiceModulo) => {
      const lecciones = Array.isArray(modulo.lecciones) ? modulo.lecciones : [];
      const filasLecciones = lecciones.map((leccion, indiceLeccion) => {
        const completada = leccion.completada === true || leccion.esta_completada === true || leccion.completada === 'true';
        return `
          <tr>
            <td class="llms-lesson_title" colspan="2">Lección ${indiceLeccion + 1}: <a class="mi-cuenta-table-link-button mi-cuenta-edutech-link lesson-title-link" href="detalle-curso.html?id=${curso.id_curso}">${leccion.titulo || 'Lección'}</a></td>
            <td class="llms-completion_date">${completada ? formatearFecha(leccion.fecha_completada || new Date().toISOString()) : '–'}</td>
            <td class="llms-associated_quiz">–</td>
            <td class="llms-overall_grade">–</td>
          </tr>
        `;
      }).join('');

      return `
        <tbody>
          <tr class="llms-section">
            <th class="llms-section_title" colspan="2">Módulo ${indiceModulo + 1}: ${modulo.titulo || 'Módulo'}</th>
            <th class="llms-completion_date">Fecha de Terminación</th>
            <th class="llms-associated_quiz">Cuestionario</th>
            <th class="llms-overall_grade">Calificación</th>
          </tr>
          ${filasLecciones}
        </tbody>
      `;
    }).join('') : '';

    const examenFila = `
      <tbody>
        <tr class="llms-section">
          <th class="llms-section_title" colspan="2">Módulo ${modulos.length + 1 || 1}: Examen Final</th>
          <th class="llms-completion_date">Fecha de Terminación</th>
          <th class="llms-associated_quiz">Cuestionario</th>
          <th class="llms-overall_grade">Calificación</th>
        </tr>
        <tr>
          <td class="llms-lesson_title" colspan="2">Lección 1: <a class="mi-cuenta-table-link-button mi-cuenta-edutech-link lesson-title-link" href="examen.html?id=${curso.id_curso}">Examen Final</a></td>
          <td class="llms-completion_date">${resultado ? formatearFecha(resultado.fecha_fin || resultado.fecha_inicio) : '–'}</td>
          <td class="llms-associated_quiz">${resultado ? `<span class="llms-status ${resultado.aprobado ? 'llms-pass' : 'llms-fail'}">${resultado.aprobado ? '¡Aprobado!' : 'No aprobado'}</span> <a class="llms-quiz-valuation-link mi-cuenta-table-link-button mi-cuenta-edutech-link lesson-title-link" href="examen.html?id=${curso.id_curso}&vista=resultado">Valoración</a>` : '–'}</td>
          <td class="llms-overall_grade">${resultado ? generarDonutCalificacionHTML(calificacion, 'mini') : '–'}</td>
        </tr>
      </tbody>
    `;

    dashboardCalificacionesDetalle.innerHTML = `
      ${widgets}
      <div class="llms-sd-section mi-cuenta-grade-detail-table-wrap">
        <table class="llms-table llms-single-course-grades">
          ${filasModulos}
          ${examenFila}
        </table>
      </div>
    `;

    const volverLista = document.getElementById('volverListaCalificaciones');
    if (volverLista) {
      volverLista.addEventListener('click', (evento) => {
        evento.preventDefault();
        window.history.pushState({ panel: 'calificaciones' }, '', '#calificaciones');
        cambiarPanel('calificaciones', false);
        mostrarListaCalificaciones();
      });
    }
  };

  const cargarDatosUsuario = () => {
    const usuario = obtenerUsuario();
    const perfil = obtenerPerfilAlumno();
    const partesUsuario = separarUsuarioNombre(usuario);

    if (accountNombre) {
      accountNombre.value = perfil.nombre || partesUsuario.nombre || usuario.nombre || '';
    }

    if (accountApellidos) {
      accountApellidos.value = perfil.apellidos || partesUsuario.apellidos || usuario.apellidos || '';
    }

    if (accountCorreo) {
      accountCorreo.value = perfil.correo || usuario.correo || usuario.email || '';
    }

    if (accountTelefono) {
      accountTelefono.value = perfil.telefono || usuario.telefono || usuario.telefono_contacto || '';
    }

    if (accountDireccion) {
      accountDireccion.value = perfil.direccion || usuario.direccion || '';
    }

    if (accountInterior) {
      accountInterior.value = perfil.interior || usuario.interior || '';
    }

    if (accountEstado) {
      accountEstado.value = perfil.estado || usuario.estado || '';
    }

    poblarCiudadesCuenta(perfil.id_ciudad || perfil.ciudad || usuario.id_ciudad || usuario.ciudad || '');

    if (accountCodigoPostal) {
      accountCodigoPostal.value = perfil.codigo_postal || usuario.codigo_postal || usuario.cp || '';
    }
  };

  const guardarDatosUsuario = (evento) => {
    evento.preventDefault();

    if (mensajeCuentaGuardada) {
      mensajeCuentaGuardada.style.display = 'none';
    }

    if (!validarFormularioCuenta()) {
      return;
    }

    const usuarioActual = obtenerUsuario();
    const perfilNuevo = obtenerDatosPerfilDesdeFormulario();
    const nuevoUsuario = {
      ...usuarioActual,
      nombre: perfilNuevo.nombre,
      apellidos: perfilNuevo.apellidos,
      correo: perfilNuevo.correo,
      email: perfilNuevo.correo,
      telefono: perfilNuevo.telefono,
      direccion: perfilNuevo.direccion,
      interior: perfilNuevo.interior,
      estado: perfilNuevo.estado,
      ciudad: perfilNuevo.ciudad,
      id_ciudad: perfilNuevo.id_ciudad,
      codigo_postal: perfilNuevo.codigo_postal
    };

    guardarJSON('edutech_usuario', nuevoUsuario);
    guardarJSON('edutech_perfil_alumno', perfilNuevo);

    if (mensajeCuentaGuardada) {
      mensajeCuentaGuardada.style.display = 'block';
    }
  };

  const obtenerPanelDesdeHash = () => {
    const hash = window.location.hash.replace(/^#/, '').trim();

    if (/^calificaciones-curso-\d+$/.test(hash)) {
      return 'calificaciones';
    }

    const panelValido = document.getElementById(`panel-${hash}`);
    return panelValido ? hash : 'dashboard';
  };

  const actualizarHashPanel = (panel, modo = 'push') => {
    const hashNuevo = `#${panel}`;

    if (window.location.hash === hashNuevo) {
      return;
    }

    if (window.history && typeof window.history[modo === 'replace' ? 'replaceState' : 'pushState'] === 'function') {
      window.history[modo === 'replace' ? 'replaceState' : 'pushState']({ panel }, '', hashNuevo);
      return;
    }

    window.location.hash = panel;
  };

  const cambiarPanel = (panel, actualizarHash = true, modoHistorial = 'push') => {
    const panelSeguro = document.getElementById(`panel-${panel}`) ? panel : 'dashboard';

    document.querySelectorAll('.mi-cuenta-panel').forEach((panelItem) => {
      const activo = panelItem.id === `panel-${panelSeguro}`;
      panelItem.classList.toggle('active', activo);
    });

    document.querySelectorAll('.mi-cuenta-link[data-panel]').forEach((link) => {
      link.classList.toggle('active', link.dataset.panel === panelSeguro);
    });

    if (actualizarHash) {
      actualizarHashPanel(panelSeguro, modoHistorial);
    }
  };

  const obtenerCursoCalificacionDesdeHash = () => {
    const hash = window.location.hash.replace(/^#/, '').trim();
    const coincidencia = hash.match(/^calificaciones-curso-(\d+)$/);
    return coincidencia ? coincidencia[1] : '';
  };

  const aplicarRutaCalificaciones = () => {
    const idCursoDetalle = obtenerCursoCalificacionDesdeHash();

    if (idCursoDetalle) {
      cambiarPanel('calificaciones', false);
      pintarDetalleCalificacion(idCursoDetalle);
      return;
    }

    cambiarPanel(obtenerPanelDesdeHash(), false);

    if (window.location.hash.replace(/^#/, '').trim() === 'calificaciones') {
      mostrarListaCalificaciones();
    }
  };

  const limpiarSesionEduTech = () => {
    const limpiarStorage = (storage) => {
      if (!storage) {
        return;
      }

      Object.keys(storage)
        .filter((clave) => clave.startsWith('edutech_'))
        .forEach((clave) => storage.removeItem(clave));
    };

    limpiarStorage(localStorage);
    limpiarStorage(sessionStorage);
  };

  const cerrarSesionCuenta = () => {
    if (window.EduTech && typeof window.EduTech.cerrarSesion === 'function') {
      window.EduTech.cerrarSesion();
    } else {
      limpiarSesionEduTech();
    }

    window.location.replace('index.html');
  };

  linksPanel.forEach((link) => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      cambiarPanel(link.dataset.panel, true, 'push');
    });
  });

  botonesPanel.forEach((boton) => {
    boton.addEventListener('click', (evento) => {
      evento.preventDefault();
      cambiarPanel(boton.dataset.panelTarget, true, 'push');
    });
  });

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (evento) => {
      evento.preventDefault();
      cerrarSesionCuenta();
    });
  }

  if (accountEstado) {
    accountEstado.addEventListener('change', () => {
      poblarCiudadesCuenta('');
    });
  }

  activarValidacionCuenta(accountCorreo);
  activarValidacionCuenta(accountTelefono);
  activarValidacionCuenta(accountCodigoPostal);

  if (formEditarCuenta) {
    formEditarCuenta.addEventListener('submit', guardarDatosUsuario);
  }

  if (dashboardCalificaciones) {
    dashboardCalificaciones.addEventListener('click', (evento) => {
      const enlace = evento.target.closest('[data-calificacion-curso]');

      if (!enlace) {
        return;
      }

      evento.preventDefault();
      const idCurso = enlace.dataset.calificacionCurso;
      const hashActual = window.location.hash.replace(/^#/, '').trim();

      if (hashActual !== 'calificaciones') {
        window.history.pushState({ panel: 'calificaciones' }, '', '#calificaciones');
      }

      window.history.pushState({ panel: 'calificaciones', idCurso }, '', `#calificaciones-curso-${idCurso}`);
      cambiarPanel('calificaciones', false);
      pintarDetalleCalificacion(idCurso);
    });
  }

  window.addEventListener('popstate', aplicarRutaCalificaciones);
  window.addEventListener('hashchange', aplicarRutaCalificaciones);

  const pintarTodo = () => {
    pintarCursos(dashboardCursosResumen, 4);
    pintarCursos(dashboardCursosTodos);
    pintarLogros(dashboardLogros);
    pintarLogros(dashboardLogrosCompleto);
    pintarCertificados(dashboardCertificados);
    pintarCertificados(dashboardCertificadosTodos);
    pintarAvisos();
    pintarPedidos();
    pintarCalificaciones();
  };

  const marcarPaginaLista = () => {
    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    cursosCache = null;
    pintarTodo();
    aplicarRutaCalificaciones();
    marcarPaginaLista();

    sincronizarDificultadesCursos()
      .then(() => {
        cursosCache = null;
        pintarTodo();
      })
      .catch(() => {
        cursosCache = null;
        pintarTodo();
      });
  });
})();
