import { Application, oakCors } from "./Dependencies/dependencies.ts";
import { routerPrograma } from "./Routes/adminRouter.ts";
import { routerLogin } from "./Routes/loginRouter.ts";
import { routerInstructor } from "./Routes/routerInstructor.ts";

const app = new Application();

app.use(oakCors());

// Usar rutas del router de admin (programa y aprendiz)
app.use(routerPrograma.routes());
app.use(routerPrograma.allowedMethods());

// Usar rutas del router de login
app.use(routerLogin.routes());
app.use(routerLogin.allowedMethods());

//Usar rutas instructor

app.use(routerInstructor.routes());
app.use(routerInstructor.allowedMethods());

console.log("Servidor corriendo por el puerto 8000");
await app.listen({ port: 8000 });
