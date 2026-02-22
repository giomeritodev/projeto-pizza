import { prisma } from "../../prisma"

interface OrderDetailServiceProps {
    order_id: number
}

class OrderDetailService {
    async execute({ order_id }: OrderDetailServiceProps) {
        try {
            const orderExists = await prisma.order.findFirst({
                where: {
                    id: order_id
                }
            })

            if (!orderExists) {
                throw new Error("Order não encontrada")
            }

            const order = await prisma.order.findFirst({
                where: {
                    id: order_id
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                    updatedAt: true,
                    items: {
                        select: {
                            id: true,
                            amount: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    description: true,
                                    banner: true
                                }
                            }
                        }
                    }
                }
            })

            if (!order) {
                throw new Error("Order não encontrada")
            }

            return order
        } catch (error) {
            console.error(error)
            throw new Error("Erro ao detalhar a Order")
        }
    }
}

export { OrderDetailService }
