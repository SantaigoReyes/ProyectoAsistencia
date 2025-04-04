import { Conexion } from "./Conexion.ts";

export const tiposAsistencia = async () => {
  return await Conexion.query(
    "SELECT idtipo_asistencia, nombre_tipo_asistencia FROM tipo_asistencia;"
  );
};
interface dataAsistencia {
  idaprendiz: number;
  tipoAsistencia_idTipoAsistencia: number;
  fechaAsistencia: string;
}
export const insertarAsistencia = async (asistencia: dataAsistencia) => {
  try {
    console.log("Insertando en la base de datos ");
    const result = await Conexion.execute(
      "INSERT INTO asistencia ( aprendiz_idaprendiz,tipo_asistencia_idtipo_asistencia,fecha_asistencia)VALUES (?, ?, ?, ?);",
      [
        asistencia.idaprendiz,
        asistencia.tipoAsistencia_idTipoAsistencia,
        asistencia.fechaAsistencia,
      ]
    );
    console.log("Resultado de la inserción:", result);
  } catch (error) {
    return {
      success: false,
      msg: "Error en la base de datos",
      error,
    };
  }
};
export const asistenciaAprendizYFicha = async (idAprendiz: number) => {
  return await Conexion.query(
    `SELECT 
      ap.nombres_aprendiz,
      ap.apellidos_aprendiz,
      ap.documento_aprendiz,
      ap.email_aprendiz,
      f.codigo_ficha,
      asis.fecha_asistencia,
      tas.nombre_tipo_asistencia
    FROM asistencia AS asis
    JOIN aprendiz AS ap ON asis.aprendiz_idaprendiz = ap.idaprendiz
    JOIN ficha AS f ON ap.ficha_idficha = f.idficha
    JOIN tipo_asistencia AS tas ON asis.tipo_asistencia_idtipo_asistencia = tas.idtipo_asistencia
    WHERE ap.idaprendiz = ?;`,
    [idAprendiz] // Se pasa el parámetro correctamente
  );
};
