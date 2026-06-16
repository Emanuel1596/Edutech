(() => {
  const estado = {
    usuario: null,
    resumen: null,
    cursos: [],
    niveles: [],
    cursoEditando: null,
    portadaLocal: null,
    modulosActuales: [],
    leccionesActuales: [],
    filtroCursos: 'todos'
  };

  const elementos = {
    mensaje: document.getElementById('instructorMensaje'),
    nombre: document.getElementById('instructorNombre'),
    correo: document.getElementById('instructorCorreo'),
    inicial: document.getElementById('instructorInicial'),
    descripcion: document.getElementById('instructorDescripcion'),
    statCursos: document.getElementById('statCursos'),
    statModulos: document.getElementById('statModulos'),
    statLecciones: document.getElementById('statLecciones'),
    statAlumnos: document.getElementById('statAlumnos'),
    cursosResumen: document.getElementById('instructorCursosResumen'),
    cursosTodos: document.getElementById('instructorCursosTodos'),
    filtroCursos: document.getElementById('instructorFiltroCursos'),
    cerrarSesion: document.getElementById('instructorCerrarSesion'),
    formCurso: document.getElementById('instructorCursoForm'),
    formTitulo: document.getElementById('instructorCursoFormTitulo'),
    formDescripcion: document.getElementById('instructorCursoFormDescripcion'),
    cursoId: document.getElementById('instructorCursoId'),
    titulo: document.getElementById('instructorCursoTitulo'),
    descripcionCurso: document.getElementById('instructorCursoDescripcion'),
    precio: document.getElementById('instructorCursoPrecio'),
    portada: document.getElementById('instructorCursoPortada'),
    portadaArchivo: document.getElementById('instructorCursoPortadaArchivo'),
    portadaDropzone: document.getElementById('instructorPortadaDropzone'),
    portadaArchivoNombre: document.getElementById('instructorPortadaArchivoNombre'),
    portadaPreviewWrap: document.getElementById('instructorPortadaPreviewWrap'),
    portadaPreviewTexto: document.getElementById('instructorPortadaPreviewTexto'),
    portadaBloqueoTexto: document.getElementById('instructorPortadaBloqueoTexto'),
    portadaPreview: document.getElementById('instructorPortadaPreview'),
    borrarPortada: document.getElementById('instructorBorrarPortada'),
    nivel: document.getElementById('instructorCursoNivel'),
    formEstado: document.getElementById('instructorFormularioEstado'),
    moduloPaso: document.getElementById('instructorModuloPaso'),
    moduloCursoNombre: document.getElementById('instructorModuloCursoNombre'),
    cantidadModulos: document.getElementById('instructorCantidadModulos'),
    prepararModulos: document.getElementById('instructorPrepararModulos'),
    modulosCampos: document.getElementById('instructorModulosCampos'),
    leccionesPaso: document.getElementById('instructorLeccionesPaso'),
    leccionesCampos: document.getElementById('instructorLeccionesCampos'),
    guardarModulos: document.getElementById('instructorGuardarModulos'),
    herramientasCurso: document.getElementById('instructorEditarCursoHerramientas'),
    herramientasLinks: document.querySelectorAll('[data-course-tool]'),
    cuentaForm: document.getElementById('instructorCuentaForm'),
    cuentaFotoPreview: document.getElementById('instructorAccountFotoPreview'),
    cuentaFotoUrl: document.getElementById('instructorAccountFotoUrl'),
    cuentaFotoArchivo: document.getElementById('instructorAccountFotoArchivo'),
    cuentaFotoNombre: document.getElementById('instructorAccountFotoNombre'),
    cuentaNombre: document.getElementById('instructorAccountNombre'),
    cuentaApellidos: document.getElementById('instructorAccountApellidos'),
    cuentaCorreo: document.getElementById('instructorAccountCorreo'),
    cuentaTelefono: document.getElementById('instructorAccountTelefono'),
    cuentaDireccion: document.getElementById('instructorAccountDireccion'),
    cuentaInterior: document.getElementById('instructorAccountInterior'),
    cuentaEstado: document.getElementById('instructorAccountEstado'),
    cuentaCiudad: document.getElementById('instructorAccountCiudad'),
    cuentaCodigoPostal: document.getElementById('instructorAccountCodigoPostal'),
    cuentaGuardada: document.getElementById('instructorCuentaGuardada')
  };

  const marcarPaginaLista = () => {
    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
  };

  const mostrarMensaje = (texto, esError = false) => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = texto;
    elementos.mensaje.classList.toggle('instructor-message-error', esError);
    elementos.mensaje.style.display = 'block';
  };

  const ocultarMensaje = () => {
    if (!elementos.mensaje) {
      return;
    }

    elementos.mensaje.textContent = '';
    elementos.mensaje.classList.remove('instructor-message-error');
    elementos.mensaje.style.display = 'none';
  };

  const consumirMensajeAcceso = () => {
    const mensaje = sessionStorage.getItem('edutech_mensaje_acceso');
    const destino = sessionStorage.getItem('edutech_mensaje_acceso_destino') || 'instructor.html';
    const pagina = window.location.pathname.split('/').pop() || 'instructor.html';

    if (!mensaje) {
      return;
    }

    sessionStorage.removeItem('edutech_mensaje_acceso');
    sessionStorage.removeItem('edutech_mensaje_acceso_destino');

    if (destino !== pagina || /inicia sesi[oó]n/i.test(mensaje)) {
      return;
    }

    mostrarMensaje(mensaje, true);
  };

  const mostrarEstadoFormulario = (texto) => {
    if (!elementos.formEstado) {
      return;
    }

    elementos.formEstado.textContent = texto;
    elementos.formEstado.hidden = false;
  };

  const ocultarEstadoFormulario = () => {
    if (!elementos.formEstado) {
      return;
    }

    elementos.formEstado.textContent = '';
    elementos.formEstado.hidden = true;
  };

  const escaparHtml = (valor) => String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');


  const obtenerJSONInstructor = (clave, valorDefault = {}) => {
    const valor = localStorage.getItem(clave) || sessionStorage.getItem(clave);

    if (!valor) {
      return valorDefault;
    }

    try {
      return JSON.parse(valor);
    } catch (error) {
      return valorDefault;
    }
  };

  const guardarJSONInstructor = (clave, valor) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  };

  const limpiarTextoSimple = (valor) => String(valor || '').trim();

  const ciudadesPorEstadoInstructor = {
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

  const obtenerPerfilInstructor = () => {
    const perfil = obtenerJSONInstructor('edutech_perfil_instructor', {});
    return perfil && typeof perfil === 'object' && !Array.isArray(perfil) ? perfil : {};
  };

  const esCorreoValidoInstructor = (valor) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{3,}$/.test(limpiarTextoSimple(valor));

  const esFotoInstructorValida = (valor) => {
    const texto = limpiarTextoSimple(valor);

    if (!texto) {
      return true;
    }

    return /^https?:\/\/\S+$/i.test(texto)
      || /^assets\/img\/[\w\-./%()]+$/i.test(texto)
      || /^data:image\//i.test(texto);
  };

  const separarNombreInstructor = (usuario) => {
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

  const obtenerFotoPerfilInstructor = (usuario = estado.usuario) => {
    const perfil = obtenerPerfilInstructor();
    return perfil.foto_perfil || perfil.foto_perfil_url || usuario?.foto_perfil || usuario?.foto_perfil_url || '';
  };

  const obtenerInicialInstructor = (usuario = estado.usuario) => {
    const nombre = obtenerNombreCompleto(usuario);
    return limpiarTextoSimple(nombre).charAt(0).toUpperCase() || 'I';
  };

  const actualizarPreviewFotoInstructor = (valor = '') => {
    if (!elementos.cuentaFotoPreview) {
      return;
    }

    const foto = limpiarTextoSimple(valor);

    if (foto) {
      elementos.cuentaFotoPreview.innerHTML = `<img src="${escaparHtml(foto)}" alt="">`;
      return;
    }

    elementos.cuentaFotoPreview.textContent = obtenerInicialInstructor();
  };

  const actualizarNombreFotoInstructor = (texto = 'Sin imagen seleccionada') => {
    if (elementos.cuentaFotoNombre) {
      elementos.cuentaFotoNombre.textContent = texto;
    }
  };

  const leerFotoLocalInstructor = (archivo) => {
    return new Promise((resolve, reject) => {
      if (!archivo) {
        resolve('');
        return;
      }

      if (!archivo.type || !archivo.type.startsWith('image/')) {
        reject(new Error('Selecciona una imagen válida.'));
        return;
      }

      const lector = new FileReader();
      lector.onload = () => resolve(String(lector.result || ''));
      lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      lector.readAsDataURL(archivo);
    });
  };

  const obtenerFotoFormularioInstructor = () => {
    const fotoLocal = elementos.cuentaFotoArchivo && elementos.cuentaFotoArchivo.dataset.fotoLocal
      ? elementos.cuentaFotoArchivo.dataset.fotoLocal
      : '';

    if (fotoLocal) {
      return fotoLocal;
    }

    const fotoLink = elementos.cuentaFotoUrl ? limpiarTextoSimple(elementos.cuentaFotoUrl.value) : '';
    return fotoLink || obtenerFotoPerfilInstructor();
  };

  const poblarCiudadesInstructor = (ciudadDeseada = '') => {
    if (!elementos.cuentaEstado || !elementos.cuentaCiudad) {
      return;
    }

    const estadoSeleccionado = limpiarTextoSimple(elementos.cuentaEstado.value);
    const ciudades = ciudadesPorEstadoInstructor[estadoSeleccionado] || [];
    const ciudadActual = ciudadDeseada || limpiarTextoSimple(elementos.cuentaCiudad.value);

    elementos.cuentaCiudad.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona una ciudad';
    elementos.cuentaCiudad.appendChild(placeholder);

    ciudades.forEach((ciudad) => {
      const option = document.createElement('option');
      option.value = String(ciudad.id);
      option.textContent = ciudad.nombre;
      option.dataset.nombreCiudad = ciudad.nombre;
      elementos.cuentaCiudad.appendChild(option);
    });

    const ciudadEncontrada = ciudades.find((ciudad) => {
      return String(ciudad.id) === String(ciudadActual)
        || ciudad.nombre.toLowerCase() === String(ciudadActual).toLowerCase();
    });

    elementos.cuentaCiudad.value = ciudadEncontrada ? String(ciudadEncontrada.id) : '';
  };

  const obtenerMensajeCuentaInstructor = (campo) => {
    const valor = limpiarTextoSimple(campo ? campo.value : '');

    if (campo === elementos.cuentaCorreo) {
      if (!valor) {
        return 'Agrega tu correo electrónico.';
      }

      if (!esCorreoValidoInstructor(valor)) {
        return 'Agrega un correo electrónico válido.';
      }
    }

    if (campo === elementos.cuentaFotoUrl && valor && !esFotoInstructorValida(valor)) {
      return 'Agrega un link http/https válido o una ruta assets/img válida.';
    }

    if (campo === elementos.cuentaTelefono && valor) {
      if (/[^0-9]/.test(valor)) {
        return 'El teléfono solo permite números.';
      }

      if (valor.length !== 10) {
        return 'El teléfono debe tener 10 dígitos.';
      }
    }

    if (campo === elementos.cuentaCodigoPostal && valor) {
      if (/[^0-9]/.test(valor)) {
        return 'El código postal solo permite números.';
      }

      if (valor.length !== 5) {
        return 'El código postal debe tener 5 dígitos.';
      }
    }

    return '';
  };

  const validarCampoCuentaInstructor = (campo) => {
    const mensaje = obtenerMensajeCuentaInstructor(campo);

    if (mensaje) {
      mostrarErrorCampo(campo, mensaje);
      return false;
    }

    quitarErrorCampo(campo);
    return true;
  };

  const cargarCuentaInstructor = () => {
    if (!elementos.cuentaForm) {
      return;
    }

    const usuario = estado.usuario || obtenerUsuarioSesion() || {};
    const perfil = obtenerPerfilInstructor();
    const partes = separarNombreInstructor(usuario);
    const foto = obtenerFotoPerfilInstructor(usuario);

    if (elementos.cuentaNombre) {
      elementos.cuentaNombre.value = perfil.nombre || partes.nombre || '';
    }

    if (elementos.cuentaApellidos) {
      elementos.cuentaApellidos.value = perfil.apellidos || partes.apellidos || '';
    }

    if (elementos.cuentaCorreo) {
      elementos.cuentaCorreo.value = perfil.correo || usuario.correo || usuario.email || '';
    }

    if (elementos.cuentaTelefono) {
      elementos.cuentaTelefono.value = perfil.telefono || usuario.telefono || usuario.phone || '';
    }

    if (elementos.cuentaDireccion) {
      elementos.cuentaDireccion.value = perfil.direccion || '';
    }

    if (elementos.cuentaInterior) {
      elementos.cuentaInterior.value = perfil.interior || '';
    }

    if (elementos.cuentaEstado) {
      elementos.cuentaEstado.value = perfil.estado || '';
    }

    poblarCiudadesInstructor(perfil.ciudad || '');

    if (elementos.cuentaCodigoPostal) {
      elementos.cuentaCodigoPostal.value = perfil.codigo_postal || '';
    }

    if (elementos.cuentaFotoUrl) {
      const fotoEsLink = /^https?:\/\/\S+$/i.test(foto) || /^assets\/img\//i.test(foto);
      elementos.cuentaFotoUrl.value = fotoEsLink ? foto : '';
    }

    if (elementos.cuentaFotoArchivo) {
      elementos.cuentaFotoArchivo.value = '';
      elementos.cuentaFotoArchivo.dataset.fotoLocal = '';
    }

    actualizarNombreFotoInstructor('Sin imagen seleccionada');
    actualizarPreviewFotoInstructor(foto);
  };

  const guardarCuentaInstructor = async (evento) => {
    evento.preventDefault();

    const campos = [
      elementos.cuentaCorreo,
      elementos.cuentaFotoUrl,
      elementos.cuentaTelefono,
      elementos.cuentaCodigoPostal
    ];

    const errores = campos.filter((campo) => !validarCampoCuentaInstructor(campo));

    if (errores.length > 0) {
      errores[0].focus();
      return;
    }

    const usuario = estado.usuario || obtenerUsuarioSesion() || {};
    const foto = obtenerFotoFormularioInstructor();
    const perfil = {
      nombre: elementos.cuentaNombre ? limpiarTextoSimple(elementos.cuentaNombre.value) : '',
      apellidos: elementos.cuentaApellidos ? limpiarTextoSimple(elementos.cuentaApellidos.value) : '',
      correo: elementos.cuentaCorreo ? limpiarTextoSimple(elementos.cuentaCorreo.value) : '',
      telefono: elementos.cuentaTelefono ? limpiarTextoSimple(elementos.cuentaTelefono.value) : '',
      direccion: elementos.cuentaDireccion ? limpiarTextoSimple(elementos.cuentaDireccion.value) : '',
      interior: elementos.cuentaInterior ? limpiarTextoSimple(elementos.cuentaInterior.value) : '',
      estado: elementos.cuentaEstado ? limpiarTextoSimple(elementos.cuentaEstado.value) : '',
      ciudad: elementos.cuentaCiudad ? limpiarTextoSimple(elementos.cuentaCiudad.value) : '',
      codigo_postal: elementos.cuentaCodigoPostal ? limpiarTextoSimple(elementos.cuentaCodigoPostal.value) : '',
      foto_perfil: foto,
      foto_perfil_url: foto
    };

    const usuarioActualizado = {
      ...usuario,
      nombre: perfil.nombre || usuario.nombre,
      apellidos: perfil.apellidos,
      apellido_paterno: perfil.apellidos || usuario.apellido_paterno,
      correo: perfil.correo || usuario.correo,
      telefono: perfil.telefono,
      foto_perfil: foto,
      foto_perfil_url: foto
    };

    try {
      const idInstructor = obtenerIdInstructor();

      if (idInstructor && window.EduTech && typeof window.EduTech.apiRequest === 'function') {
        const respuestaPerfil = await window.EduTech.apiRequest(`/instructores/${encodeURIComponent(idInstructor)}/perfil`, {
          method: 'PUT',
          body: {
            foto_perfil_url: foto
          }
        });

        if (respuestaPerfil && respuestaPerfil.instructor) {
          usuarioActualizado.foto_perfil_url = respuestaPerfil.instructor.foto_perfil_url || foto;
          usuarioActualizado.foto_perfil = respuestaPerfil.instructor.foto_perfil_url || foto;
        }
      }

      estado.usuario = usuarioActualizado;
      guardarJSONInstructor('edutech_usuario', usuarioActualizado);
      guardarJSONInstructor('edutech_perfil_instructor', perfil);

      actualizarPreviewFotoInstructor(foto);
      pintarPerfil();

      if (elementos.cuentaGuardada) {
        elementos.cuentaGuardada.textContent = 'Perfil actualizado correctamente.';
        elementos.cuentaGuardada.style.display = 'block';
      }
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo guardar la imagen del perfil.', true);
    }
  };


  const formatearDinero = (valor) => {
    const numero = Number(valor || 0);
    return numero.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };

  const contieneLetras = (valor) => /[a-záéíóúñü]/i.test(String(valor || ''));

  const normalizarPrecio = (valor) => String(valor || '')
    .trim();

  const nivelesBase = [
    { id_nivel_curso: 1, nombre_nivel: 'Principiante' },
    { id_nivel_curso: 2, nombre_nivel: 'Intermedio' },
    { id_nivel_curso: 3, nombre_nivel: 'Avanzado' }
  ];

  const obtenerContenedorCampo = (campo) => campo ? campo.closest('.instructor-field') : null;

  const obtenerMensajeCampo = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    return contenedor ? contenedor.querySelector('.error-message') : null;
  };

  const mostrarErrorCampo = (campo, mensaje) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerContenedorCampo(campo);
    const mensajeCampo = obtenerMensajeCampo(campo);

    campo.classList.add('is-invalid');
    campo.setAttribute('aria-invalid', 'true');

    if (contenedor) {
      contenedor.classList.add('has-error');
    }

    if (mensajeCampo) {
      mensajeCampo.textContent = mensaje;
      mensajeCampo.style.display = 'block';
    }
  };

  const quitarErrorCampo = (campo) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerContenedorCampo(campo);
    const mensajeCampo = obtenerMensajeCampo(campo);

    campo.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');

    if (contenedor) {
      contenedor.classList.remove('has-error');
    }

    if (mensajeCampo) {
      mensajeCampo.textContent = '';
      mensajeCampo.style.display = 'none';
    }
  };

  const limpiarErroresFormularioCurso = () => {
    [
      elementos.titulo,
      elementos.nivel,
      elementos.descripcionCurso,
      elementos.precio,
      elementos.portada,
      elementos.cantidadModulos
    ].forEach(quitarErrorCampo);

    document.querySelectorAll('.instructorModuloTitulo, .instructorLeccionTitulo, .instructorLeccionDescripcion, .instructorLeccionVideo, .instructorLeccionTipoVideo, .instructorLeccionDuracion, .instructorLeccionesCantidad').forEach(quitarErrorCampo);
  };

  const enfocarPrimerCampoConError = () => {
    const campo = elementos.formCurso
      ? elementos.formCurso.querySelector('.is-invalid')
      : null;

    if (campo && typeof campo.focus === 'function') {
      campo.focus();
    }
  };

  const obtenerMensajeValidacionCampo = (campo) => {
    if (!campo) {
      return '';
    }

    const valor = campo.value.trim();

    if (campo === elementos.titulo) {
      if (valor.length === 0) {
        return 'Agrega el título del curso.';
      }

      if (valor.length < 5) {
        return 'El título debe tener al menos 5 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'El título debe contener texto, no solo números o signos.';
      }
    }

    if (campo === elementos.descripcionCurso) {
      if (valor.length === 0) {
        return 'Agrega la descripción del curso.';
      }

      if (valor.length < 20) {
        return 'La descripción debe tener al menos 20 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'La descripción debe contener texto, no solo números o signos.';
      }
    }

    if (campo === elementos.precio) {
      const precioTexto = normalizarPrecio(valor);
      const puntos = (precioTexto.match(/\./g) || []).length;

      if (precioTexto.length === 0) {
        return 'Agrega el precio del curso.';
      }

      if (/[^0-9.]/.test(precioTexto)) {
        return 'El precio solo permite números.';
      }

      if (puntos > 1) {
        return 'El precio debe ser un número válido.';
      }

      if (/^\d+\.\d{3,}$/.test(precioTexto) || /^\.\d{3,}$/.test(precioTexto)) {
        return 'El precio solo permite máximo dos decimales.';
      }

      if (!/^\d+(\.\d{0,2})?$/.test(precioTexto)) {
        return 'El precio debe ser un número válido.';
      }

      if (Number(precioTexto) <= 0) {
        return 'El precio debe ser mayor a 0.';
      }

      if (Number(precioTexto) > 9999) {
        return 'El precio no puede ser mayor a $9,999 MXN.';
      }
    }

    if (campo === elementos.nivel) {
      if (!valor) {
        return 'Selecciona una dificultad.';
      }
    }

    if (campo === elementos.portada) {
      if (!valor && !estado.portadaLocal) {
        return 'Agrega una portada por link o archivo local.';
      }

      if (valor && !esUrlPortadaValida(valor)) {
        return 'La portada debe ser una imagen JPG, PNG o WEBP. No uses videos, GIF ni otros archivos.';
      }
    }

    if (campo === elementos.cantidadModulos) {
      if (!/^\d+$/.test(valor)) {
        return 'Escribe una cantidad válida de módulos entre 1 y 20.';
      }

      const cantidad = Number(valor);

      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
        return 'Escribe una cantidad válida de módulos entre 1 y 20.';
      }
    }

    if (campo.classList.contains('instructorModuloTitulo')) {
      if (valor.length === 0) {
        return 'Agrega el nombre del módulo.';
      }

      if (valor.length < 3) {
        return 'El módulo debe tener al menos 3 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'El módulo debe contener texto, no solo números o signos.';
      }
    }

    if (campo.classList.contains('instructorLeccionTitulo')) {
      if (valor.length === 0) {
        return 'Agrega el nombre de la lección.';
      }

      if (valor.length < 3) {
        return 'La lección debe tener al menos 3 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'La lección debe contener texto, no solo números o signos.';
      }
    }

    if (campo.classList.contains('instructorLeccionDescripcion')) {
      if (valor.length === 0) {
        return 'Agrega la descripción de la lección.';
      }

      if (valor.length < 10) {
        return 'La descripción de la lección debe tener al menos 10 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'La descripción de la lección debe contener texto, no solo números o signos.';
      }
    }

    if (campo.classList.contains('instructorLeccionTipoVideo')) {
      if (!valor) {
        return 'Selecciona el tipo de video.';
      }
    }

    if (campo.classList.contains('instructorLeccionVideo')) {
      const tarjetaLeccion = campo.closest('.instructor-lesson-card');
      const tipoVideo = Number(tarjetaLeccion?.querySelector('.instructorLeccionTipoVideo')?.value || 1);

      if (valor.length === 0) {
        return tipoVideo === 3
          ? 'Selecciona el archivo local de la lección.'
          : 'Agrega el link del video de la lección.';
      }

      if (tipoVideo === 3) {
        if (!/^assets\/videos\/[\w\-./%()]+$/i.test(valor) || !esRutaVideoValida(valor)) {
          return 'Selecciona un video local MP4, WEBM, OGG, MOV o M4V.';
        }

        return '';
      }

      if (!esUrlVideoValida(valor)) {
        return 'Agrega un video válido. Usa YouTube, Vimeo o un archivo MP4, WEBM, OGG, MOV o M4V. No uses imágenes ni GIF.';
      }
    }

    if (campo.classList.contains('instructorLeccionDuracion')) {
      if (valor.length === 0) {
        return 'Agrega la duración aproximada de la lección.';
      }

      if (!/^\d+$/.test(valor) || Number(valor) < 1 || Number(valor) > 600) {
        return 'La duración debe ser un número de minutos entre 1 y 600.';
      }
    }

    if (campo.classList.contains('instructorRecursoTitulo')) {
      if (valor.length === 0) {
        return 'Agrega el nombre del recurso.';
      }

      if (valor.length < 3) {
        return 'El recurso debe tener al menos 3 caracteres.';
      }

      if (!contieneLetras(valor)) {
        return 'El recurso debe contener texto, no solo números o signos.';
      }
    }

    if (campo.classList.contains('instructorRecursoUrl')) {
      const tarjetaRecurso = campo.closest('.instructor-resource-card');
      const origen = tarjetaRecurso?.querySelector('.instructorRecursoOrigen')?.value || 'link';

      if (valor.length === 0) {
        return origen === 'local'
          ? 'Selecciona el archivo del recurso.'
          : 'Agrega el link del recurso.';
      }

      if (origen === 'local') {
        if (!/^assets\/recursos\/[\w\-./%()]+$/i.test(valor)) {
          return 'Selecciona un archivo local válido.';
        }

        return '';
      }

      if (!/^https?:\/\/\S+$/i.test(valor)) {
        return 'Agrega un link http/https válido.';
      }
    }

    if (campo.classList.contains('instructorRecursoCantidad')) {
      if (valor && (!/^\d+$/.test(valor) || Number(valor) < 1 || Number(valor) > 10)) {
        return 'La cantidad de recursos debe ser entre 1 y 10.';
      }
    }

    return '';
  };

  const validarCampoCurso = (campo, mostrarSiValido = false) => {
    if (!campo) {
      return true;
    }

    const mensaje = obtenerMensajeValidacionCampo(campo);

    if (mensaje) {
      mostrarErrorCampo(campo, mensaje);
      return false;
    }

    if (mostrarSiValido || campo.classList.contains('is-invalid')) {
      quitarErrorCampo(campo);
    }

    return true;
  };

  const marcarCampoValidado = (campo) => {
    if (campo) {
      campo.dataset.validacionIniciada = 'true';
    }
  };

  const campoYaFueValidado = (campo) => Boolean(
    campo && campo.dataset.validacionIniciada === 'true'
  );

  const formatearPrecioSiEsValido = () => {
    if (!elementos.precio) {
      return;
    }

    const valor = normalizarPrecio(elementos.precio.value);

    if (/^\d+(\.\d{0,2})?$/.test(valor)) {
      elementos.precio.value = Number(valor).toFixed(2);
    }
  };

  const precioRequiereValidacionInmediata = () => {
    if (!elementos.precio) {
      return false;
    }

    const valor = normalizarPrecio(elementos.precio.value);
    const puntos = (valor.match(/\./g) || []).length;

    return /[^0-9.]/.test(valor)
      || puntos > 1
      || /^\d+\.\d{3,}$/.test(valor)
      || /^\.\d{3,}$/.test(valor);
  };

  const activarValidacionEnTiempoReal = (campo) => {
    if (!campo) {
      return;
    }

    campo.addEventListener('blur', () => {
      marcarCampoValidado(campo);
      validarCampoCurso(campo, true);

      if (campo === elementos.precio && !campo.classList.contains('is-invalid')) {
        formatearPrecioSiEsValido();
      }
    });

    campo.addEventListener('input', () => {
      if (campo === elementos.precio && precioRequiereValidacionInmediata()) {
        marcarCampoValidado(campo);
        validarCampoCurso(campo, true);
        return;
      }

      if (campoYaFueValidado(campo) || campo.classList.contains('is-invalid')) {
        validarCampoCurso(campo, true);
      }
    });

    campo.addEventListener('change', () => {
      if (campo === elementos.precio && precioRequiereValidacionInmediata()) {
        marcarCampoValidado(campo);
        validarCampoCurso(campo, true);
        return;
      }

      if (campoYaFueValidado(campo) || campo.classList.contains('is-invalid')) {
        validarCampoCurso(campo, true);
      }
    });
  };

  const obtenerModoPortada = () => {
    return estado.portadaLocal ? 'local' : 'link';
  };

  const obtenerRutaSinConsulta = (valor) => String(valor || '')
    .trim()
    .split(/[?#]/)[0]
    .toLowerCase();

  const esRutaImagenValida = (valor) => /\.(jpg|jpeg|png|webp)$/i.test(obtenerRutaSinConsulta(valor));

  const esRutaVideoValida = (valor) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(obtenerRutaSinConsulta(valor));

  const esUrlYouTubeOVimeo = (valor) => /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(String(valor || '').trim());

  const esUrlPortadaValida = (valor) => {
    const texto = String(valor || '').trim();

    if (!texto) {
      return true;
    }

    if (/^https?:\/\/\S+$/i.test(texto)) {
      return esRutaImagenValida(texto);
    }

    return /^assets\/img\/[\w\-./%()]+$/i.test(texto) && esRutaImagenValida(texto);
  };

  const esUrlVideoValida = (valor) => {
    const texto = String(valor || '').trim();

    if (!texto) {
      return false;
    }

    if (/^assets\/videos\/[\w\-./%()]+$/i.test(texto)) {
      return esRutaVideoValida(texto);
    }

    if (esUrlYouTubeOVimeo(texto)) {
      return true;
    }

    if (/^https?:\/\/\S+$/i.test(texto)) {
      return esRutaVideoValida(texto);
    }

    return false;
  };

  const desbloquearCamposPortada = () => {
    if (elementos.portada) {
      elementos.portada.disabled = false;
      elementos.portada.classList.remove('is-locked');
    }

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.disabled = false;
    }

    if (elementos.portadaDropzone) {
      elementos.portadaDropzone.classList.remove('is-locked');
      elementos.portadaDropzone.setAttribute('aria-disabled', 'false');
    }

    if (elementos.portadaBloqueoTexto) {
      elementos.portadaBloqueoTexto.textContent = 'Solo se permite una imagen. Para cambiarla, borra la imagen actual.';
      elementos.portadaBloqueoTexto.hidden = true;
    }
  };

  const bloquearCamposPortada = (origen = 'link') => {
    if (elementos.portada) {
      elementos.portada.disabled = true;
      elementos.portada.classList.add('is-locked');
    }

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.disabled = true;
    }

    if (elementos.portadaDropzone) {
      elementos.portadaDropzone.classList.add('is-locked');
      elementos.portadaDropzone.setAttribute('aria-disabled', 'true');
    }

    if (elementos.portadaBloqueoTexto) {
      elementos.portadaBloqueoTexto.textContent = origen === 'local'
        ? 'Solo se permite una imagen. Ya seleccionaste un archivo local. Para cambiarlo, borra la imagen actual.'
        : 'Solo se permite una imagen. Ya agregaste una portada por link. Para cambiarla, borra la imagen actual.';
      elementos.portadaBloqueoTexto.hidden = false;
    }
  };

  const limpiarVistaPreviaPortada = () => {
    if (elementos.portadaPreviewWrap) {
      elementos.portadaPreviewWrap.hidden = true;
      elementos.portadaPreviewWrap.dataset.origen = '';
    }

    if (elementos.portadaPreview) {
      elementos.portadaPreview.removeAttribute('src');
    }

    if (elementos.portadaPreviewTexto) {
      elementos.portadaPreviewTexto.textContent = 'Revisa cómo se verá la portada antes de guardar.';
    }

    if (elementos.portadaArchivoNombre) {
      elementos.portadaArchivoNombre.textContent = 'Ningún archivo seleccionado.';
    }

    desbloquearCamposPortada();
  };

  const mostrarVistaPreviaPortada = (src, nombre = '', origen = 'link') => {
    if (elementos.portadaPreviewWrap && src) {
      elementos.portadaPreviewWrap.hidden = false;
      elementos.portadaPreviewWrap.dataset.origen = origen;
    }

    if (elementos.portadaPreview && src) {
      elementos.portadaPreview.src = src;
    }

    if (elementos.portadaPreviewTexto) {
      elementos.portadaPreviewTexto.textContent = nombre || 'Imagen seleccionada.';
    }

    if (elementos.portadaArchivoNombre && origen === 'local') {
      elementos.portadaArchivoNombre.textContent = nombre || 'Imagen seleccionada.';
    }

    bloquearCamposPortada(origen);
  };

  const borrarPortada = () => {
    estado.portadaLocal = null;

    if (elementos.portada) {
      elementos.portada.value = '';
    }

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.value = '';
    }

    limpiarVistaPreviaPortada();
    quitarErrorCampo(elementos.portada);
    ocultarEstadoFormulario();

    if (elementos.portada) {
      delete elementos.portada.dataset.validacionIniciada;
    }

    ocultarMensaje();
  };

  const actualizarVistaPortada = () => {
    if (estado.portadaLocal || (elementos.portada && elementos.portada.disabled)) {
      return;
    }

    const valor = elementos.portada ? elementos.portada.value.trim() : '';

    if (elementos.portada && elementos.portada.classList.contains('is-invalid')) {
      validarCampoCurso(elementos.portada, true);
    }

    if (valor) {
      if (esUrlPortadaValida(valor)) {
        quitarErrorCampo(elementos.portada);
        ocultarEstadoFormulario();
        mostrarVistaPreviaPortada(valor, 'Vista previa generada desde el link.', 'link');
      } else if (elementos.portadaPreviewWrap) {
        elementos.portadaPreviewWrap.hidden = true;
      }
    } else {
      limpiarVistaPreviaPortada();
    }
  };

  const leerArchivoComoDataUrl = (archivo) => new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer el archivo de portada.'));
    lector.readAsDataURL(archivo);
  });

  const asignarArchivoPortada = (archivo) => {
    if (!archivo) {
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const extensionPermitida = /\.(jpg|jpeg|png|webp)$/i.test(archivo.name || '');

    if (!tiposPermitidos.includes(archivo.type) || !extensionPermitida) {
      estado.portadaLocal = null;

      if (elementos.portadaArchivo) {
        elementos.portadaArchivo.value = '';
      }

      mostrarMensaje('La portada local debe ser una imagen JPG, PNG o WEBP. No uses videos, GIF ni otros archivos.', true);
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      estado.portadaLocal = null;

      if (elementos.portadaArchivo) {
        elementos.portadaArchivo.value = '';
      }

      mostrarMensaje('La portada local no debe pesar más de 2 MB.', true);
      return;
    }

    estado.portadaLocal = archivo;

    if (elementos.portada) {
      elementos.portada.value = '';
    }

    quitarErrorCampo(elementos.portada);
    ocultarEstadoFormulario();

    const urlTemporal = URL.createObjectURL(archivo);
    mostrarVistaPreviaPortada(urlTemporal, `Archivo local seleccionado: ${archivo.name}`, 'local');
  };

  const subirPortadaLocal = async () => {
    if (!estado.portadaLocal) {
      return elementos.portada ? elementos.portada.value.trim() : '';
    }

    const idInstructor = obtenerIdInstructor();
    const dataUrl = await leerArchivoComoDataUrl(estado.portadaLocal);
    const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/portadas`, {
      method: 'POST',
      body: {
        nombre_archivo: estado.portadaLocal.name,
        mime_type: estado.portadaLocal.type,
        data_url: dataUrl
      }
    });

    return datos.ruta || '';
  };

  const validarFormularioCurso = () => {
    const campos = [
      elementos.titulo,
      elementos.nivel,
      elementos.descripcionCurso,
      elementos.precio,
      elementos.portada
    ];
    const errores = [];

    campos.forEach((campo) => {
      marcarCampoValidado(campo);

      if (!validarCampoCurso(campo, true)) {
        const mensaje = obtenerMensajeValidacionCampo(campo);
        if (mensaje) {
          errores.push(mensaje);
        }
      }
    });

    if (errores.length === 0) {
      formatearPrecioSiEsValido();
    }

    return errores;
  };

  const obtenerUsuarioSesion = () => {
    if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
      return window.EduTech.obtenerUsuarioSesion();
    }

    try {
      return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
    } catch (error) {
      return null;
    }
  };

  const obtenerIdInstructor = () => estado.usuario && (estado.usuario.id_usuario || estado.usuario.id);

  const obtenerNombreCompleto = (usuario) => {
    if (!usuario) {
      return 'Instructor';
    }

    return [
      usuario.nombre,
      usuario.apellido_paterno,
      usuario.apellido_materno
    ].filter(Boolean).join(' ') || usuario.correo || 'Instructor';
  };

  const usuarioPuedeEntrar = (usuario) => {
    if (!usuario) {
      return false;
    }

    const idRol = Number(usuario.id_rol);
    const rol = String(usuario.nombre_rol || usuario.rol || '').toLowerCase();

    return idRol === 2 || idRol === 3 || rol === 'instructor' || rol === 'administrador';
  };

  const pintarPerfil = () => {
    const nombre = obtenerNombreCompleto(estado.usuario);

    if (elementos.nombre) {
      elementos.nombre.textContent = nombre;
    }

    if (elementos.correo) {
      elementos.correo.textContent = estado.usuario.correo || 'Sin correo registrado';
    }

    if (elementos.inicial) {
      const fotoPerfil = obtenerFotoPerfilInstructor(estado.usuario);

      if (fotoPerfil) {
        elementos.inicial.innerHTML = `<img src="${escaparHtml(fotoPerfil)}" alt="">`;
        elementos.inicial.classList.add('instructor-avatar-has-image');
      } else {
        elementos.inicial.textContent = nombre.trim().charAt(0).toUpperCase() || 'I';
        elementos.inicial.classList.remove('instructor-avatar-has-image');
      }
    }

    if (elementos.descripcion) {
      elementos.descripcion.textContent = `Hola, ${nombre}. Administra tus cursos, módulos, lecciones y exámenes.`;
    }
  };

  const pintarEstadisticas = () => {
    const resumen = estado.resumen || {};

    if (elementos.statCursos) {
      elementos.statCursos.textContent = resumen.total_cursos || 0;
    }

    if (elementos.statModulos) {
      elementos.statModulos.textContent = resumen.total_modulos || 0;
    }

    if (elementos.statLecciones) {
      elementos.statLecciones.textContent = resumen.total_lecciones || 0;
    }

    if (elementos.statAlumnos) {
      elementos.statAlumnos.textContent = resumen.total_alumnos || 0;
    }
  };

  const obtenerTextoRevision = (curso) => {
    if (!curso.ultima_revision) {
      return 'Sin revisión enviada';
    }

    return `${curso.ultima_revision.estado_revision || 'revisión'} · ${curso.ultima_revision.comentario || 'Sin comentario'}`;
  };

  const formatearFechaCurso = (valor) => {
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

  const normalizarEstadoTexto = (valor) => String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  const obtenerFiltroCurso = (curso) => {
    const estadoCurso = normalizarEstadoTexto(curso.nombre_estado_curso);
    const estadoRevision = normalizarEstadoTexto(curso.ultima_revision?.estado_revision);

    if (estadoRevision.includes('rechaz')) {
      return 'rechazado';
    }

    if (estadoRevision.includes('pendient') || estadoCurso.includes('revision') || estadoCurso.includes('pendient')) {
      return 'pendiente';
    }

    if (estadoCurso.includes('public')) {
      return 'publicado';
    }

    if (estadoCurso.includes('borrador')) {
      return 'borrador';
    }

    return 'otros';
  };

  const crearCursoCard = (curso) => {
    const estadoCurso = curso.nombre_estado_curso || 'sin estado';
    const nivel = curso.nombre_nivel || 'sin nivel';
    const totalModulos = Number(curso.total_modulos || 0);
    const totalLecciones = Number(curso.total_lecciones || 0);
    const totalAlumnos = Number(curso.total_alumnos || 0);
    const totalIntentos = Number(curso.total_intentos || 0);
    const totalAprobados = Number(curso.total_aprobados || 0);
    const promedio = Number(curso.promedio_examen || 0);
    const examen = curso.examen || null;
    const filtroCurso = obtenerFiltroCurso(curso);
    const tipoEliminacion = filtroCurso === 'rechazado' ? 'rechazado' : 'borrador';
    const puedeEliminarCurso = ['borrador', 'rechazado'].includes(filtroCurso);
    const textoBotonEliminar = tipoEliminacion === 'rechazado'
      ? 'Eliminar curso rechazado'
      : 'Eliminar borrador';
    const fechaBorrador = curso.fecha_actualizacion || curso.fecha_creacion;
    const fechaRevision = curso.ultima_revision?.fecha_revision || '';
    const textoFechaPrincipal = normalizarEstadoTexto(estadoCurso).includes('borrador')
      ? `Borrador guardado: ${formatearFechaCurso(fechaBorrador)}`
      : `Última actualización: ${formatearFechaCurso(fechaBorrador)}`;
    const textoFechaRevision = fechaRevision
      ? `Enviado/revisado: ${formatearFechaCurso(fechaRevision)}`
      : 'Revisión: sin fecha registrada';

    const articulo = document.createElement('article');
    articulo.className = 'instructor-course-card';
    articulo.dataset.estadoCurso = filtroCurso;

    articulo.innerHTML = `
      <div class="instructor-course-main">
        <p class="instructor-course-status">${escaparHtml(estadoCurso)} · ${escaparHtml(nivel)}</p>
        <h3>${escaparHtml(curso.titulo)}</h3>
        <p>${escaparHtml(curso.descripcion)}</p>
      </div>

      <div class="instructor-course-dates">
        <p>${escaparHtml(textoFechaPrincipal)}</p>
        <p>${escaparHtml(textoFechaRevision)}</p>
      </div>

      <div class="instructor-course-metrics">
        <span><strong>${totalModulos}</strong> módulos</span>
        <span><strong>${totalLecciones}</strong> lecciones</span>
        <span><strong>${totalAlumnos}</strong> alumnos</span>
        <span><strong>${formatearDinero(curso.precio_mxn)}</strong></span>
      </div>

      <div class="instructor-course-exam">
        <span>Examen: ${examen ? escaparHtml(examen.estado || 'configurado') : 'sin configurar'}</span>
        <span>Intentos: ${totalIntentos}</span>
        <span>Aprobados: ${totalAprobados}</span>
        <span>Promedio: ${promedio.toFixed(2)}%</span>
      </div>

      <p class="instructor-review-status">Revisión: ${escaparHtml(obtenerTextoRevision(curso))}</p>

      <div class="instructor-course-actions">
        <a href="#crear" data-panel-target="crear" data-action="editar-curso" data-id-curso="${encodeURIComponent(curso.id_curso)}">Editar curso</a>
        <a href="instructor-examen.html?idCurso=${encodeURIComponent(curso.id_curso)}">Examen</a>
        ${puedeEliminarCurso ? `<button type="button" data-action="eliminar-borrador" data-id-curso="${encodeURIComponent(curso.id_curso)}" data-delete-kind="${tipoEliminacion}">${textoBotonEliminar}</button>` : ''}
      </div>
    `;

    return articulo;
  };

  const obtenerCursosFiltrados = () => {
    const filtro = estado.filtroCursos || 'todos';
    const cursos = estado.cursos || [];

    if (filtro === 'todos') {
      return cursos;
    }

    return cursos.filter((curso) => obtenerFiltroCurso(curso) === filtro);
  };

  const pintarCursos = () => {
    const cursos = estado.cursos || [];
    const cursosFiltrados = obtenerCursosFiltrados();

    if (elementos.cursosResumen) {
      elementos.cursosResumen.innerHTML = '';

      if (cursos.length === 0) {
        elementos.cursosResumen.innerHTML = '<p class="instructor-empty-text">Todavía no tienes cursos asignados.</p>';
      } else {
        cursos.slice(0, 2).forEach((curso) => {
          elementos.cursosResumen.appendChild(crearCursoCard(curso));
        });
      }
    }

    if (elementos.cursosTodos) {
      elementos.cursosTodos.innerHTML = '';

      if (cursos.length === 0) {
        elementos.cursosTodos.innerHTML = '<p class="instructor-empty-text">Todavía no tienes cursos asignados.</p>';
      } else if (cursosFiltrados.length === 0) {
        elementos.cursosTodos.innerHTML = '<p class="instructor-filter-empty">No hay cursos con ese estado.</p>';
      } else {
        cursosFiltrados.forEach((curso) => {
          elementos.cursosTodos.appendChild(crearCursoCard(curso));
        });
      }
    }
  };

  const obtenerPanelDesdeHash = () => {
    const hashLimpio = window.location.hash.replace('#', '').split('?')[0].trim();
    return hashLimpio || 'dashboard';
  };

  const actualizarHashPanelInstructor = (panel, modo = 'replace') => {
    const hashNuevo = `#${panel}`;

    if (window.location.hash === hashNuevo) {
      return;
    }

    if (window.history && typeof window.history[modo === 'push' ? 'pushState' : 'replaceState'] === 'function') {
      window.history[modo === 'push' ? 'pushState' : 'replaceState']({ panel }, '', hashNuevo);
      return;
    }

    window.location.hash = panel;
  };

  const activarPanel = (nombrePanel, opciones = {}) => {
    const panelSolicitado = nombrePanel || 'dashboard';
    const existePanel = Boolean(document.getElementById(`panel-${panelSolicitado}`));
    const panelSeguro = existePanel ? panelSolicitado : 'dashboard';
    const actualizarHash = opciones.actualizarHash !== false;
    const modoHistorial = opciones.historial === 'push' ? 'push' : 'replace';

    document.querySelectorAll('.instructor-panel').forEach((panel) => {
      const esActivo = panel.id === `panel-${panelSeguro}`;
      panel.classList.toggle('active', esActivo);
      panel.hidden = !esActivo;
      panel.style.display = esActivo ? 'block' : 'none';
    });

    document.querySelectorAll('.instructor-nav-link[data-panel], .main-menu a[data-panel]').forEach((enlace) => {
      enlace.classList.toggle('active', enlace.dataset.panel === panelSeguro);
    });

    if (actualizarHash) {
      actualizarHashPanelInstructor(panelSeguro, modoHistorial);
    }

    if (panelSeguro === 'cuenta') {
      cargarCuentaInstructor();
    }

    if (opciones.subir !== false) {
      const contenedor = document.querySelector('.mi-cuenta-section');

      if (contenedor) {
        contenedor.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  };

  const pintarNiveles = () => {
    if (!elementos.nivel) {
      return;
    }

    const valorActual = elementos.nivel.value;
    elementos.nivel.innerHTML = '<option value="">Selecciona una dificultad</option>';

    const niveles = estado.niveles.length > 0 ? estado.niveles : nivelesBase;

    niveles.forEach((nivel) => {
      const opcion = document.createElement('option');
      opcion.value = String(nivel.id_nivel_curso);
      opcion.textContent = nivel.nombre_nivel;
      elementos.nivel.appendChild(opcion);
    });

    if (valorActual) {
      elementos.nivel.value = valorActual;
    }
  };

  const cargarCatalogos = async () => {
    try {
      const datos = await window.EduTech.apiRequest('/instructores/catalogos/curso');
      estado.niveles = Array.isArray(datos.niveles) && datos.niveles.length > 0
        ? datos.niveles
        : nivelesBase;
    } catch (error) {
      estado.niveles = nivelesBase;
    }

    pintarNiveles();
  };

  const limpiarPasoModulos = () => {
    estado.modulosActuales = [];

    if (elementos.moduloPaso) {
      elementos.moduloPaso.hidden = false;
    }

    if (elementos.cantidadModulos) {
      elementos.cantidadModulos.value = '';
    }

    if (elementos.modulosCampos) {
      elementos.modulosCampos.innerHTML = '';
    }

    if (elementos.guardarModulos) {
      elementos.guardarModulos.hidden = true;
    }
  };

  const mostrarPasoModulos = () => {
    if (elementos.moduloPaso) {
      elementos.moduloPaso.hidden = false;
    }
  };

  const configurarFormularioCrear = () => {
    if (elementos.formTitulo) {
      elementos.formTitulo.textContent = 'Crear curso';
    }

    if (elementos.formDescripcion) {
      elementos.formDescripcion.textContent = 'Crea la ficha general del curso y completa sus módulos en el mismo formulario.';
    }

    if (elementos.herramientasCurso) {
      elementos.herramientasCurso.hidden = true;
    }

    limpiarPasoModulos();
  };

  const configurarFormularioEditar = (idCurso) => {
    if (elementos.formTitulo) {
      elementos.formTitulo.textContent = 'Editar curso';
    }

    if (elementos.formDescripcion) {
      elementos.formDescripcion.textContent = 'Actualiza los datos generales del curso y continúa con módulos, lecciones y examen antes de enviarlo a revisión.';
    }

    if (elementos.herramientasCurso) {
      elementos.herramientasCurso.hidden = false;
    }

    if (elementos.herramientasLinks) {
      elementos.herramientasLinks.forEach((enlace) => {
        enlace.dataset.idCurso = String(idCurso || '');
      });
    }
  };

  const limpiarFormularioCurso = () => {
    estado.cursoEditando = null;

    if (elementos.formCurso) {
      elementos.formCurso.reset();
    }

    if (elementos.cursoId) {
      elementos.cursoId.value = '';
    }

    estado.portadaLocal = null;

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.value = '';
    }

    estado.modulosActuales = [];
    estado.leccionesActuales = [];

    if (elementos.modulosCampos) {
      elementos.modulosCampos.innerHTML = '';
    }

    if (elementos.leccionesCampos) {
      elementos.leccionesCampos.innerHTML = '';
    }

    configurarFormularioCrear();
    limpiarErroresFormularioCurso();
    limpiarVistaPreviaPortada();
  };

  const llenarFormularioCurso = (curso) => {
    estado.cursoEditando = curso;

    if (elementos.cursoId) {
      elementos.cursoId.value = curso.id_curso || '';
    }

    if (elementos.titulo) {
      elementos.titulo.value = curso.titulo || '';
    }

    if (elementos.descripcionCurso) {
      elementos.descripcionCurso.value = curso.descripcion || '';
    }

    if (elementos.precio) {
      elementos.precio.value = curso.precio_mxn || '0';
    }

    if (elementos.portada) {
      elementos.portada.value = curso.imagen_portada || '';
    }

    estado.portadaLocal = null;

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.value = '';
    }

    if (curso.imagen_portada) {
      mostrarVistaPreviaPortada(curso.imagen_portada, 'Vista previa guardada del curso.', 'link');
    } else {
      limpiarVistaPreviaPortada();
    }

    if (elementos.nivel) {
      elementos.nivel.value = String(curso.id_nivel_curso || '');
    }

    configurarFormularioEditar(curso.id_curso);
    prepararPasoModulos(curso);
  };


  const tiposVideoBase = [
    { id_tipo_video: 1, nombre_tipo_video: 'YouTube' },
    { id_tipo_video: 2, nombre_tipo_video: 'Vimeo' },
    { id_tipo_video: 3, nombre_tipo_video: 'Local' }
  ];

  const normalizarLeccion = (leccion = {}, indice = 0, moduloNumeroOrden = 1) => ({
    id_leccion: leccion.id_leccion || null,
    modulo_numero_orden: Number(leccion.modulo_numero_orden || moduloNumeroOrden),
    id_tipo_video: Number(leccion.id_tipo_video || leccion.idTipoVideo || 1),
    titulo: leccion.titulo || '',
    numero_orden: Number(leccion.numero_orden || indice + 1),
    texto_descriptivo: leccion.texto_descriptivo || leccion.descripcion || '',
    url_video: leccion.url_video || '',
    duracion_segundos: leccion.duracion_segundos === null || leccion.duracion_segundos === undefined
      ? null
      : Number(leccion.duracion_segundos),
    esta_activa: leccion.esta_activa !== false,
    recursos: Array.isArray(leccion.recursos) ? leccion.recursos : []
  });

  const obtenerModulosCurso = (curso) => {
    if (!curso || !Array.isArray(curso.modulos)) {
      return [];
    }

    return curso.modulos
      .map((modulo, indice) => {
        const numeroOrden = Number(modulo.numero_orden || indice + 1);
        const lecciones = Array.isArray(modulo.lecciones)
          ? modulo.lecciones.map((leccion, indiceLeccion) => normalizarLeccion(leccion, indiceLeccion, numeroOrden))
          : [];

        return {
          id_modulo: modulo.id_modulo || null,
          numero_orden: numeroOrden,
          titulo: modulo.titulo || '',
          lecciones
        };
      })
      .sort((a, b) => a.numero_orden - b.numero_orden);
  };

  const obtenerLeccionesDeModulo = (modulo = {}) => {
    if (!Array.isArray(modulo.lecciones)) {
      return [];
    }

    return modulo.lecciones
      .map((leccion, indice) => normalizarLeccion(leccion, indice, modulo.numero_orden || 1))
      .sort((a, b) => a.numero_orden - b.numero_orden);
  };

  const asociarLeccionesAModulos = (modulos = [], lecciones = []) => modulos.map((modulo) => ({
    ...modulo,
    lecciones: lecciones
      .filter((leccion) => Number(leccion.modulo_numero_orden) === Number(modulo.numero_orden))
      .map((leccion, indice) => normalizarLeccion(leccion, indice, modulo.numero_orden))
  }));

  const obtenerTituloModuloActual = (numeroOrden) => {
    const campo = document.querySelector(`.instructorModuloTitulo[data-numero-orden="${numeroOrden}"]`);
    const texto = campo ? campo.value.trim() : '';
    return texto || `Módulo ${numeroOrden}`;
  };

  const actualizarTituloGrupoLecciones = (numeroOrden) => {
    const titulo = document.querySelector(`.instructorLessonModuleTitle[data-modulo-orden="${numeroOrden}"]`);

    if (titulo) {
      titulo.textContent = `Módulo ${numeroOrden}: ${obtenerTituloModuloActual(numeroOrden)}`;
    }
  };

  const construirOpcionesTipoVideo = (seleccionado = 1) => {
    return tiposVideoBase.map((tipo) => `
      <option value="${tipo.id_tipo_video}" ${Number(seleccionado) === Number(tipo.id_tipo_video) ? 'selected' : ''}>${escaparHtml(tipo.nombre_tipo_video)}</option>
    `).join('');
  };

  const obtenerNombreArchivoVideo = (ruta) => {
    const texto = String(ruta || '');

    if (!texto) {
      return 'Ningún video seleccionado.';
    }

    return texto.split('/').pop() || 'Video seleccionado.';
  };

  const obtenerNombreArchivoRecurso = (ruta) => {
    const texto = String(ruta || '');

    if (!texto) {
      return 'Ningún archivo seleccionado.';
    }

    return texto.split('/').pop() || 'Archivo seleccionado.';
  };

  const obtenerRutaVideoLocal = (archivo) => {
    const nombreSeguro = String(archivo?.name || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w.\-()]/g, '');

    return nombreSeguro ? `assets/videos/${nombreSeguro}` : '';
  };

  const obtenerRutaRecursoLocal = (archivo) => {
    const nombreSeguro = String(archivo?.name || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w.\-()]/g, '');

    return nombreSeguro ? `assets/recursos/${nombreSeguro}` : '';
  };

  const actualizarModoVideoLeccion = (tarjeta) => {
    const tipo = Number(tarjeta.querySelector('.instructorLeccionTipoVideo')?.value || 1);
    const linkBox = tarjeta.querySelector('.instructor-video-link-box');
    const localBox = tarjeta.querySelector('.instructor-video-local-box');
    const videoInput = tarjeta.querySelector('.instructorLeccionVideo');

    const esLocal = tipo === 3;

    if (linkBox) {
      linkBox.hidden = esLocal;
    }

    if (localBox) {
      localBox.hidden = !esLocal;
    }

    if (videoInput) {
      videoInput.placeholder = esLocal
        ? 'assets/videos/video-del-curso.mp4'
        : 'https://youtube.com/watch?v=...';
    }
  };

  const prepararVideoLocalLeccion = (tarjeta) => {
    const archivoInput = tarjeta.querySelector('.instructorLeccionVideoArchivo');
    const nombreArchivo = tarjeta.querySelector('.instructor-video-file-name');
    const videoInput = tarjeta.querySelector('.instructorLeccionVideo');

    if (!archivoInput || !nombreArchivo || !videoInput) {
      return;
    }

    const valorInicial = videoInput.value.trim();

    if (valorInicial.startsWith('assets/videos/')) {
      nombreArchivo.textContent = obtenerNombreArchivoVideo(valorInicial);
      nombreArchivo.classList.add('has-file');
    }

    archivoInput.addEventListener('change', () => {
      const archivo = archivoInput.files && archivoInput.files[0];

      if (!archivo) {
        nombreArchivo.textContent = 'Ningún video seleccionado.';
        nombreArchivo.classList.remove('has-file');
        videoInput.value = '';
        validarCampoCurso(videoInput, true);
        return;
      }

      const maximoBytes = 80 * 1024 * 1024;
      const extensionValida = /\.(mp4|webm|ogg|mov|m4v)$/i.test(archivo.name);

      if (!extensionValida || archivo.size > maximoBytes) {
        archivoInput.value = '';
        nombreArchivo.textContent = 'Archivo inválido. Usa MP4, WEBM, OGG, MOV o M4V. Máximo 80 MB.';
        nombreArchivo.classList.remove('has-file');
        videoInput.value = '';
        validarCampoCurso(videoInput, true);
        return;
      }

      const rutaLocal = obtenerRutaVideoLocal(archivo);
      videoInput.value = rutaLocal;
      nombreArchivo.textContent = archivo.name;
      nombreArchivo.classList.add('has-file');
      validarCampoCurso(videoInput, true);
      ocultarEstadoFormulario();
    });
  };

  const construirOpcionesTipoRecurso = (seleccionado = 2) => {
    const tipos = [
      { id_tipo_recurso: 2, nombre_tipo_recurso: 'Enlace' },
      { id_tipo_recurso: 1, nombre_tipo_recurso: 'PDF' },
      { id_tipo_recurso: 3, nombre_tipo_recurso: 'Archivo' },
      { id_tipo_recurso: 4, nombre_tipo_recurso: 'Repositorio' }
    ];

    return tipos.map((tipo) => `
      <option value="${tipo.id_tipo_recurso}" ${Number(seleccionado) === Number(tipo.id_tipo_recurso) ? 'selected' : ''}>${escaparHtml(tipo.nombre_tipo_recurso)}</option>
    `).join('');
  };

  const actualizarModoRecurso = (tarjeta) => {
    const origen = tarjeta.querySelector('.instructorRecursoOrigen')?.value || 'link';
    const linkBox = tarjeta.querySelector('.instructor-resource-link-box');
    const localBox = tarjeta.querySelector('.instructor-resource-local-box');
    const inputUrl = tarjeta.querySelector('.instructorRecursoUrl');
    const tipoRecurso = tarjeta.querySelector('.instructorRecursoTipo');

    const esLocal = origen === 'local';

    if (linkBox) {
      linkBox.hidden = esLocal;
    }

    if (localBox) {
      localBox.hidden = !esLocal;
    }

    if (tipoRecurso) {
      tipoRecurso.value = esLocal ? '3' : '2';
    }

    if (inputUrl) {
      inputUrl.placeholder = esLocal
        ? 'assets/recursos/material.pdf'
        : 'https://sitio.com/material';
    }
  };

  const prepararArchivoLocalRecurso = (tarjeta) => {
    const archivoInput = tarjeta.querySelector('.instructorRecursoArchivo');
    const nombreArchivo = tarjeta.querySelector('.instructor-resource-file-name');
    const inputUrl = tarjeta.querySelector('.instructorRecursoUrl');

    if (!archivoInput || !nombreArchivo || !inputUrl) {
      return;
    }

    const valorInicial = inputUrl.value.trim();

    if (valorInicial.startsWith('assets/recursos/')) {
      nombreArchivo.textContent = obtenerNombreArchivoRecurso(valorInicial);
      nombreArchivo.classList.add('has-file');
    }

    archivoInput.addEventListener('change', () => {
      const archivo = archivoInput.files && archivoInput.files[0];

      if (!archivo) {
        nombreArchivo.textContent = 'Ningún archivo seleccionado.';
        nombreArchivo.classList.remove('has-file');
        inputUrl.value = '';
        validarCampoCurso(inputUrl, true);
        return;
      }

      const maximoBytes = 25 * 1024 * 1024;
      const extensionValida = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar|txt|png|jpg|jpeg|webp)$/i.test(archivo.name);

      if (!extensionValida || archivo.size > maximoBytes) {
        archivoInput.value = '';
        nombreArchivo.textContent = 'Archivo inválido. Máximo 25 MB.';
        nombreArchivo.classList.remove('has-file');
        inputUrl.value = '';
        validarCampoCurso(inputUrl, true);
        return;
      }

      const rutaLocal = obtenerRutaRecursoLocal(archivo);
      inputUrl.value = rutaLocal;
      nombreArchivo.textContent = archivo.name;
      nombreArchivo.classList.add('has-file');
      validarCampoCurso(inputUrl, true);
      ocultarEstadoFormulario();
    });
  };

  const pintarRecursosLeccion = (tarjetaLeccion, cantidad, recursos = []) => {
    const lista = tarjetaLeccion.querySelector('.instructor-resource-list');

    if (!lista) {
      return;
    }

    lista.innerHTML = '';

    for (let indice = 0; indice < cantidad; indice += 1) {
      const recurso = recursos[indice] || {};
      const esLocal = String(recurso.url_recurso || '').startsWith('assets/recursos/');
      const tarjeta = document.createElement('article');
      tarjeta.className = 'instructor-resource-card';
      tarjeta.dataset.recursoOrden = String(indice + 1);
      tarjeta.innerHTML = `
        <h6>Recurso ${indice + 1}</h6>
        <div class="instructor-resource-grid">
          <label class="mi-cuenta-field instructor-field">
            <span>Nombre del recurso</span>
            <input type="text" class="instructorRecursoTitulo" maxlength="150" autocomplete="off" value="${escaparHtml(recurso.titulo || '')}" placeholder="Ejemplo: Guía PDF">
            <small class="error-message"></small>
          </label>

          <label class="mi-cuenta-field instructor-field instructor-resource-origin-field">
            <span>¿Cómo quieres agregarlo?</span>
            <select class="instructorRecursoOrigen">
              <option value="link" ${esLocal ? '' : 'selected'}>Link</option>
              <option value="local" ${esLocal ? 'selected' : ''}>Local</option>
            </select>
            <small class="error-message"></small>
          </label>

          <label class="mi-cuenta-field instructor-field instructor-field-full">
            <span>Descripción del recurso</span>
            <input type="text" class="instructorRecursoDescripcion" maxlength="255" autocomplete="off" value="${escaparHtml(recurso.descripcion || '')}" placeholder="Material complementario de la lección">
            <small class="error-message"></small>
          </label>

          <input type="hidden" class="instructorRecursoTipo" value="${esLocal ? '3' : '2'}">

          <div class="mi-cuenta-field instructor-field instructor-resource-url-field">
            <span>Archivo o link del recurso</span>
            <div class="instructor-resource-link-box">
              <input type="text" class="instructorRecursoUrl" maxlength="255" autocomplete="off" value="${escaparHtml(recurso.url_recurso || '')}" placeholder="https://sitio.com/material">
            </div>
            <div class="instructor-resource-local-box" hidden>
              <label class="instructor-resource-dropzone">
                <input type="file" class="instructor-resource-file-input instructorRecursoArchivo">
                <span><strong>Arrastra un archivo aquí</strong>o haz clic para seleccionar PDF, Office, ZIP o imagen. Máximo 25 MB.</span>
              </label>
              <p class="instructor-resource-file-name ${esLocal && recurso.url_recurso ? 'has-file' : ''}">${escaparHtml(esLocal && recurso.url_recurso ? obtenerNombreArchivoRecurso(recurso.url_recurso) : 'Ningún archivo seleccionado.')}</p>
            </div>
            <small class="error-message"></small>
            ${indice === cantidad - 1 ? `
              <button type="button" class="instructor-form-text-button instructorCancelarRecursos instructor-cancel-resource-under-field">Cancelar recursos extra</button>
            ` : ''}
          </div>
        </div>
      `;
      lista.appendChild(tarjeta);

      const origen = tarjeta.querySelector('.instructorRecursoOrigen');
      if (origen) {
        origen.addEventListener('change', () => {
          actualizarModoRecurso(tarjeta);
          validarCampoCurso(tarjeta.querySelector('.instructorRecursoUrl'), true);
          ocultarEstadoFormulario();
        });
      }

      prepararArchivoLocalRecurso(tarjeta);
      actualizarModoRecurso(tarjeta);

      tarjeta
        .querySelectorAll('.instructorRecursoTitulo, .instructorRecursoUrl')
        .forEach((campo) => {
          activarValidacionEnTiempoReal(campo);
          campo.addEventListener('input', ocultarEstadoFormulario);
          campo.addEventListener('change', ocultarEstadoFormulario);
        });

      const botonCancelarRecursos = tarjeta.querySelector('.instructorCancelarRecursos');
      if (botonCancelarRecursos) {
        botonCancelarRecursos.addEventListener('click', () => {
          cancelarRecursosExtra(tarjetaLeccion);
        });
      }
    }
  };

  const actualizarRecursosExtra = (tarjeta) => {
    const selectExtra = tarjeta.querySelector('.instructorLeccionExtra');
    const cuerpo = tarjeta.querySelector('.instructor-extra-resources-body');
    const cantidad = tarjeta.querySelector('.instructorRecursoCantidad');
    const boton = tarjeta.querySelector('.instructorPrepararRecursos');
    const lista = tarjeta.querySelector('.instructor-resource-list');
    const botonCancelar = tarjeta.querySelector('.instructorCancelarRecursos');

    const activo = selectExtra?.value === 'si';

    if (cuerpo) {
      cuerpo.hidden = !activo;
    }

    if (cantidad) {
      cantidad.disabled = !activo;
    }

    if (boton) {
      boton.disabled = !activo;
    }

    if (botonCancelar) {
      botonCancelar.hidden = !activo;
    }

    if (!activo) {
      if (lista) {
        lista.innerHTML = '';
      }

      if (botonCancelar) {
        botonCancelar.hidden = true;
      }

      if (cantidad) {
        cantidad.value = '';
        quitarErrorCampo(cantidad);
      }
    }
  };

  const cancelarRecursosExtra = (tarjeta) => {
    const selectExtra = tarjeta.querySelector('.instructorLeccionExtra');
    const cantidad = tarjeta.querySelector('.instructorRecursoCantidad');
    const lista = tarjeta.querySelector('.instructor-resource-list');

    if (selectExtra) {
      selectExtra.value = 'no';
    }

    if (cantidad) {
      cantidad.value = '';
      quitarErrorCampo(cantidad);
    }

    if (lista) {
      lista.innerHTML = '';
    }

    actualizarRecursosExtra(tarjeta);
    ocultarEstadoFormulario();
  };

  const pintarCamposLeccionesModulo = (numeroOrden, cantidad, lecciones = []) => {
    const lista = document.querySelector(`.instructor-lesson-list[data-modulo-orden="${numeroOrden}"]`);

    if (!lista) {
      return;
    }

    lista.innerHTML = '';

    for (let indice = 0; indice < cantidad; indice += 1) {
      const leccion = lecciones[indice] || {};
      const recursos = Array.isArray(leccion.recursos) ? leccion.recursos : [];
      const duracionMinutos = leccion.duracion_segundos || leccion.duracion_segundos === 0
        ? Math.round(Number(leccion.duracion_segundos) / 60)
        : '';

      const esLocal = Number(leccion.id_tipo_video || 1) === 3 || String(leccion.url_video || '').startsWith('assets/videos/');
      const tieneRecursos = recursos.length > 0;
      const tarjeta = document.createElement('article');
      tarjeta.className = 'instructor-lesson-card';
      tarjeta.dataset.moduloOrden = String(numeroOrden);
      tarjeta.dataset.leccionOrden = String(indice + 1);
      tarjeta.innerHTML = `
        <h5>Lección ${indice + 1}</h5>
        <div class="instructor-lesson-grid">
          <label class="mi-cuenta-field instructor-field">
            <span>Nombre de la lección</span>
            <input type="text" class="instructorLeccionTitulo" data-modulo-orden="${numeroOrden}" data-leccion-orden="${indice + 1}" maxlength="150" autocomplete="off" value="${escaparHtml(leccion.titulo || '')}" placeholder="Ejemplo: Introducción">
            <small class="error-message"></small>
          </label>

          <label class="mi-cuenta-field instructor-field">
            <span>Tipo de video</span>
            <select class="instructorLeccionTipoVideo" data-modulo-orden="${numeroOrden}" data-leccion-orden="${indice + 1}">
              ${construirOpcionesTipoVideo(esLocal ? 3 : (leccion.id_tipo_video || 1))}
            </select>
            <small class="error-message"></small>
          </label>

          <label class="mi-cuenta-field instructor-field instructor-field-full">
            <span>Descripción de la lección</span>
            <textarea class="instructorLeccionDescripcion" data-modulo-orden="${numeroOrden}" data-leccion-orden="${indice + 1}" rows="3" placeholder="Explica brevemente qué verá el alumno en esta lección.">${escaparHtml(leccion.texto_descriptivo || '')}</textarea>
            <small class="error-message"></small>
          </label>

          <div class="mi-cuenta-field instructor-field instructor-video-field">
            <span>Video de la lección</span>
            <div class="instructor-video-source-box">
              <div class="instructor-video-link-box">
                <input type="text" class="instructorLeccionVideo" data-modulo-orden="${numeroOrden}" data-leccion-orden="${indice + 1}" maxlength="255" autocomplete="off" value="${escaparHtml(leccion.url_video || '')}" placeholder="https://youtube.com/watch?v=...">
              </div>

              <div class="instructor-video-local-box" hidden>
                <label class="instructor-video-dropzone">
                  <input type="file" class="instructor-video-file-input instructorLeccionVideoArchivo" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*">
                  <span><strong>Arrastra un video aquí</strong>o haz clic para seleccionar MP4, WEBM, OGG, MOV o M4V. Máximo 80 MB.</span>
                </label>
                <p class="instructor-video-file-name ${esLocal && leccion.url_video ? 'has-file' : ''}">${escaparHtml(esLocal && leccion.url_video ? obtenerNombreArchivoVideo(leccion.url_video) : 'Ningún video seleccionado.')}</p>
              </div>
            </div>
            <small class="error-message"></small>
          </div>

          <label class="mi-cuenta-field instructor-field instructor-duration-field">
            <span>Duración aproximada en minutos</span>
            <input type="text" class="instructorLeccionDuracion" data-modulo-orden="${numeroOrden}" data-leccion-orden="${indice + 1}" inputmode="numeric" autocomplete="off" value="${escaparHtml(duracionMinutos)}" placeholder="Ejemplo: 10">
            <small class="error-message"></small>
          </label>

          <div class="instructor-extra-resources">
            <div class="instructor-extra-resources-head">
              <label class="mi-cuenta-field instructor-field">
                <span>¿Quieres agregar contenido extra?</span>
                <select class="instructorLeccionExtra">
                  <option value="no" ${tieneRecursos ? '' : 'selected'}>No</option>
                  <option value="si" ${tieneRecursos ? 'selected' : ''}>Sí</option>
                </select>
                <small class="error-message"></small>
              </label>
            </div>

            <div class="instructor-extra-resources-body" ${tieneRecursos ? '' : 'hidden'}>
              <div class="instructor-resource-count-row">
                <label class="mi-cuenta-field instructor-field">
                  <span>¿Cuántos recursos?</span>
                  <input type="text" class="instructorRecursoCantidad" inputmode="numeric" autocomplete="off" value="${tieneRecursos ? String(recursos.length) : ''}" placeholder="Ejemplo: 2">
                  <small class="error-message"></small>
                </label>

                <div class="instructor-resource-actions-inline">
                  <button type="button" class="instructor-form-text-button instructorPrepararRecursos">Crear espacios de recursos</button>
                </div>
              </div>

              <div class="instructor-resource-list"></div>
            </div>
          </div>
        </div>
      `;
      lista.appendChild(tarjeta);

      const tipoVideo = tarjeta.querySelector('.instructorLeccionTipoVideo');

      if (tipoVideo) {
        tipoVideo.addEventListener('change', () => {
          actualizarModoVideoLeccion(tarjeta);
          validarCampoCurso(tarjeta.querySelector('.instructorLeccionVideo'), true);
          ocultarEstadoFormulario();
        });
      }

      const extra = tarjeta.querySelector('.instructorLeccionExtra');
      if (extra) {
        extra.addEventListener('change', () => {
          actualizarRecursosExtra(tarjeta);
          ocultarEstadoFormulario();
        });
      }

      const cantidadRecursos = tarjeta.querySelector('.instructorRecursoCantidad');
      if (cantidadRecursos) {
        activarValidacionEnTiempoReal(cantidadRecursos);
        cantidadRecursos.addEventListener('input', ocultarEstadoFormulario);
      }

      actualizarRecursosExtra(tarjeta);

      const botonRecursos = tarjeta.querySelector('.instructorPrepararRecursos');
      if (botonRecursos) {
        botonRecursos.addEventListener('click', () => {
          const campoCantidad = tarjeta.querySelector('.instructorRecursoCantidad');
          const cantidadRecursosValor = Number(campoCantidad?.value || 0);

          if (!/^\d+$/.test(String(campoCantidad?.value || '').trim()) || cantidadRecursosValor < 1 || cantidadRecursosValor > 10) {
            mostrarErrorCampo(campoCantidad, 'La cantidad de recursos debe ser entre 1 y 10.');
            campoCantidad?.focus();
            return;
          }

          quitarErrorCampo(campoCantidad);
          tarjeta.querySelector('.instructorLeccionExtra').value = 'si';
          pintarRecursosLeccion(tarjeta, cantidadRecursosValor, capturarRecursosLeccion(tarjeta));
          actualizarRecursosExtra(tarjeta);
        });
      }

      prepararVideoLocalLeccion(tarjeta);
      actualizarModoVideoLeccion(tarjeta);

      if (tieneRecursos) {
        pintarRecursosLeccion(tarjeta, recursos.length, recursos);
      }

      tarjeta
        .querySelectorAll('.instructorLeccionTitulo, .instructorLeccionDescripcion, .instructorLeccionVideo, .instructorLeccionTipoVideo, .instructorLeccionDuracion')
        .forEach((campo) => {
          activarValidacionEnTiempoReal(campo);
          campo.addEventListener('input', ocultarEstadoFormulario);
          campo.addEventListener('change', ocultarEstadoFormulario);
        });
    }
  };

  const pintarCamposLecciones = (modulos = []) => {
    if (!elementos.leccionesCampos) {
      return;
    }

    elementos.leccionesCampos.innerHTML = '';

    if (!modulos.length) {
      elementos.leccionesCampos.innerHTML = '<p class="instructor-lesson-empty">Primero crea los espacios de módulos para poder agregar lecciones.</p>';
      return;
    }

    modulos.forEach((modulo) => {
      const numeroOrden = Number(modulo.numero_orden || 1);
      const lecciones = obtenerLeccionesDeModulo(modulo);
      const tarjeta = document.createElement('section');
      tarjeta.className = 'instructor-lesson-module-card';
      tarjeta.dataset.moduloOrden = String(numeroOrden);
      tarjeta.innerHTML = `
        <div class="instructor-lesson-module-header">
          <div>
            <h4 class="instructorLessonModuleTitle" data-modulo-orden="${numeroOrden}">Módulo ${numeroOrden}: ${escaparHtml(obtenerTituloModuloActual(numeroOrden))}</h4>
            <p>Define las lecciones que tendrá este módulo.</p>
          </div>
        </div>

        <div class="instructor-lesson-count-row">
          <label class="mi-cuenta-field instructor-field">
            <span>¿Cuántas lecciones tendrá este módulo?</span>
            <input type="text" class="instructorLeccionesCantidad" data-modulo-orden="${numeroOrden}" inputmode="numeric" autocomplete="off" value="${lecciones.length ? String(lecciones.length) : ''}" placeholder="Ejemplo: 4">
            <small class="error-message"></small>
          </label>
          <button type="button" class="instructor-form-text-button instructorPrepararLeccionesModulo" data-modulo-orden="${numeroOrden}">Crear espacios de lecciones</button>
        </div>

        <div class="instructor-lesson-list" data-modulo-orden="${numeroOrden}"></div>
      `;
      elementos.leccionesCampos.appendChild(tarjeta);

      const cantidadCampo = tarjeta.querySelector('.instructorLeccionesCantidad');
      cantidadCampo.addEventListener('input', ocultarEstadoFormulario);

      if (lecciones.length > 0) {
        pintarCamposLeccionesModulo(numeroOrden, lecciones.length, lecciones);
      }
    });
  };

  const pintarCamposModulos = (cantidad, modulos = []) => {
    if (!elementos.modulosCampos) {
      return;
    }

    const leccionesCapturadas = capturarLeccionesFormulario();
    const modulosConLecciones = leccionesCapturadas.length
      ? asociarLeccionesAModulos(modulos, leccionesCapturadas)
      : modulos;

    elementos.modulosCampos.innerHTML = '';

    for (let indice = 0; indice < cantidad; indice += 1) {
      const modulo = modulosConLecciones[indice] || {};
      const fila = document.createElement('label');
      fila.className = 'mi-cuenta-field instructor-field instructor-module-field';
      fila.innerHTML = `
        <span>Nombre del módulo ${indice + 1}</span>
        <input type="text" class="instructorModuloTitulo" data-numero-orden="${indice + 1}" maxlength="150" autocomplete="off" value="${escaparHtml(modulo.titulo || '')}" placeholder="Nombre del módulo ${indice + 1}">
        <small class="error-message"></small>
      `;
      elementos.modulosCampos.appendChild(fila);

      const campoModulo = fila.querySelector('.instructorModuloTitulo');
      activarValidacionEnTiempoReal(campoModulo);
      campoModulo.addEventListener('input', () => {
        actualizarTituloGrupoLecciones(indice + 1);
        ocultarEstadoFormulario();
      });
    }

    if (elementos.guardarModulos) {
      elementos.guardarModulos.hidden = cantidad < 1;
    }

    const modulosParaLecciones = Array.from(document.querySelectorAll('.instructorModuloTitulo')).map((campo, indice) => {
      const base = modulosConLecciones[indice] || {};
      return {
        ...base,
        numero_orden: Number(campo.dataset.numeroOrden || indice + 1),
        titulo: campo.value.trim() || base.titulo || '',
        lecciones: base.lecciones || []
      };
    });

    pintarCamposLecciones(modulosParaLecciones);
  };

  const prepararPasoModulos = (curso) => {
    const cursoBase = curso || estado.cursoEditando;
    const modulos = obtenerModulosCurso(cursoBase);
    estado.modulosActuales = modulos;
    estado.leccionesActuales = modulos.flatMap((modulo) => obtenerLeccionesDeModulo(modulo));

    if (elementos.cantidadModulos) {
      elementos.cantidadModulos.value = modulos.length ? String(modulos.length) : '';
    }

    if (modulos.length > 0) {
      pintarCamposModulos(modulos.length, modulos);
    } else if (elementos.modulosCampos) {
      elementos.modulosCampos.innerHTML = '';
      pintarCamposLecciones([]);
    }

    mostrarPasoModulos();
  };

  const obtenerCantidadModulos = () => {
    const texto = elementos.cantidadModulos ? elementos.cantidadModulos.value.trim() : '';

    if (!/^\d+$/.test(texto)) {
      return null;
    }

    const cantidad = Number(texto);

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
      return null;
    }

    return cantidad;
  };

  const prepararCamposModulos = () => {
    const cantidad = obtenerCantidadModulos();

    if (!validarCampoCurso(elementos.cantidadModulos, true) || !cantidad) {
      ocultarMensaje();
      enfocarPrimerCampoConError();
      return;
    }

    ocultarMensaje();
    pintarCamposModulos(cantidad, estado.modulosActuales);
  };

  const validarCantidadLecciones = (campo) => {
    const valor = campo ? campo.value.trim() : '';

    if (!campo || !/^\d+$/.test(valor)) {
      mostrarErrorCampo(campo, 'Escribe una cantidad válida de lecciones entre 1 y 30.');
      return null;
    }

    const cantidad = Number(valor);

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 30) {
      mostrarErrorCampo(campo, 'Escribe una cantidad válida de lecciones entre 1 y 30.');
      return null;
    }

    quitarErrorCampo(campo);
    return cantidad;
  };

  const prepararCamposLecciones = (boton) => {
    const numeroOrden = Number(boton.dataset.moduloOrden || 0);
    const tarjeta = boton.closest('.instructor-lesson-module-card');
    const campoCantidad = tarjeta ? tarjeta.querySelector('.instructorLeccionesCantidad') : null;
    const cantidad = validarCantidadLecciones(campoCantidad);

    if (!cantidad) {
      campoCantidad?.focus();
      return;
    }

    const leccionesActuales = capturarLeccionesFormulario()
      .filter((leccion) => Number(leccion.modulo_numero_orden) === numeroOrden);

    ocultarMensaje();
    ocultarEstadoFormulario();
    pintarCamposLeccionesModulo(numeroOrden, cantidad, leccionesActuales);
  };

  const obtenerModulosFormulario = () => {
    const campos = Array.from(document.querySelectorAll('.instructorModuloTitulo'));
    const errores = [];
    const modulos = campos.map((campo, indice) => {
      const titulo = campo.value.trim();

      if (!validarCampoCurso(campo, true)) {
        const mensaje = obtenerMensajeValidacionCampo(campo);
        errores.push(mensaje.replace('El módulo', `El módulo ${indice + 1}`));
      }

      return {
        numero_orden: Number(campo.dataset.numeroOrden || indice + 1),
        titulo
      };
    });

    if (modulos.length === 0) {
      errores.push('Primero crea los espacios de módulos.');
    }

    return { errores, modulos };
  };

  const capturarRecursosLeccion = (tarjetaLeccion) => {
    const recursos = [];

    if (tarjetaLeccion.querySelector('.instructorLeccionExtra')?.value !== 'si') {
      return recursos;
    }

    tarjetaLeccion.querySelectorAll('.instructor-resource-card').forEach((tarjeta, indice) => {
      const titulo = tarjeta.querySelector('.instructorRecursoTitulo')?.value.trim() || '';
      const descripcion = tarjeta.querySelector('.instructorRecursoDescripcion')?.value.trim() || '';
      const urlRecurso = tarjeta.querySelector('.instructorRecursoUrl')?.value.trim() || '';
      const idTipoRecurso = Number(tarjeta.querySelector('.instructorRecursoTipo')?.value || 2);
      const tieneDatos = titulo || descripcion || urlRecurso;

      if (!tieneDatos) {
        return;
      }

      recursos.push({
        numero_orden: indice + 1,
        id_tipo_recurso: idTipoRecurso,
        titulo,
        descripcion,
        url_recurso: urlRecurso
      });
    });

    return recursos;
  };

  const validarRecursosLeccion = (tarjetaLeccion, moduloNumeroOrden, leccionNumeroOrden, errores) => {
    const extra = tarjetaLeccion.querySelector('.instructorLeccionExtra')?.value || 'no';

    if (extra !== 'si') {
      return [];
    }

    const cantidadCampo = tarjetaLeccion.querySelector('.instructorRecursoCantidad');
    const cantidadTexto = cantidadCampo ? cantidadCampo.value.trim() : '';

    marcarCampoValidado(cantidadCampo);

    if (!validarCampoCurso(cantidadCampo, true)) {
      const mensaje = obtenerMensajeValidacionCampo(cantidadCampo);
      if (mensaje) {
        errores.push(`Módulo ${moduloNumeroOrden}, lección ${leccionNumeroOrden}: ${mensaje}`);
      }
    }

    const recursos = [];

    tarjetaLeccion.querySelectorAll('.instructor-resource-card').forEach((tarjeta, indice) => {
      const campos = [
        tarjeta.querySelector('.instructorRecursoTitulo'),
        tarjeta.querySelector('.instructorRecursoUrl')
      ];

      campos.forEach((campo) => marcarCampoValidado(campo));

      campos.forEach((campo) => {
        if (!validarCampoCurso(campo, true)) {
          const mensaje = obtenerMensajeValidacionCampo(campo);
          if (mensaje) {
            errores.push(`Módulo ${moduloNumeroOrden}, lección ${leccionNumeroOrden}, recurso ${indice + 1}: ${mensaje}`);
          }
        }
      });

      recursos.push({
        numero_orden: indice + 1,
        id_tipo_recurso: Number(tarjeta.querySelector('.instructorRecursoTipo')?.value || 2),
        titulo: tarjeta.querySelector('.instructorRecursoTitulo')?.value.trim() || '',
        descripcion: tarjeta.querySelector('.instructorRecursoDescripcion')?.value.trim() || '',
        url_recurso: tarjeta.querySelector('.instructorRecursoUrl')?.value.trim() || ''
      });
    });

    if (cantidadTexto && Number(cantidadTexto) > 0 && recursos.length !== Number(cantidadTexto)) {
      errores.push(`Módulo ${moduloNumeroOrden}, lección ${leccionNumeroOrden}: crea los espacios de todos los recursos indicados.`);
    }

    return recursos;
  };

  const capturarLeccionesFormulario = () => {
    const lecciones = [];

    document.querySelectorAll('.instructor-lesson-card').forEach((tarjeta, indiceGlobal) => {
      const moduloNumeroOrden = Number(tarjeta.dataset.moduloOrden || 0);
      const leccionNumeroOrden = Number(tarjeta.dataset.leccionOrden || indiceGlobal + 1);
      const titulo = tarjeta.querySelector('.instructorLeccionTitulo')?.value.trim() || '';
      const textoDescriptivo = tarjeta.querySelector('.instructorLeccionDescripcion')?.value.trim() || '';
      const urlVideo = tarjeta.querySelector('.instructorLeccionVideo')?.value.trim() || '';
      const idTipoVideo = Number(tarjeta.querySelector('.instructorLeccionTipoVideo')?.value || 1);
      const duracionMinutosTexto = tarjeta.querySelector('.instructorLeccionDuracion')?.value.trim() || '';
      const recursos = capturarRecursosLeccion(tarjeta);
      const tieneDatos = titulo || textoDescriptivo || urlVideo || duracionMinutosTexto || recursos.length > 0;

      if (!tieneDatos) {
        return;
      }

      lecciones.push({
        modulo_numero_orden: moduloNumeroOrden,
        numero_orden: leccionNumeroOrden,
        titulo,
        texto_descriptivo: textoDescriptivo,
        url_video: urlVideo,
        id_tipo_video: idTipoVideo,
        duracion_segundos: duracionMinutosTexto ? Number(duracionMinutosTexto) * 60 : null,
        esta_activa: true,
        recursos
      });
    });

    return lecciones;
  };

  const obtenerLeccionesFormulario = () => {
    const errores = [];
    const lecciones = [];

    document.querySelectorAll('.instructor-lesson-card').forEach((tarjeta, indiceGlobal) => {
      const moduloNumeroOrden = Number(tarjeta.dataset.moduloOrden || 0);
      const leccionNumeroOrden = Number(tarjeta.dataset.leccionOrden || indiceGlobal + 1);
      const campos = [
        tarjeta.querySelector('.instructorLeccionTitulo'),
        tarjeta.querySelector('.instructorLeccionTipoVideo'),
        tarjeta.querySelector('.instructorLeccionDescripcion'),
        tarjeta.querySelector('.instructorLeccionVideo'),
        tarjeta.querySelector('.instructorLeccionDuracion')
      ];

      campos.forEach((campo) => marcarCampoValidado(campo));

      campos.forEach((campo) => {
        if (!validarCampoCurso(campo, true)) {
          const mensaje = obtenerMensajeValidacionCampo(campo);
          if (mensaje) {
            errores.push(`Módulo ${moduloNumeroOrden}, lección ${leccionNumeroOrden}: ${mensaje}`);
          }
        }
      });

      const duracionMinutosTexto = campos[4] ? campos[4].value.trim() : '';
      const recursos = validarRecursosLeccion(tarjeta, moduloNumeroOrden, leccionNumeroOrden, errores);

      lecciones.push({
        modulo_numero_orden: moduloNumeroOrden,
        numero_orden: leccionNumeroOrden,
        titulo: campos[0] ? campos[0].value.trim() : '',
        id_tipo_video: campos[1] ? Number(campos[1].value || 1) : 1,
        texto_descriptivo: campos[2] ? campos[2].value.trim() : '',
        url_video: campos[3] ? campos[3].value.trim() : '',
        duracion_segundos: duracionMinutosTexto ? Number(duracionMinutosTexto) * 60 : null,
        esta_activa: true,
        recursos
      });
    });

    document.querySelectorAll('.instructorLeccionesCantidad').forEach((campoCantidad) => {
      const tarjetaModulo = campoCantidad.closest('.instructor-lesson-module-card');
      const moduloNumeroOrden = Number(campoCantidad.dataset.moduloOrden || tarjetaModulo?.dataset.moduloOrden || 0);
      const cantidadTexto = campoCantidad.value.trim();
      const tarjetasModulo = Array.from(document.querySelectorAll(`.instructor-lesson-card[data-modulo-orden="${moduloNumeroOrden}"]`));

      if (tarjetasModulo.length === 0 && !cantidadTexto) {
        return;
      }

      if (!/^\d+$/.test(cantidadTexto)) {
        mostrarErrorCampo(campoCantidad, 'Escribe la cantidad de lecciones antes de continuar.');
        errores.push(`Módulo ${moduloNumeroOrden}: escribe la cantidad de lecciones antes de continuar.`);
        return;
      }

      const cantidad = Number(cantidadTexto);

      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 30) {
        mostrarErrorCampo(campoCantidad, 'Escribe una cantidad válida de lecciones entre 1 y 30.');
        errores.push(`Módulo ${moduloNumeroOrden}: la cantidad de lecciones debe estar entre 1 y 30.`);
        return;
      }

      quitarErrorCampo(campoCantidad);

      if (tarjetasModulo.length > 0 && tarjetasModulo.length !== cantidad) {
        mostrarErrorCampo(campoCantidad, 'La cantidad debe coincidir con los espacios de lección creados.');
        errores.push(`Módulo ${moduloNumeroOrden}: la cantidad debe coincidir con los espacios de lección creados.`);
      }
    });

    return { errores, lecciones };
  };

  const hayModulosCapturados = () => {
    return Array.from(document.querySelectorAll('.instructorModuloTitulo'))
      .some((campo) => campo.value.trim());
  };

  const hayLeccionesCapturadas = () => {
    return capturarLeccionesFormulario().length > 0;
  };

  const guardarModulosDesdeFormulario = async (idCurso) => {
    if (!idCurso || !hayModulosCapturados()) {
      return false;
    }

    const leccionesCapturadas = capturarLeccionesFormulario();
    const { errores, modulos } = obtenerModulosFormulario();

    if (errores.length > 0) {
      ocultarMensaje();
      mostrarEstadoFormulario('Revisa los campos marcados en rojo antes de continuar.');
      enfocarPrimerCampoConError();
      throw new Error('modulos_invalidos');
    }

    const idInstructor = obtenerIdInstructor();
    const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/modulos`, {
      method: 'POST',
      body: { modulos }
    });

    estado.modulosActuales = asociarLeccionesAModulos(
      Array.isArray(datos.modulos) ? datos.modulos : modulos,
      leccionesCapturadas.length ? leccionesCapturadas : estado.leccionesActuales
    );
    estado.leccionesActuales = estado.modulosActuales.flatMap((modulo) => obtenerLeccionesDeModulo(modulo));
    pintarCamposModulos(estado.modulosActuales.length, estado.modulosActuales);
    return true;
  };

  const validarLeccionesRequeridasSinGuardar = (accion) => {
    const requiereLecciones = accion === 'enviar_revision' || accion === 'continuar_examen';

    if (!requiereLecciones) {
      return true;
    }

    const tarjetas = Array.from(document.querySelectorAll('.instructor-lesson-card'));

    if (tarjetas.length === 0) {
      return true;
    }

    const { errores, lecciones } = obtenerLeccionesFormulario();

    if (lecciones.length === 0) {
      errores.push('Completa los datos de las lecciones que ya creaste antes de continuar.');
    }

    if (errores.length > 0) {
      ocultarMensaje();
      mostrarEstadoFormulario('Revisa las lecciones marcadas en rojo antes de continuar. No se borraron tus espacios de lección.');
      enfocarPrimerCampoConError();
      return false;
    }

    return true;
  };

  const guardarLeccionesDesdeFormulario = async (idCurso, requerido = false) => {
    if (!idCurso) {
      return false;
    }

    const { errores, lecciones } = obtenerLeccionesFormulario();

    if (lecciones.length === 0 && !requerido && !hayLeccionesCapturadas()) {
      return false;
    }

    if (lecciones.length === 0 && requerido) {
      errores.push('Agrega al menos una lección antes de enviar el curso a revisión.');
    }

    if (errores.length > 0) {
      ocultarMensaje();
      mostrarEstadoFormulario('Revisa las lecciones marcadas en rojo antes de continuar.');
      enfocarPrimerCampoConError();
      throw new Error('lecciones_invalidas');
    }

    const idInstructor = obtenerIdInstructor();
    const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/lecciones`, {
      method: 'POST',
      body: { lecciones }
    });

    estado.leccionesActuales = Array.isArray(datos.lecciones) ? datos.lecciones : lecciones;
    estado.modulosActuales = asociarLeccionesAModulos(estado.modulosActuales, estado.leccionesActuales);
    pintarCamposLecciones(estado.modulosActuales);
    return true;
  };

  const guardarModulosCurso = async () => {
    try {
      ocultarMensaje();
      ocultarEstadoFormulario();

      const idInstructor = obtenerIdInstructor();
      const idCurso = elementos.cursoId ? elementos.cursoId.value : '';

      if (!idCurso) {
        mostrarMensaje('Primero guarda la ficha general del curso como borrador.', true);
        return;
      }

      const { errores, modulos } = obtenerModulosFormulario();

      if (errores.length > 0) {
        ocultarMensaje();
        mostrarEstadoFormulario('Revisa los campos marcados en rojo antes de continuar.');
        enfocarPrimerCampoConError();
        return;
      }

      if (elementos.guardarModulos) {
        elementos.guardarModulos.disabled = true;
      }

      const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}/modulos`, {
        method: 'POST',
        body: { modulos }
      });

      estado.modulosActuales = Array.isArray(datos.modulos) ? datos.modulos : modulos;
      pintarCamposModulos(estado.modulosActuales.length, estado.modulosActuales);
      mostrarMensaje(datos.message || 'Módulos guardados correctamente. Después continúa con lecciones.');
      await cargarInstructor(false);
    } catch (error) {
      mostrarMensaje(error && error.message ? error.message : 'No se pudieron guardar los módulos.', true);
    } finally {
      if (elementos.guardarModulos) {
        elementos.guardarModulos.disabled = false;
      }
    }
  };

  const cargarCursoParaEditar = async (idCurso) => {
    try {
      ocultarMensaje();
      ocultarEstadoFormulario();

      const idInstructor = obtenerIdInstructor();
      const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCurso}`);
      llenarFormularioCurso(datos.curso);

      window.requestAnimationFrame(() => {
        const inicioFormulario = document.getElementById('panel-crear');

        if (inicioFormulario && typeof inicioFormulario.scrollIntoView === 'function') {
          inicioFormulario.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      });

      mostrarMensaje('Curso cargado para edición. Completa módulos, lecciones y examen antes de enviarlo a revisión.');
    } catch (error) {
      const estadoHttp = Number(error?.status || error?.statusCode || 0);
      const mensajeError = String(error?.message || '').toLowerCase();
      const esCursoAjeno = estadoHttp === 403
        || estadoHttp === 404
        || mensajeError.includes('no pertenece')
        || mensajeError.includes('curso no encontrado para este instructor')
        || mensajeError.includes('no tienes permisos');

      if (esCursoAjeno) {
        limpiarFormularioCurso();
        activarPanel('cursos');
        mostrarMensaje('No puedes acceder a ese curso porque no pertenece a tu cuenta de instructor.', true);
        return;
      }

      mostrarMensaje(error && error.message ? error.message : 'No se pudo cargar el curso para edición.', true);
    }
  };

  const obtenerDatosFormularioCurso = async () => ({
    titulo: elementos.titulo ? elementos.titulo.value.trim() : '',
    descripcion: elementos.descripcionCurso ? elementos.descripcionCurso.value.trim() : '',
    precio_mxn: elementos.precio ? normalizarPrecio(elementos.precio.value) : '0',
    imagen_portada: await subirPortadaLocal(),
    id_nivel_curso: elementos.nivel ? elementos.nivel.value : '',
  });

  const guardarCurso = async (evento) => {
    evento.preventDefault();

    try {
      ocultarMensaje();
      ocultarEstadoFormulario();

      const idInstructor = obtenerIdInstructor();
      const idCurso = elementos.cursoId ? elementos.cursoId.value : '';
      const accion = evento.submitter && evento.submitter.value
        ? evento.submitter.value
        : 'guardar_borrador';

      const errores = validarFormularioCurso();

      if (errores.length > 0) {
        ocultarMensaje();
        mostrarEstadoFormulario('Revisa los campos marcados en rojo antes de continuar.');
        enfocarPrimerCampoConError();
        return;
      }

      if (!validarLeccionesRequeridasSinGuardar(accion)) {
        return;
      }

      if (evento.submitter) {
        evento.submitter.disabled = true;
      }

      const datosFormulario = await obtenerDatosFormularioCurso();
      const cuerpoBorrador = {
        ...datosFormulario,
        accion: 'guardar_borrador'
      };

      const ruta = idCurso
        ? `/instructores/${idInstructor}/cursos/${idCurso}`
        : `/instructores/${idInstructor}/cursos`;

      const metodo = idCurso ? 'PUT' : 'POST';
      let datos = await window.EduTech.apiRequest(ruta, {
        method: metodo,
        body: cuerpoBorrador
      });

      if (datos.curso) {
        estado.cursoEditando = datos.curso;

        if (elementos.cursoId) {
          elementos.cursoId.value = datos.curso.id_curso || '';
        }

        configurarFormularioEditar(datos.curso.id_curso);
      }

      const idCursoGuardado = elementos.cursoId ? elementos.cursoId.value : '';
      let modulosGuardados = false;
      let leccionesGuardadas = false;

      try {
        modulosGuardados = await guardarModulosDesdeFormulario(idCursoGuardado);
      } catch (errorModulos) {
        if (errorModulos && errorModulos.message === 'modulos_invalidos') {
          return;
        }

        throw errorModulos;
      }

      try {
        leccionesGuardadas = await guardarLeccionesDesdeFormulario(idCursoGuardado, accion === 'enviar_revision' || accion === 'continuar_examen');
      } catch (errorLecciones) {
        if (errorLecciones && errorLecciones.message === 'lecciones_invalidas') {
          return;
        }

        throw errorLecciones;
      }

      if (accion === 'continuar_examen') {
        await cargarInstructor(false);
        window.location.href = `instructor-examen.html?idCurso=${encodeURIComponent(idCursoGuardado)}`;
        return;
      }

      if (accion === 'enviar_revision') {
        datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/cursos/${idCursoGuardado}`, {
          method: 'PUT',
          body: {
            ...datosFormulario,
            accion: 'enviar_revision'
          }
        });
      }

      const mensajeExito = accion === 'enviar_revision'
        ? (datos.message || 'Curso enviado a revisión.')
        : leccionesGuardadas
          ? 'Curso, módulos y lecciones guardados como borrador.'
          : modulosGuardados
            ? 'Curso y módulos guardados como borrador. Puedes agregar lecciones en este mismo formulario.'
            : 'Curso guardado como borrador. Puedes agregar módulos y lecciones en este mismo formulario.';

      await cargarInstructor(false);
      limpiarFormularioCurso();
      activarPanel('cursos', { historial: 'push' });
      mostrarMensaje(mensajeExito);
      return;
    } catch (error) {
      const mensajeError = error && error.message ? error.message : 'No se pudo guardar el curso.';
      ocultarMensaje();
      mostrarEstadoFormulario(mensajeError);

      if (elementos.formEstado && typeof elementos.formEstado.scrollIntoView === 'function') {
        elementos.formEstado.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (evento.submitter) {
        evento.submitter.disabled = false;
      }
    }
  };


  const prepararCuentaInstructor = () => {
    if (!elementos.cuentaForm) {
      return;
    }

    const camposValidables = [
      elementos.cuentaCorreo,
      elementos.cuentaFotoUrl,
      elementos.cuentaTelefono,
      elementos.cuentaCodigoPostal
    ];

    camposValidables.forEach((campo) => {
      if (!campo) {
        return;
      }

      campo.addEventListener('blur', () => validarCampoCuentaInstructor(campo));
      campo.addEventListener('input', () => {
        if (campo === elementos.cuentaTelefono || campo === elementos.cuentaCodigoPostal) {
          campo.value = campo.value.replace(/\D/g, '');
        }

        validarCampoCuentaInstructor(campo);

        if (elementos.cuentaGuardada) {
          elementos.cuentaGuardada.style.display = 'none';
        }
      });
    });

    if (elementos.cuentaEstado) {
      elementos.cuentaEstado.addEventListener('change', () => poblarCiudadesInstructor(''));
    }

    if (elementos.cuentaFotoUrl) {
      elementos.cuentaFotoUrl.addEventListener('input', () => {
        if (elementos.cuentaFotoArchivo) {
          elementos.cuentaFotoArchivo.value = '';
          elementos.cuentaFotoArchivo.dataset.fotoLocal = '';
        }

        actualizarNombreFotoInstructor('Sin imagen seleccionada');
        actualizarPreviewFotoInstructor(elementos.cuentaFotoUrl.value || obtenerFotoPerfilInstructor());
      });
    }

    if (elementos.cuentaFotoArchivo) {
      elementos.cuentaFotoArchivo.addEventListener('change', async () => {
        const archivo = elementos.cuentaFotoArchivo.files && elementos.cuentaFotoArchivo.files[0];

        if (!archivo) {
          elementos.cuentaFotoArchivo.dataset.fotoLocal = '';
          actualizarNombreFotoInstructor('Sin imagen seleccionada');
          actualizarPreviewFotoInstructor(elementos.cuentaFotoUrl ? elementos.cuentaFotoUrl.value : obtenerFotoPerfilInstructor());
          return;
        }

        try {
          const fotoLocal = await leerFotoLocalInstructor(archivo);
          elementos.cuentaFotoArchivo.dataset.fotoLocal = fotoLocal;
          actualizarNombreFotoInstructor(archivo.name);
          actualizarPreviewFotoInstructor(fotoLocal);

          if (elementos.cuentaFotoUrl) {
            elementos.cuentaFotoUrl.value = '';
            quitarErrorCampo(elementos.cuentaFotoUrl);
          }
        } catch (error) {
          elementos.cuentaFotoArchivo.dataset.fotoLocal = '';
          actualizarNombreFotoInstructor('Sin imagen seleccionada');
          mostrarErrorCampo(elementos.cuentaFotoArchivo, error.message || 'Selecciona una imagen válida.');
        }
      });
    }

    elementos.cuentaForm.addEventListener('submit', guardarCuentaInstructor);
  };


  const prepararFormularioCurso = () => {
    if (elementos.formCurso) {
      elementos.formCurso.addEventListener('submit', guardarCurso);
    }

    [
      elementos.titulo,
      elementos.nivel,
      elementos.descripcionCurso,
      elementos.precio,
      elementos.portada,
      elementos.cantidadModulos
    ].forEach((campo) => {
      activarValidacionEnTiempoReal(campo);

      if (campo) {
        campo.addEventListener('input', ocultarEstadoFormulario);
        campo.addEventListener('change', ocultarEstadoFormulario);
      }
    });

    if (elementos.portada) {
      elementos.portada.addEventListener('input', () => {
        if (!estado.portadaLocal) {
          actualizarVistaPortada();
        }
      });
    }

    if (elementos.portadaArchivo) {
      elementos.portadaArchivo.addEventListener('change', () => {
        asignarArchivoPortada(elementos.portadaArchivo.files[0]);
      });
    }

    if (elementos.portadaDropzone) {
      ['dragenter', 'dragover'].forEach((eventoNombre) => {
        elementos.portadaDropzone.addEventListener(eventoNombre, (evento) => {
          evento.preventDefault();

          if (!elementos.portadaDropzone.classList.contains('is-locked')) {
            elementos.portadaDropzone.classList.add('drag-over');
          }
        });
      });

      ['dragleave', 'drop'].forEach((eventoNombre) => {
        elementos.portadaDropzone.addEventListener(eventoNombre, (evento) => {
          evento.preventDefault();
          elementos.portadaDropzone.classList.remove('drag-over');
        });
      });

      elementos.portadaDropzone.addEventListener('drop', (evento) => {
        if (elementos.portadaDropzone.classList.contains('is-locked')) {
          return;
        }

        const archivo = evento.dataTransfer.files[0];
        asignarArchivoPortada(archivo);
      });
    }

    if (elementos.prepararModulos) {
      elementos.prepararModulos.addEventListener('click', prepararCamposModulos);
    }

    if (elementos.formCurso) {
      elementos.formCurso.addEventListener('click', (evento) => {
        const botonLecciones = evento.target.closest('.instructorPrepararLeccionesModulo');

        if (!botonLecciones) {
          return;
        }

        evento.preventDefault();
        prepararCamposLecciones(botonLecciones);
      });
    }

    if (elementos.guardarModulos) {
      elementos.guardarModulos.addEventListener('click', guardarModulosCurso);
    }

    if (elementos.borrarPortada) {
      elementos.borrarPortada.addEventListener('click', borrarPortada);
    }

    configurarFormularioCrear();
    actualizarVistaPortada();
  };

  const eliminarCursoBorradorDesdeTarjeta = async (idCurso, tipoEliminacion = 'borrador') => {
    const idInstructor = obtenerIdInstructor();
    const tipo = tipoEliminacion === 'rechazado' ? 'rechazado' : 'borrador';
    const nombreElemento = tipo === 'rechazado' ? 'curso rechazado' : 'borrador';

    if (!idInstructor || !idCurso) {
      mostrarMensaje('No se pudo identificar el curso a eliminar.', true);
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar este ${nombreElemento}? Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    try {
      await window.EduTech.apiRequest(`/instructores/${encodeURIComponent(idInstructor)}/cursos/${encodeURIComponent(idCurso)}/borrador`, {
        method: 'DELETE'
      });
      mostrarMensaje(tipo === 'rechazado'
        ? 'Curso rechazado eliminado correctamente.'
        : 'Borrador eliminado correctamente.');
      await cargarInstructor(false);
      activarPanel('cursos', { actualizarHash: true, subir: false });
    } catch (error) {
      mostrarMensaje(error.message || `No se pudo eliminar el ${nombreElemento}.`, true);
    }
  };

  const prepararNavegacion = () => {
    document.addEventListener('click', (evento) => {
      const botonEliminar = evento.target.closest('[data-action="eliminar-borrador"]');

      if (botonEliminar) {
        evento.preventDefault();
        eliminarCursoBorradorDesdeTarjeta(botonEliminar.dataset.idCurso, botonEliminar.dataset.deleteKind);
        return;
      }

      const enlace = evento.target.closest('[data-panel], [data-panel-target]');

      if (!enlace) {
        return;
      }

      const panel = enlace.dataset.panel || enlace.dataset.panelTarget;

      if (!panel) {
        return;
      }

      evento.preventDefault();
      activarPanel(panel, { historial: 'push' });

      if (enlace.dataset.action === 'editar-curso' && enlace.dataset.idCurso) {
        cargarCursoParaEditar(enlace.dataset.idCurso);
        return;
      }

      if (panel === 'crear' && !enlace.dataset.action) {
        limpiarFormularioCurso();
      }
    });

    const aplicarPanelDesdeHistorial = () => {
      activarPanel(obtenerPanelDesdeHash(), { actualizarHash: false });
    };

    window.addEventListener('popstate', aplicarPanelDesdeHistorial);
    window.addEventListener('hashchange', aplicarPanelDesdeHistorial);

    activarPanel(obtenerPanelDesdeHash(), { actualizarHash: false, subir: false });
  };

  const cargarEdicionPendienteDesdeExamen = async () => {
    const idCursoPendiente = sessionStorage.getItem('edutech_instructor_editar_curso_id');

    if (!idCursoPendiente) {
      return false;
    }

    sessionStorage.removeItem('edutech_instructor_editar_curso_id');
    activarPanel('crear', { actualizarHash: true, subir: false });
    await cargarCursoParaEditar(idCursoPendiente);
    return true;
  };

  const cargarInstructor = async (debeMarcarPaginaLista = true) => {
    try {
      ocultarMensaje();

      estado.usuario = obtenerUsuarioSesion();

      if (!estado.usuario) {
        if (window.EduTech && typeof window.EduTech.guardarRedirectDespuesLogin === 'function') {
          window.EduTech.guardarRedirectDespuesLogin('instructor.html');
        }

        window.location.replace('login.html');
        return;
      }

      if (!usuarioPuedeEntrar(estado.usuario)) {
        const destino = window.EduTech && typeof window.EduTech.obtenerRutaInicioPorRol === 'function'
          ? window.EduTech.obtenerRutaInicioPorRol(estado.usuario)
          : 'mi-cuenta.html';

        window.location.replace(destino);
        return;
      }

      cargarCuentaInstructor();
      pintarPerfil();

      await cargarCatalogos();

      const idInstructor = obtenerIdInstructor();
      const datos = await window.EduTech.apiRequest(`/instructores/${idInstructor}/resumen`);

      estado.resumen = datos.resumen || {};
      estado.cursos = Array.isArray(datos.cursos) ? datos.cursos : [];

      if (datos.instructor) {
        estado.usuario = {
          ...estado.usuario,
          ...datos.instructor
        };
      }

      cargarCuentaInstructor();
      pintarPerfil();
      pintarEstadisticas();
      pintarCursos();
      activarPanel(obtenerPanelDesdeHash(), { actualizarHash: false, subir: false });
      const seCargoEdicionPendiente = await cargarEdicionPendienteDesdeExamen();

      if (!seCargoEdicionPendiente) {
        consumirMensajeAcceso();
      }
    } catch (error) {
      mostrarMensaje(error && error.message ? error.message : 'No se pudo cargar el panel del instructor.', true);
    } finally {
      if (debeMarcarPaginaLista) {
        marcarPaginaLista();
      }
    }
  };

  if (elementos.cerrarSesion) {
    elementos.cerrarSesion.addEventListener('click', (evento) => {
      evento.preventDefault();

      if (window.EduTech && typeof window.EduTech.cerrarSesion === 'function') {
        window.EduTech.cerrarSesion();
      }

      window.location.replace('login.html');
    });
  }

  prepararNavegacion();
  prepararCuentaInstructor();
  prepararFormularioCurso();
  if (elementos.filtroCursos) {
    elementos.filtroCursos.addEventListener('change', () => {
      estado.filtroCursos = elementos.filtroCursos.value || 'todos';
      pintarCursos();
    });
  }
  document.addEventListener('DOMContentLoaded', cargarInstructor);
})();
