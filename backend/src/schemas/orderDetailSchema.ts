import { z } from "zod";

export const orderDetailSchema = z.object({
    query: z.object({
        order_id: z.string().min(1, { message: "O ID da order é obrigatório" })
    })
})
