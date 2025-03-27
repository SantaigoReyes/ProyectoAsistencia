// deno-lint-ignore-file
import {
  Middleware,
  Status,
  Context,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { verify } from "../Dependencies/dependencies.ts";
import { CRYPTO_SECRET_KEY } from "../Helpers/jwt.ts";

export const authMiddleware: Middleware<Record<string, any>> = async (
  ctx,
  next
) => {
  const { request, response } = ctx;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status = 401;
      response.body = { message: "No autorizado: falta token" };
      return;
    }
    const token = authHeader.replace("Bearer ", "").trim();
    const payload = await verify(token, CRYPTO_SECRET_KEY);

    // Guardamos el payload en ctx.state
    ctx.state.user = payload;
    await next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    response.status = 401;
    response.body = { message: "Token inválido o expirado" };
  }
};

export const roleMiddleware = (
  allowedRoles: string[]
): Middleware<Record<string, any>> => {
  return async (ctx, next) => {
    const user = ctx.state.user;

    if (user && Array.isArray(user.roles)) {
      if (!user.roles.some((role: string) => allowedRoles.includes(role))) {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = {
          message: "Acceso denegado: permisos insuficientes",
        };
        return;
      }
    } else if (user && typeof user.role === "string") {
      if (!allowedRoles.includes(user.role)) {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = {
          message: "Acceso denegado: permisos insuficientes",
        };
        return;
      }
    } else {
      ctx.response.status = Status.Forbidden;
      ctx.response.body = {
        message: "Acceso denegado: información de usuario ausente",
      };
      return;
    }
    await next();
  };
};
