// File: /Helpers/jwt.ts

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

// Exportamos la clave para poder usarla en la verificación
export { CRYPTO_SECRET_KEY };
