const pool = require('../config/db');

const obtenerIdAdmin = (req) => Number(req.query.idAdmin || req.query.id_admin || req.body.id_admin || req.body.idAdmin || 0);

const validarAdmin = async (idAdmin) => {
  if (!Number.isInteger(Number(idAdmin)) || Number(idAdmin) < 1) {
    return {
      ok: false,
      status: 401,
      message: 'No se recibió un administrador válido.'
    };
  }

  const resultado = await pool.query(
    `SELECT
      u.id_usuario,
      u.id_rol,
      r.nombre_rol,
      u.esta_activo
     FROM edutech.usuario u
     INNER JOIN edutech.rol r
      ON r.id_rol = u.id_rol
     WHERE u.id_usuario = $1`,
    [idAdmin]
  );

  if (resultado.rows.length === 0) {
    return {
      ok: false,
      status: 404,
      message: 'Administrador no encontrado.'
    };
  }

  const admin = resultado.rows[0];

  if (!admin.esta_activo) {
    return {
      ok: false,
      status: 403,
      message: 'El administrador está inactivo.'
    };
  }

  if (String(admin.nombre_rol || '').toLowerCase() !== 'administrador') {
    return {
      ok: false,
      status: 403,
      message: 'No tienes permisos de administrador.'
    };
  }

  return {
    ok: true,
    admin
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

const listarUsuariosAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const rolesResultado = await pool.query(
      `SELECT
        id_rol,
        nombre_rol
       FROM edutech.rol
       ORDER BY id_rol ASC`
    );

    const usuariosResultado = await pool.query(
      `SELECT
        u.id_usuario,
        u.id_rol,
        r.nombre_rol,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.telefono,
        u.esta_activo,
        u.fecha_registro,
        u.fecha_actualizacion
       FROM edutech.usuario u
       INNER JOIN edutech.rol r
        ON r.id_rol = u.id_rol
       ORDER BY u.id_usuario ASC`
    );

    res.json({
      ok: true,
      roles: rolesResultado.rows,
      usuarios: usuariosResultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar usuarios.',
      error: error.message
    });
  }
};

const cambiarRolUsuarioAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const idUsuario = Number(req.params.idUsuario);
    const idRol = Number(req.body.id_rol || req.body.idRol);

    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    if (!Number.isInteger(idUsuario) || idUsuario < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario inválido.'
      });
    }

    if (Number(idAdmin) === Number(idUsuario)) {
      return res.status(400).json({
        ok: false,
        message: 'No puedes cambiar tu propio rol desde este panel.'
      });
    }

    if (!Number.isInteger(idRol) || idRol < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Rol inválido.'
      });
    }

    const rolResultado = await pool.query(
      `SELECT
        id_rol,
        nombre_rol
       FROM edutech.rol
       WHERE id_rol = $1`,
      [idRol]
    );

    if (rolResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'El rol seleccionado no existe.'
      });
    }

    const usuarioResultado = await pool.query(
      `SELECT
        id_usuario,
        id_rol,
        correo
       FROM edutech.usuario
       WHERE id_usuario = $1`,
      [idUsuario]
    );

    if (usuarioResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.'
      });
    }

    const actualizado = await pool.query(
      `UPDATE edutech.usuario
       SET
        id_rol = $1,
        fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_usuario = $2
       RETURNING
        id_usuario,
        id_rol,
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        esta_activo,
        fecha_registro,
        fecha_actualizacion`,
      [idRol, idUsuario]
    );

    const usuario = {
      ...actualizado.rows[0],
      nombre_rol: rolResultado.rows[0].nombre_rol
    };

    res.json({
      ok: true,
      message: `Rol actualizado a ${rolResultado.rows[0].nombre_rol}.`,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cambiar el rol del usuario.',
      error: error.message
    });
  }
};

const listarCursosRevisionAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const cursosResultado = await pool.query(
      `SELECT
        c.id_curso,
        c.id_usuario AS id_instructor,
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
        u.nombre AS instructor_nombre,
        u.apellido_paterno AS instructor_apellido_paterno,
        u.apellido_materno AS instructor_apellido_materno,
        u.correo AS instructor_correo,

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
       INNER JOIN edutech.usuario u
        ON u.id_usuario = c.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON nc.id_nivel_curso = c.id_nivel_curso
       INNER JOIN edutech.estado_curso ec
        ON ec.id_estado_curso = c.id_estado_curso
       WHERE LOWER(ec.nombre_estado_curso) = LOWER('pendiente_revision')
        OR EXISTS (
          SELECT 1
          FROM edutech.revision_curso rc
          WHERE rc.id_curso = c.id_curso
        )
       ORDER BY
        CASE WHEN LOWER(ec.nombre_estado_curso) = LOWER('pendiente_revision') THEN 0 ELSE 1 END,
        c.fecha_actualizacion DESC,
        c.id_curso DESC`
    );

    const cursos = cursosResultado.rows;
    const idsCursos = cursos.map((curso) => curso.id_curso);

    let modulosPorCurso = new Map();

    if (idsCursos.length > 0) {
      const modulosResultado = await pool.query(
        `SELECT
          m.id_curso,
          json_agg(
            json_build_object(
              'id_modulo', m.id_modulo,
              'titulo', m.titulo,
              'numero_orden', m.numero_orden,
              'lecciones', COALESCE((
                SELECT json_agg(
                  json_build_object(
                    'id_leccion', l.id_leccion,
                    'titulo', l.titulo,
                    'numero_orden', l.numero_orden,
                    'url_video', l.url_video,
                    'duracion_segundos', l.duracion_segundos
                  )
                  ORDER BY l.numero_orden ASC, l.id_leccion ASC
                )
                FROM edutech.leccion l
                WHERE l.id_modulo = m.id_modulo
                  AND l.esta_activa = TRUE
              ), '[]'::json)
            )
            ORDER BY m.numero_orden ASC, m.id_modulo ASC
          ) AS modulos
         FROM edutech.modulo m
         WHERE m.id_curso = ANY($1::int[])
         GROUP BY m.id_curso`,
        [idsCursos]
      );

      modulosPorCurso = new Map(
        modulosResultado.rows.map((fila) => [Number(fila.id_curso), fila.modulos || []])
      );
    }

    res.json({
      ok: true,
      cursos: cursos.map((curso) => ({
        ...curso,
        modulos: modulosPorCurso.get(Number(curso.id_curso)) || []
      }))
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar cursos por revisar.',
      error: error.message
    });
  }
};

