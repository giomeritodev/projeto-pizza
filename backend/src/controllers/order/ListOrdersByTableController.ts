import { Request, Response } from "express";
import { ListOrdersByTableService } from "../../services/order/ListOrdersByTableService";

class ListOrdersByTableController {
    async handle(_req: Request, res: Response) {
        const service = new ListOrdersByTableService();
        const result = await service.execute({});
        res.json(result);
    }
}

export { ListOrdersByTableController };