import { prisma } from "../../prisma";

interface FinishOrderProps {
    order_id: number;
}

class FinishOrderService {
    async execute({ order_id }: FinishOrderProps) {
        // Lógica para finalizar o pedido
        try {
            //Vamos verificar se existe um pedido com o ID fornecido
            const orderExists = await prisma.order.findFirst({
                where: {
                    id: order_id,
                },
            });

            if (!orderExists) {
                throw new Error('Pedido não encontrado.');
            }

            // Se o pedido existir, vamos atualizá-lo para marcar como finalizado
            const finishedOrder = await prisma.order.update({
                where: {
                    id: order_id,
                },
                data: {
                    status: true, // Supondo que haja um campo de status para indicar o estado do pedido sendo true o pedido esta pronto                    
                },
                select: {
                    id: true,
                    table: true,
                    status: true,
                    name: true,
                    draft: true,
                    createdAt: true,
                }
            });
            return finishedOrder;

        } catch (error) {
            console.log('Error finishing order:', error);
            throw new Error('Não foi possível finalizar o pedido.');
        }
    }
}

export { FinishOrderService }