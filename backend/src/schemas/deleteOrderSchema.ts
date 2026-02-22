import z from "zod";

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z.string({ message: "A order_id é obrigatória e deve ser um número." }),
    })
})