import { Router } from "../Dependencies/dependencies.ts";
import { authMiddleware, roleMiddleware } from "../Middlewares/authAdmin.ts";
import {
  getAsistenciaPorAprendiz,
  getTipoAsistencia,
} from "../Controller/istructorCrud.ts";
import { postAsistenciaFiltroFP } from "../Controller/asistenciaFiltroFPC.ts";
import {
  getAprendicesPorFicha,
  getFichasPorInstructor,
} from "../Models/punto4.ts";
import {
  postAsistencia,
  putAsistencia,
} from "../Controller/asistenciaController.ts";

const routerInstructor = new Router();

routerInstructor.post(
  "/misAprendices",
  authMiddleware,
  roleMiddleware(["Instructor"]),
  getAsistenciaPorAprendiz
);
routerInstructor.get(
  "/tipoAsistencia",
  authMiddleware,
  roleMiddleware(["Instructor"]),
  getTipoAsistencia
);
routerInstructor.post(
  "/filtroFP",
  authMiddleware,
  roleMiddleware(["Instructor"]),
  postAsistenciaFiltroFP
);

//Punto 4
routerInstructor.get(
  "/fichas-instructor",
  authMiddleware,
  roleMiddleware(["Instructor"]), // ← cuidado con las mayúsculas si en BD es "Instructor"
  getFichasPorInstructor
);
routerInstructor.get(
  "/aprendices-por-ficha",
  authMiddleware,
  roleMiddleware(["Instructor", "Administrador"]),
  getAprendicesPorFicha
);

//Rutas Crud Asistencia Maira
routerInstructor.post(
  "/crear-asistencia",
  authMiddleware,
  roleMiddleware(["Instructor", "Administrador"]),
  postAsistencia
);
routerInstructor.put(
  "/editar-asistencia",
  authMiddleware,
  roleMiddleware(["Instructor", "Administrador"]),
  putAsistencia
);
export { routerInstructor };