const revisarCursoAdmin = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const idAdmin = obtenerIdAdmin(req);
    const idCurso = Number(req.params.idCurso);
    const accion = String(req.body.accion || '').trim().toLowerCase();
    const comentario = String(req.body.comentario || '').trim();

    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    if (!Number.isInteger(idCurso) || idCurso < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Curso inválido.'
      });
    }

    if (!['aprobar', 'rechazar'].includes(accion)) {
      return res.status(400).json({
        ok: false,
        message: 'Acción de revisión inválida.'
      });
    }

    if (accion === 'rechazar' && comentario.length < 5) {
      return res.status(400).json({
        ok: false,
        message: 'Para rechazar el curso escribe un motivo claro.'
      });
    }

    await cliente.query('BEGIN');

    const cursoResultado = await cliente.query(
      `SELECT
        id_curso,
        titulo
       FROM edutech.curso
       WHERE id_curso = $1
       FOR UPDATE`,
      [idCurso]
    );

    if (cursoResultado.rows.length === 0) {
      await cliente.query('ROLLBACK');

      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado.'
      });
    }

    const aprobar = accion === 'aprobar';
    const idEstadoCurso = await obtenerIdEstadoCurso(aprobar ? 'publicado' : 'no_publicado');
    const idEstadoRevision = await obtenerIdEstadoRevision(aprobar ? 'aprobada' : 'rechazada');
    const comentarioFinal = comentario || (aprobar
      ? 'Curso aprobado por el administrador.'
      : 'Curso rechazado por el administrador.');

    await cliente.query(
      `UPDATE edutech.curso
       SET
        id_estado_curso = $1,
        fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_curso = $2`,
      [idEstadoCurso, idCurso]
    );

    await cliente.query(
      `INSERT INTO edutech.revision_curso
        (id_curso, id_estado_revision_curso, id_usuario_revisor, comentario)
       VALUES
        ($1, $2, $3, $4)`,
      [idCurso, idEstadoRevision, idAdmin, comentarioFinal]
    );

    await cliente.query('COMMIT');

    res.json({
      ok: true,
      message: aprobar
        ? 'Curso aprobado y publicado correctamente.'
        : 'Curso rechazado correctamente.'
    });
  } catch (error) {
    await cliente.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      message: 'Error al revisar el curso.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const obtenerCursoPreviewAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const idCurso = Number(req.params.idCurso);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    if (!Number.isInteger(idCurso) || idCurso < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Curso inválido.'
      });
    }

    const cursoResultado = await pool.query(
      `SELECT
        c.id_curso,
        c.id_usuario AS id_instructor,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        c.precio_mxn,
        c.fecha_creacion,
        c.fecha_actualizacion,
        nc.nombre_nivel,
        ec.nombre_estado_curso,
        u.nombre AS instructor_nombre,
        u.apellido_paterno AS instructor_apellido_paterno,
        u.apellido_materno AS instructor_apellido_materno,
        u.correo AS instructor_correo,
        COALESCE((
          SELECT json_agg(cat.nombre_categoria ORDER BY cat.nombre_categoria)
          FROM edutech.curso_categoria cc
          INNER JOIN edutech.categoria cat
            ON cat.id_categoria = cc.id_categoria
          WHERE cc.id_curso = c.id_curso
        ), '[]'::json) AS categorias
       FROM edutech.curso c
       INNER JOIN edutech.usuario u
        ON u.id_usuario = c.id_usuario
       INNER JOIN edutech.nivel_curso nc
        ON nc.id_nivel_curso = c.id_nivel_curso
       INNER JOIN edutech.estado_curso ec
        ON ec.id_estado_curso = c.id_estado_curso
       WHERE c.id_curso = $1`,
      [idCurso]
    );

    if (cursoResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado.'
      });
    }

    const modulosResultado = await pool.query(
      `SELECT
        m.id_modulo,
        m.id_curso,
        m.titulo,
        m.numero_orden
       FROM edutech.modulo m
       WHERE m.id_curso = $1
       ORDER BY m.numero_orden ASC, m.id_modulo ASC`,
      [idCurso]
    );

    const idsModulos = modulosResultado.rows.map((modulo) => modulo.id_modulo);
    let lecciones = [];

    if (idsModulos.length > 0) {
      const leccionesResultado = await pool.query(
        `SELECT
          l.id_leccion,
          l.id_modulo,
          l.id_tipo_video,
          tv.nombre_tipo_video,
          l.titulo,
          l.numero_orden,
          l.texto_descriptivo,
          l.url_video,
          l.duracion_segundos,
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id_recurso', r.id_recurso,
                'titulo', r.titulo,
                'descripcion', r.descripcion,
                'url_recurso', r.url_recurso,
                'nombre_tipo_recurso', tr.nombre_tipo_recurso,
                'numero_orden', lr.numero_orden
              )
              ORDER BY lr.numero_orden ASC, r.id_recurso ASC
            )
            FROM edutech.leccion_recurso lr
            INNER JOIN edutech.recurso r
              ON r.id_recurso = lr.id_recurso
            INNER JOIN edutech.tipo_recurso tr
              ON tr.id_tipo_recurso = r.id_tipo_recurso
            WHERE lr.id_leccion = l.id_leccion
          ), '[]'::json) AS recursos
         FROM edutech.leccion l
         INNER JOIN edutech.tipo_video tv
          ON tv.id_tipo_video = l.id_tipo_video
         WHERE l.id_modulo = ANY($1::int[])
          AND l.esta_activa = TRUE
         ORDER BY l.numero_orden ASC, l.id_leccion ASC`,
        [idsModulos]
      );

      lecciones = leccionesResultado.rows;
    }

    const leccionesPorModulo = new Map();

    lecciones.forEach((leccion) => {
      const idModulo = Number(leccion.id_modulo);

      if (!leccionesPorModulo.has(idModulo)) {
        leccionesPorModulo.set(idModulo, []);
      }

      leccionesPorModulo.get(idModulo).push(leccion);
    });

    const modulos = modulosResultado.rows.map((modulo) => ({
      ...modulo,
      lecciones: leccionesPorModulo.get(Number(modulo.id_modulo)) || []
    }));

    const curso = {
      ...cursoResultado.rows[0],
      modulos,
      total_modulos: modulos.length,
      total_lecciones: lecciones.length,
      total_recursos: lecciones.reduce((total, leccion) => total + (Array.isArray(leccion.recursos) ? leccion.recursos.length : 0), 0)
    };

    res.json({
      ok: true,
      curso
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar vista previa del curso.',
      error: error.message
    });
  }
};


const obtenerExamenPreviewAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const idCurso = Number(req.params.idCurso);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    if (!Number.isInteger(idCurso) || idCurso < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Curso inválido.'
      });
    }

    const examenResultado = await pool.query(
      `SELECT
        e.id_examen,
        e.id_curso,
        e.titulo,
        e.descripcion,
        e.tiempo_limite_minutos,
        e.max_intentos,
        e.calificacion_minima,
        e.cantidad_preguntas,
        ee.nombre_estado_examen
       FROM edutech.examen e
       INNER JOIN edutech.estado_examen ee
        ON ee.id_estado_examen = e.id_estado_examen
       WHERE e.id_curso = $1
       ORDER BY
        CASE WHEN LOWER(ee.nombre_estado_examen) = LOWER('activo') THEN 0 ELSE 1 END,
        e.id_examen DESC
       LIMIT 1`,
      [idCurso]
    );

    if (examenResultado.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Este curso todavía no tiene examen configurado.'
      });
    }

    const examen = examenResultado.rows[0];

    const preguntasResultado = await pool.query(
      `SELECT
        p.id_pregunta,
        p.texto_pregunta,
        p.esta_activa,
        COALESCE(
          json_agg(
            json_build_object(
              'id_opcion', o.id_opcion,
              'texto_opcion', o.texto_opcion,
              'es_correcta', o.es_correcta
            )
            ORDER BY o.id_opcion ASC
          ) FILTER (WHERE o.id_opcion IS NOT NULL),
          '[]'
        ) AS opciones
       FROM edutech.pregunta p
       LEFT JOIN edutech.opcion_respuesta o
        ON o.id_pregunta = p.id_pregunta
       WHERE p.id_examen = $1
        AND p.esta_activa = TRUE
       GROUP BY p.id_pregunta, p.texto_pregunta, p.esta_activa
       ORDER BY p.id_pregunta ASC`,
      [examen.id_examen]
    );

    res.json({
      ok: true,
      examen: {
        ...examen,
        modo_preview_admin: true,
        guarda_calificacion: false,
        usa_temporizador: false,
        preguntas: preguntasResultado.rows
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar examen de vista previa.',
      error: error.message
    });
  }
};


const obtenerIdEstadoSolicitudInstructor = async (nombreEstado, cliente = pool) => {
  const resultado = await cliente.query(
    `SELECT id_estado_solicitud_instructor
     FROM edutech.estado_solicitud_instructor
     WHERE LOWER(nombre_estado_solicitud) = LOWER($1)`,
    [nombreEstado]
  );

  if (resultado.rows.length === 0) {
    throw new Error(`No existe el estado de solicitud de instructor: ${nombreEstado}.`);
  }

  return resultado.rows[0].id_estado_solicitud_instructor;
};

