import {
  getProgram,
  postPrograma,
  putProgram,
  deletePrograma,
  postAprendiz,
  getAprendiz,
  putAprendiz,
  deleteAprendizC,
} from "../Controller/adminController.ts";
import { Router } from "../Dependencies/dependencies.ts";

const routerPrograma = new Router();
//Rutas Programa
routerPrograma.post("/programa", postPrograma);
routerPrograma.get("/programa", getProgram);
routerPrograma.put("/programa", putProgram);
routerPrograma.delete("/programa/:id", deletePrograma);
//Rutas Aprendiz
routerPrograma.post("/aprendiz", postAprendiz);
routerPrograma.get("/aprendiz", getAprendiz);
routerPrograma.put("/aprendiz", putAprendiz);
routerPrograma.delete("/aprendiz/:id", deleteAprendizC);
export { routerPrograma };
