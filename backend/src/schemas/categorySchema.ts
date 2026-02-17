import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "Categoria precisa ser um texto" }).min(2, { message: "A categoria precisa ter no minimo 2 carecteres." })
    })
})