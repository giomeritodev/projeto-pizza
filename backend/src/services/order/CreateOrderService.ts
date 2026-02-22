import { prisma } from "../../prisma"

interface CreateOrderServiceProps {
    table: number
    name: string
}

class CreateOrderService {
    async execute({ table, name }: CreateOrderServiceProps) {
        try {
            const order = await prisma.order.create({
                data: {
                    table: table,
                    name: name ?? ""
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
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
