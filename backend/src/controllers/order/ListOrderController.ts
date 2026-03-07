import { Request, Response } from "express";
import { ListOrderService } from "../../services/order/ListOrderService";

class ListOrderController {
    async handle(req: Request, res: Response) {
        const draft = req.query?.draft as string | undefined;
        const payment = req.query?.payment as string | undefined;

        const listOrders = new ListOrderService();

        const orders = await listOrders.execute({ draft: draft, payment: payment });

        res.json(orders)
    }
}

export { ListOrderController }