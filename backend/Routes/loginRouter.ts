import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import {
  IniciarSesion,
  IniciarSesionFuncionario,
} from "../Controller/authController.ts";

const routerLogin = new Router();

routerLogin.post("/login/aprendiz", IniciarSesion);
routerLogin.post("/login/funcionario", IniciarSesionFuncionario);

export { routerLogin };
