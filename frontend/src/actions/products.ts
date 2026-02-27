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
