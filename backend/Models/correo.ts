// deno-lint-ignore-file no-explicit-any
import { decodeToken, generarToken } from "../Helpers/jwt.ts";
import { Conexion } from "./Conexion.ts";
import { SMTPClient } from "../Dependencies/dependencies.ts";
export const verificarUsuario = async (email: string) => {
  try {
    const query = "SELECT * FROM funcionario WHERE email = ?";

    const result = await Conexion.execute(query, [email]);

    if (result.rows && result.rows.length === 1) {
      //const token = await generarToken(result.rows[0].email)
      const token = await generarToken({ email: result.rows[0].email }); // ✅

      //const recoveryLink = http://localhost:8000/employees/reset-password?token=${token};

      const recoveryLink = ` http://localhost:5173/reset-password?token=${token}`;

      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: "mairaalej55@gmail.com",
            password: "fshz eron cemc jtjx",
          },
        },
      });

      await client.send({
        from: "mairaalej55@gmail.com",
        to: email,
        subject: "Recuperación de contraseña",
        content: ` Haz clic en este enlace para recuperar tu contraseña: ${recoveryLink}`,
      });

      await client.close();

      return {
        success: true,
        message: "Revisa tu correo para continuar con la recuperación.",
        link: recoveryLink,
        token: token,
      };
    } else {
      throw new Error("No se encontro el usuario con este correo.");
    }
  } catch (error) {
    throw error;
  }
};

//Recuperacion de contaseña paso#2
export const resetPassword = async (body: any) => {
  try {
    const tokenData = await decodeToken(body.token);

    const query = "UPDATE funcionario SET password = ? WHERE email = ? ";
    const values = [body.password, tokenData.email];

    const result = await Conexion.execute(query, values);

    if (result.affectedRows && result.affectedRows === 1) {
      return {
        success: true,
        message: "Contraseña actualizada con exito",
      };
    } else {
      throw new Error("Se presento un error al actualizar la contraseña");
    }
  } catch (error) {
    throw error;
  }
};
