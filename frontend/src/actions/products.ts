"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth"
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Erro ao criar produto" }
        }

        // forward FormData (contains file and fields) to backend
        await apiClient<Product>('/product', {
            method: 'POST',
            body: formData,
            token: token
        })

        revalidatePath('/dashboard/products')

        return { success: true, error: "" }

    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Erro ao criar produto' }
    }

}

export async function listProductsAction(disabled?: boolean) {
    const token = await getToken();

    if (!token) {
        throw new Error("Não autenticado");
    }

    const query = disabled !== undefined ? `?disabled=${disabled}` : "";
    const products = await apiClient<Product[]>(`/products${query}`, {
        token,
        cache: "no-store"
    });

    return products;
}

export async function deleteProductAction(productId: number) {
    try {
        if (!productId) {
            return { success: false, error: "ID do produto inválido" }
        }

        const token = await getToken();

        if (!token) {
            return { success: false, error: "Não autenticado" }
        }

        await apiClient(`/product/${productId}`, {
            method: "DELETE",
            token: token
        })

        revalidatePath("/dashboard/products");
        return { success: true, error: "" }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Erro ao deletar o produto' }
    }
}