import { Request, Response } from "express";
import { UpdatePaymentByTableService } from "../../services/order/UpdatePaymentByTableService";

class UpdatePaymentByTableController {
    async handle(req: Request, res: Response) {
        const { table, payment } = req.body;
        const service = new UpdatePaymentByTableService();
        const result = await service.execute({ table, payment });
        res.json(result);
    }
}

export { UpdatePaymentByTableController };