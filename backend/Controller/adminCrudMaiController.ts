// deno-lint-ignore-file
import {
  ListaFicha,
  ActualizarFicha,
  CrearFicha,
  EliminaFicha,
  ListarIntructores,
  ActualizarInstructor,
  EliminarInstructor,
  ListaFichaEstado,
} from "../Models/adminCrudMai.ts";
import { z } from "../Dependencies/dependencies.ts";
export const getFicha = async (ctx: any) => {
  const { response } = ctx;

  try {
    const result = await ListaFicha();
    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No se pudo cargar la lista de fichas",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, msg: error.message };
    } else {
      return { success: false, msg: "Error de servidor" };
    }
  }
};

export const postFicha = async (ctx: any) => {
  const { request, response } = ctx;

  try {
    if (request.headers.get("Content-Length") === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud vacio",
      };
      return;
    }
    const body = await request.body.json();
    console.log("Cuerpo de la solicitud: ", body);

    const result = await CrearFicha(body);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Ficha creada correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        meg: result.msg,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato del cuerpo de la solicitud",
        error: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        meg: "Error interno en el servidor",
      };
    }
  }
};

export const putFicha = async (ctx: any) => {
  const { request, response, params } = ctx;

  try {
    const contentLength = request.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud vacio",
      };
      return;
    }

    const idficha = Number(params.idficha);
    if (isNaN(idficha) || idficha <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "id de ficha invalido",
      };
      return;
    }

    const body = await request.body.json();
    console.log("cuerpo de la solicitud: ", body);

    console.log("ID ficha: ", idficha);
    console.log("datos actualizados: ", body);

    const result = await ActualizarFicha(idficha, body);
    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "FICHA ACTUALIZADA",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg,
      };
    }
  } catch (error) {
    console.error("Error en putUser:", error); // 🔴 Ahora verás el error exacto en la consola

    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato del cuerpo de la solicitud",
        errors: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno del servidor",
      };
    }
  }
};

export const deleteFicha = async (ctx: any) => {
  const { response, params } = ctx;

  try {
    const idficha = Number(params.idficha);
    if (isNaN(idficha) || idficha <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID invalido",
      };
      return;
    }

    const result = await EliminaFicha(idficha);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "USUARIIO EIMIANDO CORRECTAMENTE",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "Usuario no encontrado",
      };
    }
  } catch (error) {
    console.error("Error en deleteUser:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

// INSTRUCTOR /////////////

import { CrearInstructor } from "../Models/adminCrudMai.ts"; // Asumiendo que este archivo es donde tienes la función para crear al instructor.

export const getInstructor = async (ctx: any) => {
  const { response } = ctx;

  try {
    const result = await ListarIntructores();

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No fue posible cargar la lista",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, msg: error.message };
    } else {
      return { success: false, msg: "Error de servidor" };
    }
  }
};

export const postInstructor = async (ctx: any) => {
  const { response } = ctx;

  try {
    // Extraer los campos del formulario procesado por el middleware de carga de imagen
    const imagenInstructor = ctx.state.fields.url_imgfuncionario || ""; // Aquí la imagen procesada por el middleware
    const {
      documento,
      nombres,
      apellidos,
      email,
      telefono,
      tipo_documento_idtipo_documento,
      password,
    } = ctx.state.fields;

    // Crear el objeto del nuevo instructor
    const nuevoInstructor = {
      idfuncionario: null,
      documento,
      nombres,
      apellidos,
      email,
      telefono,
      url_imgfuncionario: imagenInstructor, // URL de la imagen procesada
      tipo_documento_idtipo_documento,
      password,
    };

    // Llamar a la función CrearInstructor para insertar el nuevo instructor
    const result = await CrearInstructor(nuevoInstructor);

    // Verificar el resultado de la inserción
    if (result.success) {
      response.status = 201;
      response.body = {
        success: true,
        data: nuevoInstructor,
        msg: "Instructor creado exitosamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg || "No se pudo crear el instructor",
      };
    }
  } catch (error) {
    console.error("Error al crear el instructor:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error en el servidor",
    };
  }
};

export const putInstructor = async (ctx: any) => {
  const { request, response, params } = ctx;

  try {
    const contentLength = request.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud vacío",
      };
      return;
    }

    const idfuncionario = Number(params.idfuncionario);
    if (isNaN(idfuncionario) || idfuncionario <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID DE INSTRUCTOR INVALIDO",
      };
      return;
    }

    const fields = ctx.state.fields;
    console.log("Campos recibidos:", fields);

    // Obtener la URL de la imagen si es que se ha cargado una nueva imagen
    const nuevaImagenUrl = fields.url_imgfuncionario || ""; // Usar ctx.state.fields.url_imgfuncionario

    type instructorData = {
      idfuncionario: number | null;
      documento: string;
      nombres: string;
      apellidos: string;
      email: string;
      telefono: string;
      url_imgfuncionario: string;
      password: string;
      tipo_documento_idtipo_documento: number;
    };

    // Datos actualizados que se enviarán al backend
    const datosActualizados = {
      idfuncionario: idfuncionario,
      documento: fields.documento,
      nombres: fields.nombres,
      apellidos: fields.apellidos,
      email: fields.email,
      telefono: fields.telefono,
      url_imgfuncionario: nuevaImagenUrl, // Aquí es donde se agrega la URL de la nueva imagen
      password: fields.password,
      tipo_documento_idtipo_documento: Number(
        fields.tipo_documento_idtipo_documento
      ),
    } as instructorData;

    // Llamar a la función para actualizar el instructor en la base de datos
    const result = await ActualizarInstructor(idfuncionario, datosActualizados);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Instructor actualizado CORRECTAMENTE",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg,
      };
    }
  } catch (error) {
    console.error("Error en putInstructor:", error);
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Error en el formato del cuerpo de la solicitud",
        errors: error.issues,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno del servidor",
      };
    }
  }
};

export const deleteInstructor = async (ctx: any) => {
  const { response, params } = ctx;
  try {
    const idfuncionario = Number(params.idfuncionario);
    if (isNaN(idfuncionario) || idfuncionario <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de instructor invalido",
      };
      return;
    }
    const result = await EliminarInstructor(idfuncionario);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Instructor ELIMINADO",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "Unuario no encontrado",
      };
    }
  } catch (error) {
    console.error("Error en deleteUser:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

// LISTAR LOS ESTADOS DE LA FICHA

export const getEstadoFicha = async (ctx: any) => {
  const { response } = ctx;
  try {
    const result = await ListaFichaEstado();

    if (result.success) {
      response.status = 200;
      response.body = {
        success: false,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No fue posible cargar la lista de estados",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, msg: error.message };
    } else {
      return { success: false, msg: "Error de servidor" };
    }
  }
};
