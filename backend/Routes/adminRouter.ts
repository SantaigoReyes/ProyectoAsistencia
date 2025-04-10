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
import {
  deleteFicha,
  deleteInstructor,
  getEstadoFicha,
  getFicha,
  getInstructor,
  postFicha,
  postInstructor,
  putFicha,
  putInstructor,
} from "../Controller/adminCrudMaiController.ts";
import { uploadImage } from "../Middlewares/imageUpload.ts";
import { getEstadoAprendiz, getTipoDocumento } from "../Models/adminCrudMai.ts";

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
//Rutas -MAira Adminisrador Crud
routerPrograma.get(
  "/fichas",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getFicha
);
routerPrograma.post(
  "/fichas",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  postFicha
);
routerPrograma.put(
  "/fichas/:idficha",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  putFicha
);
routerPrograma.delete(
  "/fichas/:idficha",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  deleteFicha
);

routerPrograma.get(
  "/listar-instructor",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getInstructor
);
routerPrograma.post(
  "/crear-instructor",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  uploadImage,
  postInstructor
);
routerPrograma.put(
  "/editar-instructor/:idfuncionario",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  uploadImage,
  putInstructor
);
routerPrograma.delete(
  "/eliminar-instructor/:idfuncionario",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  deleteInstructor // ✅ sin uploadImage
);
routerPrograma.get(
  "/estado-ficha",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  getEstadoFicha
);

//TipoDocumento
routerPrograma.get("/tipodocumento", authMiddleware, getTipoDocumento);
routerPrograma.get("/estadoaprendiz", authMiddleware, getEstadoAprendiz);

export { routerPrograma };
