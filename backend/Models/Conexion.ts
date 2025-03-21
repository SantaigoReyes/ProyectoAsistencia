import { Client } from "../Dependencies/dependencies.ts";

export const Conexion = await new Client().connect({
  hostname: "localhost",
  username: "root",
  db: "edu_sena",
  password: "",
  port: 3306,
});
