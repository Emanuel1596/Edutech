(() => {
  const limpiarTexto = (valor) => String(valor || '').trim();
  const marcarPaginaDatosLista = () => {
    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
  };
  const esperar = (milisegundos) => new Promise((resolve) => window.setTimeout(resolve, milisegundos));

  const ciudadesPorEstado = {
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

  const aliasesEstado = {
    cdmx: 'Ciudad de México',
    df: 'Ciudad de México',
    'distrito federal': 'Ciudad de México',
    'ciudad de mexico': 'Ciudad de México',
    'estado de mexico': 'Estado de México',
    edomex: 'Estado de México',
    jalisco: 'Jalisco',
    'nuevo leon': 'Nuevo León',
    puebla: 'Puebla',
    '1': 'Ciudad de México',
    '2': 'Estado de México',
    '3': 'Jalisco',
    '4': 'Nuevo León',
    '5': 'Puebla'
  };

  const obtenerElemento = (...selectores) => {
    for (const selector of selectores) {
      const elemento = document.querySelector(selector);

      if (elemento) {
        return elemento;
      }
    }

    return null;
  };

  const obtenerPaginaCompra = () => obtenerElemento('main.checkout-page', '.site-content.checkout-page');

  const activarCargaVisualCompra = () => {
    const paginaCompra = obtenerPaginaCompra();

    if (!paginaCompra) {
      return;
    }

    paginaCompra.classList.add('checkout-loading');

    window.setTimeout(() => {
      paginaCompra.classList.add('checkout-ready');
      paginaCompra.classList.remove('checkout-loading');
      marcarPaginaDatosLista();
    }, 2500);
  };

  const revelarPantallaCompra = () => {
    const paginaCompra = obtenerPaginaCompra();

    if (!paginaCompra) {
      return;
    }

    paginaCompra.classList.add('checkout-ready');
    paginaCompra.classList.remove('checkout-loading');
    marcarPaginaDatosLista();
  };

  const mostrarElemento = (elemento) => {
    if (!elemento) {
      return;
    }

    elemento.hidden = false;
    elemento.classList.remove('is-hidden', 'is-loading', 'hidden', 'd-none');
    elemento.style.removeProperty('display');
    elemento.style.removeProperty('visibility');
    elemento.style.removeProperty('opacity');
  };

  const asegurarPantallaVisible = () => {
    [
      '.checkout-page',
      '.checkout-section',
      '.checkout-container',
      '.checkout-main',
      '.checkout-summary',
      '#checkoutSummary',
      '#compraContenidoVisual',
      '#compraCursoForm',
      '#checkoutForm'
    ].forEach((selector) => {
      document.querySelectorAll(selector).forEach(mostrarElemento);
    });
  };

  const esCompraDesdeCarrito = () => {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get('carrito') === '1';
  };

  const obtenerParametroId = () => {
    if (esCompraDesdeCarrito()) {
      return null;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idPorQuery = parametros.get('id');

    if (idPorQuery) {
      sessionStorage.setItem('edutech_curso_compra_id', idPorQuery);
      sessionStorage.setItem('edutech_curso_detalle_id', idPorQuery);
      return idPorQuery;
    }

    const idCompra = sessionStorage.getItem('edutech_curso_compra_id');

    if (idCompra) {
      return idCompra;
    }

    const idDetalle = sessionStorage.getItem('edutech_curso_detalle_id');

    if (idDetalle) {
      sessionStorage.setItem('edutech_curso_compra_id', idDetalle);
      return idDetalle;
    }

    return null;
  };

  const obtenerUsuarioCompra = () => {
    if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
      return window.EduTech.obtenerUsuarioSesion();
    }

    try {
      return JSON.parse(localStorage.getItem('edutech_usuario') || 'null');
    } catch (error) {
      return null;
    }
  };

  const usuarioEsInstructorCompra = () => {
    const usuario = obtenerUsuarioCompra();

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

  const mostrarNoCoincidenciasCompra = () => {
    document.body.className = 'edutech-denied-body';
    document.body.innerHTML = `
      <main class="edutech-denied-page" aria-live="polite">
        <section class="edutech-denied-card">
          <h1>No hay coincidencias</h1>
        </section>
      </main>
    `;

    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
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

  const obtenerInstructor = (curso) => {
    const nombre = curso.nombre_instructor || curso.instructor_nombre || '';
    const apellido = curso.apellido_paterno_instructor || curso.instructor_apellido || '';
    const instructor = `${nombre} ${apellido}`.trim();

    return instructor || curso.instructor || 'Instructor EduTech';
  };

  const crearPantallaCompraSiNoExiste = () => {
    const formularioExistente = obtenerElemento('#compraCursoForm', '#checkoutForm');

    if (formularioExistente) {
      return;
    }

    const main = obtenerElemento('main.checkout-page', '.site-content.checkout-page', 'main.site-content');

    if (!main) {
      return;
    }

    main.innerHTML = `
      <section class="checkout-section">
        <div class="checkout-container checkout-form-stacked" id="compraContenidoVisual">
          <div class="checkout-main">
            <h1>Adquisición de curso</h1>
            <p class="checkout-login-line" id="checkoutUsuarioLinea"></p>
            <p class="form-warning" id="checkoutError" role="alert"></p>

            <form class="checkout-form checkout-form-stacked" id="compraCursoForm" novalidate>
              <h2>Datos de contacto</h2>

              <div class="form-field checkout-full-field">
                <label for="checkoutNombre">Primer nombre *</label>
                <input type="text" id="checkoutNombre" name="nombre" autocomplete="given-name" required>
                <span class="error-message">Escribe un nombre válido, sin números ni signos especiales.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutApellidos">Apellidos *</label>
                <input type="text" id="checkoutApellidos" name="apellidos" autocomplete="family-name" required>
                <span class="error-message">Escribe apellidos válidos, sin números ni signos especiales.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutCorreo">Correo electrónico *</label>
                <input type="email" id="checkoutCorreo" name="correo" autocomplete="email" required>
                <span class="error-message">Escribe un correo electrónico válido.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutTelefono">Número de teléfono *</label>
                <input type="tel" id="checkoutTelefono" name="telefono" inputmode="numeric" autocomplete="tel" required>
                <span class="error-message">Escribe un teléfono válido de 10 dígitos.</span>
              </div>

              <h2>Información de facturación</h2>

              <div class="form-field checkout-full-field">
                <label for="checkoutDireccion">Dirección *</label>
                <input type="text" id="checkoutDireccion" name="direccion" autocomplete="address-line1" required>
                <span class="error-message">Escribe una dirección válida.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutInterior">Interior</label>
                <input type="text" id="checkoutInterior" name="interior" autocomplete="address-line2">
                <span class="error-message">Escribe un interior válido.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutEstado">Estado *</label>
                <select id="checkoutEstado" name="estado" autocomplete="address-level1" required>
                  <option value="Ciudad de México">Ciudad de México</option>
                  <option value="Estado de México">Estado de México</option>
                  <option value="Jalisco">Jalisco</option>
                  <option value="Nuevo León">Nuevo León</option>
                </select>
                <span class="error-message">Selecciona un estado.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutCiudad">Ciudad *</label>
                <select id="checkoutCiudad" name="ciudad" autocomplete="address-level2" required>
                  <option value="">Selecciona una ciudad</option>
                </select>
                <span class="error-message">Selecciona una ciudad.</span>
              </div>

              <div class="form-field checkout-full-field">
                <label for="checkoutCodigoPostal">Código postal *</label>
                <input type="text" id="checkoutCodigoPostal" name="codigoPostal" inputmode="numeric" autocomplete="postal-code" required>
                <span class="error-message">Escribe un código postal válido de 5 dígitos.</span>
              </div>

              <p class="form-success" id="checkoutSuccess">Datos validados. Continúa con PayPal Sandbox.</p>
            </form>
          </div>

          <aside class="checkout-summary" id="checkoutSummary" aria-labelledby="summaryTitle">
            <h2 id="summaryTitle">Resumen del pedido</h2>

            <div class="summary-item">
              <span>Curso:</span>
              <strong id="resumenCurso">Curso EduTech</strong>
            </div>

            <div class="summary-item">
              <span>Instructor:</span>
              <strong id="resumenInstructor">Instructor EduTech</strong>
            </div>

            <div class="summary-item">
              <span>Nivel:</span>
              <strong id="resumenNivel">Por definir</strong>
            </div>

            <div class="summary-item">
              <span>Lecciones:</span>
              <strong id="resumenLecciones">Por definir</strong>
            </div>

            <div class="summary-item">
              <span>Precio:</span>
              <strong id="resumenPrecio">$0 MXN</strong>
            </div>

            <div class="summary-total">
              <span>Total:</span>
              <strong id="resumenTotal">$0 MXN</strong>
            </div>

            <hr>

            <h3>Método de pago</h3>

            <label class="payment-option">
              <input type="radio" name="payment" checked>
              <span>PayPal Sandbox</span>
            </label>

            <p class="payment-note">Al continuar, se creará la orden y pagarás con PayPal Sandbox real.</p>

            <button class="checkout-buy-button" id="checkoutBoton" type="submit" form="compraCursoForm">
              Continuar con PayPal Sandbox
            </button>
          </aside>
        </div>
      </section>
    `;
  };

  const obtenerUsuarioActual = () => {
    if (window.EduTech && typeof window.EduTech.obtenerUsuarioSesion === 'function') {
      const usuarioApi = window.EduTech.obtenerUsuarioSesion();

      if (usuarioApi) {
        return usuarioApi;
      }
    }

    const usuarioGuardado = localStorage.getItem('edutech_usuario') || sessionStorage.getItem('edutech_usuario');

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch (error) {
      return null;
    }
  };

  const obtenerIdUsuarioActual = () => {
    const usuario = obtenerUsuarioActual();

    return (
      localStorage.getItem('edutech_id_usuario') ||
      sessionStorage.getItem('edutech_id_usuario') ||
      (usuario && (usuario.id_usuario || usuario.id)) ||
      null
    );
  };

  const separarNombreUsuario = (usuario) => {
    if (!usuario) {
      return {
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: ''
      };
    }

    const nombreDirecto = limpiarTexto(usuario.nombre || usuario.primer_nombre || usuario.name);
    const apellidoPaterno = limpiarTexto(usuario.apellido_paterno || usuario.apellidoPaterno);
    const apellidoMaterno = limpiarTexto(usuario.apellido_materno || usuario.apellidoMaterno);
    const apellidosDirectos = limpiarTexto(usuario.apellidos || usuario.apellido || usuario.last_name);
    const nombreCompleto = limpiarTexto(usuario.nombre_completo || usuario.full_name);

    let nombre = nombreDirecto;
    let apellidos = [apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ') || apellidosDirectos;

    if (!nombre && nombreCompleto) {
      const partes = nombreCompleto.split(/\s+/).filter(Boolean);
      nombre = partes.shift() || '';
      apellidos = apellidos || partes.join(' ');
    }

    return {
      nombre,
      apellidos,
      correo: limpiarTexto(usuario.correo || usuario.email),
      telefono: limpiarTexto(usuario.telefono || usuario.telefono_contacto || usuario.phone)
    };
  };

  const normalizarTextoComparacion = (valor) => {
    return limpiarTexto(valor)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const obtenerTextoOpcionSeleccionada = (select) => {
    if (!select || select.tagName !== 'SELECT') {
      return '';
    }

    const opcion = select.selectedOptions && select.selectedOptions[0];
    return opcion ? limpiarTexto(opcion.dataset.nombreEstado || opcion.textContent) : '';
  };

  const resolverNombreEstado = (estado, textoOpcion = '') => {
    const candidatos = [estado, textoOpcion].map(normalizarTextoComparacion).filter(Boolean);

    for (const candidato of candidatos) {
      if (aliasesEstado[candidato]) {
        return aliasesEstado[candidato];
      }

      const claveEstado = Object.keys(ciudadesPorEstado).find((clave) => normalizarTextoComparacion(clave) === candidato);

      if (claveEstado) {
        return claveEstado;
      }
    }

    return '';
  };

  const obtenerCiudadesEstado = (estado, textoOpcion = '') => {
    const nombreEstado = resolverNombreEstado(estado, textoOpcion);

    return nombreEstado ? ciudadesPorEstado[nombreEstado] || [] : [];
  };

  const selectTienePlaceholder = (select) => {
    if (!select || select.tagName !== 'SELECT') {
      return false;
    }

    return Array.from(select.options).some((opcion) => opcion.value === '' || /^selecciona/i.test(opcion.textContent));
  };

  const obtenerValorCampo = (campo) => {
    if (!campo) {
      return '';
    }

    return limpiarTexto(campo.value);
  };

  const asignarValorSiExiste = (campo, valor) => {
    if (!campo || valor === undefined || valor === null || valor === '') {
      return;
    }

    campo.value = String(valor);
  };

  const obtenerJSONLocal = (clave, valorDefault) => {
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

  const guardarJSONLocal = (clave, valor) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  };

  const obtenerPerfilAlumno = () => {
    const usuario = obtenerUsuarioActual() || {};
    const idUsuario = usuario.id_usuario || usuario.id || obtenerIdUsuarioActual() || '';
    const perfilGeneral = obtenerJSONLocal('edutech_perfil_alumno', {});
    const perfilPorUsuario = idUsuario ? obtenerJSONLocal(`edutech_perfil_alumno_${idUsuario}`, {}) : {};
    const ultimoPerfil = obtenerJSONLocal('edutech_ultimo_perfil_compra', {});

    return {
      ...(ultimoPerfil && typeof ultimoPerfil === 'object' && !Array.isArray(ultimoPerfil) ? ultimoPerfil : {}),
      ...(perfilGeneral && typeof perfilGeneral === 'object' && !Array.isArray(perfilGeneral) ? perfilGeneral : {}),
      ...(perfilPorUsuario && typeof perfilPorUsuario === 'object' && !Array.isArray(perfilPorUsuario) ? perfilPorUsuario : {})
    };
  };

  const obtenerNombreEstadoCuenta = (campoEstado) => {
    if (!campoEstado) {
      return '';
    }

    if (campoEstado.tagName === 'SELECT') {
      return obtenerTextoOpcionSeleccionada(campoEstado) || obtenerValorCampo(campoEstado);
    }

    return obtenerValorCampo(campoEstado);
  };

  const construirPerfilAlumnoDesdeCheckout = (campos) => {
    return {
      nombre: obtenerValorCampo(campos.nombre),
      apellidos: obtenerValorCampo(campos.apellidos),
      correo: obtenerValorCampo(campos.correo),
      telefono: obtenerValorCampo(campos.telefono),
      direccion: obtenerValorCampo(campos.direccion),
      interior: obtenerValorCampo(campos.interior),
      estado: obtenerNombreEstadoCuenta(campos.estado),
      ciudad: campos.obtenerCiudad ? campos.obtenerCiudad() : '',
      id_ciudad: campos.ciudad ? obtenerValorCampo(campos.ciudad) : '',
      codigo_postal: obtenerValorCampo(campos.codigoPostal)
    };
  };

  const guardarPerfilAlumno = (perfil) => {
    const usuarioActual = obtenerUsuarioActual() || {};
    const usuarioActualizado = {
      ...usuarioActual,
      nombre: perfil.nombre || usuarioActual.nombre || '',
      apellidos: perfil.apellidos || usuarioActual.apellidos || '',
      correo: perfil.correo || usuarioActual.correo || usuarioActual.email || '',
      email: perfil.correo || usuarioActual.email || usuarioActual.correo || '',
      telefono: perfil.telefono || usuarioActual.telefono || '',
      direccion: perfil.direccion || usuarioActual.direccion || '',
      interior: perfil.interior || usuarioActual.interior || '',
      estado: perfil.estado || usuarioActual.estado || '',
      ciudad: perfil.ciudad || usuarioActual.ciudad || '',
      id_ciudad: perfil.id_ciudad || usuarioActual.id_ciudad || '',
      codigo_postal: perfil.codigo_postal || usuarioActual.codigo_postal || ''
    };

    guardarJSONLocal('edutech_perfil_alumno', perfil);
    guardarJSONLocal('edutech_ultimo_perfil_compra', perfil);

    if (usuarioActualizado.id_usuario || usuarioActualizado.id) {
      guardarJSONLocal(`edutech_perfil_alumno_${usuarioActualizado.id_usuario || usuarioActualizado.id}`, perfil);
    }

    guardarJSONLocal('edutech_usuario', usuarioActualizado);
  };

  const obtenerContenedorCampo = (campo) => {
    return campo ? campo.closest('.form-field') : null;
  };

  const obtenerMensajeCampo = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);
    return contenedor ? contenedor.querySelector('.error-message') : null;
  };

  const actualizarTextoError = (campo, mensaje) => {
    const mensajeCampo = obtenerMensajeCampo(campo);

    if (mensajeCampo && mensaje) {
      mensajeCampo.textContent = mensaje;
    }
  };

  const mostrarErrorCampo = (campo, mensaje) => {
    if (!campo) {
      return;
    }

    const contenedor = obtenerContenedorCampo(campo);
    const mensajeCampo = obtenerMensajeCampo(campo);

    if (contenedor) {
      contenedor.classList.add('has-error');
      contenedor.dataset.errorActivo = 'true';
    }

    campo.classList.add('is-invalid');
    campo.setAttribute('aria-invalid', 'true');

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

    if (contenedor) {
      contenedor.classList.remove('has-error');
      contenedor.dataset.errorActivo = 'false';
    }

    campo.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');

    if (mensajeCampo) {
      mensajeCampo.style.display = 'none';
    }
  };

  const campoTieneErrorActivo = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    return Boolean(contenedor && contenedor.dataset.errorActivo === 'true');
  };

  const marcarCampoValidado = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    if (contenedor) {
      contenedor.dataset.validacionIniciada = 'true';
    }
  };

  const campoYaFueValidado = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    return Boolean(contenedor && contenedor.dataset.validacionIniciada === 'true');
  };

  const marcarCampoConEntrada = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    if (contenedor && obtenerValorCampo(campo) !== '') {
      contenedor.dataset.tuvoEntrada = 'true';
    }
  };

  const campoTuvoEntrada = (campo) => {
    const contenedor = obtenerContenedorCampo(campo);

    return Boolean(contenedor && contenedor.dataset.tuvoEntrada === 'true');
  };

  const obtenerTextoElemento = (...selectores) => {
    const elemento = obtenerElemento(...selectores);
    return elemento ? limpiarTexto(elemento.textContent) : '';
  };

  const obtenerCursoDesdePantalla = (idCurso) => {
    const precioTexto = obtenerTextoElemento('#resumenPrecio', '#resumenTotal', '[data-resumen="precio"]') || '$0 MXN';
    const precioNumerico = Number(precioTexto.replace(/[^0-9.]/g, '')) || 0;

    return {
      id_curso: idCurso || sessionStorage.getItem('edutech_curso_compra_id') || null,
      titulo: obtenerTextoElemento('#resumenCurso', '[data-resumen="curso"]') || 'Curso EduTech',
      instructor: obtenerTextoElemento('#resumenInstructor', '[data-resumen="instructor"]') || 'Instructor EduTech',
      nombre_nivel: obtenerTextoElemento('#resumenNivel', '[data-resumen="nivel"]') || 'Por definir',
      total_lecciones: obtenerTextoElemento('#resumenLecciones', '[data-resumen="lecciones"]') || 'Por definir',
      precio_mxn: precioNumerico
    };
  };

  const iniciarCompraCurso = () => {
    if (usuarioEsInstructorCompra()) {
      mostrarNoCoincidenciasCompra();
      return;
    }


    activarCargaVisualCompra();
    crearPantallaCompraSiNoExiste();
    asegurarPantallaVisible();

    const compraForm = obtenerElemento('#compraCursoForm', '#checkoutForm');
    const checkoutSummary = obtenerElemento('#checkoutSummary', '.checkout-summary');
    const checkoutNombre = document.getElementById('checkoutNombre');
    const checkoutApellidos = document.getElementById('checkoutApellidos');
    const checkoutCorreo = document.getElementById('checkoutCorreo');
    const checkoutTelefono = document.getElementById('checkoutTelefono');
    const checkoutDireccion = document.getElementById('checkoutDireccion');
    const checkoutInterior = document.getElementById('checkoutInterior');
    const checkoutPais = document.getElementById('checkoutPais');
    const checkoutEstado = document.getElementById('checkoutEstado') || document.getElementById('checkoutProvincia');
    const checkoutCiudad = document.getElementById('checkoutCiudad');
    const checkoutCodigoPostal = document.getElementById('checkoutCodigoPostal');
    const checkoutSuccess = document.getElementById('checkoutSuccess');
    let checkoutError = document.getElementById('checkoutError');
    const checkoutBoton = obtenerElemento('#checkoutBoton', '.checkout-buy-button', 'button[form="compraCursoForm"]', 'button[form="checkoutForm"]');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const paypalConfigMessage = document.getElementById('paypalConfigMessage');
    const checkoutCursoLinea = document.getElementById('checkoutCursoLinea');
    const resumenCurso = document.getElementById('resumenCurso');
    const resumenInstructor = document.getElementById('resumenInstructor');
    const resumenNivel = document.getElementById('resumenNivel');
    const resumenLecciones = document.getElementById('resumenLecciones');
    const resumenPrecio = document.getElementById('resumenPrecio');
    const resumenTotal = document.getElementById('resumenTotal');

    let cursoSeleccionado = null;
    let cursosSeleccionados = [];
    let paypalRenderizado = false;
    let paypalListo = false;
    let compraPayPalPendiente = null;

    if (checkoutBoton) {
      checkoutBoton.hidden = true;
      checkoutBoton.style.display = 'none';
    }

    if (!checkoutError && compraForm) {
      checkoutError = document.createElement('p');
      checkoutError.id = 'checkoutError';
      checkoutError.className = 'form-warning';
      checkoutError.setAttribute('role', 'alert');
      compraForm.insertBefore(checkoutError, compraForm.firstChild);
    }

    const mostrarResumenCompra = () => {
      mostrarElemento(checkoutSummary);
    };

    const mostrarErrorCompra = (mensaje) => {
      if (checkoutError) {
        checkoutError.textContent = mensaje;
        checkoutError.classList.add('is-visible');
        checkoutError.style.display = 'block';
      }

      if (checkoutSuccess) {
        checkoutSuccess.classList.remove('is-visible');
        checkoutSuccess.style.display = 'none';
      }
    };

    const ocultarErrorCompra = () => {
      if (checkoutError) {
        checkoutError.textContent = '';
        checkoutError.classList.remove('is-visible');
        checkoutError.style.display = 'none';
      }
    };

    const ocultarExitoCompra = () => {
      if (checkoutSuccess) {
        checkoutSuccess.classList.remove('is-visible');
        checkoutSuccess.style.display = 'none';
      }

      document.querySelectorAll('.form-success').forEach((mensaje) => {
        if (mensaje !== checkoutSuccess || !mensaje.classList.contains('is-visible')) {
          mensaje.classList.remove('is-visible');
          mensaje.style.display = 'none';
        }
      });
    };

    const mostrarExitoCompra = () => {
      if (checkoutSuccess) {
        if (!limpiarTexto(checkoutSuccess.textContent)) {
          checkoutSuccess.textContent = 'Datos validados. Continúa con PayPal Sandbox.';
        }

        checkoutSuccess.classList.add('is-visible');
        checkoutSuccess.style.display = 'block';
      }

      ocultarErrorCompra();
    };

    const textoOriginalBotonCompra = checkoutBoton ? limpiarTexto(checkoutBoton.textContent) || 'Continuar con PayPal Sandbox' : 'Continuar con PayPal Sandbox';

    const bloquearBotonCompra = (bloquear) => {
      if (checkoutBoton) {
        checkoutBoton.disabled = bloquear;
        checkoutBoton.textContent = bloquear ? 'Creando orden...' : textoOriginalBotonCompra;
      }
    };

    const configurarMensajesEstaticos = () => {
      actualizarTextoError(checkoutNombre, 'Escribe un nombre válido, sin números ni signos especiales.');
      actualizarTextoError(checkoutApellidos, 'Escribe apellidos válidos, sin números ni signos especiales.');
      actualizarTextoError(checkoutCorreo, 'Escribe un correo electrónico válido. Usa un dominio como .com, .net, .org o .mx.');
      actualizarTextoError(checkoutTelefono, 'Escribe un teléfono válido de 10 dígitos.');
      actualizarTextoError(checkoutDireccion, 'Escribe una dirección válida.');
      actualizarTextoError(checkoutInterior, 'Escribe un interior válido.');
      actualizarTextoError(checkoutPais, 'Selecciona un país.');
      actualizarTextoError(checkoutEstado, 'Selecciona un estado.');
      actualizarTextoError(checkoutCiudad, checkoutCiudad && checkoutCiudad.tagName === 'SELECT' ? 'Selecciona una ciudad.' : 'Escribe una ciudad válida, sin números ni signos especiales.');
      actualizarTextoError(checkoutCodigoPostal, 'Escribe un código postal válido de 5 dígitos.');
    };

    const precargarDatosUsuario = () => {
      const usuario = obtenerUsuarioActual();
      const datos = separarNombreUsuario(usuario);
      const perfil = obtenerPerfilAlumno();

      asignarValorSiExiste(checkoutNombre, perfil.nombre || datos.nombre);
      asignarValorSiExiste(checkoutApellidos, perfil.apellidos || datos.apellidos);
      asignarValorSiExiste(checkoutCorreo, perfil.correo || datos.correo);
      asignarValorSiExiste(checkoutTelefono, perfil.telefono || datos.telefono);
      asignarValorSiExiste(checkoutDireccion, perfil.direccion || (usuario && usuario.direccion));
      asignarValorSiExiste(checkoutInterior, perfil.interior || (usuario && usuario.interior));
      asignarValorSiExiste(checkoutEstado, perfil.estado || (usuario && usuario.estado));
      asignarValorSiExiste(checkoutCodigoPostal, perfil.codigo_postal || (usuario && (usuario.codigo_postal || usuario.cp)));

      const lineaUsuario = document.getElementById('checkoutUsuarioLinea') || document.querySelector('.checkout-login-line');
      const correoVisible = perfil.correo || datos.correo;

      if (lineaUsuario && correoVisible) {
        lineaUsuario.innerHTML = `Estás registrado como <em>${correoVisible}</em>.`;
      }
    };

    const precargarCiudadPerfil = () => {
      const usuario = obtenerUsuarioActual() || {};
      const perfil = obtenerPerfilAlumno();
      const ciudadGuardada = perfil.id_ciudad || perfil.ciudad || usuario.id_ciudad || usuario.ciudad;

      if (!checkoutCiudad || !ciudadGuardada) {
        return;
      }

      if (checkoutCiudad.tagName === 'SELECT') {
        const opciones = Array.from(checkoutCiudad.options);
        const opcion = opciones.find((item) => {
          return String(item.value) === String(ciudadGuardada) || normalizarTextoComparacion(item.dataset.nombreCiudad || item.textContent) === normalizarTextoComparacion(ciudadGuardada);
        });

        if (opcion) {
          checkoutCiudad.value = opcion.value;
        }
        return;
      }

      checkoutCiudad.value = String(ciudadGuardada);
    };

    const poblarCiudadesPorEstado = (mantenerValor = true) => {
      if (!checkoutEstado || !checkoutCiudad || checkoutCiudad.tagName !== 'SELECT') {
        return;
      }

      const estado = obtenerValorCampo(checkoutEstado);
      const textoEstado = obtenerTextoOpcionSeleccionada(checkoutEstado);
      const ciudades = obtenerCiudadesEstado(estado, textoEstado);
      const valorAnterior = mantenerValor ? obtenerValorCampo(checkoutCiudad) : '';
      const textoAnterior = mantenerValor ? obtenerTextoOpcionSeleccionada(checkoutCiudad) : '';

      checkoutCiudad.innerHTML = '';
      checkoutCiudad.dataset.ciudadesDinamicas = 'true';

      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Selecciona una ciudad';
      checkoutCiudad.appendChild(placeholder);

      ciudades.forEach((ciudad) => {
        const opcion = document.createElement('option');
        opcion.value = String(ciudad.id);
        opcion.textContent = ciudad.nombre;
        opcion.dataset.nombreCiudad = ciudad.nombre;
        checkoutCiudad.appendChild(opcion);
      });

      const ciudadCoincidente = ciudades.find((ciudad) => {
        return (
          String(ciudad.id) === valorAnterior ||
          normalizarTextoComparacion(ciudad.nombre) === normalizarTextoComparacion(valorAnterior) ||
          normalizarTextoComparacion(ciudad.nombre) === normalizarTextoComparacion(textoAnterior)
        );
      });

      checkoutCiudad.value = ciudadCoincidente ? String(ciudadCoincidente.id) : '';
    };

    const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominiosCorreoPermitidos = ['com', 'net', 'org', 'edu', 'mx', 'com.mx', 'edu.mx', 'gob.mx', 'gov'];
    const correoCompraValido = (valor) => {
      const correo = String(valor || '').trim().toLowerCase();
      if (!patronCorreo.test(correo) || correo.includes('..')) {
        return false;
      }
      const dominio = correo.split('@')[1] || '';
      return dominiosCorreoPermitidos.some((terminacion) => dominio === terminacion || dominio.endsWith(`.${terminacion}`));
    };
    const patronTelefono = /^\d{10}$/;
    const patronSoloDigitos = /^\d*$/;
    const patronDireccion = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s#.,\-]*$/;
    const patronCP = /^\d{5}$/;

    const obtenerReglasFormularioCompra = () => {
      return [
        {
          campo: checkoutNombre,
          validar: (valor) => valor !== '' && patronNombre.test(valor),
          errorInmediato: (valor) => valor !== '' && !patronNombre.test(valor),
          mensaje: 'Escribe un nombre válido, sin números ni signos especiales.'
        },
        {
          campo: checkoutApellidos,
          validar: (valor) => valor !== '' && patronNombre.test(valor),
          errorInmediato: (valor) => valor !== '' && !patronNombre.test(valor),
          mensaje: 'Escribe apellidos válidos, sin números ni signos especiales.'
        },
        {
          campo: checkoutCorreo,
          validar: (valor) => valor !== '' && correoCompraValido(valor),
          errorInmediato: (valor) => valor !== '' && (/\s/.test(valor) || (valor.includes('@') && valor.includes('.') && !correoCompraValido(valor))),
          mensaje: 'Escribe un correo electrónico válido. Usa un dominio como .com, .net, .org o .mx.'
        },
        {
          campo: checkoutTelefono,
          validar: (valor) => patronTelefono.test(valor),
          errorInmediato: (valor) => valor !== '' && (!patronSoloDigitos.test(valor) || valor.length > 10),
          mensaje: 'Escribe un teléfono válido de 10 dígitos.'
        },
        {
          campo: checkoutDireccion,
          validar: (valor) => valor !== '' && patronDireccion.test(valor),
          errorInmediato: (valor) => valor !== '' && !patronDireccion.test(valor),
          mensaje: 'Escribe una dirección válida.'
        },
        {
          campo: checkoutInterior,
          validar: (valor) => valor === '' || patronDireccion.test(valor),
          errorInmediato: (valor) => valor !== '' && !patronDireccion.test(valor),
          mensaje: 'Escribe un interior válido.'
        },
        {
          campo: checkoutPais,
          validar: (valor) => valor !== '',
          errorInmediato: () => false,
          mensaje: 'Selecciona un país.'
        },
        {
          campo: checkoutEstado,
          validar: (valor) => valor !== '' && !/^selecciona/i.test(valor),
          errorInmediato: () => false,
          mensaje: 'Selecciona un estado.'
        },
        {
          campo: checkoutCiudad,
          validar: (valor) => valor !== '' && !/^selecciona/i.test(valor) && (checkoutCiudad.tagName === 'SELECT' || patronNombre.test(valor)),
          errorInmediato: (valor) => checkoutCiudad.tagName !== 'SELECT' && valor !== '' && !patronNombre.test(valor),
          mensaje: checkoutCiudad && checkoutCiudad.tagName === 'SELECT' ? 'Selecciona una ciudad.' : 'Escribe una ciudad válida, sin números ni signos especiales.'
        },
        {
          campo: checkoutCodigoPostal,
          validar: (valor) => patronCP.test(valor),
          errorInmediato: (valor) => valor !== '' && (!patronSoloDigitos.test(valor) || valor.length > 5),
          mensaje: 'Escribe un código postal válido de 5 dígitos.'
        }
      ].filter((regla) => regla.campo);
    };

    const validarCampoCompra = (regla, mostrarError) => {
      const valor = obtenerValorCampo(regla.campo);
      const campoValido = regla.validar(valor);

      if (mostrarError) {
        if (campoValido) {
          quitarErrorCampo(regla.campo);
        } else {
          mostrarErrorCampo(regla.campo, regla.mensaje);
        }
      }

      return campoValido;
    };

    const revisarCampoMientrasEscribe = (regla) => {
      const valor = obtenerValorCampo(regla.campo);
      marcarCampoConEntrada(regla.campo);

      if (campoTieneErrorActivo(regla.campo) || campoYaFueValidado(regla.campo)) {
        validarCampoCompra(regla, true);
        return;
      }

      if (regla.errorInmediato(valor)) {
        marcarCampoValidado(regla.campo);
        mostrarErrorCampo(regla.campo, regla.mensaje);
      }
    };

    const revisarCampoAlSalir = (regla) => {
      const valor = obtenerValorCampo(regla.campo);

      if (valor === '' && !campoTieneErrorActivo(regla.campo) && !campoTuvoEntrada(regla.campo)) {
        return;
      }

      marcarCampoValidado(regla.campo);
      validarCampoCompra(regla, true);
    };

    const validarFormularioCompra = () => {
      let valido = true;

      obtenerReglasFormularioCompra().forEach((regla) => {
        marcarCampoValidado(regla.campo);
        const campoValido = validarCampoCompra(regla, true);
        valido = valido && campoValido;
      });

      if (!Array.isArray(cursosSeleccionados) || cursosSeleccionados.length === 0) {
        mostrarErrorCompra('No hay cursos seleccionados para comprar.');
        valido = false;
      }

      return valido;
    };

    const obtenerIdCiudadParaBackend = () => {
      if (!checkoutCiudad) {
        return null;
      }

      const valor = obtenerValorCampo(checkoutCiudad);
      const numero = Number(valor);

      if (valor !== '' && Number.isInteger(numero) && numero > 0) {
        return numero;
      }

      const estado = checkoutEstado ? obtenerValorCampo(checkoutEstado) : '';
      const ciudad = valor;
      const ciudades = obtenerCiudadesEstado(estado, checkoutEstado ? obtenerTextoOpcionSeleccionada(checkoutEstado) : '');
      const ciudadEncontrada = ciudades.find((item) => normalizarTextoComparacion(item.nombre) === normalizarTextoComparacion(ciudad));

      return ciudadEncontrada ? ciudadEncontrada.id : null;
    };

    const obtenerNombreCiudad = () => {
      if (!checkoutCiudad) {
        return '';
      }

      if (checkoutCiudad.tagName === 'SELECT') {
        const opcion = checkoutCiudad.selectedOptions && checkoutCiudad.selectedOptions[0];
        return opcion ? limpiarTexto(opcion.dataset.nombreCiudad || opcion.textContent) : '';
      }

      return obtenerValorCampo(checkoutCiudad);
    };

    const construirDatosCompra = () => {
      const apellidos = obtenerValorCampo(checkoutApellidos).split(/\s+/).filter(Boolean);
      const apellidoPaterno = apellidos.shift() || '';
      const apellidoMaterno = apellidos.join(' ');

      return {
        nombre_contacto: obtenerValorCampo(checkoutNombre),
        apellido_paterno_contacto: apellidoPaterno || obtenerValorCampo(checkoutApellidos),
        apellido_materno_contacto: apellidoMaterno,
        correo_contacto: obtenerValorCampo(checkoutCorreo),
        telefono_contacto: obtenerValorCampo(checkoutTelefono),
        direccion: obtenerValorCampo(checkoutInterior) ? `${obtenerValorCampo(checkoutDireccion)} Int. ${obtenerValorCampo(checkoutInterior)}` : obtenerValorCampo(checkoutDireccion),
        id_ciudad: obtenerIdCiudadParaBackend(),
        codigo_postal: obtenerValorCampo(checkoutCodigoPostal)
      };
    };

    const guardarPerfilAlumnoDesdeCheckout = () => {
      const perfil = construirPerfilAlumnoDesdeCheckout({
        nombre: checkoutNombre,
        apellidos: checkoutApellidos,
        correo: checkoutCorreo,
        telefono: checkoutTelefono,
        direccion: checkoutDireccion,
        interior: checkoutInterior,
        estado: checkoutEstado,
        ciudad: checkoutCiudad,
        codigoPostal: checkoutCodigoPostal,
        obtenerCiudad: obtenerNombreCiudad
      });

      guardarPerfilAlumno(perfil);
      return perfil;
    };

    const crearCompraLocal = (datosExtra = {}) => {
      const cursosCompra = Array.isArray(cursosSeleccionados) && cursosSeleccionados.length > 0
        ? cursosSeleccionados
        : [cursoSeleccionado || obtenerCursoDesdePantalla(obtenerParametroId())].filter(Boolean);
      const curso = cursosCompra[0] || {};
      const totalNumerico = cursosCompra.reduce((suma, item) => suma + Number(item.precio_mxn || item.precio || 0), 0);
      const precio = formatearPrecio(curso.precio_mxn || curso.precio || 0);
      const total = datosExtra.total || formatearPrecio(totalNumerico);

      return {
        id_curso: curso.id_curso,
        curso: cursosCompra.length > 1 ? `${cursosCompra.length} cursos` : (curso.titulo || 'Curso EduTech'),
        instructor: cursosCompra.length > 1 ? 'Varios instructores' : obtenerInstructor(curso),
        nivel: cursosCompra.length > 1 ? 'Varios niveles' : (curso.nombre_nivel || curso.nivel || 'Curso disponible'),
        total_lecciones: cursosCompra.reduce((suma, item) => suma + Number(item.total_lecciones || item.lecciones || 0), 0),
        precio,
        total,
        cursos: cursosCompra.map((item) => ({
          id_curso: item.id_curso,
          curso: item.titulo || item.curso || 'Curso EduTech',
          instructor: obtenerInstructor(item),
          precio: item.precio_mxn || item.precio || 0
        })),
        nombre: obtenerValorCampo(checkoutNombre),
        apellidos: obtenerValorCampo(checkoutApellidos),
        correo: obtenerValorCampo(checkoutCorreo),
        telefono: obtenerValorCampo(checkoutTelefono),
        ciudad: obtenerNombreCiudad(),
        estado: obtenerNombreEstadoCuenta(checkoutEstado),
        id_ciudad: obtenerIdCiudadParaBackend(),
        direccion: obtenerValorCampo(checkoutDireccion),
        interior: obtenerValorCampo(checkoutInterior),
        codigo_postal: obtenerValorCampo(checkoutCodigoPostal),
        ...datosExtra
      };
    };

    const guardarCompraPendiente = (compra) => {
      sessionStorage.setItem('edutech_compra_pendiente', JSON.stringify(compra));
    };

    const pintarResumenCurso = (curso) => {
      const titulo = curso.titulo || 'Curso EduTech';
      const instructor = obtenerInstructor(curso);
      const nivel = curso.nombre_nivel || curso.nivel || 'Por definir';
      const lecciones = curso.total_lecciones || curso.lecciones || 'Por definir';
      const precio = formatearPrecio(curso.precio_mxn || curso.precio || 0);

      document.title = `Comprar ${titulo} - EduTech`;

      if (checkoutCursoLinea) {
        checkoutCursoLinea.textContent = `Estás comprando: ${titulo}`;
      }

      if (resumenCurso) {
        resumenCurso.textContent = titulo;
      }

      [resumenInstructor, resumenNivel, resumenLecciones, resumenPrecio].forEach((elemento) => {
        const fila = elemento ? elemento.closest('.summary-item') : null;
        if (fila) {
          fila.style.display = '';
        }
      });

      if (resumenInstructor) {
        resumenInstructor.textContent = instructor;
      }

      if (resumenNivel) {
        resumenNivel.textContent = nivel;
      }

      if (resumenLecciones) {
        resumenLecciones.textContent = typeof lecciones === 'number' ? `${lecciones} lecciones` : lecciones;
      }

      if (resumenPrecio) {
        resumenPrecio.textContent = precio;
      }

      if (resumenTotal) {
        resumenTotal.textContent = precio;
      }
    };


    const pintarResumenCursos = (cursos) => {
      if (!Array.isArray(cursos) || cursos.length === 0) {
        return;
      }

      if (cursos.length === 1) {
        pintarResumenCurso(cursos[0]);
        return;
      }

      const total = cursos.reduce((suma, curso) => suma + Number(curso.precio_mxn || curso.precio || 0), 0);

      document.title = `Comprar ${cursos.length} cursos - EduTech`;

      if (checkoutCursoLinea) {
        checkoutCursoLinea.textContent = `Estás comprando ${cursos.length} cursos del carrito.`;
      }

      if (resumenCurso) {
        resumenCurso.textContent = `${cursos.length} cursos seleccionados`;
      }

      [resumenInstructor, resumenNivel, resumenLecciones, resumenPrecio].forEach((elemento) => {
        const fila = elemento ? elemento.closest('.summary-item') : null;
        if (fila) {
          fila.style.display = 'none';
        }
      });

      if (resumenTotal) {
        resumenTotal.textContent = formatearPrecio(total);
      }

      let lista = document.getElementById('resumenCursosLista');

      if (!lista && resumenCurso && resumenCurso.closest('.checkout-summary')) {
        lista = document.createElement('div');
        lista.id = 'resumenCursosLista';
        lista.className = 'summary-courses-list';
        resumenCurso.closest('.summary-item').insertAdjacentElement('afterend', lista);
      }

      if (lista) {
        lista.innerHTML = '';
        cursos.forEach((curso) => {
          const fila = document.createElement('div');
          fila.className = 'summary-course-row';
          fila.innerHTML = `<span>${curso.titulo || curso.curso || 'Curso EduTech'}</span><strong>${formatearPrecio(curso.precio_mxn || curso.precio || 0)}</strong>`;
          lista.appendChild(fila);
        });
      }
    };

    const apiRequestConReintento = async (ruta, opciones = {}, intentos = 3) => {
      let ultimoError = null;

      for (let intento = 1; intento <= intentos; intento += 1) {
        try {
          return await window.EduTech.apiRequest(ruta, opciones);
        } catch (error) {
          ultimoError = error;

          if (intento < intentos) {
            await esperar(350 * intento);
          }
        }
      }

      throw ultimoError;
    };


    const leerJsonStorage = (storage, clave) => {
      const valor = storage.getItem(clave);

      if (!valor) {
        return null;
      }

      try {
        return JSON.parse(valor);
      } catch (error) {
        return null;
      }
    };

    const mostrarMensajePayPal = (mensaje, tipo = 'warning') => {
      if (!paypalConfigMessage) {
        if (mensaje) {
          mostrarErrorCompra(mensaje);
        }
        return;
      }

      paypalConfigMessage.textContent = mensaje || '';
      paypalConfigMessage.style.display = mensaje ? 'block' : 'none';
      paypalConfigMessage.classList.toggle('paypal-config-error', tipo === 'error');
      paypalConfigMessage.classList.toggle('paypal-config-success', tipo === 'success');
    };

    const cargarScriptPayPal = (clientId, currency) => {
      return new Promise((resolve, reject) => {
        if (window.paypal && typeof window.paypal.Buttons === 'function') {
          resolve();
          return;
        }

        const scriptExistente = document.querySelector('script[data-edutech-paypal-sdk="true"]');

        if (scriptExistente) {
          scriptExistente.addEventListener('load', () => resolve(), { once: true });
          scriptExistente.addEventListener('error', () => reject(new Error('No se pudo cargar el SDK oficial de PayPal.')), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.dataset.edutechPaypalSdk = 'true';
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency || 'MXN')}&intent=capture`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar el SDK oficial de PayPal.'));
        document.head.appendChild(script);
      });
    };

    const guardarCompraAprobadaPayPal = (compra) => {
      sessionStorage.setItem('edutech_compra_pendiente', JSON.stringify(compra));
      localStorage.setItem('edutech_compra_aprobada_backend', JSON.stringify(compra));
      sessionStorage.removeItem('edutech_orden_paypal_pendiente');
    };

    const prepararOrdenParaPayPal = async () => {
      ocultarErrorCompra();
      mostrarMensajePayPal('');

      if (!validarFormularioCompra()) {
        mostrarErrorCompra('Revisa únicamente los campos marcados antes de pagar con PayPal.');
        throw new Error('Formulario de compra incompleto.');
      }

      guardarPerfilAlumnoDesdeCheckout();

      if (compraPayPalPendiente && compraPayPalPendiente.id_orden) {
        return compraPayPalPendiente;
      }

      mostrarExitoCompra();
      const compra = await crearOrdenBackend();

      if (!compra || !compra.id_orden) {
        throw new Error('No se pudo crear la orden pendiente para PayPal.');
      }

      compraPayPalPendiente = compra;
      guardarCompraPendiente(compra);
      return compra;
    };

    const inicializarBotonPayPal = async () => {
      if (!paypalButtonContainer || paypalRenderizado) {
        return;
      }

      if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
        mostrarMensajePayPal('No se cargó la conexión con la API de EduTech. Recarga la página.', 'error');
        return;
      }

      try {
        mostrarMensajePayPal('Cargando botón oficial de PayPal Sandbox...');

        const config = await window.EduTech.apiRequest('/paypal/config');

        if (!config.clientId) {
          mostrarMensajePayPal(config.message || 'Falta configurar PAYPAL_CLIENT_ID en backend/.env para mostrar el botón oficial de PayPal.', 'error');
          return;
        }

        await cargarScriptPayPal(config.clientId, config.currency || 'MXN');

        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
          throw new Error('El SDK oficial de PayPal no quedó disponible en la página.');
        }

        paypalButtonContainer.innerHTML = '';

        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          },

          createOrder: async () => {
            const compra = await prepararOrdenParaPayPal();

            const respuesta = await window.EduTech.apiRequest(`/paypal/ordenes/${compra.id_orden}/crear-orden`, {
              method: 'POST'
            });

            if (!respuesta.paypalOrderId) {
              throw new Error('PayPal no devolvió el identificador de orden.');
            }

            return respuesta.paypalOrderId;
          },

          onApprove: async (data) => {
            mostrarMensajePayPal('Pago aprobado por PayPal. Liberando el curso...', 'success');

            const compraBase = compraPayPalPendiente || leerJsonStorage(sessionStorage, 'edutech_orden_paypal_pendiente') || {};
            const idOrden = compraBase.id_orden;

            if (!idOrden) {
              throw new Error('No se encontró la orden interna para capturar el pago.');
            }

            const respuesta = await window.EduTech.apiRequest(`/paypal/ordenes/${idOrden}/capturar-orden`, {
              method: 'POST',
              body: {
                paypalOrderId: data.orderID
              }
            });

            const compraAprobada = {
              ...compraBase,
              ...(respuesta.compra || {}),
              id_curso: (respuesta.compra && respuesta.compra.id_curso) || compraBase.id_curso || obtenerParametroId(),
              id_orden: Number(idOrden),
              estatus: 'Aprobada'
            };

            guardarCompraAprobadaPayPal(compraAprobada);

            if (esCompraDesdeCarrito() && window.EduTechCarrito) {
              window.EduTechCarrito.limpiar();
            }

            window.location.href = esCompraDesdeCarrito()
              ? 'compra-aprobada.html'
              : `compra-aprobada.html?id=${compraAprobada.id_curso || obtenerParametroId() || ''}`;
          },

          onCancel: () => {
            mostrarMensajePayPal('El pago fue cancelado en PayPal. La orden queda pendiente y el curso no se libera.', 'error');
          },

          onError: (error) => {
            mostrarMensajePayPal(error && error.message ? error.message : 'PayPal no pudo completar el pago. Intenta de nuevo.', 'error');
          }
        }).render('#paypal-button-container');

        paypalRenderizado = true;
        paypalListo = true;
        mostrarMensajePayPal('');
      } catch (error) {
        paypalRenderizado = false;
        paypalListo = false;
        if (paypalButtonContainer) {
          paypalButtonContainer.innerHTML = '';
        }
        mostrarMensajePayPal(error.message || 'No se pudo preparar el botón oficial de PayPal Sandbox.', 'error');
      }
    };

    const crearOrdenBackend = async () => {
      const idUsuario = obtenerIdUsuarioActual();

      if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function' || !idUsuario) {
        return null;
      }

      const respuestaOrden = await apiRequestConReintento('/ordenes', {
        method: 'POST',
        body: {
          id_usuario: Number(idUsuario),
          cursos: cursosSeleccionados.map((curso) => Number(curso.id_curso)).filter((id) => Number.isInteger(id) && id > 0),
          datos_compra: construirDatosCompra()
        }
      }, 3);

      const orden = respuestaOrden.orden || null;

      if (!orden || !orden.id_orden) {
        throw new Error('La API no devolvió la orden creada.');
      }

      const compra = crearCompraLocal({
        id_orden: orden.id_orden,
        numero_orden: orden.numero_orden,
        id_pago: null,
        id_inscripcion: null,
        total: formatearPrecio(orden.total),
        fecha_compra: orden.fecha_creacion || new Date().toISOString(),
        fecha_orden: orden.fecha_creacion || new Date().toISOString(),
        estatus: 'Pendiente'
      });

      sessionStorage.setItem('edutech_orden_paypal_pendiente', JSON.stringify(compra));

      return compra;
    };

    const manejarEnvioCompra = async (evento) => {
      evento.preventDefault();
      ocultarErrorCompra();

      try {
        await prepararOrdenParaPayPal();
        mostrarMensajePayPal(paypalListo ? 'Orden creada. Ahora termina el pago con el botón oficial de PayPal.' : 'Orden creada. Espera a que cargue el botón oficial de PayPal.', 'success');
      } catch (error) {
        mostrarErrorCompra(error.message || 'No se pudo crear la orden para PayPal. Revisa los campos e intenta de nuevo.');
      } finally {
        bloquearBotonCompra(false);
      }
    };

    const cargarCursosActualesDelCarrito = async (carrito) => {
      if (!Array.isArray(carrito) || carrito.length === 0 || !window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
        return carrito;
      }

      const cursos = [];

      for (const item of carrito) {
        const idCurso = Number(item.id_curso || item.idCurso || item.id);
        if (!Number.isInteger(idCurso) || idCurso <= 0) {
          continue;
        }

        try {
          const respuesta = await apiRequestConReintento(`/cursos/${idCurso}`, {}, 2);
          const curso = respuesta.curso || respuesta.data || respuesta;
          if (curso && curso.id_curso) {
            cursos.push(curso);
          }
        } catch (error) {
          cursos.push(item);
        }
      }

      if (window.EduTechCarrito && cursos.length > 0) {
        window.EduTechCarrito.guardar(cursos);
      }

      return cursos;
    };

    const cargarCursoCompra = async () => {
      mostrarResumenCompra();
      bloquearBotonCompra(true);

      const idCurso = obtenerParametroId();

      try {
        if (esCompraDesdeCarrito()) {
          const carrito = window.EduTechCarrito ? window.EduTechCarrito.obtener() : [];

          if (!Array.isArray(carrito) || carrito.length === 0) {
            cursosSeleccionados = [];
            cursoSeleccionado = null;
            mostrarErrorCompra('Tu carrito está vacío. Agrega cursos antes de continuar.');
            return;
          }

          const carritoActualizado = await cargarCursosActualesDelCarrito(carrito);
          cursosSeleccionados = carritoActualizado;
          cursoSeleccionado = carritoActualizado[0];
          pintarResumenCursos(carritoActualizado);
          ocultarErrorCompra();
          return;
        }

        if (!idCurso) {
          cursoSeleccionado = obtenerCursoDesdePantalla(null);
          cursosSeleccionados = [];
          mostrarErrorCompra('No se indicó qué curso se va a comprar.');
          return;
        }

        cursoSeleccionado = obtenerCursoDesdePantalla(idCurso);
        cursosSeleccionados = cursoSeleccionado && cursoSeleccionado.id_curso ? [cursoSeleccionado] : [];

        if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
          return;
        }

        const respuesta = await apiRequestConReintento(`/cursos/${idCurso}`, {}, 2);
        const curso = respuesta.curso || respuesta.data || respuesta;

        if (!curso || !curso.id_curso) {
          return;
        }

        cursoSeleccionado = curso;
        cursosSeleccionados = [curso];
        sessionStorage.setItem('edutech_curso_compra_id', String(curso.id_curso));
        pintarResumenCurso(curso);
        ocultarErrorCompra();
      } catch (error) {
        mostrarResumenCompra();
      } finally {
        if (Array.isArray(cursosSeleccionados) && cursosSeleccionados.length > 0) {
          bloquearBotonCompra(false);
        }

        mostrarResumenCompra();
        revelarPantallaCompra();
      }
    };

    const configurarValidacionCampos = () => {
      obtenerReglasFormularioCompra().forEach((regla) => {
        const contenedor = obtenerContenedorCampo(regla.campo);

        if (contenedor) {
          contenedor.dataset.errorActivo = 'false';
          contenedor.dataset.validacionIniciada = 'false';
          contenedor.dataset.tuvoEntrada = obtenerValorCampo(regla.campo) ? 'true' : 'false';
        }

        regla.campo.addEventListener('input', () => {
          revisarCampoMientrasEscribe(regla);
        });

        regla.campo.addEventListener('blur', () => {
          revisarCampoAlSalir(regla);
        });

        regla.campo.addEventListener('change', () => {
          if (regla.campo === checkoutEstado) {
            poblarCiudadesPorEstado(false);

            if (!campoTieneErrorActivo(checkoutCiudad) && !campoYaFueValidado(checkoutCiudad)) {
              quitarErrorCampo(checkoutCiudad);
            }
          }

          revisarCampoAlSalir(regla);
        });
      });
    };

    configurarMensajesEstaticos();
    ocultarExitoCompra();
    precargarDatosUsuario();
    poblarCiudadesPorEstado(true);
    precargarCiudadPerfil();
    configurarValidacionCampos();

    if (compraForm) {
      compraForm.addEventListener('submit', manejarEnvioCompra);
    }

    cargarCursoCompra().then(() => {
      inicializarBotonPayPal();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCompraCurso);
  } else {
    iniciarCompraCurso();
  }
})();
