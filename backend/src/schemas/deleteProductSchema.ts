import { z } from "zod";

export const deleteProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "O ID do produto é obrigatório" })
    })
})
