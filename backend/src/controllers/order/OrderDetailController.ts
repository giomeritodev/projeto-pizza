import { Request, Response } from "express";
import { OrderDetailService } from "../../services/order/OrderDetailService";

class OrderDetailController {
    async handle(req: Request, res: Response) {
        const { order_id } = req.query;

        const orderId = Number(order_id);

        const orderDetailService = new OrderDetailService();

        const order = await orderDetailService.execute({ order_id: orderId });

        res.status(200).json(order)
    }
}

export { OrderDetailController }
