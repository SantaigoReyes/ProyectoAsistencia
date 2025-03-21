//Hacer un crud para aprendiz y para programa
import { Application, oakCors } from "./Dependencies/dependencies.ts";
const app = new Application();
app.use(oakCors());
console.log("Servidor Corriendo por el puerto 8000");
app.listen({ port: 8000 });
