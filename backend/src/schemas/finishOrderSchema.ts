import z from "zod";

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z.number({ message: "O ID do pedido deve ser um número." }),
    })
})