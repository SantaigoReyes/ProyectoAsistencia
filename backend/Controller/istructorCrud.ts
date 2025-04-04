// deno-lint-ignore-file
import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import {
  asistenciaAprendizYFicha,
  tiposAsistencia,
} from "../Models/instructorCrudM.ts";

export const getAsistenciaPorAprendiz = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    // Usar la misma sintaxis que en postPrograma
    const body = await request.body.json();
    const { idAprendiz } = body;

    if (!idAprendiz) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Falta el id del aprendiz",
      };
      return;
    }

    const resultado = await asistenciaAprendizYFicha(idAprendiz);

    response.status = 200;
    response.body = {
      success: true,
      data: resultado,
    };
  } catch (error) {
    console.error("Error al obtener la asistencia:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error del servidor al obtener la asistencia",
    };
  }
};

export const getTipoAsistencia = async (ctx: any) => {
  try {
    const verTipoAsistencia = await tiposAsistencia();
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: verTipoAsistencia,
    };
  } catch (error) {
    console.error("Error al obtener el tipo de asistencia:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: "Error al obtener el tipo de asistencia",
    };
  }
};
