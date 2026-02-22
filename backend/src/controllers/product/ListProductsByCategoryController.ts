import { Request, Response } from "express";
import { ListProductsByCategoryService } from "../../services/product/ListProductsByCategoryService";

class ListProductsByCategoryController {
    async handle(req: Request, res: Response) {
        const { category_id } = req.query;

        const categoryId = Number(category_id);

        const listProductsByCategoryService = new ListProductsByCategoryService();

        const products = await listProductsByCategoryService.execute({ category_id: categoryId });

        return res.status(200).json(products)
    }
}

export { ListProductsByCategoryController }
