//Hacer un crud para aprendiz y para programa
import { Application, oakCors } from "./Dependencies/dependencies.ts";
import { routerPrograma } from "./Routes/adminRouter.ts";
const app = new Application();
app.use(oakCors());
app.use(routerPrograma.routes());
app.use(routerPrograma.allowedMethods());
console.log("Servidor Corriendo por el puerto 8000");
app.listen({ port: 8000 });
