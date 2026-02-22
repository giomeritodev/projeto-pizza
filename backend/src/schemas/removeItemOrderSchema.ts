import { z } from "zod";

export const removeItemOrderSchema = z.object({
    query: z.object({
        item_id: z.string().min(1, { message: "O ID do item é obrigatório" })
    })
})
