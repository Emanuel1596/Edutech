const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const pool = require('../config/db');

const obtenerNombreRol = (valor) => String(valor || '').trim().toLowerCase();

const validarInstructor = async (idInstructor) => {
  const resultado = await pool.query(
    `SELECT
      u.id_usuario,
      u.id_rol,
      r.nombre_rol,
      u.nombre,
      u.apellido_paterno,
      u.apellido_materno,
      u.correo,
      u.esta_activo
     FROM edutech.usuario u
     INNER JOIN edutech.rol r
      ON r.id_rol = u.id_rol
     WHERE u.id_usuario = $1`,
    [idInstructor]
  );

  if (resultado.rows.length === 0) {
    return {
      ok: false,
      status: 404,
      message: 'Instructor no encontrado.'
    };
  }

  const instructor = resultado.rows[0];

  if (!instructor.esta_activo) {
    return {
      ok: false,
      status: 403,
      message: 'El usuario está inactivo.'
    };
  }

  const rol = obtenerNombreRol(instructor.nombre_rol);

  if (!['instructor', 'administrador'].includes(rol)) {
    return {
      ok: false,
      status: 403,
      message: 'Esta pantalla solo está disponible para instructores.'
    };
  }

  return {
    ok: true,
    instructor
  };
};

const obtenerIdEstadoCurso = async (nombreEstado) => {
  const resultado = await pool.query(
    `SELECT id_estado_curso
     FROM edutech.estado_curso
     WHERE LOWER(nombre_estado_curso) = LOWER($1)`,
    [nombreEstado]
  );

  if (resultado.rows.length === 0) {
    throw new Error(`No existe el estado de curso: ${nombreEstado}.`);
  }

  return resultado.rows[0].id_estado_curso;
};

const obtenerIdEstadoRevision = async (nombreEstado) => {
  const resultado = await pool.query(
    `SELECT id_estado_revision_curso
     FROM edutech.estado_revision_curso
     WHERE LOWER(nombre_estado_revision_curso) = LOWER($1)`,
    [nombreEstado]
  );

  if (resultado.rows.length === 0) {
    throw new Error(`No existe el estado de revisión: ${nombreEstado}.`);
  }

  return resultado.rows[0].id_estado_revision_curso;
};

const obtenerIdAdministradorRevisor = async () => {
  const resultado = await pool.query(
    `SELECT u.id_usuario
     FROM edutech.usuario u
     INNER JOIN edutech.rol r
      ON r.id_rol = u.id_rol
     WHERE LOWER(r.nombre_rol) = LOWER('Administrador')
      AND u.esta_activo = TRUE
     ORDER BY u.id_usuario
     LIMIT 1`
  );

  if (resultado.rows.length === 0) {
    throw new Error('No existe un administrador activo para recibir la revisión del curso.');
  }

  return resultado.rows[0].id_usuario;
};

const obtenerDatosCursoInstructor = async (idCurso, idInstructor) => {
  const resultado = await pool.query(
    `SELECT
      c.id_curso,
      c.id_usuario,
      c.id_nivel_curso,
      c.id_estado_curso,
      c.titulo,
      c.descripcion,
      c.imagen_portada,
      c.precio_mxn,
      c.fecha_creacion,
      c.fecha_actualizacion,
      nc.nombre_nivel,
      ec.nombre_estado_curso
     FROM edutech.curso c
     INNER JOIN edutech.nivel_curso nc
      ON nc.id_nivel_curso = c.id_nivel_curso
     INNER JOIN edutech.estado_curso ec
      ON ec.id_estado_curso = c.id_estado_curso
     WHERE c.id_curso = $1
      AND c.id_usuario = $2`,
    [idCurso, idInstructor]
  );

  return resultado.rows[0] || null;
};

const contieneLetras = (valor) => /[a-záéíóúñü]/i.test(String(valor || ''));

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

