"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus, Upload } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { createProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"
import { Category } from "@/lib/types"
import Image from "next/image"

interface Props {
    categories: Category[]
}

export function ProductForm({ categories }: Props) {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [priceValue, setPriceValue] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);


    function convertBRLToCents(value: string): number {
        const cleanValue = value.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".")
        const reais = parseFloat(cleanValue) || 0

        return Math.round(reais * 100)
    }

    async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (!imageFile) {
            setIsLoading(false)
            return;
        }

        const formData = new FormData();
        const formElement = e.currentTarget;
        const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value;
        const description = (formElement.elements.namedItem("description") as HTMLInputElement)?.value;
        const category_id = (formElement.elements.namedItem("category_id") as HTMLInputElement)?.value;
        const priceInCents = convertBRLToCents(priceValue)

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", priceInCents.toString());
        formData.append("category_id", category_id);
        formData.append("file", imageFile);



        // const formData = new FormData(e.currentTarget)

        // convert price to cents if provided as decimal
        // const rawPrice = formData.get('price')
        // if (rawPrice) {
        //     const raw = String(rawPrice).replace(',', '.')
        //     const cents = Math.round(Number(raw) * 100)
        //     formData.set('price', String(cents))
        // }

        const result = await createProductAction(formData as FormData);

        if (result.success) {
            setOpen(false)
            router.refresh();
            return;
        } else {
            console.log(result.error)
        }
    }

    function formatToBrl(value: string) {
        //Remover tudo que não é numero
        const numbers = value.replace(/\D/g, "");

        if (!numbers) return "";

        //Converter para numero e dividir po 100 para ter os centavos
        const amount = parseInt(numbers) / 100;
        return amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatToBrl(e.target.value);
        setPriceValue(formatted);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                return;
            }
            setImageFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }

            reader.readAsDataURL(file);
        }
    }

    function clearImage() {
        setImageFile(null)
        setImagePreview(null)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo produto
                </Button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-app-card text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Criar novo produto
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados do produto
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateProduct} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <Label htmlFor="name" className="mb-2">Nome</Label>
                        <Input id="name" name="name" required placeholder="Nome do produto" className="border-app-border bg-app-background text-white" />
                    </div>

                    <div>
                        <Label htmlFor="price" className="mb-2">Preço (ex: 12.50)</Label>
                        <Input
                            id="price"
                            name="price"
                            required
                            placeholder="Preço em reais" className="border-app-border bg-app-background text-white"
                            value={priceValue}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2">Descrição</Label>
                        <Textarea id="description" name="description" placeholder="Descrição do produto" className="border-app-border bg-app-background text-white" />
                    </div>

                    <div>
                        <Label htmlFor="category_id" className="mb-2">Categoria</Label>
                        <select id="category_id" name="category_id" required className="w-full p-2 rounded bg-app-background border-app-border text-white">
                            <option value="">Selecione</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="file"
                            className="mb-2"
                        >
                            Banner (imagem)
                        </Label>

                        {imagePreview ? (
                            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="preview da imagem"
                                    fill
                                    className="object-cover z-10"
                                />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 z-20"
                                >
                                    Excluir
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-mdp-8 flex flex-col items-center">
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <Label htmlFor="file" className="cursor-pointer">
                                    Clique para selecionar uma imagem
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="image/jpeg, image/jpg, image/png"
                                    onChange={handleImageChange}
                                    required
                                    className="hidden"
                                />
                            </div>
                        )}

                    </div>

                    <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">Criar produto</Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}
