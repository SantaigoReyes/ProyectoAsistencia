import { Conexion } from "./Conexion.ts";
import { z } from "../Dependencies/dependencies.ts";

export interface asistenciaData {
  idasistencia: number | null;
  fecha_asistencia: Date;
  aprendiz_idaprendiz: number;
  tipo_asistencia_idtipo_asistencia: number;
}

export const CrearAsistencia = async (asistencias: asistenciaData[]) => {
  try {
    for (const asistencia of asistencias) {
      const consulta = `
        INSERT INTO asistencia (fecha_asistencia, aprendiz_idaprendiz, tipo_asistencia_idtipo_asistencia)
        VALUES (?, ?, ?)`;

      await Conexion.execute(consulta, [
        asistencia.fecha_asistencia,
        asistencia.aprendiz_idaprendiz,
        asistencia.tipo_asistencia_idtipo_asistencia,
      ]);
    }

    return {
      success: true,
      msg: "Asistencias enviadas correctamente",
    };
  } catch (error) {
    console.error("Error al insertar asistencias:", error);
    return {
      success: false,
      msg: "Error al insertar asistencias",
    };
  }
};

export const ActualizarAsistencia = async (asistencia: asistenciaData) => {
  try {
    if (!asistencia.idasistencia) {
      return {
        success: false,
        msg: "El id de la asistencia es requerido para actualizar",
      };
    }

    const consulta = `UPDATE asistencia
      SET fecha_asistencia = ?, aprendiz_idaprendiz = ?, tipo_asistencia_idtipo_asistencia = ?
      WHERE idasistencia = ? `;

    await Conexion.execute(consulta, [
      asistencia.fecha_asistencia,
      asistencia.aprendiz_idaprendiz,
      asistencia.tipo_asistencia_idtipo_asistencia,
      asistencia.idasistencia,
    ]);
    return {
      success: true,
      msg: "Asistencia actualizada correctamente",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: error.message,
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor al actualizar la asistencia",
      };
    }
  }
};