const validarDatosCurso = ({ titulo, descripcion, precio_mxn, id_nivel_curso, imagen_portada }) => {
  const errores = [];
  const tituloLimpio = String(titulo || '').trim();
  const descripcionLimpia = String(descripcion || '').trim();
  const precioTexto = String(precio_mxn || '').trim();

  if (tituloLimpio.length < 5) {
    errores.push('El título debe tener al menos 5 caracteres.');
  }

  if (!contieneLetras(tituloLimpio)) {
    errores.push('El título debe contener texto, no solo números o signos.');
  }

  if (descripcionLimpia.length < 20) {
    errores.push('La descripción debe tener al menos 20 caracteres.');
  }

  if (!contieneLetras(descripcionLimpia)) {
    errores.push('La descripción debe contener texto, no solo números o signos.');
  }

  const puntosPrecio = (precioTexto.match(/\./g) || []).length;

  if (/[^0-9.]/.test(precioTexto)) {
    errores.push('El precio solo permite números.');
  } else if (puntosPrecio > 1) {
    errores.push('El precio debe ser un número válido.');
  } else if (/^\d+\.\d{3,}$/.test(precioTexto) || /^\.\d{3,}$/.test(precioTexto)) {
    errores.push('El precio solo permite máximo dos decimales.');
  } else if (!/^\d+(\.\d{0,2})?$/.test(precioTexto)) {
    errores.push('El precio debe ser un número válido.');
  }

  const precio = Number(precioTexto);

  if (!Number.isFinite(precio) || precio < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0.');
  }

  if (!id_nivel_curso || !Number.isInteger(Number(id_nivel_curso))) {
    errores.push('Selecciona una dificultad válida.');
  }

  if (!String(imagen_portada || '').trim()) {
    errores.push('Agrega una portada por link o archivo local.');
  } else if (!esUrlPortadaValida(imagen_portada)) {
    errores.push('La portada debe ser una imagen JPG, PNG o WEBP. No uses videos, GIF ni otros archivos.');
  }

  return errores;
};



const validarModulosCurso = (modulos) => {
  const errores = [];

  if (!Array.isArray(modulos) || modulos.length === 0) {
    errores.push('Agrega al menos un módulo.');
    return errores;
  }

  if (modulos.length > 20) {
    errores.push('No puedes guardar más de 20 módulos de una sola vez.');
  }

  const ordenes = new Set();

  modulos.forEach((modulo, indice) => {
    const titulo = String(modulo.titulo || '').trim();
    const numeroOrden = Number(modulo.numero_orden || indice + 1);

    if (!Number.isInteger(numeroOrden) || numeroOrden < 1) {
      errores.push(`El módulo ${indice + 1} tiene un número de orden inválido.`);
    }

    if (ordenes.has(numeroOrden)) {
      errores.push(`El número de orden ${numeroOrden} está repetido.`);
    }

    ordenes.add(numeroOrden);

    if (titulo.length < 3) {
      errores.push(`El módulo ${indice + 1} debe tener al menos 3 caracteres.`);
    }

    if (!contieneLetras(titulo)) {
      errores.push(`El módulo ${indice + 1} debe contener texto, no solo números o signos.`);
    }
  });

  return errores;
};


