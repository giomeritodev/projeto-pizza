import { z } from "zod";

export const updatePaymentSchema = z.object({
    body: z.object({
        order_id: z.number({ message: "O ID do pedido deve ser um número." }),
        payment: z.boolean({ message: "O status de pagamento deve ser booleano." }),
    }),
});
