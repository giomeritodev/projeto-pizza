import { prisma } from "../../prisma";

interface ListOrdersByTableServiceProps {
    // optional filters if needed
}

class ListOrdersByTableService {
    async execute({ }: ListOrdersByTableServiceProps) {
        try {
            // Fetch all orders that are ready (status=true) and not paid (payment=false)
            const orders = await prisma.order.findMany({
                where: {
                    status: true,
                    payment: false,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    table: 'asc',
                },
            });

            // Group by table
            const groupedByTable: { [table: number]: any } = {};

            orders.forEach(order => {
                if (!groupedByTable[order.table]) {
                    groupedByTable[order.table] = {
                        table: order.table,
                        orders: [],
                        total: 0,
                        items: [],
                    };
                }
                groupedByTable[order.table].orders.push(order);

                // Calculate total for this order
                const orderTotal = order.items.reduce((sum, item) => {
                    return sum + (item.product.price * item.amount);
                }, 0);
                groupedByTable[order.table].total += orderTotal;

                // Collect all items
                groupedByTable[order.table].items.push(...order.items);
            });

            // Convert to array
            const result = Object.values(groupedByTable);

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao listar pedidos por mesa");
        }
    }
}

export { ListOrdersByTableService };