const validarLeccionesCurso = (lecciones) => {
  const errores = [];

  if (!Array.isArray(lecciones) || lecciones.length === 0) {
    errores.push('Agrega al menos una lección.');
    return errores;
  }

  if (lecciones.length > 100) {
    errores.push('No puedes guardar más de 100 lecciones de una sola vez.');
  }

  const ordenesPorModulo = new Map();

  lecciones.forEach((leccion, indice) => {
    const moduloNumeroOrden = Number(leccion.modulo_numero_orden);
    const numeroOrden = Number(leccion.numero_orden || indice + 1);
    const titulo = String(leccion.titulo || '').trim();
    const textoDescriptivo = String(leccion.texto_descriptivo || '').trim();
    const urlVideo = String(leccion.url_video || '').trim();
    const idTipoVideo = Number(leccion.id_tipo_video || 1);
    const duracion = leccion.duracion_segundos === null || leccion.duracion_segundos === undefined || leccion.duracion_segundos === ''
      ? null
      : Number(leccion.duracion_segundos);

    if (!Number.isInteger(moduloNumeroOrden) || moduloNumeroOrden < 1) {
      errores.push(`La lección ${indice + 1} no tiene un módulo válido.`);
    }

    if (!Number.isInteger(numeroOrden) || numeroOrden < 1) {
      errores.push(`La lección ${indice + 1} tiene un número de orden inválido.`);
    }

    const claveModulo = String(moduloNumeroOrden);
    const ordenes = ordenesPorModulo.get(claveModulo) || new Set();

    if (ordenes.has(numeroOrden)) {
      errores.push(`El módulo ${moduloNumeroOrden} tiene repetido el número de lección ${numeroOrden}.`);
    }

    ordenes.add(numeroOrden);
    ordenesPorModulo.set(claveModulo, ordenes);

    if (titulo.length < 3) {
      errores.push(`La lección ${indice + 1} debe tener al menos 3 caracteres.`);
    }

    if (!contieneLetras(titulo)) {
      errores.push(`La lección ${indice + 1} debe contener texto, no solo números o signos.`);
    }

    if (textoDescriptivo.length < 10) {
      errores.push(`La descripción de la lección ${indice + 1} debe tener al menos 10 caracteres.`);
    }

    if (!contieneLetras(textoDescriptivo)) {
      errores.push(`La descripción de la lección ${indice + 1} debe contener texto.`);
    }

    if (urlVideo.length < 5 || urlVideo.length > 255) {
      errores.push(`El video de la lección ${indice + 1} debe ser válido.`);
    }

    if (!esUrlVideoValida(urlVideo)) {
      errores.push(`El video de la lección ${indice + 1} debe ser YouTube, Vimeo o un archivo MP4, WEBM, OGG, MOV o M4V. No uses imágenes ni GIF.`);
    }

    if (!Number.isInteger(idTipoVideo) || idTipoVideo < 1) {
      errores.push(`La lección ${indice + 1} tiene un tipo de video inválido.`);
    }

    if (duracion !== null && (!Number.isInteger(duracion) || duracion < 0)) {
      errores.push(`La duración de la lección ${indice + 1} debe ser un número válido.`);
    }

    if (Array.isArray(leccion.recursos)) {
      if (leccion.recursos.length > 10) {
        errores.push(`La lección ${indice + 1} no puede tener más de 10 recursos.`);
      }

      leccion.recursos.forEach((recurso, indiceRecurso) => {
        const tituloRecurso = String(recurso.titulo || '').trim();
        const urlRecurso = String(recurso.url_recurso || '').trim();
        const idTipoRecurso = Number(recurso.id_tipo_recurso || 2);

        if (tituloRecurso.length < 3 || !contieneLetras(tituloRecurso)) {
          errores.push(`El recurso ${indiceRecurso + 1} de la lección ${indice + 1} debe tener nombre válido.`);
        }

        if (!Number.isInteger(idTipoRecurso) || idTipoRecurso < 1) {
          errores.push(`El recurso ${indiceRecurso + 1} de la lección ${indice + 1} tiene un tipo inválido.`);
        }

        if (urlRecurso.length < 5 || urlRecurso.length > 255) {
          errores.push(`El recurso ${indiceRecurso + 1} de la lección ${indice + 1} debe tener link o archivo válido.`);
        }

        if (!/^https?:\/\/\S+$/i.test(urlRecurso) && !/^assets\/recursos\/[\w\-./%()]+$/i.test(urlRecurso)) {
          errores.push(`El recurso ${indiceRecurso + 1} de la lección ${indice + 1} debe ser un link http/https válido o una ruta assets/recursos válida.`);
        }
      });
    }

  });

  return errores;
};

const validarCursoListoParaRevision = async (idCurso) => {
  const resultado = await pool.query(
    `SELECT
      COALESCE((
        SELECT COUNT(*)::int
        FROM edutech.modulo m
        WHERE m.id_curso = $1
      ), 0) AS total_modulos,

      COALESCE((
        SELECT COUNT(*)::int
        FROM edutech.modulo m
        INNER JOIN edutech.leccion l
          ON l.id_modulo = m.id_modulo
        WHERE m.id_curso = $1
          AND l.esta_activa = TRUE
      ), 0) AS total_lecciones,

      COALESCE((
        SELECT COUNT(*)::int
        FROM edutech.examen e
        WHERE e.id_curso = $1
      ), 0) AS total_examenes,

      COALESCE((
        SELECT COUNT(*)::int
        FROM edutech.examen e
        INNER JOIN edutech.pregunta p
          ON p.id_examen = e.id_examen
        WHERE e.id_curso = $1
          AND p.esta_activa = TRUE
      ), 0) AS total_preguntas`,
    [idCurso]
  );

  const datos = resultado.rows[0] || {};
  const errores = [];

  if (Number(datos.total_modulos || 0) < 1) {
    errores.push('Agrega al menos un módulo antes de enviar el curso a revisión.');
  }

  if (Number(datos.total_lecciones || 0) < 1) {
    errores.push('Agrega al menos una lección activa antes de enviar el curso a revisión.');
  }

  if (Number(datos.total_examenes || 0) < 1) {
    errores.push('Configura un examen antes de enviar el curso a revisión.');
  }

  if (Number(datos.total_preguntas || 0) < 1) {
    errores.push('Agrega preguntas al examen antes de enviar el curso a revisión.');
  }

  return errores;
};

