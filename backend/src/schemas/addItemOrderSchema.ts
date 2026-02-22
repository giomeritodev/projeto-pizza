import z from "zod";


export const addItemOrderSchema = z.object({
    body: z.object({
        order_id: z.number({ message: "O ID da ordem precisa ser um número" }).int().min(1, { message: "O ID da ordem precisa ser um número válido" }),
        product_id: z.number({ message: "O ID do produto precisa ser um número" }).int().min(1, { message: "O ID do produto precisa ser um número válido" }),
        amount: z.number({ message: "A quantidade precisa ser um número" }).int({ message: "A quantidade precisa ser um número inteiro" }).positive({ message: "A quantidade precisa ser um número positivo" })
    })
})