// deno-lint-ignore-file
// Middlewares/imageUpload.ts
import { ensureDir } from "https://deno.land/std@0.177.0/fs/mod.ts";

export const uploadImage = async (ctx: any, next: any) => {
  try {
    if (ctx.request.hasBody) {
      const body = await ctx.request.body.formData();
      const file = body.get("imagen");

      const fields: Record<string, string> = {};
      for (const [key, value] of body.entries()) {
        if (typeof value === "string") {
          fields[key] = value;
        }
      }

      if (file && file instanceof File) {
        await ensureDir("uploads");
        const fileName = file.name ?? `${Date.now()}_imagen.jpg`;
        const filePath = `uploads/${fileName}`;
        const fileBytes = new Uint8Array(await file.arrayBuffer());
        await Deno.writeFile(filePath, fileBytes);
        fields.url_imgfuncionario = `/uploads/${fileName}`;
      } else {
        fields.url_imgfuncionario;
      }

      ctx.state.fields = fields;
    } else {
      ctx.state.fields = {};
    }

    await next();
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    ctx.throw(400, "Error al procesar la imagen");
  }
};