const obtenerExtensionImagen = (mimeType) => {
  const mapa = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

  return mapa[mimeType] || null;
};

const subirPortadaCurso = async (req, res) => {
  try {
    const { idInstructor } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const { data_url, mime_type } = req.body;
    const mimeDetectado = String(mime_type || '').trim().toLowerCase();
    const extension = obtenerExtensionImagen(mimeDetectado);

    if (!extension) {
      return res.status(400).json({
        ok: false,
        message: 'La portada local debe ser JPG, PNG o WEBP.'
      });
    }

    const prefijo = `data:${mimeDetectado};base64,`;
    const dataUrlTexto = String(data_url || '');

    if (!dataUrlTexto.startsWith(prefijo)) {
      return res.status(400).json({
        ok: false,
        message: 'El archivo de portada no tiene un formato válido.'
      });
    }

    const contenidoBase64 = dataUrlTexto.slice(prefijo.length);
    const buffer = Buffer.from(contenidoBase64, 'base64');
    const maximoBytes = 2 * 1024 * 1024;

    if (!buffer.length || buffer.length > maximoBytes) {
      return res.status(400).json({
        ok: false,
        message: 'La portada local no debe pesar más de 2 MB.'
      });
    }

    const carpetaDestino = path.resolve(__dirname, '../../../frontend/assets/img/cursos');
    await fs.mkdir(carpetaDestino, { recursive: true });

    const nombreArchivo = `curso-${idInstructor}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${extension}`;
    const rutaFinal = path.join(carpetaDestino, nombreArchivo);
    await fs.writeFile(rutaFinal, buffer);

    res.status(201).json({
      ok: true,
      message: 'Portada cargada correctamente.',
      ruta: `assets/img/cursos/${nombreArchivo}`
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar la portada del curso.',
      error: error.message
    });
  }
};

const registrarRevisionPendiente = async (cliente, idCurso) => {
  const idEstadoRevisionPendiente = await obtenerIdEstadoRevision('pendiente');
  const idAdministrador = await obtenerIdAdministradorRevisor();

  await cliente.query(
    `INSERT INTO edutech.revision_curso
      (id_curso, id_estado_revision_curso, id_usuario_revisor, comentario)
     VALUES
      ($1, $2, $3, $4)`,
    [
      idCurso,
      idEstadoRevisionPendiente,
      idAdministrador,
      'Curso enviado por el instructor para revisión.'
    ]
  );
};

