import { z } from "zod";

export const listProductsByCategorySchema = z.object({
    query: z.object({
        category_id: z.string().min(1, { message: "O ID da categoria é obrigatório" })
    })
})
