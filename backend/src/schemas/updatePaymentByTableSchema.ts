import { z } from "zod";

export const updatePaymentByTableSchema = z.object({
    body: z.object({
        table: z.number({ message: "A mesa deve ser um número." }),
        payment: z.boolean({ message: "O status de pagamento deve ser booleano." }),
    }),
});