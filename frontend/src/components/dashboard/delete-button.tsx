"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { deleteProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    productId: number
}

export function DeleteButtonProduct({ productId }: DeleteButtonProps) {
    const router = useRouter()
    async function handleDeleteProduct() {
        if (!confirm("Tem certeza que deseja deletar este produto?")) {
            return;
        }

        const result = await deleteProductAction(productId)

        if (result.success) {
            router.refresh();
            return;
        }
        if (result.error !== "") {
            console.error(result.error)
        }
    }

    return (
        <Button onClick={handleDeleteProduct} variant="destructive">
            <Trash className="w-5 h-5" />
        </Button>
    )
}