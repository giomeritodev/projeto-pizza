"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { createProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"
import { Category } from "@/lib/types"

interface Props {
    categories: Category[]
}

export function ProductForm({ categories }: Props) {
    const [open, setOpen] = useState(false)
    const router = useRouter();

    async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)

        // convert price to cents if provided as decimal
        const rawPrice = formData.get('price')
        if (rawPrice) {
            const raw = String(rawPrice).replace(',', '.')
            const cents = Math.round(Number(raw) * 100)
            formData.set('price', String(cents))
        }

        const result = await createProductAction(formData as FormData);

        if (result.success) {
            setOpen(false)
            router.refresh();
            return;
        } else {
            console.log(result.error)
        }
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
                        <Input id="price" name="price" required placeholder="Preço em reais" className="border-app-border bg-app-background text-white" />
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

                    <div>
                        <Label htmlFor="file" className="mb-2">Banner (imagem)</Label>
                        <Input id="file" name="file" type="file" accept="image/*" className="border-app-border bg-app-background text-white" />
                    </div>

                    <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">Criar produto</Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}
