import { z } from "zod";

export const listProductSchema = z.object({
    query: z.object({
        disabled: z.enum(['true', 'false']).optional().default('false')
    })
})
