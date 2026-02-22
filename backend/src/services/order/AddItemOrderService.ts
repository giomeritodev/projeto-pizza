import { prisma } from "../../prisma"

interface ItemsProps {
    order_id: number
    product_id: number
    amount: number
}

class AddItemOrderService {
    async execute({ order_id, product_id, amount }: ItemsProps) {
        try {
            const orderExists = await prisma.order.findFirst({
                where: {
                    id: order_id
                }
            })

            if (!orderExists) {
                throw new Error("Pedido não encontrado")
            }

            const productExists = await prisma.product.findFirst({
                where: {
                    id: product_id,
                    disabled: false
                }
            })

            if (!productExists) {
                throw new Error("Produto não encontrado")
            }

            const item = await prisma.item.create({
                data: {
                    order_id,
                    product_id,
                    amount: amount
                },
                select: {
                    id: true,
                    order_id: true,
                    product_id: true,
                    amount: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            description: true,
                            banner: true,
                            disabled: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                        }
                    }
                }
            })

            return item
        } catch (error) {
            throw new Error("Erro ao adicionar item ao pedido")
        }
    }
}

export { AddItemOrderService }