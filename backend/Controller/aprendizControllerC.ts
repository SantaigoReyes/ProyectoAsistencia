// deno-lint-ignore-file no-explicit-any
import { Conexion } from "../Models/Conexion.ts";

export const getPanelAprendiz = async (ctx: any) => {
  // Extraer el ID del aprendiz del token (ya verificado por authMiddleware)
  const aprendizId = ctx.state.user.id;

  // Ejecutar la consulta en la BD. Ajusta el nombre de la columna de fecha según tu BD
  const result = await Conexion.query(
    `
    SELECT 
      a.idasistencia, 
      a.fecha_asistencia AS fecha_asistencia, 
      ta.nombre_tipo_asistencia 
    FROM ASISTENCIA a
    JOIN TIPO_ASISTENCIA ta ON a.tipo_asistencia_idtipo_asistencia = ta.idtipo_asistencia
    WHERE a.aprendiz_idaprendiz = ?
    ORDER BY a.fecha_asistencia DESC
  `,
    [aprendizId]
  );

  if (result.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { msg: "No hay asistencias registradas" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { historial: result };
};
