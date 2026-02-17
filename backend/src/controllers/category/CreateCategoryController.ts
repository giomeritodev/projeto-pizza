import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/CreateCategoryService";


class CreateCategoryController {
    async handle(req: Request, res: Response) {
        const { name } = req.body;
        const createCategoryService = new CreateCategoryService();

        const createCategory = await createCategoryService.execute({ name });

        return res.status(201).json(createCategory)
    }
}

export { CreateCategoryController }