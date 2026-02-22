import { Request, Response } from "express"
import { SendOrderService } from "../../services/order/SendOrderService"

class SendOrderController {
    async handle(req: Request, res: Response) {
        try {
            const { order_id, name } = req.body;

            const orderService = new SendOrderService()

            const updateOrder = await orderService.execute({ order_id: Number(order_id), name: name as string })

            res.json(updateOrder)
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Erro ao enviar o pedido para a cozinha" })
        }
    }
}

export { SendOrderController }