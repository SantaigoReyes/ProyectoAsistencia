// deno-lint-ignore-file
// Controller/MairaInstructor.ts
import { Conexion } from "../Models/Conexion.ts";

export const postFuncionario = async ({ response, state }: any) => {
  try {
    const {
      documento,
      nombres,
      apellidos,
      email,
      telefono,
      password,
      tipo_documento_idtipo_documento,
      url_imgfuncionario,
    } = state.fields;

    await Conexion.execute(
      `INSERT INTO funcionario (
        documento, nombres, apellidos, email, telefono,
        url_imgfuncionario, password, tipo_documento_idtipo_documento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        documento,
        nombres,
        apellidos,
        email,
        telefono,
        url_imgfuncionario,
        password,
        tipo_documento_idtipo_documento,
      ]
    );

    response.status = 201;
    response.body = { msg: "Funcionario registrado correctamente" };
  } catch (error) {
    console.error("Error al insertar funcionario:", error);
    response.status = 500;
    response.body = { msg: "Error al registrar funcionario", error };
  }
};
