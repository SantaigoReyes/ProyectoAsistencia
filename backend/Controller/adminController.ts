// deno-lint-ignore-file
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";
import { z } from "../Dependencies/dependencies.ts";
import {
  addProgram,
  deleteProgram,
  updateProgram,
  viewProgram,
  //Cruds de aprendiz
  addAprendiz,
  deleteAprendiz,
  updateAprendiz,
  viewAprendiz,
} from "../Models/adminCruds.ts";
//Controller Programa
export const postPrograma = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const result = await addProgram(body);
    response.status = 201;
    response.body = {
      success: true,
      msg: "Programa agregado",
      result,
    };
  } catch (error) {
    response.status = 500;
    response.body = { success: false, msg: "Error al agregar el Programa" };
  }
};
export const getProgram = async (ctx: any) => {
  try {
    const program = await viewProgram();
    ctx.response.body = { program };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error al obtener el programa",
    };
  }
};

export const deletePrograma = async (ctx: any) => {
  const { params, response } = ctx;
  try {
    const { id } = params;
    if (!id) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Falta el id en el programa",
      };
      return;
    }
    const result = await deleteProgram(id);
    if (result.affectedRows && result.affectedRows > 0) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Programa eliminado con exito",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "Error programa no encontrado",
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno en el servidor",
    };
  }
};

export const putProgram = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const { idPrograma, codigoPrograma, nombrePrograma } = body;
    if (!idPrograma) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Falta el id en el programa de la solicitud",
      };
      return;
    }
    const result = await updateProgram(idPrograma, {
      codigoPrograma,
      nombrePrograma,
    });
    if (result.affectedRows && result.affectedRows > 0) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Programa actualizado correctamente",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "No se encontró el usuario a actualizar",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato de la solicitud",
        errors: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno en el servidor",
      };
    }
  }
};
//Controller de Aprendiz
export const postAprendiz = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const result = await addAprendiz(body);
    response.status = 201;
    response.body = {
      success: true,
      msg: "Aprendiz agregado",
      result,
    };
  } catch (error) {
    response.status = 500;
    response.body = { success: false, msg: "Error al agregar el aprendiz" };
  }
};

export const getAprendiz = async (ctx: any) => {
  try {
    const aprendiz = await viewAprendiz();
    ctx.response.body = { aprendiz };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error al obtener el aprendiz",
    };
  }
};

export const deleteAprendizC = async (ctx: any) => {
  const { params, response } = ctx;
  try {
    const { id } = params;
    if (!id) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error falta el id del aprendiz",
      };
      return;
    }
    const result = await deleteAprendiz(id);
    if (result.affectedRows && result.affectedRows > 0) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Aprendiz eliminado correctamente",
      };
    } else {
      response.status = 404;
      response.body = { success: false, msg: "Error Programa no encontrado" };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato de la solicitud",
        errors: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno en el servidor",
      };
    }
  }
};

const aprendizSchema = z.object({
  idAprendiz: z.string().min(1),
  documento_aprendiz: z.string().min(1),
  nombre_aprendiz: z.string().min(1),
  apellido_aprendiz: z.string().min(1),
  telefono_aprendiz: z.string().min(1),
  email_aprendiz: z.string().email(),
  password_aprendiz: z.string().min(6),
  ficha_idFicha: z.string().min(1),
  estado_aprendiz_idEstado_aprendiz: z.string().min(1),
  tipo_documento_idTipo_documento: z.string().min(1),
});

export const putAprendiz = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const validatedData = aprendizSchema.parse(body);

    const {
      idAprendiz,
      documento_aprendiz,
      nombre_aprendiz,
      apellido_aprendiz,
      telefono_aprendiz,
      email_aprendiz,
      password_aprendiz,
      ficha_idFicha,
      estado_aprendiz_idEstado_aprendiz,
      tipo_documento_idTipo_documento,
    } = body;

    if (!idAprendiz) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Falta el id en el aprendiz de la solicitud",
      };
      return;
    }

    console.log(body);
    // Se asume que updateAprendiz está definido para recibir (id, datosAprendiz)
    const result = await updateAprendiz(idAprendiz, {
      documento_aprendiz,
      nombre_aprendiz,
      apellido_aprendiz,
      telefono_aprendiz,
      email_aprendiz,
      password_aprendiz,
      ficha_idFicha,
      estado_aprendiz_idEstado_aprendiz,
      tipo_documento_idTipo_documento,
    });

    if (
      result.result &&
      result.result.affectedRows &&
      result.result.affectedRows > 0
    ) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Aprendiz actualizado correctamente",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "No se encontró el aprendiz a actualizar",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato de la solicitud",
        errors: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno en el servidor",
      };
    }
  }
};
