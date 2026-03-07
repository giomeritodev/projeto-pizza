import { prisma } from "../../prisma";

interface ListOrderServiceProps {
    draft?: string;
    payment?: string;
}

class ListOrderService {
    async execute({ draft, payment }: ListOrderServiceProps) {
        try {
            // build dynamic where clause so we can optionally filter by draft and/or payment
            const whereClause: any = {}

            if (draft !== undefined) {
                // explicit query param provided
                whereClause.draft = draft === "true";
            } else {
                // default behaviour from before: only non‑draft orders
                whereClause.draft = false;
            }

            if (payment !== undefined) {
                whereClause.payment = payment === "true";
            }

            const orders = await prisma.order.findMany({
                where: whereClause,
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    payment: true,
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