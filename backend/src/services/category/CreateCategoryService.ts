import { prisma } from "../../prisma"

interface CreateCategoryProps {
    name: string
}

class CreateCategoryService {

    async execute({ name }: CreateCategoryProps) {
        try {
            const createCategory = await prisma.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            })

            return (createCategory)
        } catch (error) {
            throw new Error("Erro ao cadastrar categoria")
        }
    }
}

export { CreateCategoryService }