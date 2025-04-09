// deno-lint-ignore-file
// AsistenciaController.ts
import { asistenciaFiltroFP } from "../Models/asistenciaFiltroFP.ts";

export const postAsistenciaFiltroFP = async (ctx: any) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const result = await asistenciaFiltroFP(body);
    response.status = 201;
    response.body = {
      success: true,
      msg: true,
      result,
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error al obtener las asistencias",
      error: error.message,
    };
  }
};
