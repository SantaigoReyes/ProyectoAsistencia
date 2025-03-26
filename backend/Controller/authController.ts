// deno-lint-ignore-file
import { generarToken } from "../Helpers/jwt.ts";
import { Conexion } from "../Models/Conexion.ts";

// deno-lint-ignore no-explicit-any
export const IniciarSesion = async (ctx: any) => {
  try {
    // Extraer username y password del body de la petición
    const { username, password } = await ctx.request.body.json();

    // Realizar la consulta en la base de datos
    const result = await Conexion.query(
      `SELECT idaprendiz, nombres_aprendiz, 'aprendiz' as role, password_aprendiz as password
       FROM edu_sena.aprendiz WHERE documento_aprendiz = ?`,
      [username]
    );

    // Verificar si el usuario existe
    if (result.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { msg: "Usuario no encontrado" };
      return;
    }

    const aprendiz = result[0];

    // Comparar la contraseña
    if (aprendiz.password !== password) {
      ctx.response.status = 401;
      ctx.response.body = {
        msg: "Credenciales Incorrectas (contraseña inválida)",
      };
      return;
    }

    // Generar el token
    const token = await generarToken({
      id: aprendiz.idaprendiz,
      nombres: aprendiz.nombres_aprendiz,
      role: aprendiz.role,
    });

    // Responder con el token y datos del usuario
    ctx.response.status = 200;
    ctx.response.body = {
      token,
      msg: "Inicio de sesión exitoso",
      usuario: {
        id: aprendiz.idaprendiz,
        nombres: aprendiz.nombres_aprendiz,
        role: aprendiz.role,
      },
    };
  } catch (error) {
    console.error("Error en IniciarSesion:", error);
    ctx.response.status = 500;
    ctx.response.body = { msg: "Error interno del servidor" };
  }
};
export const IniciarSesionFuncionario = async (ctx: any) => {
  try {
    const { username, password } = await ctx.request.body.json();

    const result = await Conexion.query(
      `SELECT f.idfuncionario, f.nombres, tf.tipo_funcionario AS role, f.password
       FROM funcionario f
       JOIN funcionario_has_tipo_funcionario ftf 
       ON f.idfuncionario = ftf.funcionario_idfuncionario
       JOIN tipo_funcionario tf
       ON ftf.tipo_funcionario_idtipo_funcionario = tf.idtipo_funcionario
       WHERE f.documento = ?`,
      [username]
    );

    if (result.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { msg: "Funcionario no encontrado" };
      return;
    }

    // Extraemos los datos del funcionario
    const funcionario = {
      id: result[0].idfuncionario,
      nombres: result[0].nombres,
      password: result[0].password,
      roles: result.map((row: any) => row.role), // Extrae todos los roles en un array
    };

    if (funcionario.password !== password) {
      ctx.response.status = 401;
      ctx.response.body = { msg: "Contraseña incorrecta" };
      return;
    }

    // Generamos el token con todos los roles en un array
    const token = await generarToken({
      id: funcionario.id,
      nombres: funcionario.nombres,
      roles: funcionario.roles, // Ahora se envía como un array
    });

    ctx.response.status = 200;
    ctx.response.body = {
      token,
      msg: "Inicio de sesión exitoso",
      usuario: {
        id: funcionario.id,
        nombres: funcionario.nombres,
        roles: funcionario.roles, // Enviar todos los roles
      },
    };
  } catch (error) {
    console.error("Error en IniciarSesionFuncionario:", error);
    ctx.response.status = 500;
    ctx.response.body = { msg: "Error interno del servidor" };
  }
};
