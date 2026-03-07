import { prisma } from "../../prisma";

interface UpdatePaymentProps {
    order_id: number;
    payment: boolean;
}

class UpdatePaymentOrderService {
    async execute({ order_id }: UpdatePaymentProps) {
        try {
            const existing = await prisma.order.findUnique({
                where: { id: order_id },
            });

            if (!existing) {
                throw new Error("Pedido não encontrado.");
            }

            const updated = await prisma.order.update({
                where: { id: order_id },
                data: { payment: true },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    payment: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return updated;
        } catch (error) {
            console.error(error);
            throw new Error("Não foi possível atualizar o pagamento do pedido.");
        }
    }
}

export { UpdatePaymentOrderService };
