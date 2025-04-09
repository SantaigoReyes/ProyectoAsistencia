// asistenciaFiltroFP.ts
import { Conexion } from "./Conexion.ts";

export const asistenciaFiltroFP = async (body: {
  fechaInicio: string;
  fechaFin: string;
  idPrograma: number;
}) => {
  const { fechaInicio, fechaFin, idPrograma } = body;

  if (!fechaInicio || !fechaFin || !idPrograma) {
    throw new Error("Faltan campos: fechaInicio, fechaFin o idPrograma");
  }

  return await Conexion.query(
    `SELECT 
      a.idasistencia,
      a.fecha_asistencia,
      ta.nombre_tipo_asistencia,
      ap.nombres_aprendiz,
      ap.apellidos_aprendiz,
      f.codigo_ficha,
      p.nombre_programa
    FROM asistencia a
    JOIN tipo_asistencia ta ON a.tipo_asistencia_idtipo_asistencia = ta.idtipo_asistencia
    JOIN aprendiz ap ON a.aprendiz_idaprendiz = ap.idaprendiz
    JOIN ficha f ON ap.ficha_idficha = f.idficha
    JOIN programa p ON f.programa_idprograma = p.idprograma
    WHERE 
      a.fecha_asistencia BETWEEN ? AND ?
      AND p.idprograma = ?`,
    [fechaInicio, fechaFin, idPrograma]
  );
};
