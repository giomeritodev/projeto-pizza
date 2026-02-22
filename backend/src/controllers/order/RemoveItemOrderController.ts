import { Request, Response } from "express";
import { RemoveItemOrderService } from "../../services/order/RemoveItemOrderService";

class RemoveItemOrderController {
    async handle(req: Request, res: Response) {
        const { item_id } = req.query;

        const itemId = Number(item_id);

        const removeItemOrderService = new RemoveItemOrderService();

        const result = await removeItemOrderService.execute({ item_id: itemId });

        res.status(200).json(result)
    }
}

export { RemoveItemOrderController }
