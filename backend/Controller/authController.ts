// deno-lint-ignore-file
import { generarToken } from "../Helpers/jwt.ts";
import { Conexion } from "../Models/Conexion.ts";

// Inicio de sesión para Aprendiz usando email y password
export const IniciarSesion = async (ctx: any) => {
  try {
    // Extraer email y password del body de la petición
    const { email, password } = await ctx.request.body.json();

    // Realizar la consulta en la base de datos para el aprendiz
    const result = await Conexion.query(
      `SELECT idaprendiz, nombres_aprendiz, 'aprendiz' as role, password_aprendiz as password
       FROM edu_sena.aprendiz WHERE email_aprendiz = ?`,
      [email]
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

// Inicio de sesión para Funcionario usando email y password
export const IniciarSesionFuncionario = async (ctx: any) => {
  try {
    // Extraer email y password del body de la petición
    const { email, password } = await ctx.request.body.json();

    // Realizar la consulta en la base de datos para el funcionario
    const result = await Conexion.query(
      `SELECT f.idfuncionario, f.nombres, tf.tipo_funcionario AS role, f.password
       FROM funcionario f
       JOIN funcionario_has_tipo_funcionario ftf 
         ON f.idfuncionario = ftf.funcionario_idfuncionario
       JOIN tipo_funcionario tf
         ON ftf.tipo_funcionario_idtipo_funcionario = tf.idtipo_funcionario
       WHERE f.email = ?`,
      [email]
    );

    // Verificar si el funcionario existe
    if (result.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { msg: "Funcionario no encontrado" };
      return;
    }

    // Extraer los datos del funcionario
    const funcionario = {
      id: result[0].idfuncionario,
      nombres: result[0].nombres,
      password: result[0].password,
      roles: result.map((row: any) => row.role), // Extrae todos los roles en un array
    };

    // Comparar la contraseña
    if (funcionario.password !== password) {
      ctx.response.status = 401;
      ctx.response.body = { msg: "Contraseña incorrecta" };
      return;
    }

    // Generar el token con todos los roles en un array
    const token = await generarToken({
      id: funcionario.id,
      nombres: funcionario.nombres,
      roles: funcionario.roles, // Se envía como un array
    });

    // Responder con el token y datos del usuario
    ctx.response.status = 200;
    ctx.response.body = {
      token,
      msg: "Inicio de sesión exitoso",
      usuario: {
        id: funcionario.id,
        nombres: funcionario.nombres,
        roles: funcionario.roles,
      },
    };
  } catch (error) {
    console.error("Error en IniciarSesionFuncionario:", error);
    ctx.response.status = 500;
    ctx.response.body = { msg: "Error interno del servidor" };
  }
};
