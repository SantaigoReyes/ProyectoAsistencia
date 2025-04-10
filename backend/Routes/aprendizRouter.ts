import { Router } from "../Dependencies/dependencies.ts";
import { authMiddleware } from "../Middlewares/authAdmin.ts";
import { getPanelAprendiz } from "../Controller/aprendizControllerC.ts";
const routerAprendiz = new Router();

routerAprendiz.get("/panel-aprendiz", authMiddleware, getPanelAprendiz);

export { routerAprendiz };
