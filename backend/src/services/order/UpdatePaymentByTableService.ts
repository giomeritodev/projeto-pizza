import { prisma } from "../../prisma";

interface UpdatePaymentByTableServiceProps {
    table: number;
    payment: boolean;
}

class UpdatePaymentByTableService {
    async execute({ table, payment }: UpdatePaymentByTableServiceProps) {
        try {
            // Update all orders for the table that are ready (status=true) and not paid (payment=false)
            await prisma.order.updateMany({
                where: {
                    table: table,
                    status: true,
                    payment: false,
                },
                data: {
                    payment: payment,
                },
            });

            // Fetch the updated orders to return details
            const orders = await prisma.order.findMany({
                where: {
                    table: table,
                    status: true,
                    payment: payment,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Calculate totals for the receipt
            const total = orders.reduce((sum, order) => {
                return sum + order.items.reduce((orderSum, item) => {
                    return orderSum + (item.product.price * item.amount);
                }, 0);
            }, 0);

            const receipt = {
                table: table,
                orders: orders,
                total: total,
                payment: payment,
                timestamp: new Date(),
            };

            return receipt;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao atualizar pagamento por mesa");
        }
    }
}

export { UpdatePaymentByTableService };