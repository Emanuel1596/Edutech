(() => {
  const carritoContenido = document.getElementById('carritoContenido');
  const carritoVacio = document.getElementById('carritoVacio');
  const carritoItems = document.getElementById('carritoItems');
  const carritoMensaje = document.getElementById('carritoMensaje');
  const carritoTotalCursos = document.getElementById('carritoTotalCursos');
  const carritoTotal = document.getElementById('carritoTotal');
  const carritoVaciar = document.getElementById('carritoVaciar');
  const carritoComprar = document.getElementById('carritoComprar');

  const marcarPaginaLista = () => {
    if (window.EduTechMarcarPaginaLista) {
      window.EduTechMarcarPaginaLista();
    }
  };

  const formatearPrecio = (precio) => {
    const numero = Number(precio || 0);
    return `$${numero.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
  };

  const mostrar = (elemento) => {
    if (!elemento) return;
    elemento.style.display = elemento.classList.contains('cart-layout') ? 'grid' : 'block';
  };

  const ocultar = (elemento) => {
    if (elemento) elemento.style.display = 'none';
  };

  const mostrarMensaje = (mensaje, error = false) => {
    if (!carritoMensaje) return;
    carritoMensaje.textContent = mensaje || '';
    carritoMensaje.style.display = mensaje ? 'block' : 'none';
    carritoMensaje.style.color = error ? '#ffb3b3' : '#19d37d';
  };

  const obtenerInstructor = (curso) => {
    const nombre = [curso.nombre_instructor, curso.apellido_paterno_instructor].filter(Boolean).join(' ').trim();
    return curso.instructor || nombre || 'Instructor EduTech';
  };

  const obtenerImagen = (curso) => String(curso.imagen_portada || curso.imagen || '').trim();

  const obtenerComprados = () => {
    const ids = new Set();

    try {
      const lista = JSON.parse(localStorage.getItem('edutech_cursos_comprados_ids') || '[]');
      if (Array.isArray(lista)) lista.forEach((id) => ids.add(String(id)));
    } catch (error) {
      // Se ignoran datos locales corruptos.
    }

    try {
      const cursos = JSON.parse(localStorage.getItem('edutech_mis_cursos') || '[]');
      if (Array.isArray(cursos)) {
        cursos.forEach((curso) => {
          const id = curso.id_curso || curso.idCurso || curso.id;
          if (id) ids.add(String(id));
        });
      }
    } catch (error) {
      // Se ignoran datos locales corruptos.
    }

    return ids;
  };

  const limpiarCursosCompradosDelCarrito = (carrito) => {
    const comprados = obtenerComprados();
    const filtrado = carrito.filter((curso) => !comprados.has(String(curso.id_curso)));

    if (filtrado.length !== carrito.length && window.EduTechCarrito) {
      window.EduTechCarrito.guardar(filtrado);
      mostrarMensaje('Quitamos del carrito cursos que ya aparecen como comprados.', false);
    }

    return filtrado;
  };

  const crearItem = (curso) => {
    const item = document.createElement('article');
    item.className = 'cart-item';

    const imagen = obtenerImagen(curso);
    const imagenBox = document.createElement('div');
    imagenBox.className = 'cart-item-image';

    if (imagen) {
      const img = document.createElement('img');
      img.src = imagen;
      img.alt = `Imagen del curso ${curso.titulo || 'EduTech'}`;
      img.onerror = () => {
        img.remove();
        imagenBox.classList.add('cart-item-image-empty');
      };
      imagenBox.appendChild(img);
    } else {
      imagenBox.classList.add('cart-item-image-empty');
    }

    const info = document.createElement('div');
    info.className = 'cart-item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = curso.titulo || 'Curso EduTech';

    const meta = document.createElement('p');
    meta.textContent = `${obtenerInstructor(curso)} · ${curso.nombre_nivel || curso.nivel || 'Curso disponible'}`;

    const precio = document.createElement('strong');
    precio.textContent = formatearPrecio(curso.precio_mxn || curso.precio || 0);

    info.appendChild(titulo);
    info.appendChild(meta);
    info.appendChild(precio);

    const acciones = document.createElement('div');
    acciones.className = 'cart-item-actions';

    const ver = document.createElement('a');
    ver.href = `detalle-curso.html?id=${curso.id_curso}`;
    ver.textContent = 'Ver curso';

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.textContent = 'Quitar';
    quitar.addEventListener('click', () => {
      if (window.EduTechCarrito) {
        window.EduTechCarrito.quitar(curso.id_curso);
      }
      pintarCarrito();
    });

    acciones.appendChild(ver);
    acciones.appendChild(quitar);

    item.appendChild(imagenBox);
    item.appendChild(info);
    item.appendChild(acciones);

    return item;
  };

  const pintarCarrito = () => {
    if (!window.EduTechCarrito) {
      mostrarMensaje('No se pudo cargar el carrito. Recarga la página.', true);
      marcarPaginaLista();
      return;
    }

    const carrito = limpiarCursosCompradosDelCarrito(window.EduTechCarrito.obtener());
    const total = carrito.reduce((suma, curso) => suma + Number(curso.precio_mxn || curso.precio || 0), 0);

    if (!carritoItems) {
      return;
    }

    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
      ocultar(carritoContenido);
      mostrar(carritoVacio);
      marcarPaginaLista();
      return;
    }

    carrito.forEach((curso) => carritoItems.appendChild(crearItem(curso)));

    if (carritoTotalCursos) {
      carritoTotalCursos.textContent = `${carrito.length} curso${carrito.length === 1 ? '' : 's'}`;
    }

    if (carritoTotal) {
      carritoTotal.textContent = formatearPrecio(total);
    }

    if (carritoComprar) {
      carritoComprar.href = 'comprar-curso.html?carrito=1';
    }

    ocultar(carritoVacio);
    mostrar(carritoContenido);
    marcarPaginaLista();
  };

  if (carritoVaciar) {
    carritoVaciar.addEventListener('click', () => {
      if (window.EduTechCarrito) {
        window.EduTechCarrito.limpiar();
      }
      mostrarMensaje('Carrito vaciado.');
      pintarCarrito();
    });
  }

  document.addEventListener('DOMContentLoaded', pintarCarrito);
  window.addEventListener('edutech-carrito-actualizado', pintarCarrito);
})();
