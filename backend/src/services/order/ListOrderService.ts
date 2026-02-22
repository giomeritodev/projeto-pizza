import { th } from "zod/v4/locales";
import { prisma } from "../../prisma";

interface ListOrderServiceProps {
    draft?: string;
}

class ListOrderService {
    async execute({ draft }: ListOrderServiceProps) {
        try {
            const orders = await prisma.order.findMany({
                where: {
                    draft: draft === "true" ? true : false,
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
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
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return orders
        } catch (error) {
            throw new Error("Erro ao listar pedidos")
        }
    }
}

export { ListOrderService }