// deno-lint-ignore-file
import { request } from "../../../Users/santi/AppData/Local/deno/npm/registry.npmjs.org/undici-types/6.20.0/api.d.ts";
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
    const result = await asignarInstructoresAFicha(body);
    response.status = 201;
    response.body = {
      success: true,
      msg: true,
      result,
    };
  } catch (error) {
    response.status = 500;
    response.body = { success: false, msg: "Error al agregar el Programa" };
  }
};
