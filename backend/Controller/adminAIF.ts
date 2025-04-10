// deno-lint-ignore-file
import {
  getFichasActiva,
  getInstructores,
  asignarInstructoresAFicha,
} from "../Models/adminAIF.ts";

export const getFichaActiva = async (ctx: any) => {
  try {
    const fichaActiva = await getFichasActiva();
    ctx.response.body = { fichaActiva };
    console.log(fichaActiva);
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error no hay fichas registradas en ejecucion",
    };
  }
};
export const getInstructoresActivos = async (ctx: any) => {
  try {
    const instructorActivo = await getInstructores();
    ctx.response.body = { instructorActivo };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error no hay instructores registradas en ejecucion",
    };
  }
};
export const asignarAIF = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();

    // Desestructuramos
    const { idFuncionario, idFicha } = body;

    // Validaciones de tipo
    if (!idFuncionario || !idFicha || isNaN(idFuncionario) || isNaN(idFicha)) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Los datos enviados no son válidos. Se requieren 'idFuncionario' y 'idFicha' como números.",
        datosRecibidos: body,
      };
      return;
    }

    // Intentamos asignar
    const result = await asignarInstructoresAFicha({ idFuncionario, idFicha });

    // Si hubo un error interno en la función
    if (result?.success === false) {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error al insertar en la base de datos.",
        error: result.error?.message ?? "Error desconocido.",
      };
      return;
    }

    // Si no se afectó ninguna fila, posiblemente ya estaba insertado
    if (result.rowsAffected === 0) {
      response.status = 200;
      response.body = {
        success: false,
        msg: "Este instructor ya está asignado a esta ficha.",
        datos: { idFuncionario, idFicha },
      };
    } else {
      // Inserción exitosa
      response.status = 201;
      response.body = {
        success: true,
        msg: "Instructor asignado correctamente a la ficha.",
        datosAsignados: {
          idFuncionario,
          idFicha,
        },
        resultadoDB: result,
      };
    }
  } catch (error) {
    console.error("Error en asignarAIF:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Ocurrió un error inesperado al asignar el instructor.",
      error: error.message,
    };
  }
};