const crearSolicitudInstructor = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const idUsuario = Number(req.body.id_usuario || req.body.idUsuario || req.headers['x-edutech-user-id'] || 0);
    const areaExperiencia = String(req.body.area_experiencia || req.body.areaExperiencia || '').trim();
    const experiencia = String(req.body.experiencia || '').trim();
    const evidencia = String(req.body.evidencia || req.body.evidencia_url || req.body.evidenciaUrl || '').trim();
    const motivo = String(req.body.motivo || '').trim();

    if (!Number.isInteger(idUsuario) || idUsuario < 1) {
      return res.status(401).json({
        ok: false,
        message: 'Inicia sesión para enviar la solicitud de instructor.'
      });
    }

    if (areaExperiencia.length < 3 || areaExperiencia.length > 60) {
      return res.status(400).json({
        ok: false,
        message: 'El área de experiencia debe tener entre 3 y 60 caracteres.'
      });
    }

    if (experiencia.length < 10 || experiencia.length > 500) {
      return res.status(400).json({
        ok: false,
        message: 'La experiencia debe tener entre 10 y 500 caracteres.'
      });
    }

    if (evidencia.length > 200 || !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(evidencia)) {
      return res.status(400).json({
        ok: false,
        message: 'Agrega un enlace válido como evidencia, de máximo 200 caracteres.'
      });
    }

    if (motivo.length < 10 || motivo.length > 300) {
      return res.status(400).json({
        ok: false,
        message: 'El motivo de solicitud debe tener entre 10 y 300 caracteres.'
      });
    }

    await cliente.query('BEGIN');

    const usuarioResultado = await cliente.query(
      `SELECT
        u.id_usuario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.esta_activo,
        r.nombre_rol
       FROM edutech.usuario u
       INNER JOIN edutech.rol r
        ON r.id_rol = u.id_rol
       WHERE u.id_usuario = $1
       FOR UPDATE`,
      [idUsuario]
    );

    if (usuarioResultado.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.'
      });
    }

    const usuario = usuarioResultado.rows[0];

    if (!usuario.esta_activo) {
      await cliente.query('ROLLBACK');
      return res.status(403).json({
        ok: false,
        message: 'Tu cuenta está inactiva.'
      });
    }

    if (String(usuario.nombre_rol || '').toLowerCase() === 'instructor') {
      await cliente.query('ROLLBACK');
      return res.status(400).json({
        ok: false,
        message: 'Tu cuenta ya tiene permisos de instructor.'
      });
    }

    if (String(usuario.nombre_rol || '').toLowerCase() === 'administrador') {
      await cliente.query('ROLLBACK');
      return res.status(400).json({
        ok: false,
        message: 'Una cuenta administradora no necesita solicitud de instructor.'
      });
    }

    const pendienteResultado = await cliente.query(
      `SELECT si.id_solicitud_instructor
       FROM edutech.solicitud_instructor si
       INNER JOIN edutech.estado_solicitud_instructor esi
        ON esi.id_estado_solicitud_instructor = si.id_estado_solicitud_instructor
       WHERE si.id_usuario_solicitante = $1
        AND LOWER(esi.nombre_estado_solicitud) = LOWER('pendiente')
       LIMIT 1`,
      [idUsuario]
    );

    if (pendienteResultado.rows.length > 0) {
      await cliente.query('ROLLBACK');
      return res.status(409).json({
        ok: false,
        message: 'Ya tienes una solicitud pendiente. Espera a que el administrador la revise.'
      });
    }

    const idEstadoPendiente = await obtenerIdEstadoSolicitudInstructor('pendiente', cliente);

    const solicitudResultado = await cliente.query(
      `INSERT INTO edutech.solicitud_instructor
        (id_usuario_solicitante, id_estado_solicitud_instructor, area_experiencia, experiencia, evidencia_url, motivo)
       VALUES
        ($1, $2, $3, $4, $5, $6)
       RETURNING
        id_solicitud_instructor,
        id_usuario_solicitante,
        id_estado_solicitud_instructor,
        area_experiencia,
        experiencia,
        evidencia_url,
        motivo,
        fecha_solicitud`,
      [idUsuario, idEstadoPendiente, areaExperiencia, experiencia, evidencia, motivo]
    );

    await cliente.query('COMMIT');

    res.status(201).json({
      ok: true,
      message: 'Solicitud enviada correctamente. El administrador revisará tu cuenta.',
      solicitud: {
        ...solicitudResultado.rows[0],
        nombre_estado_solicitud: 'pendiente',
        usuario
      }
    });
  } catch (error) {
    await cliente.query('ROLLBACK');
    res.status(500).json({
      ok: false,
      message: 'Error al enviar la solicitud de instructor.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const listarSolicitudesInstructorAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const resultado = await pool.query(
      `SELECT
        si.id_solicitud_instructor,
        si.id_usuario_solicitante,
        si.id_usuario_revisor,
        si.id_estado_solicitud_instructor,
        esi.nombre_estado_solicitud,
        si.area_experiencia,
        si.experiencia,
        si.evidencia_url,
        si.motivo,
        si.comentario_revision,
        si.fecha_solicitud,
        si.fecha_revision,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        r.nombre_rol,
        revisor.nombre AS revisor_nombre,
        revisor.apellido_paterno AS revisor_apellido_paterno,
        revisor.correo AS revisor_correo
       FROM edutech.solicitud_instructor si
       INNER JOIN edutech.estado_solicitud_instructor esi
        ON esi.id_estado_solicitud_instructor = si.id_estado_solicitud_instructor
       INNER JOIN edutech.usuario u
        ON u.id_usuario = si.id_usuario_solicitante
       INNER JOIN edutech.rol r
        ON r.id_rol = u.id_rol
       LEFT JOIN edutech.usuario revisor
        ON revisor.id_usuario = si.id_usuario_revisor
       ORDER BY
        CASE WHEN LOWER(esi.nombre_estado_solicitud) = LOWER('pendiente') THEN 0 ELSE 1 END,
        si.fecha_solicitud DESC,
        si.id_solicitud_instructor DESC`
    );

    res.json({
      ok: true,
      solicitudes: resultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar solicitudes de instructor.',
      error: error.message
    });
  }
};

