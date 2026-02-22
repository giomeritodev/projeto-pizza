import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z.number({ message: "A mesa precisa ser um número" }).int().min(1, { message: "A mesa precisa ser um número válido" }),
        name: z.string({ message: "O nome precisa ser um texto" }).optional()
    })
})
