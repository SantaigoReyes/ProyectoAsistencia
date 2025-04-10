// deno-lint-ignore-file no-explicit-any
import { resetPassword, verificarUsuario } from "../Models/correo.ts";

export const postVerificarCorreo = async (ctx: any) => {
  const { request, response } = ctx;

  try {
    const email = await request.body.json();

    const result = await verificarUsuario(email.user);

    response.status = 200;
    response.body = {
      success: true,
      message: result.message,
      link: result.link,
      token: result.token,
    };
  } catch (error) {
    console.error("❌ Error en postVerificarCorreo:", error); // Importante loguearlo
  }
};

export const postResetpassword = async (ctx: any) => {
  const { request, response } = ctx;

  try {
    const body = await request.body.json();

    const result = await resetPassword(body);

    response.status = 200;
    response.body = {
      success: true,
      message: result.message,
    };
  } catch (error) {
    throw error;
  }
};
