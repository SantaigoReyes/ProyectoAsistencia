//Ver si hay ficha
import { Conexion } from "./Conexion.ts";
interface datosAIF {
  idFuncionario: number;
  idFicha: number;
}
export const getFichasActiva = async () => {
  return await Conexion.query(
    "SELECT f.idficha, f.codigo_ficha, ef.estado_ficha FROM ficha AS f INNER JOIN estado_ficha AS ef ON f.estado_ficha_idestado_ficha = ef.idestado_ficha WHERE ef.estado_ficha IN ('Ejecución', 'Inducción');"
  );
};
//Ver instructores
export const getInstructores = async () => {
  return await Conexion.query(`SELECT 
  f.idfuncionario,
  f.documento,
  f.nombres,
  f.apellidos,
  f.email,
  f.telefono,
  tf.idtipo_funcionario,
  tf.tipo_funcionario
FROM funcionario f
INNER JOIN funcionario_has_tipo_funcionario fhtf 
  ON f.idfuncionario = fhtf.funcionario_idfuncionario
INNER JOIN tipo_funcionario tf 
  ON fhtf.tipo_funcionario_idtipo_funcionario = tf.idtipo_funcionario
  WHERE idtipo_funcionario =2;`);
};

export const asignarInstructoresAFicha = async (asignarAIF: datosAIF) => {
  try {
    console.log(" Insertando en la base de datos:", asignarAIF);
    const result = await Conexion.execute(
      `INSERT INTO funcionario_has_ficha (funcionario_idfuncionario, ficha_idficha)
        SELECT f.idfuncionario, ?
        FROM funcionario AS f
        JOIN funcionario_has_tipo_funcionario AS ftf 
          ON f.idfuncionario = ftf.funcionario_idfuncionario
        JOIN tipo_funcionario AS tf 
          ON ftf.tipo_funcionario_idtipo_funcionario = tf.idtipo_funcionario
        WHERE tf.tipo_funcionario = 'Instructor'
          AND f.idfuncionario = ?`,
      [asignarAIF.idFicha, asignarAIF.idFuncionario]
    );
    console.log("Resultado de la inserción:", result);
    return result;
  } catch (error) {
    return {
      success: false,
      msg: "Error en la base de datos",
      error,
    };
  }
};
