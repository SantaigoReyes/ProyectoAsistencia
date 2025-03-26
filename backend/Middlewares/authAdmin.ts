// File: /Middlewares/loginMiddleware.ts

import { Middleware, verify } from "../Dependencies/dependencies.ts";
import { CRYPTO_SECRET_KEY } from "../Helpers/jwt.ts";

export const authMiddleware: Middleware = async (ctx, next) => {
  const { response, request } = ctx;

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status = 401;
      response.body = { message: "No estás autorizado" };
      return;
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = await verify(token, CRYPTO_SECRET_KEY);

    // Guardamos la info del payload en el contexto, para uso posterior
    ctx.state.user = payload;
    await next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    response.status = 401;
    response.body = { message: "Token inválido o expirado" };
  }
};
