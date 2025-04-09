import {
  Application,
  oakCors,
  Router,
  send,
} from "./Dependencies/dependencies.ts";
import { postFuncionario } from "./Controller/MairaInstructor.ts";
import { uploadImage } from "./Middlewares/imageUpload.ts";

const app = new Application();
const router = new Router();

// Middleware para servir imágenes estáticas desde /uploads
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(), // Usar Deno.cwd() sin comillas
    });
  } else {
    await next();
  }
});

// Middleware CORS (debe ir antes de las rutas si necesitas control de cabeceras)
app.use(oakCors());

// Rutas
router.post("/funcionario", uploadImage, postFuncionario);

// Uso de rutas y métodos
app.use(router.routes());
app.use(router.allowedMethods());

console.log("✅ Servidor corriendo en http://localhost:8002");
await app.listen({ port: 8002 });
