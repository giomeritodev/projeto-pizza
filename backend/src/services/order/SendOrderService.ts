import { prisma } from "../../prisma";


interface SendOrderProps {
    name: string;
    order_id: number;
}

class SendOrderService {
    async execute({ name, order_id }: SendOrderProps) {
        try {
            const orderExists = await prisma.order.findFirst({
                where: { id: Number(order_id) }
            })

            if (!orderExists) {
                throw new Error("Pedido não existe")
            }

            const order = await prisma.order.update({
                where: { id: Number(order_id) },
                data: {
                    draft: false,
                    name: name
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true,

                }
            })


            return order
        }
        catch (error) {
            console.error(error)
            throw new Error("Erro ao enviar o pedido para a cozinha")
        }
    }
}

export { SendOrderService }