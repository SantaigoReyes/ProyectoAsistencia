// LoginModels.ts
import { Conexion } from "./Conexion.ts";

//Borrar esto lo tengo en el authControlelr o migrarlo
// Función para buscar un aprendiz por documento
export const getAprendizByDocumento = async (documento: string) => {
  const result = await Conexion.query(
    `SELECT idaprendiz AS id, nombres_aprendiz AS nombres, 'aprendiz' AS role, password_aprendiz AS password
     FROM edu_sena.aprendiz WHERE documento_aprendiz = ?`,
    [documento]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

// Función para buscar un funcionario por documento
export const getFuncionarioByDocumento = async (documento: string) => {
  const result = await Conexion.query(
    `SELECT f.idfuncionario AS id, f.nombres, GROUP_CONCAT(tf.tipo_funcionario) AS roles, f.password
     FROM edu_sena.funcionario f
     JOIN edu_sena.funcionario_has_tipo_funcionario ftf ON f.idfuncionario = ftf.funcionario_idfuncionario
     JOIN edu_sena.tipo_funcionario tf ON ftf.tipo_funcionario_idtipo_funcionario = tf.idtipo_funcionario
     WHERE f.documento = ?
     GROUP BY f.idfuncionario, f.nombres, f.password`,
    [documento]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};