const obtenerResumenInstructor = async (req, res) => {
  try {
    const { idInstructor } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const cursosResultado = await pool.query(
      `SELECT
        c.id_curso,
        c.id_nivel_curso,
        c.id_estado_curso,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        c.precio_mxn,
        c.fecha_creacion,
        c.fecha_actualizacion,
        nc.nombre_nivel,
        ec.nombre_estado_curso,

        COALESCE((
          SELECT COUNT(*)::int
          FROM edutech.modulo m
          WHERE m.id_curso = c.id_curso
        ), 0) AS total_modulos,

        COALESCE((
          SELECT COUNT(*)::int
          FROM edutech.modulo m
          INNER JOIN edutech.leccion l
            ON l.id_modulo = m.id_modulo
          WHERE m.id_curso = c.id_curso
            AND l.esta_activa = TRUE
        ), 0) AS total_lecciones,

        COALESCE((
          SELECT COUNT(DISTINCT lr.id_recurso)::int
          FROM edutech.modulo m
          INNER JOIN edutech.leccion l
            ON l.id_modulo = m.id_modulo
          INNER JOIN edutech.leccion_recurso lr
            ON lr.id_leccion = l.id_leccion
          WHERE m.id_curso = c.id_curso
            AND l.esta_activa = TRUE
        ), 0) AS total_recursos,

        COALESCE((
          SELECT COUNT(DISTINCT i.id_inscripcion)::int
          FROM edutech.inscripcion i
          INNER JOIN edutech.orden_detalle od
            ON od.id_orden_detalle = i.id_orden_detalle
          WHERE od.id_curso = c.id_curso
        ), 0) AS total_alumnos,

        COALESCE((
          SELECT ROUND(AVG(ie.calificacion), 2)
          FROM edutech.examen e
          INNER JOIN edutech.intento_examen ie
            ON ie.id_examen = e.id_examen
          WHERE e.id_curso = c.id_curso
            AND ie.calificacion IS NOT NULL
        ), 0) AS promedio_examen,

        COALESCE((
          SELECT COUNT(*)::int
          FROM edutech.examen e
          INNER JOIN edutech.intento_examen ie
            ON ie.id_examen = e.id_examen
          WHERE e.id_curso = c.id_curso
        ), 0) AS total_intentos,

        COALESCE((
          SELECT COUNT(*)::int
          FROM edutech.examen e
          INNER JOIN edutech.intento_examen ie
            ON ie.id_examen = e.id_examen
          WHERE e.id_curso = c.id_curso
            AND ie.aprobado = TRUE
        ), 0) AS total_aprobados,

        (
          SELECT json_build_object(
            'id_examen', e.id_examen,
            'titulo', e.titulo,
            'tiempo_limite_minutos', e.tiempo_limite_minutos,
            'max_intentos', e.max_intentos,
            'calificacion_minima', e.calificacion_minima,
            'cantidad_preguntas', e.cantidad_preguntas,
            'estado', ee.nombre_estado_examen
          )
          FROM edutech.examen e
          INNER JOIN edutech.estado_examen ee
            ON ee.id_estado_examen = e.id_estado_examen
          WHERE e.id_curso = c.id_curso
          LIMIT 1
        ) AS examen,

        (
          SELECT json_build_object(
            'id_revision_curso', rc.id_revision_curso,
            'estado_revision', erc.nombre_estado_revision_curso,
            'comentario', rc.comentario,
            'fecha_revision', rc.fecha_revision
          )
          FROM edutech.revision_curso rc
          INNER JOIN edutech.estado_revision_curso erc
            ON erc.id_estado_revision_curso = rc.id_estado_revision_curso
          WHERE rc.id_curso = c.id_curso
          ORDER BY rc.fecha_revision DESC, rc.id_revision_curso DESC
          LIMIT 1
        ) AS ultima_revision
       FROM edutech.curso c
       INNER JOIN edutech.nivel_curso nc
        ON nc.id_nivel_curso = c.id_nivel_curso
       INNER JOIN edutech.estado_curso ec
        ON ec.id_estado_curso = c.id_estado_curso
       WHERE c.id_usuario = $1
       ORDER BY c.fecha_creacion DESC, c.id_curso DESC`,
      [idInstructor]
    );

    const cursos = cursosResultado.rows;
    const resumen = cursos.reduce((acumulado, curso) => {
      acumulado.total_cursos += 1;
      acumulado.total_modulos += Number(curso.total_modulos || 0);
      acumulado.total_lecciones += Number(curso.total_lecciones || 0);
      acumulado.total_recursos += Number(curso.total_recursos || 0);
      acumulado.total_alumnos += Number(curso.total_alumnos || 0);
      acumulado.total_intentos += Number(curso.total_intentos || 0);
      acumulado.total_aprobados += Number(curso.total_aprobados || 0);
      return acumulado;
    }, {
      total_cursos: 0,
      total_modulos: 0,
      total_lecciones: 0,
      total_recursos: 0,
      total_alumnos: 0,
      total_intentos: 0,
      total_aprobados: 0
    });

    res.json({
      ok: true,
      instructor: validacion.instructor,
      resumen,
      cursos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el escritorio del instructor.',
      error: error.message
    });
  }
};

const obtenerCatalogosCurso = async (req, res) => {
  try {
    const nivelesResultado = await pool.query(
      `SELECT id_nivel_curso, nombre_nivel
       FROM edutech.nivel_curso
       ORDER BY id_nivel_curso`
    );

    res.json({
      ok: true,
      niveles: nivelesResultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener catálogos del curso.',
      error: error.message
    });
  }
};

