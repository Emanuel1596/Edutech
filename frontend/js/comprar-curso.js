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

  const obtenerParametroId = () => {
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

              <p class="form-success" id="checkoutSuccess">Datos validados. Redirigiendo a la confirmación de compra.</p>
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
              <span>Pago con PayPal / Sandbox</span>
            </label>

            <p class="payment-note">Al continuar, se creará la orden y se simulará la aprobación del pago.</p>

            <button class="checkout-buy-button" id="checkoutBoton" type="submit" form="compraCursoForm">
              Continuar con PayPal
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
    const perfil = obtenerJSONLocal('edutech_perfil_alumno', {});
    return perfil && typeof perfil === 'object' && !Array.isArray(perfil) ? perfil : {};
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
    const checkoutCursoLinea = document.getElementById('checkoutCursoLinea');
    const resumenCurso = document.getElementById('resumenCurso');
    const resumenInstructor = document.getElementById('resumenInstructor');
    const resumenNivel = document.getElementById('resumenNivel');
    const resumenLecciones = document.getElementById('resumenLecciones');
    const resumenPrecio = document.getElementById('resumenPrecio');
    const resumenTotal = document.getElementById('resumenTotal');

    let cursoSeleccionado = null;

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
          checkoutSuccess.textContent = 'Datos validados. Redirigiendo a la confirmación de compra.';
        }

        checkoutSuccess.classList.add('is-visible');
        checkoutSuccess.style.display = 'block';
      }

      ocultarErrorCompra();
    };

    const textoOriginalBotonCompra = checkoutBoton ? limpiarTexto(checkoutBoton.textContent) || 'Continuar con PayPal' : 'Continuar con PayPal';

    const bloquearBotonCompra = (bloquear) => {
      if (checkoutBoton) {
        checkoutBoton.disabled = bloquear;
        checkoutBoton.textContent = bloquear ? 'Procesando compra...' : textoOriginalBotonCompra;
      }
    };

    const configurarMensajesEstaticos = () => {
      actualizarTextoError(checkoutNombre, 'Escribe un nombre válido, sin números ni signos especiales.');
      actualizarTextoError(checkoutApellidos, 'Escribe apellidos válidos, sin números ni signos especiales.');
      actualizarTextoError(checkoutCorreo, 'Escribe un correo electrónico válido.');
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
          validar: (valor) => valor !== '' && patronCorreo.test(valor),
          errorInmediato: (valor) => valor !== '' && /\s/.test(valor),
          mensaje: 'Escribe un correo electrónico válido.'
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

      if (!cursoSeleccionado || !cursoSeleccionado.id_curso) {
        mostrarErrorCompra('No hay curso seleccionado para comprar.');
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
      const curso = cursoSeleccionado || obtenerCursoDesdePantalla(obtenerParametroId());
      const precio = formatearPrecio(curso.precio_mxn || curso.precio || 0);

      return {
        id_curso: curso.id_curso,
        curso: curso.titulo || 'Curso EduTech',
        instructor: obtenerInstructor(curso),
        nivel: curso.nombre_nivel || curso.nivel || 'Curso disponible',
        total_lecciones: curso.total_lecciones || curso.lecciones || 0,
        precio,
        total: datosExtra.total || precio,
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

    const crearOrdenBackend = async () => {
      const idUsuario = obtenerIdUsuarioActual();

      if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function' || !idUsuario) {
        return null;
      }

      const respuestaOrden = await apiRequestConReintento('/ordenes', {
        method: 'POST',
        body: {
          id_usuario: Number(idUsuario),
          cursos: [Number(cursoSeleccionado.id_curso)],
          datos_compra: construirDatosCompra()
        }
      }, 3);

      const orden = respuestaOrden.orden || null;

      if (!orden || !orden.id_orden) {
        throw new Error('La API no devolvió la orden creada.');
      }

      const respuestaPago = await apiRequestConReintento(`/ordenes/${orden.id_orden}/pago-simulado`, {
        method: 'POST'
      }, 3);

      const pago = respuestaPago.pago || null;
      const inscripciones = Array.isArray(respuestaPago.inscripciones) ? respuestaPago.inscripciones : [];
      const inscripcion = inscripciones[0] || null;

      const compra = crearCompraLocal({
        id_orden: orden.id_orden,
        numero_orden: orden.numero_orden,
        id_pago: pago ? pago.id_pago : null,
        id_inscripcion: inscripcion ? inscripcion.id_inscripcion : null,
        total: formatearPrecio(orden.total),
        fecha_compra: (pago && pago.fecha_pago) || (inscripcion && inscripcion.fecha_inscripcion) || orden.fecha_creacion || new Date().toISOString(),
        fecha_inscripcion: (inscripcion && inscripcion.fecha_inscripcion) || (pago && pago.fecha_pago) || orden.fecha_creacion || new Date().toISOString(),
        estatus: 'Aprobada'
      });

      localStorage.setItem('edutech_compra_aprobada_backend', JSON.stringify(compra));

      return compra;
    };

    const manejarEnvioCompra = async (evento) => {
      evento.preventDefault();
      ocultarErrorCompra();

      if (!validarFormularioCompra()) {
        mostrarErrorCompra('Revisa únicamente los campos marcados antes de continuar.');
        return;
      }

      guardarPerfilAlumnoDesdeCheckout();
      bloquearBotonCompra(true);

      try {
        let compra = null;

        try {
          compra = await crearOrdenBackend();
        } catch (error) {
          compra = crearCompraLocal({
            id_orden: null,
            numero_orden: `ORD-LOCAL-${Date.now()}`,
            id_pago: null,
            estatus: 'Aprobada',
            fecha_compra: new Date().toISOString(),
            respaldo_local: true
          });
        }

        if (!compra) {
          compra = crearCompraLocal({
            numero_orden: `ORD-LOCAL-${Date.now()}`,
            estatus: 'Aprobada',
            fecha_compra: new Date().toISOString(),
            respaldo_local: true
          });
        }

        guardarCompraPendiente(compra);
        mostrarExitoCompra();

        window.setTimeout(() => {
          window.location.href = `compra-aprobada.html?id=${compra.id_curso}`;
        }, 650);
      } catch (error) {
        mostrarErrorCompra('No se pudo completar la compra. Revisa los campos e intenta de nuevo.');
        bloquearBotonCompra(false);
      }
    };

    const cargarCursoCompra = async () => {
      mostrarResumenCompra();
      bloquearBotonCompra(true);

      const idCurso = obtenerParametroId();

      try {
        if (!idCurso) {
          cursoSeleccionado = obtenerCursoDesdePantalla(null);
          mostrarErrorCompra('No se indicó qué curso se va a comprar.');
          return;
        }

        cursoSeleccionado = obtenerCursoDesdePantalla(idCurso);

        if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
          return;
        }

        const respuesta = await apiRequestConReintento(`/cursos/${idCurso}`, {}, 2);
        const curso = respuesta.curso || respuesta.data || respuesta;

        if (!curso || !curso.id_curso) {
          return;
        }

        cursoSeleccionado = curso;
        sessionStorage.setItem('edutech_curso_compra_id', String(curso.id_curso));
        pintarResumenCurso(curso);
        ocultarErrorCompra();
      } catch (error) {
        mostrarResumenCompra();
      } finally {
        if (cursoSeleccionado && cursoSeleccionado.id_curso) {
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

    cargarCursoCompra();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCompraCurso);
  } else {
    iniciarCompraCurso();
  }
})();
