import { Router } from "../Dependencies/dependencies.ts";
import { authMiddleware, roleMiddleware } from "../Middlewares/authAdmin.ts";
import {
  getAsistenciaPorAprendiz,
  getTipoAsistencia,
} from "../Controller/istructorCrud.ts";

const routerInstructor = new Router();

routerInstructor.post(
  "/misAprendices",
  authMiddleware,
  roleMiddleware(["Instructor"]),
  getAsistenciaPorAprendiz
);
routerInstructor.post(
  "/tipoAsistencia",
  authMiddleware,
  roleMiddleware(["Instructor"]),
  getTipoAsistencia
);
export { routerInstructor };
