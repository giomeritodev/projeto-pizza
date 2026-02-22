import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z.number({ message: "A mesa precisa ser um número" }).int().min(1, { message: "A mesa precisa ser um número válido" }),
        name: z.string({ message: "O nome é obrigatório" }).min(1, { message: "O nome precisa ter pelo menos 1 caractere" })
    })
})
