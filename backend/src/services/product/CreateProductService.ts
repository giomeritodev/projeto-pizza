import { prisma } from "../../prisma"
import cloudinary from "../../config/cloudinary"
import { Readable } from "node:stream"

interface CreateProductProps {
    name: string
    price: number
    description: string,
    category_id: number
    imagemBuffer: Buffer,
    imageName: string,
}

class CreateProductService {
    public async execute({ name, price, description, category_id, imagemBuffer, imageName }: CreateProductProps) {
        const categoryExists = await prisma.category.findFirst({
            where: {
                id: category_id
            }
        })
        if (!categoryExists) {
            throw new Error("Categoria não encontrada")
        }

        //Enviar para o Cloudinary e salvar no Banco de dados como novo produto
        let bannerUrl = "";

        try {
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "products",
                    resource_type: "image",
                    public_id: `${Date.now()}-${imageName.split(".")[0]}`,
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                // Criar um stream de leitura a partir do buffer da imagem
                const bufferStream = Readable.from(imagemBuffer);
                bufferStream.pipe(uploadStream);
            });

            bannerUrl = result.secure_url;
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao enviar imagem para o Cloudinary");
        }


        try {
            // Lógica para criar um produto
            const newProduct = await prisma.product.create({
                data: {
                    name: name,
                    price: price,
                    description: description,
                    banner: bannerUrl,
                    category_id: category_id
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    category_id: true,
                    createdAt: true,
                }
            })
            return newProduct;
        } catch (error) {
            throw new Error("Erro ao criar produto")
        }
    }
}

export { CreateProductService }