const revisarSolicitudInstructorAdmin = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const idAdmin = obtenerIdAdmin(req);
    const idSolicitud = Number(req.params.idSolicitud);
    const accion = String(req.body.accion || '').trim().toLowerCase();
    const comentario = String(req.body.comentario || '').trim();

    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    if (!Number.isInteger(idSolicitud) || idSolicitud < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Solicitud inválida.'
      });
    }

    if (!['aceptar', 'rechazar'].includes(accion)) {
      return res.status(400).json({
        ok: false,
        message: 'Acción de solicitud inválida.'
      });
    }

    if (accion === 'rechazar' && comentario.length < 5) {
      return res.status(400).json({
        ok: false,
        message: 'Para rechazar la solicitud escribe un motivo de al menos 5 caracteres.'
      });
    }

    await cliente.query('BEGIN');

    const solicitudResultado = await cliente.query(
      `SELECT
        si.id_solicitud_instructor,
        si.id_usuario_solicitante,
        esi.nombre_estado_solicitud
       FROM edutech.solicitud_instructor si
       INNER JOIN edutech.estado_solicitud_instructor esi
        ON esi.id_estado_solicitud_instructor = si.id_estado_solicitud_instructor
       WHERE si.id_solicitud_instructor = $1
       FOR UPDATE`,
      [idSolicitud]
    );

    if (solicitudResultado.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        message: 'Solicitud no encontrada.'
      });
    }

    const solicitud = solicitudResultado.rows[0];

    if (String(solicitud.nombre_estado_solicitud || '').toLowerCase() !== 'pendiente') {
      await cliente.query('ROLLBACK');
      return res.status(400).json({
        ok: false,
        message: 'Esta solicitud ya fue revisada.'
      });
    }

    const aceptar = accion === 'aceptar';
    const idEstadoSolicitud = await obtenerIdEstadoSolicitudInstructor(aceptar ? 'aceptada' : 'rechazada', cliente);
    const comentarioFinal = comentario || (aceptar
      ? 'Solicitud aceptada. La cuenta ahora tiene rol de instructor.'
      : 'Solicitud rechazada por el administrador.');

    await cliente.query(
      `UPDATE edutech.solicitud_instructor
       SET
        id_estado_solicitud_instructor = $1,
        id_usuario_revisor = $2,
        comentario_revision = $3,
        fecha_revision = CURRENT_TIMESTAMP
       WHERE id_solicitud_instructor = $4`,
      [idEstadoSolicitud, idAdmin, comentarioFinal, idSolicitud]
    );

    if (aceptar) {
      const rolInstructorResultado = await cliente.query(
        `SELECT id_rol
         FROM edutech.rol
         WHERE LOWER(nombre_rol) = LOWER('Instructor')`
      );

      if (rolInstructorResultado.rows.length === 0) {
        throw new Error('No existe el rol Instructor.');
      }

      await cliente.query(
        `UPDATE edutech.usuario
         SET
          id_rol = $1,
          fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id_usuario = $2`,
        [rolInstructorResultado.rows[0].id_rol, solicitud.id_usuario_solicitante]
      );
    }

    await cliente.query('COMMIT');

    res.json({
      ok: true,
      message: aceptar
        ? 'Solicitud aceptada. El alumno ahora es instructor.'
        : 'Solicitud rechazada correctamente.'
    });
  } catch (error) {
    await cliente.query('ROLLBACK');
    res.status(500).json({
      ok: false,
      message: 'Error al revisar la solicitud de instructor.',
      error: error.message
    });
  } finally {
    cliente.release();
  }
};

