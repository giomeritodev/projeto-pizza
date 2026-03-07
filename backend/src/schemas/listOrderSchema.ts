import { z } from "zod";

export const listOrderSchema = z.object({
    query: z.object({
        draft: z.enum(["true", "false"]).optional().default("false"),
        payment: z.enum(["true", "false"]).optional(),
    }),
});
