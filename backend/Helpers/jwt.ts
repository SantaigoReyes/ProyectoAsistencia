// File: /Helpers/jwt.ts
import { verify } from "../Dependencies/dependencies.ts";
import { create, getNumericDate } from "../Dependencies/dependencies.ts";

// Clave secreta. Debe ser la misma que uses para verificar el token en el middleware.
const SECRET_KEY = "santiago@gmail.com";

// Importamos la clave en formato CryptoKey para HMAC-SHA256
const CRYPTO_SECRET_KEY = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(SECRET_KEY),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

// Función para generar el token
export const generarToken = async (payload: object) => {
  return await create(
    { alg: "HS256", typ: "JWT" },
    { ...payload, exp: getNumericDate(60 * 60) }, // Expira en 1 hora
    CRYPTO_SECRET_KEY
  );
};

// NUUUUUUUEEEEEEEEVAAAAAAAAAAAAAAA
export const decodeToken = async (token: string) => {
  try {
    // Decodificar el token
    const decoded = await verify(token, CRYPTO_SECRET_KEY);

    // Verificar si el token ha expirado
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("El token ha expirado.");
    }

    return { success: true, email: decoded.email };
  } catch {
    throw new Error("Token inválido o expirado.");
  }
};

// Exportamos la clave para poder usarla en la verificación
export { CRYPTO_SECRET_KEY };
