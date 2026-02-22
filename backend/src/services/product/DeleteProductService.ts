import { prisma } from "../../prisma"

interface DeleteProductServiceProps {
    id: number
}

class DeleteProductService {

    async execute({ id }: DeleteProductServiceProps) {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: id
                }
            })

            if (!product) {
                throw new Error("Produto não encontrado")
            }

            await prisma.product.update({
                where: {
                    id: id
                },
                data: {
                    disabled: true
                }
            })

            return { message: "Produto deletado/arqivado com sucesso" }
        } catch (error) {
            throw error
        }
    }
}

export { DeleteProductService }
