import { prisma } from "../../prisma"

interface ListProductServiceProps {
    disabled: boolean
}

class ListProductService {

    async execute({ disabled }: ListProductServiceProps) {
        try {
            const products = await prisma.product.findMany({
                where: {
                    disabled: disabled
                },
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
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return products
        } catch (error) {
            throw new Error("Erro ao listar produtos")
        }
    }
}

export { ListProductService }
