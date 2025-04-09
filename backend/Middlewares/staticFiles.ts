import { send } from "https://deno.land/x/oak@v17.1.4/send.ts";

export async function staticMiddleware(ctx: any, next: any) {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(),
    });
  } else {
    await next();
  }
}
