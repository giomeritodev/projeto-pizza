import { prisma } from "../../prisma"

class ListCategoryService {

    async execute() {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return categories
        } catch (error) {
            throw new Error("Erro ao listar categorias")
        }
    }
}

export { ListCategoryService }
