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
import {
  asignarAIF,
  getFichaActiva,
  getInstructoresActivos,
} from "../Controller/adminAIF.ts";
import { Router } from "../Dependencies/dependencies.ts";
import { authMiddleware, roleMiddleware } from "../Middlewares/authAdmin.ts";

const routerPrograma = new Router();

// Rutas protegidas: solo se permite acceso a usuarios autenticados
// con rol "Administrador" (en el payload del token)

//Asigno Administrador y instructor a ficha
routerPrograma.get(
  "/instructoresAIF",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getInstructoresActivos
);
routerPrograma.get(
  "/fichaAIF",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getFichaActiva
);
routerPrograma.post(
  "/asignarAIF",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  asignarAIF
);
///Crudss Admin

routerPrograma.post(
  "/programa",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  postPrograma
);
routerPrograma.get(
  "/programa",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getProgram
);
routerPrograma.put(
  "/programa",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  putProgram
);
routerPrograma.delete(
  "/programa/:id",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  deletePrograma
);

// Rutas para "aprendiz" también protegidas para Administrador (ajusta según lo requieras)
routerPrograma.post(
  "/aprendiz",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  postAprendiz
);
routerPrograma.get(
  "/aprendiz",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getAprendiz
);
routerPrograma.put(
  "/aprendiz",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  putAprendiz
);
routerPrograma.delete(
  "/aprendiz/:id",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  deleteAprendizC
);

export { routerPrograma };
