import { Request, Response } from "express"
import { CreateProductService } from "../../services/product/CreateProductService"


class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, price, description, category_id } = req.body

        if (!req.file) {
            throw new Error("A imagem do produto é obrigatório")
        }

        const createProductService = new CreateProductService()

        const product = await createProductService.execute({
            name: name,
            price: parseInt(price), //Converte string para int para receber o valor em centavos
            description: description,
            category_id: category_id,
            imagemBuffer: req.file.buffer,
            imageName: req.file.originalname
        })

        res.status(201).json(product)
    }
}

export { CreateProductController }