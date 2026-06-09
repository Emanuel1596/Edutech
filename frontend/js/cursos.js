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

const guardarCursoSeleccionado = (idCurso) => {
  if (!idCurso) {
    return;
  }

  sessionStorage.setItem('edutech_curso_detalle_id', String(idCurso));
};

const obtenerImagenCurso = (curso) => {
  if (curso.imagen_portada && curso.imagen_portada.trim() !== '') {
    return curso.imagen_portada;
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

const obtenerNivel = (curso) => {
  return curso.nombre_nivel || 'Curso disponible';
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
  const precio = formatearPrecio(curso.precio_mxn);

  const article = crearElemento('article', 'course-card-tc');

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
  const tipoElemento = crearElemento('span', null, 'Acceso en línea');

  meta.appendChild(nivelElemento);
  meta.appendChild(tipoElemento);

  const footer = crearElemento('div', 'course-footer-tc');
  const precioElemento = crearElemento('strong', null, precio);
  const linkCurso = crearElemento('a', null, 'Ver curso');
  prepararEnlaceDetalle(linkCurso, idCurso);

  footer.appendChild(precioElemento);
  footer.appendChild(linkCurso);

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
  if (!cursosGrid) {
    return;
  }

  ocultarGridCursos();

  if (!window.EduTech || typeof window.EduTech.apiRequest !== 'function') {
    mostrarMensajeCursos('No se pudo conectar con la API. Revisa que js/api.js esté cargado antes de js/cursos.js.', true);
    return;
  }

  try {
    ocultarMensajeCursos();

    const respuesta = await window.EduTech.apiRequest('/cursos');
    const cursos = Array.isArray(respuesta.cursos) ? respuesta.cursos : [];

    if (cursos.length === 0) {
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
    mostrarMensajeCursos('No se pudieron cargar los cursos desde el backend. Revisa que el backend esté encendido y que el puerto 3000 esté público.', true);
  }
};

document.addEventListener('DOMContentLoaded', cargarCursos);
