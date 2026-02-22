import { prisma } from "../../prisma"

interface RemoveItemOrderServiceProps {
    item_id: number
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemOrderServiceProps) {
        try {
            const item = await prisma.item.findFirst({
                where: {
                    id: item_id
                }
            })

            if (!item) {
                throw new Error("Item não encontrado")
            }

            await prisma.item.delete({
                where: {
                    id: item_id
                }
            })

            return { message: "Item removido com sucesso" }
        } catch (error) {
            console.error(error)
            throw new Error("Erro ao remover item do pedido")
        }
    }
}

export { RemoveItemOrderService }