const obtenerCursoInstructor = async (req, res) => {
  try {
    const { idInstructor, idCurso } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const curso = await obtenerDatosCursoInstructor(idCurso, idInstructor);

    if (!curso) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para este instructor.'
      });
    }

    const modulosResultado = await pool.query(
      `SELECT
        m.id_modulo,
        m.titulo,
        m.numero_orden,
        COALESCE(
          json_agg(
            json_build_object(
              'id_leccion', l.id_leccion,
              'titulo', l.titulo,
              'numero_orden', l.numero_orden,
              'id_tipo_video', l.id_tipo_video,
              'texto_descriptivo', l.texto_descriptivo,
              'url_video', l.url_video,
              'duracion_segundos', l.duracion_segundos,
              'esta_activa', l.esta_activa
            )
            ORDER BY l.numero_orden
          ) FILTER (WHERE l.id_leccion IS NOT NULL),
          '[]'::json
        ) AS lecciones
       FROM edutech.modulo m
       LEFT JOIN edutech.leccion l
        ON l.id_modulo = m.id_modulo
       WHERE m.id_curso = $1
       GROUP BY m.id_modulo, m.titulo, m.numero_orden
       ORDER BY m.numero_orden`,
      [idCurso]
    );

    const recursosResultado = await pool.query(
      `SELECT
        lr.id_leccion,
        lr.numero_orden,
        r.id_recurso,
        r.id_tipo_recurso,
        tr.nombre_tipo_recurso,
        r.titulo,
        r.descripcion,
        r.url_recurso
       FROM edutech.leccion_recurso lr
       INNER JOIN edutech.recurso r
        ON r.id_recurso = lr.id_recurso
       INNER JOIN edutech.tipo_recurso tr
        ON tr.id_tipo_recurso = r.id_tipo_recurso
       INNER JOIN edutech.leccion l
        ON l.id_leccion = lr.id_leccion
       INNER JOIN edutech.modulo m
        ON m.id_modulo = l.id_modulo
       WHERE m.id_curso = $1
       ORDER BY lr.id_leccion ASC, lr.numero_orden ASC`,
      [idCurso]
    );

    const modulos = modulosResultado.rows.map((modulo) => ({
      ...modulo,
      lecciones: (Array.isArray(modulo.lecciones) ? modulo.lecciones : []).map((leccion) => ({
        ...leccion,
        recursos: recursosResultado.rows.filter((recurso) => Number(recurso.id_leccion) === Number(leccion.id_leccion))
      }))
    }));

    res.json({
      ok: true,
      curso: {
        ...curso,
        modulos
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el curso del instructor.',
      error: error.message
    });
  }
};

