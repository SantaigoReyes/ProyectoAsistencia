import { Application } from "https://deno.land/x/oak@v17.1.4/application.ts";
import { send } from "https://deno.land/x/oak@v17.1.4/send.ts";

export {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
export type { Middleware } from "https://deno.land/x/oak@v17.1.4/mod.ts";
export { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
export { z } from "https://deno.land/x/zod@v3.24.1/mod.ts";
export { join } from "https://deno.land/std@0.168.0/path/mod.ts";
///Atention
export {
  create,
  verify,
  getNumericDate,
} from "https://deno.land/x/djwt@v2.8/mod.ts";

const app = new Application();

// Servir archivos estáticos desde la carpeta "uploads"
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(), // directorio base (donde está tu carpeta uploads)
    });
  } else {
    await next();
  }
});
