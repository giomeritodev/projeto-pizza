import { Request, Response } from "express";
import { UpdatePaymentOrderService } from "../../services/order/UpdatePaymentOrderService";

class UpdatePaymentController {
    async handle(req: Request, res: Response) {
        const { order_id } = req.body;

        const service = new UpdatePaymentOrderService();
        const result = await service.execute(order_id);

        res.status(200).json(result);
    }
}

export { UpdatePaymentController };
