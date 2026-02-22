import { Request, Response } from "express"
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

class AddItemOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, product_id, amount } = req.body;

        const addItemOrderService = new AddItemOrderService();

        const item = await addItemOrderService.execute({ order_id, product_id, amount });

        res.status(201).json(item)
    }
}

export { AddItemOrderController }