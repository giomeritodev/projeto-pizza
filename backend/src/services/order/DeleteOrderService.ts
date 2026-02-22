import { prisma } from "../../prisma";

interface DeleteOrderProps {
    order_id: number;
}


class DeleteOrderService {
    async execute({ order_id }: DeleteOrderProps) {
        // Lógica para deletar o pedido
        try {
            //Vamos verificar se existe um pedido com o ID fornecido
            const orderExists = await prisma.order.findFirst({
                where: {
                    id: order_id as number,
                },
            });

            if (!orderExists) {
                throw new Error('Pedido não encontrado.');
            }

            // Se o pedido existir, vamos deletá-lo
            await prisma.order.delete({
                where: {
                    id: Number(order_id),
                },
            });

            return { message: 'Pedido deletado com sucesso.' };

        } catch (error) {
            console.log('Error deleting order:', error);
            throw new Error('Não foi possível deletar o pedido.');
        }
    }
}

export { DeleteOrderService }