const listarPagosAdmin = async (req, res) => {
  try {
    const idAdmin = obtenerIdAdmin(req);
    const validacion = await validarAdmin(idAdmin);

    if (!validacion.ok) {
      return res.status(validacion.status).json({
        ok: false,
        message: validacion.message
      });
    }

    const resultado = await pool.query(
      `SELECT
        p.id_pago,
        p.id_orden,
        p.id_pago_externo,
        p.monto_pagado,
        p.fecha_pago,
        pp.nombre_proveedor,
        ep.nombre_estado_pago,
        o.numero_orden,
        o.total,
        eo.nombre_estado_orden,
        u.id_usuario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        COALESCE((
          SELECT json_agg(
            json_build_object(
              'id_curso', c.id_curso,
              'titulo', c.titulo,
              'precio_unitario', od.precio_unitario,
              'id_inscripcion', i.id_inscripcion
            )
            ORDER BY c.titulo ASC
          )
          FROM edutech.orden_detalle od
          INNER JOIN edutech.curso c
            ON c.id_curso = od.id_curso
          LEFT JOIN edutech.inscripcion i
            ON i.id_orden_detalle = od.id_orden_detalle
          WHERE od.id_orden = o.id_orden
        ), '[]'::json) AS cursos
       FROM edutech.pago p
       INNER JOIN edutech.proveedor_pago pp
        ON pp.id_proveedor_pago = p.id_proveedor_pago
       INNER JOIN edutech.estado_pago ep
        ON ep.id_estado_pago = p.id_estado_pago
       INNER JOIN edutech.orden o
        ON o.id_orden = p.id_orden
       INNER JOIN edutech.estado_orden eo
        ON eo.id_estado_orden = o.id_estado_orden
       INNER JOIN edutech.usuario u
        ON u.id_usuario = o.id_usuario
       ORDER BY p.fecha_pago DESC, p.id_pago DESC
       LIMIT 80`
    );

    res.json({
      ok: true,
      pagos: resultado.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar pagos.',
      error: error.message
    });
  }
};


module.exports = {
  listarUsuariosAdmin,
  cambiarRolUsuarioAdmin,
  listarCursosRevisionAdmin,
  revisarCursoAdmin,
  obtenerCursoPreviewAdmin,
  obtenerExamenPreviewAdmin,
  crearSolicitudInstructor,
  listarSolicitudesInstructorAdmin,
  revisarSolicitudInstructorAdmin,
  listarPagosAdmin
};
