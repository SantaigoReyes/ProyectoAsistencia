// deno-lint-ignore-file
import { Conexion } from "./Conexion.ts";
export const getFichasPorInstructor = async (ctx: any) => {
  try {
    // 1. Obtener el id del usuario autenticado desde el token
    const instructorId = ctx.state.user.id;

    // 2. Consulta para traer las fichas asignadas a ese funcionario
    const result = await Conexion.query(
      `SELECT f.idficha, f.codigo_ficha, p.nombre_programa
       FROM ficha f
       JOIN funcionario_has_ficha ff ON f.idficha = ff.ficha_idficha
       JOIN funcionario func ON ff.funcionario_idfuncionario = func.idfuncionario
       JOIN programa p ON f.programa_idprograma = p.idprograma
       WHERE func.idfuncionario = ?`,
      [instructorId]
    );

    // 3. Verificar si encontró fichas
    if (result.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { msg: "No se encontraron fichas asignadas." };
      return;
    }

    // 4. Responder con las fichas
    ctx.response.status = 200;
    ctx.response.body = {
      fichas: result,
    };
  } catch (error) {
    console.error("Error al obtener fichas del instructor:", error);
    ctx.response.status = 500;
    ctx.response.body = { msg: "Error del servidor al obtener fichas." };
  }
};
export const getAprendicesPorFicha = async (ctx: any) => {
  try {
    const url = new URL(ctx.request.url);
    const idFicha = url.searchParams.get("idFicha");

    if (!idFicha) {
      ctx.response.status = 400;
      ctx.response.body = { msg: "ID de ficha requerido" };
      return;
    }

    const result = await Conexion.query(
      `SELECT 
  a.idaprendiz, 
  a.nombres_aprendiz,
  a.apellidos_aprendiz,
  a.telefono_aprendiz, 
  a.documento_aprendiz, 
  a.email_aprendiz,
  ea.estado_aprendiz AS estado_aprendiz,
  td.tipo_documento,
  td.abreviatura_tipo_documento AS abreviatura_documento
FROM aprendiz a
JOIN ficha f ON a.ficha_idficha = f.idficha
JOIN estado_aprendiz ea ON a.estado_aprendiz_idestado_aprendiz = ea.idestado_aprendiz
JOIN tipo_documento td ON a.tipo_documento_idtipo_documento = td.idtipo_documento
WHERE f.idficha = ?;
;`,
      [idFicha]
    );

    ctx.response.status = 200;
    ctx.response.body = {
      aprendices: result,
    };
  } catch (error) {
    console.error("Error al obtener aprendices:", error);
    ctx.response.status = 500;
    ctx.response.body = { msg: "Error interno" };
  }
};
