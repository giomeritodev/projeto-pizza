import { prisma } from "../../prisma"

interface CreateOrderServiceProps {
    table: number
    name: string
    user_id: number
}

class CreateOrderService {
    async execute({ table, name, user_id }: CreateOrderServiceProps) {
        try {
            const order = await prisma.order.create({
                data: {
                    table: table,
                    name: name ?? "",
                    user_id: user_id
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    payment: true,
                    user_id: true,
                    createdAt: true,
                    updatedAt: true
                }
            })

            return order
        } catch (error) {
            throw new Error("Erro ao criar pedido")
        }
    }
}

export { CreateOrderService }
