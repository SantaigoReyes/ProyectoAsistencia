// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Conexion } from "./Conexion.ts";

import { Data } from "https://deno.land/x/oak@v17.1.4/types.ts";
import { z } from "../Dependencies/dependencies.ts";
interface FichaData {
  idficha: number | null;
  codiggo_ficha: string;
  fecha_inicio: Data;

  programa_idprograma: number;
  nombre_programa: string;

  estado_ficha_idestado_ficha: number;
  estado_ficha: string;
}

export const ListaFicha = async () => {
  try {
    const { rows: fichas } = await Conexion.execute(
      `SELECT 
                f.idficha,
                f.codigo_ficha,
                f.fecha_inicio,
                p.nombre_programa,
                e.estado_ficha
            FROM ficha f
                JOIN programa p ON f.programa_idprograma = p.idprograma
                JOIN estado_ficha e ON f.estado_ficha_idestado_ficha = e.idestado_ficha; 
            `
    );
    console.log("lista de las fichas:", fichas);

    return {
      success: true,
      data: fichas as FichaData[],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

export const CrearFicha = async (ficha: FichaData) => {
  try {
    const consulta = `
        INSERT INTO ficha (codigo_ficha, fecha_inicio, programa_idprograma, estado_ficha_idestado_ficha)
        VALUES (?, ?, ?, ?)      
        `;
    await Conexion.execute(consulta, [
      ficha.codiggo_ficha,
      ficha.fecha_inicio,
      ficha.programa_idprograma,
      ficha.estado_ficha_idestado_ficha,
    ]);
    return {
      success: true,
      msg: "FICHA CREADA",
    };
  } catch (error) {
    console.error("Error en insertar ficha: ", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

const FichaEntradaData = z.object({
  idficha: z.number(),
  codigo_ficha: z.string(),
  fecha_inicio: z.string(),
  programa_idprograma: z.number(),
  //nombre_programa:string;
  estado_ficha_idestado_ficha: z.number(),
  //estado_ficha:string;
});

export const ActualizarFicha = async (idficha: number, data: any) => {
  try {
    const datosEntrada = FichaEntradaData.parse({ idficha, ...data });

    const result = await Conexion.execute(
      `UPDATE ficha 
             SET codigo_ficha = ?, 
                 fecha_inicio = ?, 
                 programa_idprograma = ?, 
                 estado_ficha_idestado_ficha = ?
             WHERE idficha = ?;`,
      [
        datosEntrada.codigo_ficha,
        datosEntrada.fecha_inicio,
        datosEntrada.programa_idprograma,
        datosEntrada.estado_ficha_idestado_ficha,
        idficha,
      ]
    );

    if (result.affectedRows === 0) {
      return {
        success: true,
        mdg: "ficha no encontrada",
      };
    }
    return {
      success: true,
      msg: "Ficha actualizada",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

export const EliminaFicha = async (idficha: number) => {
  try {
    const consulta = await Conexion.execute(
      ` DELETE FROM ficha WHERE idficha = ?,
            [idficha] `
    );

    if (consulta.affectedRows === 0) {
      return {
        success: false,
        msg: "Fichano encontrada",
      };
    }
    return {
      success: true,
      msg: "Usuario eliminado correctamente",
    };
  } catch (error) {
    return {
      success: false,
      msg: "Error en el servidor",
    };
  }
};

// INSTRUCTOR ////////////77

interface InstructorData {
  idfuncionario: number | null;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  url_imgfuncionario: string;
  password: string;
  tipo_documento: string;
  //tipo_documento_idtipo_documento :string;
}

export const ListarIntructores = async () => {
  try {
    const { rows: instructores } = await Conexion.execute(`
        SELECT 
            f.idfuncionario,
            f.documento,
            f.nombres,
            f.apellidos,
            f.email,
            f.telefono,
            f.url_imgfuncionario,
            td.tipo_documento AS tipo_documento,  
            f.password
        FROM funcionario f
        JOIN tipo_documento td ON f.tipo_documento_idtipo_documento = td.idtipo_documento
        JOIN funcionario_has_tipo_funcionario ftf ON f.idfuncionario = ftf.funcionario_idfuncionario
        WHERE ftf.tipo_funcionario_idtipo_funcionario = ?; 
        `);

    console.log("Listado de instructores: ", instructores);

    return {
      success: true,
      data: instructores as InstructorData[],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

interface InstructorData1 {
  idfuncionario: number | null;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  url_imgfuncionario: string;
  password: string;
  tipo_documento_idtipo_documento: string;
}

export const CrearInstructor = async (instructor: InstructorData1) => {
  try {
    const consulta = `
        INSERT INTO funcionario (documento, nombres, apellidos, email, telefono, url_imgfuncionario,
        password, tipo_documento_idtipo_documento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const result: any = await Conexion.execute(consulta, [
      instructor.documento,
      instructor.nombres,
      instructor.apellidos,
      instructor.email,
      instructor.telefono,
      instructor.url_imgfuncionario,
      instructor.password,
      instructor.tipo_documento_idtipo_documento,
    ]);

    //const funcionarioId = result.insertId;

    //const funcionarioId = result.insertId;
    // 3. Ejecutar SELECT LAST_INSERT_ID() para obtener el ID generado
    const lastResult: any = await Conexion.query(
      "SELECT LAST_INSERT_ID() as lastId"
    );
    console.log("Resultado de LAST_INSERT_ID():", lastResult);
    const funcionarioId = lastResult[0]?.lastId;

    if (!funcionarioId) {
      throw new Error("No se pudo obtener el ID del funcionario");
    }

    //insertar el funcionario a instructor
    const consutaRelacion = `INSERT INTO funcionario_has_tipo_funcionario(funcionario_idfuncionario, tipo_funcionario_idtipo_funcionario, password)
        VALUES (?, ?, ?)      
        `;

    await Conexion.execute(consutaRelacion, [
      funcionarioId,
      2,
      instructor.password,
    ]);

    return {
      success: true,
      msg: "Funcionario creado y asignado a INSTRUCTOR",
    };
  } catch (error) {
    console.error("Error en insertar funcionario: ", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

interface InstructorData2 {
  idfuncionario: number | null;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  url_imgfuncionario: string;
  password: string;
  tipo_documento_idtipo_documento: number;
}
export const ActualizarInstructor = async (
  idfuncionario: number | null,
  data: InstructorData2
) => {
  try {
    const datosEntrada = z
      .object({
        idfuncionario: z.number().nullable(),
        documento: z.string(),
        nombres: z.string(),
        apellidos: z.string(),
        email: z.string(),
        telefono: z.string(),
        url_imgfuncionario: z.string(),
        password: z.string(),
        tipo_documento_idtipo_documento: z.number(),
      })
      .parse(data);

    const result: any = await Conexion.execute(
      `
            UPDATE funcionario
            SET documento = ?, nombres = ?, apellidos = ?, email = ?, 
                telefono = ?, url_imgfuncionario = ?, password = ?, 
                tipo_documento_idtipo_documento = ?
            WHERE idfuncionario = ?
            `,
      [
        datosEntrada.documento,
        datosEntrada.nombres,
        datosEntrada.apellidos,
        datosEntrada.email,
        datosEntrada.telefono,
        datosEntrada.url_imgfuncionario,
        datosEntrada.password,
        datosEntrada.tipo_documento_idtipo_documento,
        idfuncionario,
      ]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        msg: "Instructor no encontrado o datos iguales",
      };
    }

    return {
      success: true,
      msg: "Instructor actualizado CORRECTAMENTE",
    };
  } catch (error) {
    console.error("Error en ActualizarInstructor:", error); // <-- Depuración

    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};

export const EliminarInstructor = async (idfuncionario: number) => {
  try {
    // 1. Eliminar la relación en la tabla de rompimiento
    await Conexion.execute(
      `DELETE FROM funcionario_has_tipo_funcionario WHERE funcionario_idfuncionario = ?,
        [idfuncionario] `
    );

    // 2. Eliminar el funcionario de la tabla principal
    const result: any = await Conexion.execute(
      ` DELETE FROM funcionario WHERE idfuncionario = ?,
        [idfuncionario] `
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        msg: "Instructor no encontrado",
      };
    }
    return {
      success: true,
      msg: "Instructor eliminado CORRECTAMENTE",
    };
  } catch (error) {
    console.error("Error en eliminar instructor:", error);
    return {
      success: false,
      msg: "Error en el servidor",
    };
  }
};

//listar los estados de la ficha

export const ListaFichaEstado = async () => {
  try {
    const { rows: fichas } = await Conexion.execute(
      ` SELECT estado_ficha FROM estado_ficha `
    );
    console.log("lista de las fichas:", fichas);

    return {
      success: true,
      data: fichas,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: "",
      };
    } else {
      return {
        success: false,
        msg: "Error en el servidor",
      };
    }
  }
};