const crearCursoInstructor = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idInstructor } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const {
      titulo,
      descripcion,
      precio_mxn,
      imagen_portada,
      id_nivel_curso,
      accion
    } = req.body;

    const errores = validarDatosCurso({ titulo, descripcion, precio_mxn, id_nivel_curso, imagen_portada });

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        message: errores.join(' ')
      });
    }

    const enviarRevision = accion === 'enviar_revision';

    if (enviarRevision) {
      return res.status(400).json({
        ok: false,
        message: 'Primero guarda el curso como borrador. Después agrega módulos, lecciones y examen desde Editar curso para enviarlo a revisión.'
      });
    }

    const idEstadoCurso = await obtenerIdEstadoCurso('borrador');

    await cliente.query('BEGIN');

    const cursoResultado = await cliente.query(
      `INSERT INTO edutech.curso
        (id_usuario, id_nivel_curso, id_estado_curso, titulo, descripcion, imagen_portada, precio_mxn)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
        id_curso,
        id_usuario,
        id_nivel_curso,
        id_estado_curso,
        titulo,
        descripcion,
        imagen_portada,
        precio_mxn,
        fecha_creacion,
        fecha_actualizacion`,
      [
        idInstructor,
        Number(id_nivel_curso),
        idEstadoCurso,
        String(titulo).trim(),
        String(descripcion).trim(),
        imagen_portada ? String(imagen_portada).trim() : null,
        Number(String(precio_mxn).trim())
      ]
    );

    const curso = cursoResultado.rows[0];

    if (enviarRevision) {
      await registrarRevisionPendiente(cliente, curso.id_curso);
    }

    await cliente.query('COMMIT');

    const cursoCompleto = await obtenerDatosCursoInstructor(curso.id_curso, idInstructor);

    res.status(201).json({
      ok: true,
      message: enviarRevision
        ? 'Curso creado y enviado a revisión. Administración deberá validarlo antes de publicarlo.'
        : 'Curso guardado como borrador.',
      curso: cursoCompleto
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al crear el curso.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const actualizarCursoInstructor = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idInstructor, idCurso } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const cursoActual = await obtenerDatosCursoInstructor(idCurso, idInstructor);

    if (!cursoActual) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para este instructor.'
      });
    }

    const {
      titulo,
      descripcion,
      precio_mxn,
      imagen_portada,
      id_nivel_curso,
      accion
    } = req.body;

    const errores = validarDatosCurso({ titulo, descripcion, precio_mxn, id_nivel_curso, imagen_portada });

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        message: errores.join(' ')
      });
    }

    const enviarRevision = accion === 'enviar_revision';

    if (enviarRevision) {
      const erroresRevision = await validarCursoListoParaRevision(idCurso);

      if (erroresRevision.length > 0) {
        return res.status(400).json({
          ok: false,
          message: erroresRevision.join(' ')
        });
      }
    }

    const idEstadoCurso = await obtenerIdEstadoCurso(enviarRevision ? 'pendiente_revision' : 'borrador');

    await cliente.query('BEGIN');

    await cliente.query(
      `UPDATE edutech.curso
       SET
        id_nivel_curso = $1,
        id_estado_curso = $2,
        titulo = $3,
        descripcion = $4,
        imagen_portada = $5,
        precio_mxn = $6,
        fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_curso = $7
        AND id_usuario = $8`,
      [
        Number(id_nivel_curso),
        idEstadoCurso,
        String(titulo).trim(),
        String(descripcion).trim(),
        imagen_portada ? String(imagen_portada).trim() : null,
        Number(String(precio_mxn).trim()),
        idCurso,
        idInstructor
      ]
    );

    if (enviarRevision) {
      await registrarRevisionPendiente(cliente, idCurso);
    }

    await cliente.query('COMMIT');

    const cursoCompleto = await obtenerDatosCursoInstructor(idCurso, idInstructor);

    res.json({
      ok: true,
      message: enviarRevision
        ? 'Curso actualizado y enviado a revisión. Administración deberá validarlo antes de publicarlo.'
        : 'Curso guardado como borrador.',
      curso: cursoCompleto
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al actualizar el curso.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};


const guardarModulosCursoInstructor = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idInstructor, idCurso } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const cursoActual = await obtenerDatosCursoInstructor(idCurso, idInstructor);

    if (!cursoActual) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para este instructor.'
      });
    }

    const { modulos } = req.body;
    const errores = validarModulosCurso(modulos);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        message: errores.join(' ')
      });
    }

    await cliente.query('BEGIN');

    for (const modulo of modulos) {
      await cliente.query(
        `INSERT INTO edutech.modulo
          (id_curso, titulo, numero_orden)
         VALUES
          ($1, $2, $3)
         ON CONFLICT (id_curso, numero_orden)
         DO UPDATE SET
          titulo = EXCLUDED.titulo`,
        [
          idCurso,
          String(modulo.titulo).trim(),
          Number(modulo.numero_orden)
        ]
      );
    }

    await cliente.query('COMMIT');

    const modulosResultado = await pool.query(
      `SELECT
        id_modulo,
        id_curso,
        titulo,
        numero_orden
       FROM edutech.modulo
       WHERE id_curso = $1
       ORDER BY numero_orden ASC`,
      [idCurso]
    );

    res.json({
      ok: true,
      message: 'Módulos guardados correctamente. Después continúa con las lecciones.',
      modulos: modulosResultado.rows
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al guardar módulos del curso.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};


const guardarLeccionesCursoInstructor = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { idInstructor, idCurso } = req.params;
    const validacion = await validarInstructor(idInstructor);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const cursoActual = await obtenerDatosCursoInstructor(idCurso, idInstructor);

    if (!cursoActual) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para este instructor.'
      });
    }

    const { lecciones } = req.body;
    const errores = validarLeccionesCurso(lecciones);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        message: errores.join(' ')
      });
    }

    const modulosResultado = await pool.query(
      `SELECT
        id_modulo,
        numero_orden
       FROM edutech.modulo
       WHERE id_curso = $1
       ORDER BY numero_orden`,
      [idCurso]
    );

    const mapaModulos = new Map(
      modulosResultado.rows.map((modulo) => [Number(modulo.numero_orden), Number(modulo.id_modulo)])
    );

    const moduloNoEncontrado = lecciones.find((leccion) => !mapaModulos.has(Number(leccion.modulo_numero_orden)));

    if (moduloNoEncontrado) {
      return res.status(400).json({
        ok: false,
        message: `No existe el módulo ${moduloNoEncontrado.modulo_numero_orden} para guardar sus lecciones.`
      });
    }

    await cliente.query('BEGIN');

    await cliente.query(
      `DELETE FROM edutech.leccion
       WHERE id_modulo IN (
        SELECT id_modulo
        FROM edutech.modulo
        WHERE id_curso = $1
       )`,
      [idCurso]
    );

    for (const leccion of lecciones) {
      const idModulo = mapaModulos.get(Number(leccion.modulo_numero_orden));
      const duracion = leccion.duracion_segundos === null || leccion.duracion_segundos === undefined || leccion.duracion_segundos === ''
        ? null
        : Number(leccion.duracion_segundos);

      const leccionResultado = await cliente.query(
        `INSERT INTO edutech.leccion
          (id_modulo, id_tipo_video, titulo, numero_orden, texto_descriptivo, url_video, duracion_segundos, esta_activa)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, TRUE)
         RETURNING id_leccion`,
        [
          idModulo,
          Number(leccion.id_tipo_video || 1),
          String(leccion.titulo).trim(),
          Number(leccion.numero_orden),
          String(leccion.texto_descriptivo || '').trim(),
          String(leccion.url_video).trim(),
          duracion
        ]
      );

      const idLeccion = leccionResultado.rows[0].id_leccion;
      const recursos = Array.isArray(leccion.recursos) ? leccion.recursos : [];

      for (const [indiceRecurso, recurso] of recursos.entries()) {
        const recursoResultado = await cliente.query(
          `INSERT INTO edutech.recurso
            (id_tipo_recurso, titulo, descripcion, url_recurso)
           VALUES
            ($1, $2, $3, $4)
           RETURNING id_recurso`,
          [
            Number(recurso.id_tipo_recurso || 2),
            String(recurso.titulo || '').trim(),
            recurso.descripcion ? String(recurso.descripcion).trim() : null,
            String(recurso.url_recurso || '').trim()
          ]
        );

        await cliente.query(
          `INSERT INTO edutech.leccion_recurso
            (id_leccion, id_recurso, numero_orden)
           VALUES
            ($1, $2, $3)`,
          [
            idLeccion,
            recursoResultado.rows[0].id_recurso,
            Number(recurso.numero_orden || indiceRecurso + 1)
          ]
        );
      }
    }

    await cliente.query('COMMIT');

    const leccionesResultado = await pool.query(
      `SELECT
        l.id_leccion,
        m.numero_orden AS modulo_numero_orden,
        l.id_modulo,
        l.id_tipo_video,
        l.titulo,
        l.numero_orden,
        l.texto_descriptivo,
        l.url_video,
        l.duracion_segundos,
        l.esta_activa
       FROM edutech.leccion l
       INNER JOIN edutech.modulo m
        ON m.id_modulo = l.id_modulo
       WHERE m.id_curso = $1
       ORDER BY m.numero_orden ASC, l.numero_orden ASC`,
      [idCurso]
    );

    const recursosGuardadosResultado = await pool.query(
      `SELECT
        lr.id_leccion,
        lr.numero_orden,
        r.id_recurso,
        r.id_tipo_recurso,
        tr.nombre_tipo_recurso,
        r.titulo,
        r.descripcion,
        r.url_recurso
       FROM edutech.leccion_recurso lr
       INNER JOIN edutech.recurso r
        ON r.id_recurso = lr.id_recurso
       INNER JOIN edutech.tipo_recurso tr
        ON tr.id_tipo_recurso = r.id_tipo_recurso
       WHERE lr.id_leccion = ANY($1::int[])
       ORDER BY lr.id_leccion ASC, lr.numero_orden ASC`,
      [leccionesResultado.rows.map((leccion) => leccion.id_leccion)]
    );

    const leccionesConRecursos = leccionesResultado.rows.map((leccion) => ({
      ...leccion,
      recursos: recursosGuardadosResultado.rows.filter((recurso) => Number(recurso.id_leccion) === Number(leccion.id_leccion))
    }));

    res.json({
      ok: true,
      message: 'Lecciones guardadas correctamente.',
      lecciones: leccionesConRecursos
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al guardar lecciones del curso.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

module.exports = {
  obtenerResumenInstructor,
  obtenerCatalogosCurso,
  obtenerCursoInstructor,
  subirPortadaCurso,
  crearCursoInstructor,
  actualizarCursoInstructor,
  guardarModulosCursoInstructor,
  guardarLeccionesCursoInstructor
};
