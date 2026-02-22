import { Request, Response } from "express"
import { DeleteOrderService } from "../../services/order/DeleteOrderService"


class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const { order_id } = req.query;

        try {
            const deleteOrderService = new DeleteOrderService()

            await deleteOrderService.execute({ order_id: Number(order_id) })

            res.status(200).json({ message: "Ordem deletada com sucesso" })
        } catch (error) {
            console.error("Error deleting order:", error)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}

export { DeleteOrderController }