const marcarPaginaDatosLista = () => {
  if (window.EduTechMarcarPaginaLista) {
    window.EduTechMarcarPaginaLista();
  }
};

const cursosGrid = document.getElementById('cursosGrid');
const cursosMensaje = document.getElementById('cursosMensaje');

const mostrarMensajeCursos = (mensaje, esError = false) => {
  if (!cursosMensaje) {
    return;
  }

  cursosMensaje.textContent = mensaje;
  cursosMensaje.style.display = 'block';
  cursosMensaje.style.color = esError ? '#ff5c5c' : '#19d37d';
};

const ocultarMensajeCursos = () => {
  if (!cursosMensaje) {
    return;
  }

  cursosMensaje.textContent = '';
  cursosMensaje.style.display = 'none';
};

const ocultarGridCursos = () => {
  if (cursosGrid) {
    cursosGrid.style.setProperty('display', 'none', 'important');
  }
};

const mostrarGridCursos = () => {
  if (cursosGrid) {
    cursosGrid.style.setProperty('display', 'flex', 'important');
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

const obtenerIdCurso = (curso) => {
  const id = Number(curso.id_curso);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};


const obtenerCursosCompradosIds = () => {
  const idsGuardados = localStorage.getItem('edutech_cursos_comprados_ids');

  if (idsGuardados) {
    try {
      const ids = JSON.parse(idsGuardados);

      if (Array.isArray(ids)) {
        return ids.map((id) => String(id));
      }
    } catch (error) {
      return [];
    }
  }

  const cursosGuardados = localStorage.getItem('edutech_mis_cursos');

  if (!cursosGuardados) {
    return [];
  }

  try {
    const cursos = JSON.parse(cursosGuardados);

    if (!Array.isArray(cursos)) {
      return [];
    }

    return cursos
      .map((curso) => curso.id_curso || curso.idCurso || curso.id)
      .filter(Boolean)
      .map((id) => String(id));
  } catch (error) {
    return [];
  }
};

const cursoEstaComprado = (idCurso) => {
  if (!idCurso) {
    return false;
  }

  return obtenerCursosCompradosIds().includes(String(idCurso));
};

const guardarCursoSeleccionado = (idCurso) => {
  if (!idCurso) {
    return;
  }

  sessionStorage.setItem('edutech_curso_detalle_id', String(idCurso));
};

const obtenerImagenCurso = (curso) => {
  const imagen = curso.imagen_portada ? String(curso.imagen_portada).trim() : '';

  if (imagen !== '') {
    return imagen;
  }

  return null;
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
  const nombre = curso.nombre_instructor || '';
  const apellido = curso.apellido_paterno_instructor || '';
  const instructor = `${nombre} ${apellido}`.trim();

  return instructor || 'Instructor EduTech';
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

const obtenerNivel = (curso) => {
  return normalizarTextoVisible(
    curso.nombre_nivel ||
    curso.nivel ||
    curso.dificultad ||
    curso.nombre_dificultad ||
    curso.dificultad_curso ||
    curso.nivel_curso ||
    'Curso disponible'
  );
};

const prepararEnlaceDetalle = (enlace, idCurso) => {
  const urlDetalle = idCurso ? `detalle-curso.html?id=${idCurso}` : 'detalle-curso.html';

  enlace.href = urlDetalle;

  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();

    if (idCurso) {
      guardarCursoSeleccionado(idCurso);
      window.location.href = `detalle-curso.html?id=${idCurso}`;
      return;
    }

    window.location.href = 'detalle-curso.html';
  });
};



const crearBotonCarritoCursos = (curso, idCurso) => {
  const boton = crearElemento('button', 'course-cart-button', 'Agregar al carrito');
  boton.type = 'button';

  const actualizarTexto = () => {
    const enCarrito = window.EduTechCarrito && window.EduTechCarrito.contiene(idCurso);
    boton.textContent = enCarrito ? 'En carrito' : 'Agregar al carrito';
    boton.classList.toggle('is-in-cart', Boolean(enCarrito));
  };

  actualizarTexto();

  boton.addEventListener('click', (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    if (!window.EduTechCarrito) {
      mostrarMensajeCursos('No se pudo cargar el carrito. Recarga la página e intenta de nuevo.', true);
      return;
    }

    const resultado = window.EduTechCarrito.agregar(curso);

    if (!resultado.ok) {
      mostrarMensajeCursos(resultado.message || 'No se pudo agregar el curso al carrito.', true);
      return;
    }

    actualizarTexto();
    mostrarMensajeCursos(resultado.message || 'Curso agregado al carrito.');
  });

  return boton;
};

const prepararImagenCurso = (img, cover, curso, titulo) => {
  return new Promise((resolve) => {
    const imagen = obtenerImagenCurso(curso);

    cover.classList.remove('course-cover-no-image');

    if (!imagen) {
      img.removeAttribute('src');
      img.alt = '';
      img.style.display = 'none';
      cover.classList.add('course-cover-no-image');
      resolve();
      return;
    }

    img.style.display = 'block';
    img.style.visibility = 'hidden';
    img.alt = `Imagen del curso ${titulo}`;

    img.onload = () => {
      img.onload = null;
      img.onerror = null;
      img.style.visibility = 'visible';
      resolve();
    };

    img.onerror = () => {
      img.onload = null;
      img.onerror = null;
      img.removeAttribute('src');
      img.alt = '';
      img.style.display = 'none';
      img.style.visibility = 'visible';
      cover.classList.add('course-cover-no-image');
      resolve();
    };

    img.src = imagen;

    if (img.complete && img.naturalWidth > 0) {
      img.onload();
    }
  });
};

const crearTarjetaCurso = (curso) => {
  const idCurso = obtenerIdCurso(curso);
  const titulo = curso.titulo || 'Curso EduTech';
  const descripcion = curso.descripcion || 'Consulta la información completa del curso y revisa su contenido.';
  const instructor = obtenerInstructor(curso);
  const nivel = obtenerNivel(curso);
  const precio = formatearPrecio(curso.precio_mxn || curso.precio || curso.total || 0);
  const comprado = cursoEstaComprado(idCurso);

  const article = crearElemento('article', comprado ? 'course-card-tc course-card-owned' : 'course-card-tc');

  if (idCurso) {
    article.dataset.idCurso = String(idCurso);
  }

  const linkImagen = crearElemento('a', 'course-image-tc');
  prepararEnlaceDetalle(linkImagen, idCurso);
  linkImagen.setAttribute('aria-label', `Curso ${titulo}`);

  const cover = crearElemento('div', 'course-cover-image');

  const img = crearElemento('img');
  img.loading = 'eager';

  cover.appendChild(img);
  linkImagen.appendChild(cover);

  const contenido = crearElemento('div', 'course-content-tc');

  const h2 = crearElemento('h2');
  const linkTitulo = crearElemento('a', null, titulo);
  prepararEnlaceDetalle(linkTitulo, idCurso);
  h2.appendChild(linkTitulo);

  const descripcionElemento = crearElemento('p', null, descripcion);
  const instructorElemento = crearElemento('p', 'course-instructor', `Instructor: ${instructor}`);

  const meta = crearElemento('div', 'course-meta-tc');
  const nivelElemento = crearElemento('span', null, nivel);
  const modalidadElemento = crearElemento('span', comprado ? 'course-owned-label' : null, comprado ? 'Comprado' : 'Acceso en línea');

  meta.appendChild(nivelElemento);
  meta.appendChild(modalidadElemento);

  const footer = crearElemento('div', 'course-footer-tc');
  const precioElemento = crearElemento('strong', null, precio);
  const acciones = crearElemento('div', 'course-footer-actions');
  const linkCurso = crearElemento('a', comprado ? 'course-entry-link' : null, comprado ? 'Entrar al curso' : 'Ver curso');
  prepararEnlaceDetalle(linkCurso, idCurso);

  if (!comprado) {
    footer.appendChild(precioElemento);
    acciones.appendChild(crearBotonCarritoCursos(curso, idCurso));
  }

  acciones.appendChild(linkCurso);
  footer.appendChild(acciones);

  contenido.appendChild(h2);
  contenido.appendChild(descripcionElemento);
  contenido.appendChild(instructorElemento);
  contenido.appendChild(meta);
  contenido.appendChild(footer);

  article.appendChild(linkImagen);
  article.appendChild(contenido);

  article.addEventListener('click', (evento) => {
    const enlace = evento.target.closest('a');

    if (enlace) {
      return;
    }

    if (idCurso) {
      guardarCursoSeleccionado(idCurso);
      window.location.href = `detalle-curso.html?id=${idCurso}`;
    }
  });

  const imagenLista = prepararImagenCurso(img, cover, curso, titulo);

  return {
    tarjeta: article,
    imagenLista
  };
};

const esperarCargaVisualCursos = async (promesas) => {
  const esperaMinima = new Promise((resolve) => {
    window.setTimeout(resolve, 120);
  });

  await Promise.all([...promesas, esperaMinima]);
};

const cargarCursos = async () => {
  try {
    if (!cursosGrid) {
      return;
    }

    ocultarGridCursos();

    if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
      mostrarMensajeCursos('No se pudo conectar con la API. Revisa que js/api.js esté cargado antes de js/cursos.js.', true);
      return;
    }

    ocultarMensajeCursos();

    const respuesta = await window.EduTech.apiRequest('/cursos');
    const cursos = Array.isArray(respuesta.cursos) ? respuesta.cursos : [];
    localStorage.setItem('edutech_catalogo_cursos', JSON.stringify(cursos));

    if (cursos.length === 0) {
      cursosGrid.innerHTML = '';
      mostrarMensajeCursos('No hay cursos publicados por el momento.', true);
      return;
    }

    cursosGrid.innerHTML = '';

    const cargasImagenes = cursos.map((curso) => {
      const resultado = crearTarjetaCurso(curso);
      cursosGrid.appendChild(resultado.tarjeta);
      return resultado.imagenLista;
    });

    await esperarCargaVisualCursos(cargasImagenes);
    ocultarMensajeCursos();
    mostrarGridCursos();
  } catch (error) {
    if (cursosGrid) {
      cursosGrid.innerHTML = '';
    }

    ocultarGridCursos();
    mostrarMensajeCursos('No se pudieron cargar los cursos desde el backend. Revisa que el backend esté encendido y que el puerto 3000 esté público.', true);
  } finally {
    marcarPaginaDatosLista();
  }
};

document.addEventListener('DOMContentLoaded', cargarCursos);
