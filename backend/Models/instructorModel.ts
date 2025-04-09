import { Conexion } from "./Conexion.ts";

export interface Instructor {
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  url_imgfuncionario: string;
  password: string;
  tipo_documento_idtipo_documento: string;
}

export async function crearInstructor(data: Instructor) {
  const query = `
    INSERT INTO funcionario 
    (documento, nombres, apellidos, email, telefono, url_imgfuncionario, password, tipo_documento_idtipo_documento) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.documento,
    data.nombres,
    data.apellidos,
    data.email,
    data.telefono,
    data.url_imgfuncionario,
    data.password,
    data.tipo_documento_idtipo_documento,
  ];

  await Conexion.execute(query, values);
}
