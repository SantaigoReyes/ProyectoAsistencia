import { Application, oakCors, send } from "./Dependencies/dependencies.ts";
import { routerPrograma } from "./Routes/adminRouter.ts";
import { routerAprendiz } from "./Routes/aprendizRouter.ts";
import { routerLogin } from "./Routes/loginRouter.ts";
import { routerInstructor } from "./Routes/routerInstructor.ts";

const app = new Application();

app.use(oakCors());

// 2) Servir estáticos: cualquier GET a /uploads/*
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    // Si tu carpeta real está en ./backend/uploads, ajusta join:
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(), // raíz de tu proyecto
      index: "index.html", // no necesario, pero puede ir
    });
  } else {
    await next();
  }
});
// Usar rutas del router de admin (programa y aprendiz)
app.use(routerPrograma.routes());
app.use(routerPrograma.allowedMethods());

// Usar rutas del router de login
app.use(routerLogin.routes());
app.use(routerLogin.allowedMethods());

//Usar rutas instructor

app.use(routerInstructor.routes());
app.use(routerInstructor.allowedMethods());
//Rutas aprendiz Maira
app.use(routerAprendiz.routes());
app.use(routerAprendiz.allowedMethods());
console.log("Servidor corriendo por el puerto 8000");
await app.listen({ port: 8000 });
