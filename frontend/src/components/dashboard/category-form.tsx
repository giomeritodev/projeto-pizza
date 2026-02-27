"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { createCategoryAction } from "@/actions/categories"
import { useRouter } from "next/navigation"

export function CategoryForm() {
    const [open, setOpen] = useState(false)
    const router = useRouter();

    async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const result = await createCategoryAction(formData);

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
                    Nova categoria
                </Button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>
                        Criar nova categoria
                    </DialogTitle>
                    <DialogDescription>
                        Criando nova categoria
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="mb-2">
                            Nome da categoria
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Digite o nome da categoria"
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary"
                    >
                        Criar categoria
                    </Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}