import { prisma } from "../../prisma"

interface ListProductsByCategoryServiceProps {
    category_id: number
}

class ListProductsByCategoryService {

    async execute({ category_id }: ListProductsByCategoryServiceProps) {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    id: category_id
                }
            })

            if (!category) {
                throw new Error("Categoria não encontrada")
            }

            const products = await prisma.product.findMany({
                where: {
                    category_id: category_id,
                    disabled: false
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return products
        } catch (error) {
            throw new Error("Erro ao listar produtos por categoria");
        }
    }
}

export { ListProductsByCategoryService }
