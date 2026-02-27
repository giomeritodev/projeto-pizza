import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth"
import { Product, Category } from "@/lib/types";
import { Image } from "lucide-react";

export default async function Products() {
    const token = await getToken();
    const products = await apiClient<Product[]>("/products", {
        token: token
    })

    const categories = await apiClient<Category[]>("/category", {
        token: token
    })

    // const formatPrice = (price: number) => {
    //     return new Intl.NumberFormat("pt-BR", {
    //         style: "currency",
    //         currency: "BRL"
    //     }).format(price / 100)
    // }
    return (

        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Produtos</h1>
                    <p className="text-sm sm:text-base mt-1">Gerencie seus produtos</p>
                </div>
                <ProductForm categories={categories} />
            </div>

            {products.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map(product => (
                        <Card key={product.id} className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white">
                            {/* <div className="relative w-full h-48">
                                <Image
                                    src={`${product.banner_url}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100w, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div> */}
                            <CardHeader>
                                <CardTitle className="gap-2 flex items-center text-base md:text-lg">
                                    <Image className="w-5 h-5" />
                                    <span>{product.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-200 text-sm">R$ {(product.price / 100).toFixed(2)}</p>
                                <p className="text-gray-300 text-sm mt-1">{product.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}