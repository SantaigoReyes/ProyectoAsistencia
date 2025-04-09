import { Conexion } from "./Conexion.ts";
//CRUDS PARA PROGRAMA
interface DataAdmin {
  idPrograma?: number;
  codigoPrograma: number; // cambiado a number para que coincida con el uso en addProgram
  nombrePrograma: string;
}

export const addProgram = async (programa: DataAdmin) => {
  try {
    console.log(" Insertando en la base de datos:", programa);

    const result = await Conexion.execute(
      "INSERT INTO programa (codigo_programa, nombre_programa) VALUES (?, ?);",
      [programa.codigoPrograma, programa.nombrePrograma]
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

export const viewProgram = async () => {
  return await Conexion.query("SELECT * FROM programa");
};
export const updateProgram = async (id: string, program: DataAdmin) => {
  const { codigoPrograma, nombrePrograma } = program;
  try {
    const result = await Conexion.execute(
      "UPDATE programa SET codigo_programa = ?, nombre_programa = ? WHERE idPrograma = ?",
      [codigoPrograma, nombrePrograma, id]
    );
    return result;
  } catch (error) {
    throw new Error("Error al actualizar el programa: " + error);
  }
};

export const deleteProgram = async (id: string) => {
  try {
    const result = await Conexion.execute(
      "DELETE FROM programa WHERE idPrograma = ?;",
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error);
  }
};
//CRUDS PARA MI APRENDIZ
interface Aprendiz {
  documento_aprendiz: string;
  nombre_aprendiz: string;
  apellido_aprendiz: string;
  telefono_aprendiz: string;
  email_aprendiz: string;
  password_aprendiz: string;
  ficha_idFicha: number;
  estado_aprendiz_idEstado_aprendiz: number;
  tipo_documento_idTipo_documento: number;
}
export const updateAprendiz = async (id: string, aprendiz: Aprendiz) => {
  const {
    nombre_aprendiz,
    apellido_aprendiz,
    telefono_aprendiz,
    email_aprendiz,
    password_aprendiz,
    ficha_idFicha,
    estado_aprendiz_idEstado_aprendiz,
    tipo_documento_idTipo_documento,
  } = aprendiz;

  try {
    const result = await Conexion.execute(
      `UPDATE aprendiz 
       SET 
         nombres_aprendiz = ?, 
         apellidos_aprendiz = ?, 
         telefono_aprendiz = ?, 
         email_aprendiz = ?, 
         password_aprendiz = ?, 
         ficha_idficha = ?, 
         estado_aprendiz_idestado_aprendiz = ?, 
         tipo_documento_idtipo_documento = ?
       WHERE idAprendiz = ?;`,
      [
        nombre_aprendiz, // Para nombres_aprendiz
        apellido_aprendiz, // Para apellidos_aprendiz
        telefono_aprendiz, // Para telefono_aprendiz
        email_aprendiz, // Para email_aprendiz
        password_aprendiz, // Para password_aprendiz
        ficha_idFicha, // Para ficha_idficha
        estado_aprendiz_idEstado_aprendiz, // Para estado_aprendiz_idestado_aprendiz
        tipo_documento_idTipo_documento, // Para tipo_documento_idtipo_documento
        id, // Valor de WHERE: documento_aprendiz
      ]
    );
    return { success: true, msg: "Aprendiz actualizado correctamente", result };
  } catch (error) {
    console.error("Error al actualizar aprendiz:", error);
    return {
      success: false,
      msg: "Error en la base de datos",
    };
  }
};

export const addAprendiz = async (aprendiz: Aprendiz) => {
  try {
    const result = await Conexion.execute(
      "INSERT INTO aprendiz (documento_aprendiz, nombres_aprendiz, apellidos_aprendiz, telefono_aprendiz, email_aprendiz, password_aprendiz, ficha_idficha, estado_aprendiz_idestado_aprendiz, tipo_documento_idtipo_documento)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [
        aprendiz.documento_aprendiz,
        aprendiz.nombre_aprendiz,
        aprendiz.apellido_aprendiz,
        aprendiz.telefono_aprendiz,
        aprendiz.email_aprendiz,
        aprendiz.password_aprendiz,
        aprendiz.ficha_idFicha,
        aprendiz.estado_aprendiz_idEstado_aprendiz,
        aprendiz.tipo_documento_idTipo_documento,
      ]
    );
    return result;
  } catch (error) {
    return {
      success: false,
      msg: "Error en la base de datos",
      error,
    };
  }
};
export const viewAprendiz = async () => {
  return await Conexion.query("SELECT * FROM  aprendiz");
};
export const deleteAprendiz = async (id: string) => {
  try {
    const result = await Conexion.execute(
      "DELETE FROM aprendiz WHERE idAprendiz = ?;",
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error);
  }
};
