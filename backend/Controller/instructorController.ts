// deno-lint-ignore-file no-explicit-any
import {
  ActualizarAsistencia,
  CrearAsistencia,
} from "../Models/instructorCruds.ts";
import { z } from "../Dependencies/dependencies.ts";

export const postAsistencia = async (ctx: any) => {
  const { request, response } = ctx;

  try {
    if (request.headers.get("Content-Length") === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de solicitud vacia",
      };
      return;
    }
    const body = await request.body.json();
    console.log("Cuerpo de la solicitud: ", body);
    const asistencias = Array.isArray(body) ? body : body.asistencias;

    const result = await CrearAsistencia(asistencias);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Asistencia enviada correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg,
      };
    }
  } catch (error) {
    console.error("Error en postAsistencia:", error); // Agregamos este log para ver el error

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
        msg: "Error interno en el servidorrrr",
      };
    }
  }
};

export const putAsistencia = async (ctx: any) => {
  const { request, response, params } = ctx;

  try {
    // Validar id de asistencia en la URL
    const idasistencia = Number(params.idasistencia);
    if (isNaN(idasistencia) || idasistencia <= 0) {
      return response.status(400).json({
        success: false,
        msg: "ID de asistencia incorrecto",
      });
    }

    // Obtener los datos del cuerpo
    const body = await request.body().value;
    const {
      fecha_asistencia,
      aprendiz_idaprendiz,
      tipo_asistencia_idtipo_asistencia,
    } = body;

    // Validar los campos necesarios
    if (
      !fecha_asistencia ||
      !aprendiz_idaprendiz ||
      !tipo_asistencia_idtipo_asistencia
    ) {
      return response.status(400).json({
        success: false,
        msg: "Todos los campos son obligatorios",
      });
    }

    // Crear el objeto de asistencia y actualizar
    const asistencia = {
      idasistencia,
      fecha_asistencia,
      aprendiz_idaprendiz,
      tipo_asistencia_idtipo_asistencia,
    };
    const result = await ActualizarAsistencia(asistencia);

    // Responder según el resultado
    if (result.success) {
      return response.status(200).json({
        success: true,
        msg: "Asistencia actualizada correctamente",
      });
    } else {
      return response.status(400).json({
        success: false,
        msg: result.msg || "Error al actualizar la asistencia",
      });
    }
  } catch (error) {
    console.error("Error en putAsistencia:", error);
    return response.status(500).json({
      success: false,
      msg: "Error interno del servidor",
    });
  }
};
