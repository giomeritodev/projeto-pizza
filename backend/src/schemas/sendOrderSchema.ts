import z from "zod";

export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z.number().int({ message: "O ID do pedido precisa ser um número inteiro" }),
        name: z.string({ message: "O nome precisa ser um texto" }).optional()
    })
})